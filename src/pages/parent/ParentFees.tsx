import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BanknoteIcon, CheckCircle2Icon, DownloadIcon, Loader2Icon, PrinterIcon, SmartphoneIcon, WalletIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, Field, Input, PageHeader, Progress, Stat, cx } from '../../components/ui/primitives';
import { Alert, Modal } from '../../components/ui/feedback';
import { DataTable } from '../../components/ui/data';
import { FEE_BREAKDOWN, FEE_SUMMARY, PAYMENTS, formatKES } from '../../data/finance';
import { GUARDIANS, STUDENTS } from '../../data/people';
import { useApp } from '../../contexts/AppContext';

type Stage = 'method' | 'details' | 'processing' | 'done';

export function ParentFees() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>('method');
  const [method, setMethod] = useState<'M-Pesa' | 'Bank Transfer'>('M-Pesa');
  const [amount, setAmount] = useState('35000');
  const [phone, setPhone] = useState('+254 722 481 903');
  const [receipt, setReceipt] = useState<null | {ref: string;no: string;}>(null);
  const { toast } = useApp();

  const start = () => {
    setStage('processing');
    window.setTimeout(() => {
      setStage('done');
      setReceipt({ ref: 'SALA7X92KQ', no: 'RCT-2026-04310' });
      toast({ tone: 'success', title: 'Payment successful', body: `${formatKES(Number(amount))} received · Ref SALA7X92KQ` });
    }, 1800);
  };

  const close = () => {
    setOpen(false);
    window.setTimeout(() => setStage('method'), 250);
  };

  return (
    <div>
      <PageHeader
        title="School fees"
        subtitle={`${FEE_SUMMARY.term} · Wanjiru Kamau, Grade 4 Acacia`}
        actions={
        <Button icon={<WalletIcon size={16} />} onClick={() => setOpen(true)}>
            Make a payment
          </Button>
        } />
      

      {FEE_SUMMARY.balance > 0 &&
      <div className="mb-6">
          <Alert tone="warning" title={`${formatKES(FEE_SUMMARY.balance)} is outstanding for Term 3`}>
            Payment is due by {FEE_SUMMARY.deadline}. Instalment arrangements can be made with the finance office on +254 726 118 990.
          </Alert>
        </div>
      }

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total billed" value={formatKES(FEE_SUMMARY.total)} sub={FEE_SUMMARY.term} icon={<BanknoteIcon size={16} />} />
        <Stat label="Amount paid" value={formatKES(FEE_SUMMARY.paid)} sub="2 payments this term" icon={<CheckCircle2Icon size={16} />} tone="primary" />
        <Stat label="Outstanding" value={formatKES(FEE_SUMMARY.balance)} sub={`Due ${FEE_SUMMARY.deadline}`} icon={<WalletIcon size={16} />} tone="danger" />
        <Stat label="Next deadline" value="30 Sep" sub="10 days from today" icon={<SmartphoneIcon size={16} />} tone="gold" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Fee breakdown" subtitle={FEE_SUMMARY.term} />
            <ul className="divide-y divide-line">
              {FEE_BREAKDOWN.map((f) =>
              <li key={f.label} className="px-5 py-3 flex items-center justify-between gap-4">
                  <span className="text-[14px] text-ink">{f.label}</span>
                  <span className="text-[14px] font-medium text-ink tabular-nums">{formatKES(f.amount)}</span>
                </li>
              )}
            </ul>
            <div className="px-5 py-3.5 border-t border-line bg-cream/60 flex items-center justify-between">
              <span className="text-[14px] font-semibold text-ink">Total</span>
              <span className="text-[15px] font-semibold text-ink tabular-nums">{formatKES(FEE_SUMMARY.total)}</span>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Payment history"
              subtitle="All payments across both children"
              action={
              <Button variant="secondary" size="sm" icon={<DownloadIcon size={15} />}>
                  Statement
                </Button>
              } />
            
            <DataTable
              columns={[
              { key: 'date', header: 'Date' },
              { key: 'student', header: 'Student', hideOnMobile: true },
              { key: 'term', header: 'Term', hideOnMobile: true },
              { key: 'method', header: 'Method', render: (r: any) => <Badge tone="neutral">{r.method}</Badge> },
              { key: 'reference', header: 'Reference' },
              { key: 'amount', header: 'Amount', align: 'right', render: (r: any) => formatKES(r.amount) },
              {
                key: 'receipt',
                header: '',
                align: 'right',
                render: (r: any) =>
                <Button variant="ghost" size="sm" onClick={() => setReceipt({ ref: r.reference, no: r.receiptNo })}>
                      Receipt
                    </Button>

              }]
              }
              rows={PAYMENTS}
              mobileTitle={(r: any) => `${formatKES(r.amount)} · ${r.date}`}
              caption="Payment history" />
            
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Term 3 progress</h3>
            <Progress className="mt-3" value={FEE_SUMMARY.paid / FEE_SUMMARY.total * 100} label="Fees paid" />
            <p className="mt-2 text-[13px] text-ink-muted">
              {formatKES(FEE_SUMMARY.paid)} of {formatKES(FEE_SUMMARY.total)} paid ({Math.round(FEE_SUMMARY.paid / FEE_SUMMARY.total * 100)}%)
            </p>
            <Button full className="mt-4" onClick={() => setOpen(true)}>
              Pay {formatKES(FEE_SUMMARY.balance)}
            </Button>
          </Card>

          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">How to pay</h3>
            <dl className="mt-3 space-y-3 text-[13.5px]">
              <div>
                <dt className="font-medium text-ink">M-Pesa Paybill</dt>
                <dd className="text-ink-muted">Business no. 522533 · Account: your child’s admission number</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Bank transfer</dt>
                <dd className="text-ink-muted">KCB Bank · Muthaiga Branch · A/C 1157 2290 447</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">In person</dt>
                <dd className="text-ink-muted">Finance office, Mon – Fri 8:00am – 4:00pm</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Other children</h3>
            <ul className="mt-3 divide-y divide-line">
              {STUDENTS.filter((s) => GUARDIANS[0].childIds.includes(s.id)).map((s, i) =>
              <li key={s.id} className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-[13.5px] text-ink">{s.name}</span>
                  <span className={cx('text-[13px] font-medium tabular-nums', i === 0 ? 'text-red-600' : 'text-forest-700')}>
                    {i === 0 ? formatKES(FEE_SUMMARY.balance) : 'Cleared'}
                  </span>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>

      {/* Payment flow */}
      <Modal
        open={open}
        onClose={close}
        title={stage === 'done' ? 'Payment successful' : 'Pay school fees'}
        description={stage === 'done' ? undefined : `Outstanding balance ${formatKES(FEE_SUMMARY.balance)} · ${FEE_SUMMARY.term}`}
        footer={
        stage === 'method' ?
        <>
              <Button variant="secondary" size="sm" onClick={close}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => setStage('details')}>
                Continue
              </Button>
            </> :
        stage === 'details' ?
        <>
              <Button variant="secondary" size="sm" onClick={() => setStage('method')}>
                Back
              </Button>
              <Button size="sm" onClick={start}>
                Pay {formatKES(Number(amount) || 0)}
              </Button>
            </> :
        stage === 'done' ?
        <>
              <Button variant="secondary" size="sm" icon={<PrinterIcon size={15} />} onClick={() => window.print()}>
                Print receipt
              </Button>
              <Button size="sm" onClick={close}>
                Done
              </Button>
            </> :
        undefined
        }>
        
        {stage === 'method' &&
        <div className="space-y-3">
            {[
          { id: 'M-Pesa' as const, icon: <SmartphoneIcon size={18} />, title: 'M-Pesa', body: 'An STK push will be sent to your phone for confirmation.' },
          { id: 'Bank Transfer' as const, icon: <BanknoteIcon size={18} />, title: 'Bank transfer', body: 'Pay to KCB 1157 2290 447 and upload your slip.' }].
          map((m) =>
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            aria-pressed={method === m.id}
            className={cx(
              'w-full flex items-start gap-3.5 rounded-lg border p-4 text-left transition-colors duration-150',
              method === m.id ? 'border-forest-600 bg-forest-50/60' : 'border-line hover:border-forest-300'
            )}>
            
                <span className="h-10 w-10 rounded-lg bg-white border border-line grid place-items-center text-forest-700 shrink-0">{m.icon}</span>
                <span>
                  <span className="block text-[14px] font-medium text-ink">{m.title}</span>
                  <span className="block text-[13px] text-ink-muted mt-0.5">{m.body}</span>
                </span>
              </button>
          )}
          </div>
        }

        {stage === 'details' &&
        <div className="space-y-4">
            <Field label="Amount (KES)" required hint="You can pay part of the balance.">
              <Input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" />
            </Field>
            {method === 'M-Pesa' ?
          <Field label="M-Pesa phone number" required hint="You will receive a prompt on this number.">
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Field> :

          <Field label="Bank slip reference" required>
                <Input placeholder="e.g. KCB-8841207" />
              </Field>
          }
            <Field label="Paying for">
              <Input readOnly value="Wanjiru Kamau · SALA/2021/0418 · Term 3 2026" />
            </Field>
            <Alert tone="info" title="This is a prototype">No real payment is taken. Transaction details are simulated.</Alert>
          </div>
        }

        {stage === 'processing' &&
        <div className="py-10 text-center">
            <Loader2Icon size={30} className="mx-auto animate-spin text-forest-700" />
            <p className="mt-4 text-[15px] font-medium text-ink">Waiting for confirmation…</p>
            <p className="mt-1 text-[13.5px] text-ink-muted">Enter your M-Pesa PIN on {phone} to authorise {formatKES(Number(amount))}.</p>
          </div>
        }

        {stage === 'done' && receipt && <ReceiptBody amount={Number(amount)} method={method} reference={receipt.ref} receiptNo={receipt.no} />}
      </Modal>

      {/* Standalone receipt viewer */}
      <Modal
        open={!open && !!receipt}
        onClose={() => setReceipt(null)}
        title="Payment receipt"
        footer={
        <>
            <Button variant="secondary" size="sm" icon={<DownloadIcon size={15} />}>
              Download
            </Button>
            <Button size="sm" icon={<PrinterIcon size={15} />} onClick={() => window.print()}>
              Print
            </Button>
          </>
        }>
        
        {receipt && <ReceiptBody amount={40000} method="M-Pesa" reference={receipt.ref} receiptNo={receipt.no} />}
      </Modal>
    </div>);

}

