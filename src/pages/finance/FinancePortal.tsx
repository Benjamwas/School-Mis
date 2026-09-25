import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DownloadIcon, PlusIcon, PrinterIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Stat, StatusBadge } from '../../components/ui/primitives';
import { BarChartBlock, ChartFrame, DataTable, DonutChartBlock, Pagination, TableToolbar, useTableState } from '../../components/ui/data';
import { Alert } from '../../components/ui/feedback';
import { COLLECTIONS_TREND, FINANCE_SUMMARY, PAYMENTS, PAYMENT_METHOD_SPLIT, STUDENT_BALANCES, formatKES } from '../../data/finance';
import { useDashboard, useList } from '../../api/hooks';
import type { ApiPayment, DashboardFinance } from '../../api/types';

const TITLES: Record<string, {title: string;sub: string;}> = {
  overview: { title: 'Finance dashboard', sub: 'Fees, collections and balances' },
  payments: { title: 'Payments', sub: 'Every payment recorded this term' },
  balances: { title: 'Student balances', sub: 'Outstanding fees by learner' },
  collections: { title: 'Collections', sub: 'Collection performance against target' },
  receipts: { title: 'Receipts', sub: 'Issued receipts and reprints' },
  reports: { title: 'Finance reports', sub: 'Exportable finance reporting' }
};

