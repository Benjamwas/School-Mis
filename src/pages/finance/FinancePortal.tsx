import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DownloadIcon, PlusIcon, PrinterIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Stat, StatusBadge } from '../../components/ui/primitives';
import { BarChartBlock, ChartFrame, DataTable, DonutChartBlock, Pagination, TableToolbar, useTableState } from '../../components/ui/data';
import { Alert } from '../../components/ui/feedback';
import { COLLECTIONS_TREND, FINANCE_SUMMARY, PAYMENTS, PAYMENT_METHOD_SPLIT, STUDENT_BALANCES, formatKES } from '../../data/finance';
import { useApiLive, useDashboard, useList, useObject } from '../../api/hooks';
import type { ApiInvoice, ApiPayment, ApiReceipt, DashboardFinance } from '../../api/types';

const TITLES: Record<string, {title: string;sub: string;}> = {
  overview: { title: 'Finance dashboard', sub: 'Fees, collections and balances' },
  payments: { title: 'Payments', sub: 'Every payment recorded this term' },
  balances: { title: 'Student balances', sub: 'Outstanding fees by learner' },
  invoices: { title: 'Invoices', sub: 'Issued invoices and payment status' },
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

function numberValue(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function invoiceStatus(status?: string): string {
  const labels: Record<string, string> = {
    PAID: 'Paid',
    PARTIALLY_PAID: 'Part paid',
    OVERDUE: 'Overdue',
    CANCELLED: 'Cancelled',
    DRAFT: 'Draft'
  };
  return status ? labels[status] ?? status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—';
}

type BalanceRow = {
  student: string;
  className: string;
  billed: number;
  paid: number;
  balance: number;
  status: string;
};

type OutstandingSummary = {
  total_outstanding: number | string;
  overdue_count: number;
  students: {
    student: {
      name: string;
      admission_number: string;
      grade: string;
    };
    balance: number | string;
  }[];
};

export function FinancePortal() {
  const { tab = 'overview' } = useParams();
  const navigate = useNavigate();
  const meta = TITLES[tab] ?? TITLES.overview;
  const live = useApiLive();

  const fin = useDashboard<DashboardFinance>('finance');
  const payments = useList<ApiPayment>('/payments/');
  const outstandingSummary = useObject<OutstandingSummary>('finance/invoices/outstanding/');
  const invoices = useList<ApiInvoice>('finance/invoices/');
  const receipts = useList<ApiReceipt>('finance/receipts/');

  const paymentRows: any[] = live
    ? (payments.data ?? []).map((payment) => ({
      id: payment.id,
      date: payment.paid_at ? payment.paid_at.slice(0, 10) : '—',
      student: payment.student_name,
      method: normalizeMethod(payment.method),
      reference: payment.transaction_ref,
      term: String(payment.term_name ?? payment.term ?? '—'),
      receiptNo: String(payment.receipt_number ?? payment.receipt ?? '—'),
      amount: numberValue(payment.amount)
    }))
    : PAYMENTS;

  const recentPayments = live ? paymentRows.slice(0, 6) : PAYMENTS;

  const balanceRows: BalanceRow[] = live
    ? (outstandingSummary.data?.students ?? []).map((row) => {
      const balance = numberValue(row.balance);
      return {
        student: row.student.name || '—',
        className: row.student.grade || '—',
        billed: balance,
        paid: 0,
        balance,
        status: balance === 0 ? 'Cleared' : 'Part paid'
      };
    })
    : STUDENT_BALANCES;

  const balances = useTableState<BalanceRow>(balanceRows, (row, query) => row.student.toLowerCase().includes(query), 6);

  const invoiceRows: any[] = live
    ? (invoices.data ?? []).map((invoice) => ({
      id: invoice.id,
      invoiceNo: invoice.invoice_number,
      student: invoice.student_name,
      admissionNo: invoice.admission_number ?? '—',
      issueDate: formatDate(invoice.issue_date),
      dueDate: formatDate(invoice.due_date),
      billed: numberValue(invoice.amount_due),
      paid: numberValue(invoice.amount_paid),
      balance: numberValue(invoice.balance),
      status: invoiceStatus(invoice.status)
    }))
    : [];

  const receiptRows: any[] = live
    ? (receipts.data ?? []).map((receipt) => ({
      id: receipt.id,
      receiptNo: receipt.receipt_number,
      date: formatDate(receipt.issued_at),
      student: receipt.student_name ?? '—',
      method: normalizeMethod(receipt.method),
      amount: numberValue(receipt.amount)
    }))
    : PAYMENTS;

  const collected = fin.data?.collected ?? FINANCE_SUMMARY.collected;
  const totalInvoiced = fin.data?.total_invoiced ?? FINANCE_SUMMARY.collected + FINANCE_SUMMARY.outstanding;
  const outstanding = fin.data?.outstanding ?? FINANCE_SUMMARY.outstanding;
  const overdue = fin.data?.overdue_invoices;
  const defaulters = fin.data?.top_defaulters?.length;
  const billedPct = totalInvoiced > 0 ? Math.round((collected / totalInvoiced) * 100) : 86;
  const outstandingSub = defaulters !== undefined ? `${defaulters} families with balances` : '214 families';
  const overdueSub = overdue !== undefined ? `${overdue} more than 14 days overdue` : '126 balances are more than 14 days overdue';
  const overviewError = fin.error ?? payments.error;

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


      {tab === 'overview' && live && overviewError &&
      <p className="mb-4 text-sm text-rose-600">{overviewError}</p>
      }

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

      {tab === 'payments' && live && payments.error &&
      <p className="mb-4 text-sm text-rose-600">{payments.error}</p>
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
          rows={paymentRows}
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

      {tab === 'invoices' &&
      <Card>
          <CardHeader title="Invoices" subtitle={live ? `${invoiceRows.length} invoices on record` : 'Issued invoices and payment status'} />
          {live && invoices.error && <p className="mb-4 px-5 text-sm text-rose-600">{invoices.error}</p>}
          <DataTable
          columns={[
          { key: 'invoiceNo', header: 'Invoice', render: (r: any) => <span className="font-medium">{r.invoiceNo}</span> },
          { key: 'student', header: 'Learner' },
          { key: 'issueDate', header: 'Issued', hideOnMobile: true },
          { key: 'dueDate', header: 'Due', hideOnMobile: true },
          { key: 'billed', header: 'Billed', align: 'right', render: (r: any) => formatKES(r.billed) },
          { key: 'balance', header: 'Balance', align: 'right', render: (r: any) => formatKES(r.balance) },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }
          ]}
          rows={invoiceRows}
          mobileTitle={(r: any) => `${r.invoiceNo} · ${r.student}`}
          caption="Invoices" />
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
          rows={receiptRows}
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
