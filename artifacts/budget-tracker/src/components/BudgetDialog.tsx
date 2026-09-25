import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CATEGORIES, makeId, type Budget } from '@/lib/finance';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

type Values={scope:'global'|'category';category:string;monthlyLimit:string};
export function BudgetDialog({open,onOpenChange,onSave,editing}:{open:boolean;onOpenChange:(v:boolean)=>void;onSave:(budget:Budget)=>void;editing?:Budget}) {
  const form=useForm<Values>({defaultValues:{scope:'global',category:'Food',monthlyLimit:''}});
  useEffect(()=>{if(open)form.reset(editing?{scope:editing.scope,category:editing.category??'Food',monthlyLimit:String(editing.monthlyLimit)}:{scope:'global',category:'Food',monthlyLimit:''})},[open,editing]);
  const scope=form.watch('scope');
  const submit=(v:Values)=>{if(Number(v.monthlyLimit)<=0)return;onSave({id:editing?.id??makeId('budget'),scope:v.scope,category:v.scope==='category'?v.category as Budget['category']:undefined,monthlyLimit:Number(v.monthlyLimit)});onOpenChange(false)};
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle className="font-serif text-2xl">{editing?'Edit budget':'Set a budget'}</DialogTitle><DialogDescription>Choose a monthly guardrail that gives your spending a little shape.</DialogDescription></DialogHeader><Form {...form}><form onSubmit={form.handleSubmit(submit)} className="space-y-4">
    <FormField control={form.control} name="scope" render={({field})=><FormItem><FormLabel>Budget scope</FormLabel><FormControl><select {...field} data-testid="select-budget-scope" className="field-input"><option value="global">All expenses</option><option value="category">A category</option></select></FormControl></FormItem>}/>
    {scope==='category'&&<FormField control={form.control} name="category" render={({field})=><FormItem><FormLabel>Category</FormLabel><FormControl><select {...field} data-testid="select-budget-category" className="field-input">{CATEGORIES.filter(c=>c!=='Salary'&&c!=='Investments').map(c=><option key={c}>{c}</option>)}</select></FormControl></FormItem>}/>}
    <FormField control={form.control} name="monthlyLimit" rules={{required:'Enter a limit'}} render={({field})=><FormItem><FormLabel>Monthly limit</FormLabel><FormControl><input {...field} type="number" min="0" step="0.01" placeholder="0.00" data-testid="input-budget-limit" className="field-input"/></FormControl><FormMessage/></FormItem>}/>
    <DialogFooter><Button type="button" variant="ghost" onClick={()=>onOpenChange(false)} data-testid="button-cancel-budget">Cancel</Button><Button type="submit" data-testid="button-save-budget">Save budget</Button></DialogFooter>
  </form></Form></DialogContent></Dialog>;
}