"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownToLine, ArrowUpRight, Building2, CheckCircle2, ChevronDown,
  Eye, EyeOff, KeyRound, Plus, RotateCw, Search, Settings, Wallet as WalletIcon, X,
} from "lucide-react";

type Transaction = {
  id: number; title: string; type: "Deposit" | "Withdrawal" | "Incentive" | "Bonus" | "Adjustment";
  amount: number; status: "completed" | "pending"; date: string; reference: string;
};

const initialTransactions: Transaction[] = [
  { id: 1, title: "Demo sales revenue", type: "Deposit", amount: 3900000000, status: "completed", date: "05 Nov 2026", reference: "WLT-0001" },
  { id: 2, title: "Agent commission payout", type: "Withdrawal", amount: -1250000, status: "completed", date: "04 Nov 2026", reference: "WLT-0002" },
  { id: 3, title: "Performance incentive", type: "Incentive", amount: 850000, status: "completed", date: "03 Nov 2026", reference: "WLT-0003" },
  { id: 4, title: "Quarterly sales bonus", type: "Bonus", amount: 500000, status: "pending", date: "02 Nov 2026", reference: "WLT-0004" },
  { id: 5, title: "Wallet reconciliation", type: "Adjustment", amount: -250000, status: "completed", date: "01 Nov 2026", reference: "WLT-0005" },
];

const money = (amount: number) => `${amount < 0 ? "-₦" : "₦"}${Math.abs(amount).toLocaleString("en-NG")}`;
const filters = ["All", "Deposit", "Withdrawal", "Incentive", "Bonus", "Adjustment"];

