'use client';
import { useMemo, useState } from 'react';
import { Search, Download, Plus, Upload, Copy, MessageSquare, MoreHorizontal, CalendarDays, ChevronDown, CheckCircle2, Truck, Package, MessageCircle } from 'lucide-react';
type Order = { id: string; date: string; time: string; staff: string; customer: string; phone: string; product: string; state: string; amount: number; status: string; agent: string };
const states = ['Imo', 'Abia', 'Kebbi', 'Bayelsa', 'Ebonyi', 'Plateau', 'Gombe', 'Zamfara', 'Katsina', 'Bauchi', 'Nasarawa', 'Delta', 'Oyo', 'FCT Abuja'];
const seed: Order[] = Array.from({ length: 45 }, (_, i) => ({ id: `SG-${129961 - i}`, date: '06 Nov 2026', time: i % 2 ? '8:37am' : '8:07am', staff: 'Demo Sales Rep', customer: `Demo Customer ${129961 - i}`, phone: `DEMO-PHONE-${129961 - i}`, product: 'Demo Glow Skincare Bundle × 1', state: states[i % states.length], amount: 30000, status: 'Delivered', agent: ['Demo Courier Lagos', 'Demo Courier Abuja', 'Demo Courier Rivers', 'Demo Courier Kano'][i % 4] }));
const money = (n: number) => `₦${n.toLocaleString('en-NG')}`;
export default function OrdersPage() {
    const [orders, setOrders] = useState(seed); const [tab, setTab] = useState('Today'); const [query, setQuery] = useState(''); const [status, setStatus] = useState('All Statuses'); const [product, setProduct] = useState('All Products'); const [staff, setStaff] = useState('All Staff'); const [agent, setAgent] = useState('All Agents'); const [date, setDate] = useState(''); const [selected, setSelected] = useState<string[]>([]); const rows = useMemo(() => orders.filter(o => (status === 'All Statuses' || o.status === status) && (product === 'All Products' || o.product.startsWith(product)) && (staff === 'All Staff' || o.staff === staff) && (agent === 'All Agents' || o.agent === agent) && (!date || o.date === date) && `${o.id} ${o.customer} ${o.phone} ${o.product} ${o.state}`.toLowerCase().includes(query.toLowerCase()) && (tab === 'All' || tab === 'Today' || (tab === 'Due Today' && o.status === 'Pending') || (tab === 'Upsells' && o.product.includes('Wellness')) || (tab === 'Trash' && o.status === 'Cancelled'))), [orders, status, product, staff, agent, date, query, tab]); const exportCsv = () => { const csv = ['Order ID,Date,Assigned To,Customer,Phone,Product,State,Amount,Status,Agent', ...rows.map(o => [o.id, o.date, o.staff, o.customer, o.phone, o.product, o.state, o.amount, o.status, o.agent].join(','))].join('\\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'orders.csv'; a.click(); URL.revokeObjectURL(a.href) }; const toggle = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]); return <div className="orders-page">
        <div className="page-heading">
            <div>
                <h1>Orders</h1>
                <p>Manage and track all your orders</p>
            </div>
            <div className="heading-actions">
                <button className="button secondary" onClick={exportCsv}><Download size={15} /> Export CSV</button>
                <label className="button secondary">
                    <Upload size={15} /> Import CSV
                    <input type="file" accept=".csv" hidden onChange={e => { if (e.target.files?.[0]) alert('CSV selected. Import processing can be connected to your backend.') }} />
                </label>
                <button className="button primary"><Plus size={16} /> New Order</button>
            </div>
        </div>
        <div className="order-summary">
            <div>
                <strong>0</strong>
                <span>Delivered Today</span>
                <i className="mint"><CheckCircle2 size={20} /></i>
            </div>
            <div>
                <strong>0</strong>
                <span>In Transit Now</span>
                <i className="amber"><Truck size={20} /></i>
            </div>
            <div>
                <strong>0</strong>
                <span>Pending Orders</span>
                <i className="blue"><Package size={20} /></i>
            </div>
            <div>
                <strong>₦0</strong>
                <span>Today's Order Worth</span>
                <i className="mint"><TrendingIcon /></i>
            </div>
        </div>
        <section className="panel orders-table-panel">
            <div className="order-tabs">{['All', 'Today', 'Yesterday', 'Due Today', 'Upsells', 'Trash'].map(t => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>)}</div><div className="orders-filterbar"><label className="table-search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} 
            placeholder="Search by name, phone, or order #" /></label><select value={status} onChange={e => setStatus(e.target.value)}><option>All Statuses</option>{['Delivered', 'In Transit', 'Pending', 'Cancelled'].map(x => <option key={x}>{x}</option>)}</select><select value={product} onChange={e => setProduct(e.target.value)}><option>All Products</option>{['Demo Glow Skincare Bundle', 'Demo Fit Wellness Pack', 'Demo Kitchen Saver Set', 'Demo Smart Organizer', 'Demo Travel Essentials Kit'].map(x => <option key={x}>{x}</option>)}</select><select value={staff} onChange={e => setStaff(e.target.value)}><option>All Staff</option><option>Demo Sales Rep</option></select><select value={agent} onChange={e => setAgent(e.target.value)}><option>All Agents</option>{['Demo Courier Lagos', 'Demo Courier Abuja', 'Demo Courier Rivers', 'Demo Courier Kano'].map(x => <option key={x}>{x}</option>)}</select><label className="date-filter"><CalendarDays size={14} /><input type="date" value={date} onChange={e => setDate(e.target.value)} aria-label="Filter by date" /></label></div><div className="orders-count">{rows.length.toLocaleString()} orders · page 1 of {Math.max(1, Math.ceil(rows.length / 15))}</div><div className="table-scroll"><table className="orders-detail-table"><thead><tr><th><input type="checkbox" checked={selected.length === rows.length && rows.length > 0} onChange={e => setSelected(e.target.checked ? rows.map(x => x.id) : [])} /></th><th>DATE</th><th>ASSIGNED TO</th><th>CUSTOMER</th><th>PRODUCTS</th><th>STATE</th><th>AMOUNT</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{rows.slice(0, 15).map(o => <tr key={o.id}><td><input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} /></td><td><b>{o.date}</b><small className="sub-cell">{o.time}</small></td><td>{o.staff}</td><td><b>{o.customer}</b><small className="sub-cell">{o.phone}</small></td><td><b>{o.product}</b></td><td>{o.state}</td><td><b>{money(o.amount)}</b></td><td><select className={`order-status ${o.status.toLowerCase().replace(' ', '-')}`} value={o.status} onChange={e => setOrders(old => old.map(x => x.id === o.id ? { ...x, status: e.target.value } : x))}>{['Delivered', 'In Transit', 'Pending', 'Cancelled'].map(x => <option key={x}>{x}</option>)}</select></td><td><div className="order-actions"><button title="Copy order ID" onClick={() => navigator.clipboard?.writeText(o.id)}><Copy size={15} /></button>
            <button title="Message customer"><MessageSquare size={15} /></button>
            <button className="whatsapp" title="WhatsApp"><MessageCircle size={15} /></button>
            <button title="More actions"><MoreHorizontal size={16} /></button></div></td></tr>)}</tbody>
            </table>
            {!rows.length && <div className="empty-state">No orders found for these filters.</div>}
            </div>
            <div className="table-footer">
                <span>{selected.length ? `${selected.length} selected · ` : ''}Showing {Math.min(15, rows.length)} of {rows.length} orders</span>
                <div className="pagination">
                    <button disabled>‹</button>
                    <button className="current-page">1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>›</button>
                </div>
            </div>
        </section>
    </div>
}
function TrendingIcon() { return <span>↗</span> }