function normalizeMethod(method?: string): string {
  if (!method) return '—';
  const map: Record<string, string> = { M_PESA: 'M-Pesa', M_PESA_PULL: 'M-Pesa Pull', BANK_TRANSFER: 'Bank Transfer', CARD: 'Card' };
  if (map[method]) return map[method];
  return method.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function FinancePortal() {
  const { tab = 'overview' } = useParams();
  const navigate = useNavigate();
  const meta = TITLES[tab] ?? TITLES.overview;
  const balances = useTableState(STUDENT_BALANCES, (r, q) => r.student.toLowerCase().includes(q), 6);

  const fin = useDashboard<DashboardFinance>('finance');
  const payments = useList<ApiPayment>('/payments/');

  const collected = fin.data?.collected ?? FINANCE_SUMMARY.collected;
  const totalInvoiced = fin.data?.total_invoiced ?? FINANCE_SUMMARY.total ?? 103000;
  const outstanding = fin.data?.outstanding ?? FINANCE_SUMMARY.outstanding;
  const overdue = fin.data?.overdue_invoices;
  const defaulters = fin.data?.top_defaulters?.length;
  const billedPct = totalInvoiced > 0 ? Math.round((collected / totalInvoiced) * 100) : 86;
  const outstandingSub = defaulters !== undefined ? `${defaulters} families with balances` : '214 families';
  const overdueSub = overdue !== undefined ? `${overdue} more than 14 days overdue` : '126 balances are more than 14 days overdue';

  const recentPayments = useMemo(() => {
    if (payments.data) {
      return payments.data.slice(0, 6).map((p: ApiPayment) => ({
        id: p.id,
        date: p.paid_at ? p.paid_at.slice(0, 10) : '—',
        student: p.student_name,
        method: normalizeMethod(p.method),
        reference: p.transaction_ref,
        amount: p.amount,
      }));
    }
    return PAYMENTS;
  }, [payments]);

  return (
    <div>
      <PageHeader
        title={meta.title}
        subtitle={meta.sub}
        actions={
        <>
            <Button size="sm" variant="secondary" icon={<DownloadIcon size={15} />}>
              Export
            </Button>
            <Button size="sm" icon={<PlusIcon size={15} />} onClick={() => navigate('/finance/payments')}>
              Record payment
            </Button>
          </>
        } />


      {tab === 'overview' &&
      <div className="space-y-6">
          <Alert tone="warning" title={`${formatKES(outstanding)} outstanding`}>
            {overdueSub}. Reminders were last sent on 8 September.
          </Alert>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Collected this term" value={formatKES(collected)} sub={`${billedPct}% of billed`} tone="primary" />
            <Stat label="Outstanding" value={formatKES(outstanding)} sub={outstandingSub} tone="danger" />
            <Stat label="Today" value={formatKES(FINANCE_SUMMARY.today)} sub="11 payments" tone="gold" />
            <Stat label="Learners cleared" value={FINANCE_SUMMARY.clearedLearners} sub="of 1,148 invoices" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <ChartFrame title="Monthly collections" subtitle="KES millions against target">
              <BarChartBlock
              data={COLLECTIONS_TREND}
              xKey="month"
              bars={[
              { key: 'collected', name: 'Collected', color: '#1F5E43' },
              { key: 'target', name: 'Target', color: '#B9D7C6' }]
              } />

            </ChartFrame>
            <ChartFrame title="Payment methods" subtitle="Share of value">
              <DonutChartBlock data={PAYMENT_METHOD_SPLIT} />
            </ChartFrame>
          </div>
          <Card>
            <CardHeader title="Recent payments" subtitle={payments.data ? `${payments.data.length} on record` : undefined} />
            <DataTable
            columns={[
            { key: 'date', header: 'Date' },
            { key: 'student', header: 'Learner', render: (r: any) => <span className="font-medium">{r.student}</span> },
            { key: 'method', header: 'Method', render: (r: any) => <Badge tone="neutral">{r.method}</Badge> },
            { key: 'reference', header: 'Reference', hideOnMobile: true },
            { key: 'amount', header: 'Amount', align: 'right', render: (r: any) => formatKES(r.amount) }]
            }
            rows={recentPayments}
            caption="Recent payments" />

          </Card>
        </div>
      }

      {tab === 'payments' &&
      <Card>
          <CardHeader title="All payments" subtitle="Term 3 · 2026" />
          <DataTable
          columns={[
          { key: 'date', header: 'Date' },
          { key: 'student', header: 'Learner', render: (r: any) => <span className="font-medium">{r.student}</span> },
          { key: 'term', header: 'Term', hideOnMobile: true },
          { key: 'method', header: 'Method', render: (r: any) => <Badge tone="neutral">{r.method}</Badge> },
          { key: 'reference', header: 'Reference' },
          { key: 'receiptNo', header: 'Receipt', hideOnMobile: true },
          { key: 'amount', header: 'Amount', align: 'right', render: (r: any) => formatKES(r.amount) }]
          }
          rows={recentPayments}
          mobileTitle={(r: any) => `${formatKES(r.amount)} · ${r.student}`}
          caption="All payments" />

        </Card>
      }

      {tab === 'balances' &&
      <Card>
          <CardHeader title={`${balances.total} learner balances`} subtitle="Term 3 · 2026" />
          <TableToolbar query={balances.query} onQuery={balances.setQuery} placeholder="Search learner…" />
          <DataTable
          columns={[
          { key: 'student', header: 'Learner', render: (r: any) => <span className="font-medium">{r.student}</span> },
          { key: 'className', header: 'Class', hideOnMobile: true },
          { key: 'billed', header: 'Billed', align: 'right', render: (r: any) => formatKES(r.billed) },
          { key: 'paid', header: 'Paid', align: 'right', render: (r: any) => formatKES(r.paid) },
          { key: 'balance', header: 'Balance', align: 'right', render: (r: any) => formatKES(r.balance) },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
          }
          rows={balances.slice}
          mobileTitle={(r: any) => r.student}
          caption="Student balances" />

          <Pagination page={balances.page} pages={balances.pages} onPage={balances.setPage} total={balances.total} />
        </Card>
      }

      {tab === 'collections' &&
      <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Collection rate" value={`${billedPct}%`} sub="Target 92%" tone="gold" />
            <Stat label="Invoices raised" value={fin.data ? Number(totalInvoiced.toFixed(0)) : FINANCE_SUMMARY.invoicesRaised} sub="Term 3" />
            <Stat label="Average days to pay" value="18" sub="From invoice date" />
          </div>
          <ChartFrame title="Collections vs target" subtitle="KES millions">
            <BarChartBlock
            data={COLLECTIONS_TREND}
            xKey="month"
            bars={[
            { key: 'collected', name: 'Collected', color: '#1F5E43' },
            { key: 'target', name: 'Target', color: '#B9D7C6' }]
            } />

          </ChartFrame>
        </div>
      }

      {tab === 'receipts' &&
      <Card>
          <CardHeader title="Issued receipts" subtitle="Reprints are logged in the audit trail" />
          <DataTable
          columns={[
          { key: 'receiptNo', header: 'Receipt', render: (r: any) => <span className="font-medium">{r.receiptNo}</span> },
          { key: 'date', header: 'Date' },
          { key: 'student', header: 'Learner' },
          { key: 'method', header: 'Method', hideOnMobile: true },
          { key: 'amount', header: 'Amount', align: 'right', render: (r: any) => formatKES(r.amount) },
          {
            key: 'a',
            header: '',
            align: 'right',
            render: () =>
            <span className="flex justify-end gap-1.5">
                    <Button variant="ghost" size="sm" icon={<PrinterIcon size={14} />} onClick={() => window.print()}>
                      Print
                    </Button>
                  </span>

          }]
          }
          rows={recentPayments}
          mobileTitle={(r: any) => r.receiptNo}
          caption="Issued receipts" />

        </Card>
      }

      {tab === 'reports' &&
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
        ['Fees collection report', 'Collections by month, class and method'],
        ['Outstanding balances', 'Every learner with a balance, ranked by age of debt'],
        ['Payment history', 'All transactions with references and receipts'],
        ['Bursary and discounts', 'Awarded concessions by learner'],
        ['Daily cash position', 'Today’s receipts by channel'],
        ['Term reconciliation', 'Billed, collected, written off']].
        map(([t, d]) =>
        <Card key={t} className="p-5">
              <h3 className="text-[15px] font-semibold text-ink">{t}</h3>
              <p className="mt-1 text-[13px] text-ink-muted">{d}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1">
                  Run report
                </Button>
                <Button size="sm" variant="ghost" icon={<DownloadIcon size={14} />}>
                  CSV
                </Button>
              </div>
            </Card>
        )}
        </div>
      }
    </div>);

}