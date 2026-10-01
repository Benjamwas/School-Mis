# GitHub Actions secrets required for "Real-Time Build and Deploy"
#
# Set these in your GitHub repo:
#   Settings → Secrets and variables → Actions → New repository secret
#
# FTP_PASSWORD
#   Your cPanel FTP password for user: oasisofl
#   Host: rs9.rcnoc.com
#
# After the first deploy, also configure on cPanel:
#   Setup Node.js App
#     - App Root: /home/oasisofl/vendramini-api
#     - Application Startup File: index.js
#     - Node version: 20
#     - Run NPM Install: yes (installs express, better-sqlite3, etc.)
#     - Set environment variables:
#         PORT=3000
#         JWT_SECRET=<your-secret>
#         ADMIN_EMAIL=admin@vendramini.sc.ke
#         ADMIN_PASSWORD=<change-me>
#
#   Then run seed once via cPanel Terminal or SSH:
#     cd /home/oasisofl/vendramini-api && node seed.js
#
#   Point your domain/public_html to proxy /api to the Node app,
#   or serve the frontend from the Node app itself.
