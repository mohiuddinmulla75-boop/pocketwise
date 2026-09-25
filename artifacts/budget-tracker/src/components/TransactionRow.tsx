import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Currency, formatDate, money, type Transaction } from '@/lib/finance';
export function TransactionRow({transaction,currency,onEdit,onDelete}:{transaction:Transaction;currency:Currency;onEdit?:()=>void;onDelete?:()=>void}) {
  return <div data-testid={`row-transaction-${transaction.id}`} className="group flex items-center gap-3 border-b border-border/60 py-4 last:border-0">
    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${transaction.type==='Income'?'bg-emerald-100 text-emerald-700':'bg-orange-100 text-orange-700'}`}>{transaction.type==='Income'?<ArrowDownLeft size={18}/>:<ArrowUpRight size={18}/>}</div>
    <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p data-testid={`text-transaction-note-${transaction.id}`} className="truncate text-sm font-bold">{transaction.notes||transaction.category}</p><span className="hidden rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline">{transaction.category}</span></div><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><span>{formatDate(transaction.date)}</span><span>·</span><span>{transaction.paymentMethod}</span></p></div>
    <p data-testid={`text-transaction-amount-${transaction.id}`} className={`text-sm font-bold ${transaction.type==='Income'?'text-emerald-700':'text-foreground'}`}>{transaction.type==='Income'?'+':'−'}{money(transaction.amount,currency)}</p>
    {(onEdit||onDelete)&&<div className="flex opacity-60 transition group-hover:opacity-100">{onEdit&&<Button variant="ghost" size="icon" onClick={onEdit} data-testid={`button-edit-transaction-${transaction.id}`}><Pencil size={15}/></Button>}{onDelete&&<Button variant="ghost" size="icon" onClick={onDelete} data-testid={`button-delete-transaction-${transaction.id}`}><Trash2 size={15}/></Button>}</div>}
  </div>;
}