function ReceiptBody({ amount, method, reference, receiptNo }: {amount: number;method: string;reference: string;receiptNo: string;}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
      <div className="rounded-lg border border-line overflow-hidden">
        <div className="bg-forest-800 text-white px-5 py-4">
          <p className="font-serif text-[17px]">St. Ann Lifred Academy Schools</p>
          <p className="text-[12.5px] text-forest-100/80">Kiambu Road, Runda Gardens, Nairobi · finance@salaschools.ac.ke</p>
        </div>
        <dl className="divide-y divide-line">
          {[
          ['Receipt number', receiptNo],
          ['Date', '20 September 2026, 10:42am'],
          ['Parent / payer', 'Grace Wanjiku Kamau'],
          ['Student', 'Wanjiru Kamau · SALA/2021/0418 · Grade 4 Acacia'],
          ['Term', 'Term 3 · 2026'],
          ['Payment method', method],
          ['Transaction reference', reference],
          ['Amount paid', formatKES(amount)],
          ['Balance after payment', formatKES(Math.max(0, FEE_SUMMARY.balance - amount))]].
          map(([k, v]) =>
          <div key={k} className="flex justify-between gap-4 px-5 py-2.5">
              <dt className="text-[13px] text-ink-muted">{k}</dt>
              <dd className="text-[13.5px] font-medium text-ink text-right">{v}</dd>
            </div>
          )}
        </dl>
        <div className="px-5 py-3 bg-cream/60 text-[12px] text-ink-muted">
          This is a computer-generated receipt and does not require a signature. Prototype data — not a real transaction.
        </div>
      </div>
    </motion.div>);

}