#!/usr/bin/env bash
set -euo pipefail

# Vendramini API smoke tests — used by CI and local verification.
# Starts a temporary server, runs form/auth/CRUD checks, then shuts down.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVER_DIR="$ROOT/server"
PORT="${SMOKE_PORT:-5099}"
BASE="http://127.0.0.1:${PORT}"
SMOKE_DATA="${SMOKE_DATA:-$ROOT/.smoke-data}"
TEST_ENV="$SERVER_DIR/.env.smoke"

echo "==> Preparing smoke test environment (port ${PORT}, db: ${SMOKE_DATA})"

# Isolated DB — never touch real server/data
rm -rf "$SMOKE_DATA"
mkdir -p "$SMOKE_DATA"

cat > "$TEST_ENV" <<EOF
PORT=${PORT}
JWT_SECRET=smoke-test-secret
ADMIN_EMAIL=admin@vendramini.sc.ke
ADMIN_PASSWORD=admin123
DATABASE_DIR=${SMOKE_DATA}
EOF

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  rm -f "$TEST_ENV"
  rm -rf "$SMOKE_DATA"
}
trap cleanup EXIT

cd "$SERVER_DIR"

# Load smoke env (dotenv)
set -a
# shellcheck disable=SC1090
source "$TEST_ENV"
set +a
export DATABASE_DIR="$SMOKE_DATA"
export PORT

echo "==> Seeding database"
node seed.js

echo "==> Starting API server on :${PORT}"
node index.js > "$SERVER_DIR/smoke-server.log" 2>&1 &
SERVER_PID=$!

# Wait for health
for i in $(seq 1 30); do
  if curl -sf "$BASE/api/health" > /dev/null 2>&1; then
    break
  fi
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "Server failed to start:"
    cat "$SERVER_DIR/smoke-server.log"
    exit 1
  fi
  sleep 0.5
done

if ! curl -sf "$BASE/api/health" > /dev/null; then
  echo "Health check failed"
  cat "$SERVER_DIR/smoke-server.log"
  exit 1
fi
echo "✓ Health OK"

PASS=0
FAIL=0

assert_http() {
  local name="$1" method="$2" path="$3"
  local expected="${4:-200}"
  local data="${5:-}"
  local auth="${6:-}"
  local args=(-s -o /tmp/smoke-body -w "%{http_code}" -X "$method" "$BASE$path")
  [[ -n "$data" ]] && args+=(-H "Content-Type: application/json" -d "$data")
  [[ -n "$auth" ]] && args+=(-H "Authorization: Bearer $auth")
  local code
  code=$(curl "${args[@]}")
  if [[ "$code" == "$expected" ]]; then
    echo "✓ $name ($code)"
    PASS=$((PASS+1))
  else
    echo "✗ $name — expected $expected got $code"
    cat /tmp/smoke-body; echo
    FAIL=$((FAIL+1))
  fi
}

assert_json_path() {
  local name="$1" path="$2" python_expr="$3"
  local body
  body=$(curl -sf "$BASE$path")
  if echo "$body" | python3 -c "import sys,json; d=json.load(sys.stdin); assert $python_expr" 2>/dev/null; then
    echo "✓ $name"
    PASS=$((PASS+1))
  else
    echo "✗ $name — check failed for $path"
    echo "$body" | head -c 400; echo
    FAIL=$((FAIL+1))
  fi
}

echo "==> Public API"
assert_http "GET /api/health" GET /api/health 200
assert_http "GET /api/stats" GET /api/stats 200
assert_json_path "stats shape" /api/stats "'events' in d and 'newLeads' in d"
assert_http "GET /api/events" GET "/api/events?status=published" 200
assert_http "GET /api/campuses" GET /api/campuses 200
assert_http "GET /api/gallery/images" GET /api/gallery/images 200
assert_http "GET /api/testimonials" GET "/api/testimonials?active=1" 200
assert_http "GET /api/settings/public" GET /api/settings/public 200
assert_http "GET /api/blog" GET "/api/blog?status=published" 200

echo "==> Auth"
LOGIN_BODY=$(curl -s -X POST "$BASE/api/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@vendramini.sc.ke","password":"admin123"}')
TOKEN=$(echo "$LOGIN_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null || true)
if [[ -n "$TOKEN" ]]; then
  echo "✓ Admin login"
  PASS=$((PASS+1))
else
  echo "✗ Admin login failed"
  echo "$LOGIN_BODY"
  FAIL=$((FAIL+1))
fi
assert_http "Admin login wrong password" POST /api/auth/login 401 '{"email":"admin@vendramini.sc.ke","password":"wrong"}'
assert_http "Protected route without token" GET /api/forms 401

if [[ -n "$TOKEN" ]]; then
  echo "==> Forms (public)"
  assert_http "Inquiry form" POST /api/forms 201 '{"type":"inquiry","name":"CI Parent","email":"ci@example.com","subject":"Test","message":"Smoke test inquiry"}'
  assert_http "Tour form" POST /api/forms 201 '{"type":"tour","name":"CI Tour","email":"tour@example.com","phone":"0722123456","campus":"Pre-Primary 1 Campus","message":"Tour please"}'
  assert_http "Enrollment form" POST /api/forms 201 '{"type":"enrollment","name":"CI Enroll","email":"enroll@example.com","phone":"0711987654","campus":"Primary School Campus","age":7,"message":"Grade 3"}'
  assert_http "Form missing name" POST /api/forms 400 '{"type":"inquiry","email":"x@y.com","message":"Hello"}'
  assert_http "Form bad email" POST /api/forms 400 '{"type":"inquiry","name":"T","email":"not-email","message":"Hello"}'
  assert_http "Form bad age" POST /api/forms 400 '{"type":"enrollment","name":"T","email":"t@e.com","message":"Hi","age":99}'

  echo "==> Admin CRUD"
  assert_http "Create event" POST /api/events 201 '{"title":"CI Test Event","date":"2026-07-01","time":"10:00 AM","location":"CI","description":"Created by smoke test","status":"published","featured":0}' "$TOKEN"
  assert_http "Create blog post" POST /api/blog 201 '{"title":"CI Test Post","excerpt":"CI","content":"Body","category":"Parenting","status":"published"}' "$TOKEN"
  assert_http "List leads authed" GET /api/forms 200 "" "$TOKEN"
  assert_http "Update lead status" PUT /api/forms/1/status 200 '{"status":"read"}' "$TOKEN"
  assert_json_path "public events include CI event" "/api/events?status=published" "any('CI Test Event' in e['title'] for e in d)"
  assert_json_path "public blog includes CI post" "/api/blog?status=published" "any('CI Test Post' in p['title'] for p in d)"

  echo "==> Settings"
  assert_http "Update footer_phone" PUT /api/settings/footer_phone 200 '{"value":"0114468263 / 0722217531"}' "$TOKEN"
  assert_json_path "settings public reflects footer" /api/settings/public "d.get('footer_phone')=='0114468263 / 0722217531'"
fi

echo ""
echo "=============================="
echo "Smoke tests: $PASS passed, $FAIL failed"
echo "=============================="
[[ "$FAIL" -eq 0 ]]
