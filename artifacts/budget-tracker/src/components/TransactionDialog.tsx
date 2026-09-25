import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CATEGORIES, METHODS, makeId, type Transaction } from '@/lib/finance';
import { useForm } from 'react-hook-form';
import { Plus, Save } from 'lucide-react';
import { useEffect } from 'react';

type Values = {amount:string; type:'Expense'|'Income'; category:string; date:string; paymentMethod:string; notes:string};
export function TransactionDialog({open,onOpenChange,onSave,editing}:{open:boolean;onOpenChange:(v:boolean)=>void;onSave:(tx:Transaction)=>void;editing?:Transaction}) {
  const form=useForm<Values>({defaultValues:{amount:'',type:'Expense',category:'Food',date:new Date().toISOString().slice(0,10),paymentMethod:'Debit Card',notes:''}});
  useEffect(()=>{ if(open) form.reset(editing?{amount:String(editing.amount),type:editing.type,category:editing.category,date:editing.date,paymentMethod:editing.paymentMethod,notes:editing.notes}:{amount:'',type:'Expense',category:'Food',date:new Date().toISOString().slice(0,10),paymentMethod:'Debit Card',notes:''}); },[open,editing]);
  const submit=(v:Values)=>{ if(Number(v.amount)<=0)return; onSave({id:editing?.id??makeId('tx'),amount:Number(v.amount),type:v.type,category:v.category as Transaction['category'],date:v.date,paymentMethod:v.paymentMethod as Transaction['paymentMethod'],notes:v.notes.trim()}); form.reset(); };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle className="font-serif text-2xl">{editing?'Edit transaction':'Add transaction'}</DialogTitle><DialogDescription>Keep the details light and accurate. You can change them later.</DialogDescription></DialogHeader>
    <Form {...form}><form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3"><FormField control={form.control} name="amount" rules={{required:'Enter an amount'}} render={({field})=><FormItem><FormLabel>Amount</FormLabel><FormControl><input {...field} type="number" step="0.01" min="0" placeholder="0.00" data-testid="input-transaction-amount" className="field-input"/></FormControl><FormMessage/></FormItem>}/>
      <FormField control={form.control} name="type" render={({field})=><FormItem><FormLabel>Type</FormLabel><FormControl><select {...field} data-testid="select-transaction-type" className="field-input"><option>Expense</option><option>Income</option></select></FormControl></FormItem>}/></div>
      <div className="grid grid-cols-2 gap-3"><FormField control={form.control} name="category" render={({field})=><FormItem><FormLabel>Category</FormLabel><FormControl><select {...field} data-testid="select-transaction-category" className="field-input">{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></FormControl></FormItem>}/>
      <FormField control={form.control} name="date" render={({field})=><FormItem><FormLabel>Date</FormLabel><FormControl><input {...field} type="date" data-testid="input-transaction-date" className="field-input"/></FormControl></FormItem>}/></div>
      <FormField control={form.control} name="paymentMethod" render={({field})=><FormItem><FormLabel>Payment method</FormLabel><FormControl><select {...field} data-testid="select-transaction-method" className="field-input">{METHODS.map(m=><option key={m}>{m}</option>)}</select></FormControl></FormItem>}/>
      <FormField control={form.control} name="notes" render={({field})=><FormItem><FormLabel>Note <span className="font-normal text-muted-foreground">(optional)</span></FormLabel><FormControl><input {...field} data-testid="input-transaction-note" placeholder="What was this for?" className="field-input"/></FormControl></FormItem>}/>
      <DialogFooter><Button type="button" variant="ghost" onClick={()=>onOpenChange(false)} data-testid="button-cancel-transaction">Cancel</Button><Button type="submit" data-testid="button-save-transaction">{editing?<Save size={16}/>:<Plus size={16}/>} {editing?'Save changes':'Add transaction'}</Button></DialogFooter>
    </form></Form>
  </DialogContent></Dialog>;
}