import { BarChart3, CheckCircle2, CircleDollarSign, Package, TrendingUp, Users, Truck, Wallet, XCircle } from 'lucide-react';

const states = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno'];
const products = ['Demo Glow Skincare Bundle','Demo Fit Wellness Pack','Demo Kitchen Saver Set','Demo Smart Organizer','Demo Travel Essentials Kit'];
const agents = ['Demo Courier Lagos','Demo Courier Abuja','Demo Courier Rivers','Demo Courier Kano'];
function Metric({label,value,sub,icon:Icon,tone='teal'}:{label:string;value:string;sub:string;icon:any;tone?:string}) {
 return <div className="report-metric"><span className={`report-icon ${tone}`}><Icon size={17}/></span><small>{label}</small><strong>{value}</strong><em>{sub}</em></div>
}
export default function ReportsPage(){return <div className="reports-page">
 <div className="page-heading"><div><h1>Reports</h1><p>In-depth store analytics · This Month</p></div><div className="heading-actions"><select className="filter-select"><option>All Products</option>{products.map(x=><option key={x}>{x}</option>)}</select><select className="filter-select"><option>This Month</option><option>This Week</option><option>Today</option><option>This Year</option></select></div></div>
 <div className="report-hero-grid">
  <div className="report-hero teal"><small><ShoppingCartIcon/> TOTAL ORDERS</small><strong>7,225</strong><span>Placed in this month</span></div>
  <div className="report-hero green"><small><CheckCircle2 size={14}/> DELIVERED</small><strong>7,225</strong><span>Delivered in this month</span></div>
  <div className="report-hero orange"><small><Package size={14}/> PENDING / UNDELIVERED</small><strong>0</strong><span>Total orders minus delivered</span></div>
  <div className="report-hero purple"><small><TrendingUp size={14}/> DELIVERY RATE</small><strong>100<sup>%</sup></strong><span>7225 of 7225 placed orders</span></div>
 </div>
 <div className="report-metrics-grid">
  <Metric label="Total Revenue" value="₦216,750,000" sub="from 7225 deliveries" icon={CircleDollarSign}/>
  <Metric label="Avg Order Value" value="₦30,000" sub="per delivered order" icon={TrendingUp} tone="purple"/>
  <Metric label="Net Profit" value="₦-2,023,250,000" sub="Negative" icon={CheckCircle2} tone="red"/>
  <Metric label="Cancel Rate" value="0%" sub="0 cancelled / rejected" icon={XCircle} tone="blue"/>
  <Metric label="Unique Customers" value="7225" sub="0 returning" icon={Users} tone="blue"/>
  <Metric label="Repeat Rate" value="0%" sub="of all customers" icon={TrendingUp} tone="purple"/>
  <Metric label="Total Expenses" value="₦2,240,000,000" sub="4 entries" icon={Wallet} tone="blue"/>
  <Metric label="Other Income" value="₦0" sub="0 entries" icon={CircleDollarSign}/>
 </div>
 <section className="panel report-trend"><div className="panel-title"><div><h2>Revenue Trend</h2><p>Daily delivered revenue · 30 days</p></div><strong>₦216,750,000<small>Total in period</small></strong></div><div className="mini-bars">{Array.from({length:30},(_,i)=><span key={i} style={{height:`${24+((i*19)%60)}%`}} title={`Day ${i+1}`}/>)}</div><div className="trend-dates"><span>Nov 1</span><span>Nov 5</span><span>Nov 9</span><span>Nov 13</span><span>Nov 17</span><span>Nov 21</span><span>Nov 25</span><span>Nov 29</span></div></section>
 <section className="panel financial-summary"><h2>Financial Summary</h2><div className="finance-summary-grid"><div><small>SALES REVENUE</small><b>₦216,750,000</b></div><div><small>OTHER INCOME</small><b>₦0</b></div><div><small>TOTAL EXPENSES</small><b>₦2,240,000,000</b></div><div><small>NET PROFIT</small><b className="negative">₦-2,023,250,000</b></div></div><h3>EXPENSES BY CATEGORY</h3>{[['Procurement','₦1,560,000,000',100],['Marketing','₦300,000,000',35],['Logistics','₦260,000,000',31],['Salary','₦120,000,000',16]].map(x=><div className="expense-line" key={x[0] as string}><span>{x[0]}</span><b>{x[1]}</b><div><i style={{width:`${x[2]}%`}}/></div></div>)}</section>
 <div className="report-two-col">
  <section className="panel report-list"><h3>Order Status Distribution</h3><p>Delivered <b>7225 (100%)</b></p><div className="distribution"><i/></div></section>
  <section className="panel report-list"><h3>Top States by Orders</h3>{states.map((s,i)=><div className="rank-line" key={s}><span>{i+1}</span>{s}<b>{i===0?603:602}</b><i/></div>)}</section>
  <section className="panel report-list"><h3>Top Products by Units Sold</h3>{products.map((p,i)=><div className="product-rank" key={p}><b>{i+1}. {p}</b><span>1445 <small>units</small></span><i/></div>)}</section>
  <section className="panel report-list"><h3>Top Products by Revenue</h3>{products.map((p,i)=><div className="product-rank purple-line" key={p}><b>{i+1}. {p}</b><span>₦43,350,000</span><i/></div>)}</section>
  <section className="panel report-list"><h3>Staff Performance</h3>{['Demo Sales Rep','Demo Marketer','Demo Accountant','Demo Stock Manager','Demo Sales Lead'].map((p,i)=><div className="person-line" key={p}><span className="rank-number">{i+1}</span><div><b>{p}</b><small>Sales Rep · 1445/1445 delivered</small></div><strong>100%<small>₦43,350,000</small></strong></div>)}</section>
  <section className="panel report-list"><h3>Top Delivery Agents</h3>{agents.map((p,i)=><div className="person-line" key={p}><span className="agent-symbol"><Truck size={15}/></span><div><b>{p}</b><small>{['Lagos','FCT Abuja','Rivers','Kano'][i]} · 1807/1807 delivered</small></div><strong>100%<small>₦54,180,000</small></strong></div>)}</section>
 </div>
 <section className="panel top-customers"><h3>Top Customers</h3><div className="table-scroll"><table><thead><tr><th>#</th><th>CUSTOMER</th><th>PHONE</th><th>ORDERS</th><th>TOTAL SPENT</th></tr></thead><tbody>{Array.from({length:8},(_,i)=><tr key={i}><td>{i+1}</td><td>🔵 Demo Customer {String(i+1).padStart(6,'0')}</td><td>DEMO-PHONE-{String(i+1).padStart(6,'0')}</td><td>1</td><td>₦30,000</td></tr>)}</tbody></table></div></section>
 </div>}
function ShoppingCartIcon(){return <Package size={14}/>}
