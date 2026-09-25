import { useMemo, useState } from 'react';

export const CATEGORIES = ['Food','Rent/Housing','Utilities','Transport','Entertainment','Shopping','Healthcare','Salary','Investments','Other'] as const;
export const METHODS = ['Cash','Credit Card','Debit Card','UPI/Bank Transfer'] as const;
export type Category = typeof CATEGORIES[number];
export type Method = typeof METHODS[number];
export type TransactionType = 'Expense' | 'Income';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';
export type Transaction = { id:string; amount:number; type:TransactionType; category:Category; date:string; paymentMethod:Method; notes:string };
export type Budget = { id:string; scope:'global'|'category'; category?:Category; monthlyLimit:number };
export type Settings = { currency:Currency };
export type FinanceState = { version:1; transactions:Transaction[]; budgets:Budget[]; settings:Settings; hasSeeded:boolean };
const KEY = 'pocketwise-finance-v1';

const iso = (offset:number) => { const d = new Date(); d.setDate(d.getDate()+offset); return d.toISOString().slice(0,10); };
export const sampleTransactions:Transaction[] = [
  {id:'seed-salary', amount:4200, type:'Income', category:'Salary', date:iso(-2), paymentMethod:'UPI/Bank Transfer', notes:'Monthly salary'},
  {id:'seed-rent', amount:1380, type:'Expense', category:'Rent/Housing', date:iso(-4), paymentMethod:'UPI/Bank Transfer', notes:'April rent'},
  {id:'seed-groceries', amount:86.42, type:'Expense', category:'Food', date:iso(-6), paymentMethod:'Debit Card', notes:'Market groceries'},
  {id:'seed-freelance', amount:640, type:'Income', category:'Other', date:iso(-9), paymentMethod:'UPI/Bank Transfer', notes:'Side project'},
  {id:'seed-transit', amount:42.5, type:'Expense', category:'Transport', date:iso(-11), paymentMethod:'Credit Card', notes:'Metro pass'},
  {id:'seed-streaming', amount:24.99, type:'Expense', category:'Entertainment', date:iso(-14), paymentMethod:'Credit Card', notes:'Streaming bundle'},
  {id:'seed-utilities', amount:118.7, type:'Expense', category:'Utilities', date:iso(-17), paymentMethod:'Debit Card', notes:'Electric + internet'},
  {id:'seed-dinner', amount:54.25, type:'Expense', category:'Food', date:iso(-20), paymentMethod:'Credit Card', notes:'Dinner with friends'},
  {id:'seed-investment', amount:300, type:'Expense', category:'Investments', date:iso(-23), paymentMethod:'UPI/Bank Transfer', notes:'Index fund contribution'},
  {id:'seed-health', amount:72, type:'Expense', category:'Healthcare', date:iso(-27), paymentMethod:'Debit Card', notes:'Pharmacy'},
  {id:'seed-salary2', amount:3850, type:'Income', category:'Salary', date:iso(-34), paymentMethod:'UPI/Bank Transfer', notes:'Previous month salary'},
  {id:'seed-shopping', amount:129.95, type:'Expense', category:'Shopping', date:iso(-39), paymentMethod:'Credit Card', notes:'Home supplies'},
];
export const sampleBudgets:Budget[] = [
  {id:'budget-global',scope:'global',monthlyLimit:2800},
  {id:'budget-food',scope:'category',category:'Food',monthlyLimit:360},
  {id:'budget-transport',scope:'category',category:'Transport',monthlyLimit:180},
  {id:'budget-fun',scope:'category',category:'Entertainment',monthlyLimit:120},
];
const fresh = ():FinanceState => ({version:1, transactions:sampleTransactions, budgets:sampleBudgets, settings:{currency:'USD'}, hasSeeded:true});
export function readState():FinanceState {
  try { const raw = localStorage.getItem(KEY); if(raw) { const parsed = JSON.parse(raw) as FinanceState; if(parsed.version===1) return parsed; } } catch { /* recover below */ }
  const next = fresh(); localStorage.setItem(KEY, JSON.stringify(next)); return next;
}
export function writeState(state:FinanceState) { localStorage.setItem(KEY, JSON.stringify(state)); window.dispatchEvent(new Event('pocketwise-change')); }
export function emptyState():FinanceState { return {version:1, transactions:[], budgets:[], settings:{currency:'USD'}, hasSeeded:true}; }
export function useFinance() {
  const [state,setState] = useState<FinanceState>(() => readState());
  const update = (fn:(s:FinanceState)=>FinanceState) => setState(prev => { const next=fn(prev); writeState(next); return next; });
  const actions = useMemo(() => ({
    saveTransaction:(tx:Transaction) => update(s=>({...s,transactions:s.transactions.some(x=>x.id===tx.id)?s.transactions.map(x=>x.id===tx.id?tx:x):[tx,...s.transactions]})),
    deleteTransaction:(id:string)=>update(s=>({...s,transactions:s.transactions.filter(x=>x.id!==id)})),
    saveBudget:(budget:Budget)=>update(s=>({...s,budgets:s.budgets.some(x=>x.id===budget.id)?s.budgets.map(x=>x.id===budget.id?budget:x):[budget,...s.budgets]})),
    deleteBudget:(id:string)=>update(s=>({...s,budgets:s.budgets.filter(x=>x.id!==id)})),
    setCurrency:(currency:Currency)=>update(s=>({...s,settings:{currency}})),
    restoreSamples:()=>{ const next=fresh(); writeState(next); setState(next); },
    reset:()=>{ const next=emptyState(); writeState(next); setState(next); },
  }), []);
  return {state,...actions};
}
export const money = (value:number,currency:Currency) => new Intl.NumberFormat(undefined,{style:'currency',currency,maximumFractionDigits:2}).format(value);
export const monthKey = (date:string) => date.slice(0,7);
export const currentMonth = () => new Date().toISOString().slice(0,7);
export const formatDate = (date:string) => new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(new Date(`${date}T12:00:00`));
export const makeId = (prefix:string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;