export default function WalletPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dialog, setDialog] = useState<"fund" | "withdraw" | "change-pin" | "reset-pin" | "bank" | null>(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [transactions] = useState(initialTransactions);
  const [notice, setNotice] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [accountName, setAccountName] = useState("Salesgee Demo Store");
  const [bankName, setBankName] = useState("Access Bank");
  const [accountNumber, setAccountNumber] = useState("0123456789");

  const visibleTransactions = useMemo(() => transactions.filter((item) => {
    const matchesType = filter === "All" || item.type === filter;
    const matchesSearch = `${item.title} ${item.reference} ${item.type}`.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  }), [transactions, filter, search]);

  function closeDialog() { setDialog(null); setAmount(""); setPin(""); setNewPin(""); }
  function submitDialog(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const messages = {
      fund: "Funding request submitted in demo mode.",
      withdraw: "Withdrawal request submitted in demo mode.",
      "change-pin": "Wallet PIN updated in demo mode.",
      "reset-pin": "PIN reset request submitted in demo mode.",
      bank: "Bank account details saved in demo mode.",
    };
    if (dialog) setNotice(messages[dialog]);
    closeDialog();
  }

  return <div className="wallet-page">
    <div className="wallet-heading">
      <div><h1>Wallet</h1><p>Powered by <strong>Paystack</strong></p></div>
      <div className="wallet-settings-wrap">
        <button className="wallet-settings-button" onClick={() => setSettingsOpen(!settingsOpen)} aria-expanded={settingsOpen}>
          <Settings size={15}/> Settings
        </button>
        {settingsOpen && <div className="wallet-settings-menu">
          <button onClick={() => { setDialog("change-pin"); setSettingsOpen(false); }}><KeyRound size={14}/> Change PIN</button>
          <button onClick={() => { setDialog("reset-pin"); setSettingsOpen(false); }}><RotateCw size={14}/> Reset PIN</button>
          <button onClick={() => { setDialog("bank"); setSettingsOpen(false); }}><Building2 size={14}/> Bank Account Details</button>
        </div>}
      </div>
    </div>

    <section className="wallet-balance-card">
      <div className="wallet-balance-decoration one"/><div className="wallet-balance-decoration two"/>
      <div className="wallet-balance-label">AVAILABLE BALANCE <button aria-label={balanceVisible ? "Hide balance" : "Show balance"} onClick={() => setBalanceVisible(!balanceVisible)}>{balanceVisible ? <Eye size={14}/> : <EyeOff size={14}/>}</button></div>
      <div className="wallet-balance-amount">{balanceVisible ? "₦2,500,000" : "••••••••••"}</div>
      <div className="wallet-actions">
        <button className="wallet-fund-button" onClick={() => setDialog("fund")}><Plus size={14}/> Fund Wallet</button>
        <button className="wallet-withdraw-button" onClick={() => setDialog("withdraw")}><ArrowDownToLine size={14}/> Withdraw</button>
      </div>
      <div className="wallet-totals">
        <div><small>↘ TOTAL IN</small><strong className="total-in">₦3,900,000,000</strong></div>
        <div><small>↗ TOTAL OUT</small><strong className="total-out">₦3,887,500,000</strong></div>
      </div>
    </section>

    <section className="wallet-transactions panel">
      <h2>Transactions</h2>
      <div className="wallet-filter-row">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? "selected" : ""}>{item}</button>)}</div>
      <label className="wallet-search"><Search size={16}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions..."/></label>
      <div className="wallet-transaction-list">
        {visibleTransactions.map((item) => <div className="wallet-transaction" key={item.id}>
          <div className="wallet-transaction-icon"><WalletIcon size={17}/></div>
          <div className="wallet-transaction-main"><strong>{item.title}</strong><small>{item.date} · {item.reference} · {item.type}</small></div>
          <div className="wallet-transaction-value"><strong className={item.amount >= 0 ? "positive" : "negative"}>{item.amount >= 0 ? "+" : ""}{money(item.amount)}</strong><span className={`wallet-status ${item.status}`}>{item.status}</span></div>
        </div>)}
        {visibleTransactions.length === 0 && <div className="wallet-empty">No transactions match your search.</div>}
      </div>
    </section>

    {notice && <div className="wallet-toast"><CheckCircle2 size={17}/>{notice}<button onClick={() => setNotice("")}><X size={15}/></button></div>}

    {dialog && <div className="wallet-modal-backdrop" onClick={closeDialog}>
      <form className="wallet-modal" onSubmit={submitDialog} onClick={(e) => e.stopPropagation()}>
        <div className="wallet-modal-heading"><div><h3>{dialog === "fund" ? "Fund Wallet" : dialog === "withdraw" ? "Withdraw funds" : dialog === "change-pin" ? "Change Wallet PIN" : dialog === "reset-pin" ? "Reset Wallet PIN" : "Bank Account Details"}</h3><p>{dialog === "fund" ? "Add money to your Salesgee wallet." : dialog === "withdraw" ? "Request a transfer from your wallet." : dialog === "bank" ? "Manage the bank account linked to your wallet." : "Keep your wallet secure with your PIN."}</p></div><button type="button" onClick={closeDialog} aria-label="Close"><X size={18}/></button></div>
        {(dialog === "fund" || dialog === "withdraw") && <label className="wallet-field">Amount (₦)<input required min="100" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount"/></label>}
        {(dialog === "change-pin" || dialog === "reset-pin") && <><label className="wallet-field">{dialog === "change-pin" ? "Current PIN" : "Account email or phone"}<input required type={dialog === "change-pin" ? "password" : "text"} value={pin} onChange={(e) => setPin(e.target.value)} placeholder={dialog === "change-pin" ? "Enter current PIN" : "Enter registered email or phone"}/></label><label className="wallet-field"> {dialog === "change-pin" ? "New PIN" : "New PIN"}<input required minLength={4} maxLength={6} type="password" value={newPin} onChange={(e) => setNewPin(e.target.value)} placeholder="Enter new 4–6 digit PIN"/></label></>}
        {dialog === "bank" && <><label className="wallet-field">Account name<input required value={accountName} onChange={(e) => setAccountName(e.target.value)}/></label><label className="wallet-field">Bank name<input required value={bankName} onChange={(e) => setBankName(e.target.value)}/></label><label className="wallet-field">Account number<input required maxLength={10} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}/></label></>}
        <div className="wallet-modal-actions"><button type="button" className="wallet-cancel" onClick={closeDialog}>Cancel</button><button type="submit" className="wallet-submit">{dialog === "fund" ? "Continue to fund" : dialog === "withdraw" ? "Request withdrawal" : "Save changes"}</button></div>
        <small className="wallet-demo-note">Demo interface: no real payment, transfer or PIN change is processed.</small>
      </form>
    </div>}
  </div>;
}
