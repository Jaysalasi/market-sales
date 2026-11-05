"use client";
import { useMemo, useState } from "react";
import { AlertTriangle, Box, Download, Plus, Search, Trash2, Package, Users, Warehouse, Truck, CalendarDays, MoreHorizontal, ChevronDown } from "lucide-react";

type PageKey = "products" | "product-analytics" | "buy-stock" | "stock-record" | "agent-stock" | "waybill" | "faulty-stock";
const products = [
    { name: "Demo Glow Skincare Bundle", type: "Bundle", price: "3 tiers", stock: 50000, cost: "₦12,000" },
    { name: "Demo Fit Wellness Pack", type: "Pack", price: "3 tiers", stock: 42000, cost: "₦12,500" },
    { name: "Demo Kitchen Saver Set", type: "Set", price: "3 tiers", stock: 39000, cost: "₦11,800" },
    { name: "Demo Smart Organizer", type: "Item", price: "₦30,000", stock: 36000, cost: "₦13,200" },
    { name: "Demo Travel Essentials Kit", type: "Kit", price: "₦30,000", stock: 33000, cost: "₦12,100" },
];
const waybills = [
    { id: "701", date: "16 Oct 2026", to: "Demo Courier Lagos", product: "Demo Product Alpha", qty: "32,500", fee: "₦65,000,000", status: "Delivered" },
    { id: "702", date: "18 Oct 2026", to: "Demo Courier Abuja", product: "Demo Product Beta", qty: "32,500", fee: "₦65,000,000", status: "Delivered" },
    { id: "703", date: "20 Oct 2026", to: "Demo Courier Rivers", product: "Demo Product Gamma", qty: "32,500", fee: "₦65,000,000", status: "Delivered" },
    { id: "704", date: "22 Oct 2026", to: "Demo Courier Kano", product: "Demo Product Delta", qty: "32,500", fee: "₦65,000,000", status: "Delivered" },
];
const titles: Record<PageKey, [string, string]> = {
    products: ["Products", "Manage your product catalogue"], "product-analytics": ["Product Analytics", "Performance metrics for your products"],
    "buy-stock": ["Buy Stock", "Record all new stock purchases"], "stock-record": ["Stock Record", "Live stock across office and agents"],
    "agent-stock": ["Agent Stock", "Live stock currently held by each agent"], waybill: ["Waybill", "Stock movements and delivery records"],
    "faulty-stock": ["Faulty Stock", "Record and track faulty or damaged stock"]
};
function Heading({ page, action }: { page: PageKey; action?: React.ReactNode }) { const [title, desc] = titles[page]; return <div className="page-heading"><div><h1>{title}</h1><p>{desc}</p></div>{action && <div className="heading-actions">{action}</div>}</div> }
function Btn({ children, onClick, secondary = false }: { children: React.ReactNode; onClick?: () => void; secondary?: boolean }) { return <button className={`button ${secondary ? "secondary" : "primary"}`} onClick={onClick}>{children}</button> }
function ProductIcon() { return <span className="inventory-product-icon"><Box size={20} /></span> }
type ProductOffer = { id: string; name: string; quantity: string; unit: string; price: string; gifts: { product: string; quantity: string }[] };
type ProductRecord = { id: string; name: string; type: string; price: string; stock: number; cost: string; basePrice: string; active: boolean; hasOffers: boolean; offers: ProductOffer[] };
const initialProductRecords: ProductRecord[] = products.map((p, i) => ({
    id: String(i + 1), name: p.name, type: p.type, price: p.price, stock: p.stock, cost: p.cost, basePrice: i < 3 ? "30000" : "30000", active: true, hasOffers: i < 3,
    offers: i < 3 ? [
        { id: `${i + 1}-a`, name: "7-Day Starter Pack", quantity: "1", unit: p.type, price: "30000", gifts: [{ product: "Demo Glow Skincare Bundle", quantity: "1" }] },
        { id: `${i + 1}-b`, name: "14-Day Progress Pack", quantity: "2", unit: p.type, price: "58000", gifts: [{ product: "Demo Glow Skincare Bundle", quantity: "1" }] },
        { id: `${i + 1}-c`, name: "30-Day Transformation Pack", quantity: "4", unit: p.type, price: "110000", gifts: [{ product: "Demo Glow Skincare Bundle", quantity: "1" }] },
    ] : []
}));
function ProductsPage() {
    const [items, setItems] = useState<ProductRecord[]>(initialProductRecords);
    const [selected, setSelected] = useState<string[]>([]);
    const [menuId, setMenuId] = useState<string | null>(null);
    const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [draft, setDraft] = useState<ProductRecord | null>(null);
    const [notice, setNotice] = useState("");
    const filtered = items.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    const active = items.find(p => p.id === activeId) ?? null;
    const setDraftField = (key: keyof ProductRecord, value: unknown) => setDraft(old => old ? ({ ...old, [key]: value }) : old);
    const openEditor = (p: ProductRecord | null) => { setActiveId(p?.id ?? null); setDraft(p ? JSON.parse(JSON.stringify(p)) : { id: `new-${Date.now()}`, name: "", type: "Item", price: "₦30,000", stock: 0, cost: "₦0", basePrice: "30000", active: true, hasOffers: false, offers: [] }); setModal(p ? "edit" : "add"); setMenuId(null) };
    const saveDraft = () => { if (!draft || !draft.name.trim()) return; if (modal === "edit") setItems(old => old.map(p => p.id === draft.id ? draft : p)); else setItems(old => [...old, draft]); setModal(null); setDraft(null); setNotice(modal === "edit" ? "Product updated" : "Product added"); };
    const duplicate = (p: ProductRecord) => { const copy = { ...JSON.parse(JSON.stringify(p)), id: `copy-${Date.now()}`, name: `${p.name} (Copy)` }; setItems(old => [...old, copy]); setMenuId(null); setNotice("Product duplicated") };
    const removeProducts = (ids: string[]) => { setItems(old => old.filter(p => !ids.includes(p.id))); setSelected(old => old.filter(id => !ids.includes(id))); setMenuId(null); setNotice(ids.length === 1 ? "Product deleted" : `${ids.length} products deleted`) };
    const toggleStatus = (ids: string[], status: boolean) => { setItems(old => old.map(p => ids.includes(p.id) ? { ...p, active: status } : p)); setSelected([]); setMenuId(null); setNotice(status ? "Product activated" : "Product deactivated") };
    const updateOffer = (offerId: string, key: keyof ProductOffer, value: unknown) => setDraft(old => old ? ({ ...old, offers: old.offers.map(o => o.id === offerId ? ({ ...o, [key]: value }) : o) }) : old);
    const addOffer = () => setDraft(old => old ? ({ ...old, offers: [...old.offers, { id: `offer-${Date.now()}`, name: "New Offer Tier", quantity: "1", unit: old.type, price: old.basePrice, gifts: [] }] }) : old);
    const closeModal = () => { setModal(null); setDraft(null) };
    return <>
        <Heading page="products" action={<>
            <Btn secondary>
                <Download size={14} /> Export CSV
            </Btn>
            <Btn onClick={() => openEditor(null)}>
                <Plus size={15} /> Add Product
            </Btn>
        </>} />
        <div className="inventory-select-all">
            <label>
                <input type="checkbox" checked={filtered.length > 0 && filtered.every(p => selected.includes(p.id))} 
                onChange={e => setSelected(e.target.checked ? Array.from(new Set([...selected, ...filtered.map(p => p.id)])) : selected.filter(id => !filtered.some(p => p.id === id)))} /> 
                Select all
            </label>
        </div>
        {selected.length > 0 && <div className="product-bulk-bar">
            <strong>{selected.length} {selected.length === 1 ? "product" : "products"} selected</strong>
            <button onClick={() => setSelected([])}>Clear</button>
            <span />
            <button onClick={() => toggleStatus(selected, true)}>✓ Activate</button>
            <button onClick={() => toggleStatus(selected, false)}>× Deactivate</button>
            <button className="danger" onClick={() => removeProducts(selected)}>▢ Delete</button>
        </div>}
        <div className="inventory-product-grid">{filtered.map(p => <article className={`inventory-product-card ${selected.includes(p.id) ? "selected" : ""}`} key={p.id}>
            <div className="inventory-card-top"><ProductIcon /><span className="offer-pill">{p.offers.length ? `${p.offers.length} Offers` : ""}</span><button className="icon-quiet product-more" aria-label={`More options for ${p.name}`} onClick={() => setMenuId(menuId === p.id ? null : p.id)}>⋮</button><input aria-label={`Select ${p.name}`} type="checkbox" checked={selected.includes(p.id)} onChange={e => setSelected(old => e.target.checked ? [...old, p.id] : old.filter(id => id !== p.id))} /></div>
            <h3>{p.name}</h3><div className="inventory-mini-stats"><div><small>PRICE</small><b>{p.offers.length ? `${p.offers.length} tiers` : p.price}</b></div><div><small>IN STOCK</small><b className="teal-text">{p.stock.toLocaleString()}</b></div></div>
            {menuId === p.id && <><button className="product-menu-dismiss" aria-label="Close product menu" onClick={() => setMenuId(null)} /><div className="product-action-menu"><button onClick={() => { setActiveId(p.id); setModal("view"); setMenuId(null) }}>View Product</button><button onClick={() => openEditor(p)}>Edit Product</button><button onClick={() => duplicate(p)}>Duplicate</button><button className="warning" onClick={() => toggleStatus([p.id], !p.active)}>{p.active ? "Ⅱ Deactivate" : "✓ Activate"}</button><button className="danger" onClick={() => removeProducts([p.id])}>Delete</button></div></>}
        </article>)}</div>
        {notice && <div className="product-toast" role="status">{notice}<button onClick={() => setNotice("")}>×</button></div>}
        
        {modal === "view" && active && <div className="inventory-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) closeModal() }}><div className="inventory-modal product-view-modal"><div className="product-modal-heading"><h2>Product Details</h2><button onClick={closeModal}>×</button></div><div className="product-view-identity"><ProductIcon /><div><b>{active.name}</b><span className={active.active ? "status-active" : "status-inactive"}>{active.active ? "Active" : "Inactive"}</span></div></div><div className="product-detail-rows"><div><span>Unit</span><b>{active.type}</b></div><div><span>Cost Price</span><b>{active.cost}</b></div><div><span>Office Stock</span><b>{active.stock.toLocaleString()} {active.type}{active.type === "Item" ? "s" : "s"}</b></div><div><span>Base Price / Unit</span><b>₦{Number(active.basePrice || 0).toLocaleString()}</b></div></div>
            {active.offers.length > 0 && <><small className="product-section-label">OFFER TIERS</small><div className="product-view-offers">{active.offers.map(o => <div className="product-view-offer" key={o.id}><div><b>{o.name}</b><strong>₦{Number(o.price || 0).toLocaleString()}</strong></div><small>Qty: {o.quantity} {o.unit}</small>{o.gifts.map((g, i) => <small className="gift-green" key={i}>Free: {g.quantity}× {g.product}</small>)}</div>)}</div></>}
            <div className="modal-actions"><Btn secondary onClick={closeModal}>Close</Btn></div></div></div>}
        {(modal === "add" || modal === "edit") && draft && <div className="inventory-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) closeModal() }}><div className="inventory-modal product-edit-modal"><div className="product-modal-heading"><h2>{modal === "edit" ? "Edit Product" : "Add Product"}</h2><button onClick={closeModal}>×</button></div>
            <label>Product Name <em>*</em><input value={draft.name} onChange={e => setDraftField("name", e.target.value)} placeholder="Enter product name" /></label>
            <div className="product-form-two"><label>Unit<select value={draft.type} onChange={e => setDraftField("type", e.target.value)}>{["Item", "Bundle", "Pack", "Set", "Kit"].map(x => <option key={x}>{x}</option>)}</select></label><label>Opening Stock<input type="number" value={draft.stock} onChange={e => setDraftField("stock", Number(e.target.value))} /></label></div>
            <label>Cost Price (₦)<input type="number" value={draft.cost.replace(/[^0-9.]/g, "")} onChange={e => setDraftField("cost", e.target.value)} /></label>
            <div className="product-offer-toggle"><div><b>This product has offers / bundles</b><small>Add multiple pricing tiers with optional free gifts</small></div><button className={draft.hasOffers ? "on" : ""} onClick={() => setDraftField("hasOffers", !draft.hasOffers)} aria-pressed={draft.hasOffers}><i /></button></div>
            <label>Base Selling Price per Unit (₦)<input type="number" value={draft.basePrice} onChange={e => setDraftField("basePrice", e.target.value)} /><small className="field-hint">Used for inventory valuation and as the default unit price when an order is placed without selecting an offer tier.</small></label>
            {draft.hasOffers && <><small className="product-section-label">OFFER TIERS</small>{draft.offers.map((o, index) => <section className="product-offer-editor" key={o.id}><button className="remove-offer" onClick={() => setDraftField("offers", draft.offers.filter(x => x.id !== o.id))}>×</button><label>OFFER NAME<input value={o.name} onChange={e => updateOffer(o.id, "name", e.target.value)} /></label><div className="product-form-two"><label>QUANTITY<input type="number" value={o.quantity} onChange={e => updateOffer(o.id, "quantity", e.target.value)} /></label><label>UNIT<input value={o.unit} onChange={e => updateOffer(o.id, "unit", e.target.value)} /></label></div><label>SELLING PRICE (₦)<input type="number" value={o.price} onChange={e => updateOffer(o.id, "price", e.target.value)} /></label>
                <div className="product-gifts"><div className="product-gifts-heading"><b>Free Gifts <small>({o.gifts.length})</small></b><button onClick={() => updateOffer(o.id, "gifts", [...o.gifts, { product: items.find(x => x.id !== draft.id)?.name ?? "Demo Product", quantity: "1" }])}>+ Add Gift</button></div>{o.gifts.map((g, gi) => <div className="product-gift-row" key={gi}><select value={g.product} onChange={e => updateOffer(o.id, "gifts", o.gifts.map((x, i) => i === gi ? { ...x, product: e.target.value } : x))}>{items.filter(x => x.id !== draft.id).map(x => <option key={x.id}>{x.name}</option>)}</select><input aria-label="Gift quantity" type="number" value={g.quantity} onChange={e => updateOffer(o.id, "gifts", o.gifts.map((x, i) => i === gi ? { ...x, quantity: e.target.value } : x))} /><button onClick={() => updateOffer(o.id, "gifts", o.gifts.filter((_, i) => i !== gi))}>×</button></div>)}</div></section>)}<button className="add-offer-tier" onClick={addOffer}>+ Add Offer Tier</button></>}
            <div className="modal-actions"><Btn secondary onClick={closeModal}>Cancel</Btn><Btn onClick={saveDraft}>Save Changes</Btn></div></div></div>}
    </>;
}
function AnalyticsPage() { return <><Heading page="product-analytics" /><div className="inventory-analytics-grid">{products.map(p => <article className="inventory-analytics-card" key={p.name}><div className="inventory-analytics-title"><ProductIcon /><div><b>{p.name}</b><small>{p.type} · Active</small></div></div>{[["Office Stock", p.stock.toLocaleString(), "teal-text"], ["Agent Stock", "0", "blue-text"], ["Total Stock", p.stock.toLocaleString(), ""], ["In Transit", "0", "orange-text"], ["Units Sold", "40", "purple-text"], ["Revenue", "₦1,200,000", ""], ["Selling Price", "₦30,000", "muted-value"], ["Cost Price", p.cost, "muted-value"]].map(([k, v, c]) => <div className={`inventory-analytics-row ${k === "Selling Price" ? "price-break" : ""}`} key={k}><span>{k}</span><b className={c}>{v}{["Office Stock", "Agent Stock", "Total Stock", "In Transit", "Units Sold"].includes(k) ? ` ${p.type === "Item" ? "Items" : p.type + "s"}` : ""}</b></div>)}</article>)}</div></> }
function BuyStockPage() { const [modal, setModal] = useState(false); return <><Heading page="buy-stock" action={<><Btn secondary><Download size={14} /> Export CSV</Btn><Btn onClick={() => setModal(true)}><Plus size={15} /> New Purchase</Btn></>} /><div className="inventory-table-wrap"><table><thead><tr>{["Date", "Product", "Qty", "Unit Cost", "Total", "Supplier", "Added By", ""].map(x => <th key={x}>{x}</th>)}</tr></thead><tbody><tr><td>06 Sept 2026</td><td><b>Demo Product Alpha</b></td><td>130,000</td><td>Free</td><td className="teal-text">—</td><td>Demo Supplier</td><td></td><td><button className="delete-btn" aria-label="Delete purchase"><Trash2 size={14} /></button></td></tr></tbody></table></div>{modal && <div className="inventory-modal-backdrop"><div className="inventory-modal"><button className="modal-close" onClick={() => setModal(false)}>×</button><h2>New Stock Purchase</h2><p>Record stock received from a supplier.</p><label>Product<select><option>Demo Product Alpha</option></select></label><label>Quantity<input type="number" placeholder="Enter quantity" /></label><label>Unit cost<input placeholder="₦ 0.00" /></label><label>Supplier<input placeholder="Supplier name" /></label><div className="modal-actions"><Btn secondary onClick={() => setModal(false)}>Cancel</Btn><Btn onClick={() => setModal(false)}>Save Purchase</Btn></div></div></div>}</> }
function Stat({ label, value, sub, kind }: { label: string; value: string; sub: string; kind: string }) { return <div className={`inventory-summary-card ${kind}`}><div>{label}</div><strong>{value}</strong><small>{sub}</small></div> }
function StockRecordPage() { return <><Heading page="stock-record" action={<Btn secondary><Download size={14} /> Export CSV</Btn>} /><div className="inventory-summary-grid four"><Stat label="Grand Total" value="200,000 units" sub="Office + Agents" kind="dark" /><Stat label="Office Stock" value="200,000 units" sub="In warehouse" kind="teal" /><Stat label="With Agents" value="0 units" sub="Distributed stock" kind="charcoal" /><Stat label="Low Stock Items" value="0 products" sub="Needs attention" kind="teal" /></div><div className="inventory-table-wrap stock-record-table"><table><thead><tr><th>Products</th><th>Office Stock</th><th>Agents Stock</th><th>Total</th></tr></thead><tbody>{products.map(p => <tr key={p.name}><td><span className="stock-name"><ProductIcon /><b>{p.name}</b></span></td><td className="teal-text"><b>{p.stock}</b></td><td className="blue-text"><b>0</b></td><td><b>{p.stock}</b></td></tr>)}</tbody></table></div></> }
function AgentStockPage() { 
    return <>
    <Heading page="agent-stock" /><div className="inventory-summary-grid"><Stat label="TOTAL FIELD STOCK" value="0 units" sub="" kind="blue" /><Stat label="ACTIVE AGENTS" value="0 of 4" sub="" kind="teal-light" /><Stat label="STOCKED PRODUCTS" value="0 of 5" sub="" kind="plain" /></div><div className="inventory-empty"><Box size={34} /><b>No agent stock yet</b><p>Stock moves to an agent when you mark a Waybill as Delivered. Until then this page stays empty.</p></div></> }

function WaybillPage() { 
    const [status, setStatus] = useState("All Statuses"); 
    const [agent, setAgent] = useState("All Agents"); const [product, setProduct] = useState("All Products"); const [selected, setSelected] = useState<string[]>([]); const [modal, setModal] = useState(false); const rows = useMemo(() => waybills.filter(w => (status === "All Statuses" || w.status === status)), [status]); return <><Heading page="waybill" action={<><Btn secondary><Download size={14} /> Export CSV</Btn><Btn onClick={() => setModal(true)}><Plus size={15} /> New Waybill</Btn></>} /><div className="waybill-filters"><select value={agent} onChange={e => setAgent(e.target.value)}><option>All Agents</option><option>Demo Courier Lagos</option><option>Demo Courier Abuja</option></select><select value={product} onChange={e => setProduct(e.target.value)}><option>All Products</option><option>Demo Product Alpha</option><option>Demo Product Beta</option></select><select value={status} onChange={e => setStatus(e.target.value)}><option>All Statuses</option><option>Delivered</option><option>Pending</option><option>In Transit</option></select><button className="button secondary"><CalendarDays size={14} /> Date</button><button className="button secondary" onClick={() => setSelected(selected.length === rows.length ? [] : rows.map(x => x.id))}><input type="checkbox" readOnly checked={selected.length === rows.length} /> Select page</button><small>{rows.length} records</small></div><div className="inventory-table-wrap"><table><thead><tr><th></th>{["Waybill ID", "Date", "From", "To", "Product", "Qty", "Fee", "Status", ""].map(x => <th key={x}>{x}</th>)}</tr></thead><tbody>{rows.filter(w => (agent === "All Agents" || w.to === agent) && (product === "All Products" || w.product === product)).map(w => <tr key={w.id}><td><input type="checkbox" checked={selected.includes(w.id)} onChange={e => setSelected(old => e.target.checked ? [...old, w.id] : old.filter(x => x !== w.id))} /></td><td><b>{w.id}</b></td><td>{w.date}</td><td>Office</td><td>{w.to}</td><td>{w.product}</td><td><b>{w.qty}</b></td><td>{w.fee}</td><td><span className="waybill-status">{w.status} <ChevronDown size={12} /></span></td><td><button className="icon-quiet"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div>{modal && <div className="inventory-modal-backdrop"><div className="inventory-modal"><button className="modal-close" onClick={() => setModal(false)}>×</button><h2>Create Waybill</h2><p>Transfer stock from the office to an agent or courier.</p><label>Destination / Agent<input placeholder="Select agent or courier" /></label><label>Product<select><option>Demo Product Alpha</option></select></label><label>Quantity<input type="number" placeholder="Enter quantity" /></label><div className="modal-actions"><Btn secondary onClick={() => setModal(false)}>Cancel</Btn><Btn onClick={() => setModal(false)}>Create Waybill</Btn></div></div></div>}</> }

function FaultyStockPage() { const [modal, setModal] = useState(false); return <><Heading page="faulty-stock" action={<Btn onClick={() => setModal(true)}><Plus size={15} /> Report Faulty Stock</Btn>} /><div className="inventory-empty faulty-empty"><AlertTriangle size={34} /><p>No faulty stock reported yet.</p></div>{modal && <div className="inventory-modal-backdrop"><div className="inventory-modal"><button className="modal-close" onClick={() => setModal(false)}>×</button><h2>Report Faulty Stock</h2><p>Record damaged or faulty inventory for review.</p><label>Product<select><option>Demo Glow Skincare Bundle</option></select></label><label>Quantity<input type="number" placeholder="Enter quantity" /></label><label>Reason<textarea placeholder="Describe the issue" /></label><div className="modal-actions"><Btn secondary onClick={() => setModal(false)}>Cancel</Btn><Btn onClick={() => setModal(false)}>Submit Report</Btn></div></div></div>}</> }

export default function InventoryPage({ page }: { page: PageKey }) { switch (page) { 
    case "products": 
    return <ProductsPage />; 
    case "product-analytics": 
    return <AnalyticsPage />; 
    case "buy-stock": 
    return <BuyStockPage />; 
    case "stock-record": 
    return <StockRecordPage />; 
    case "agent-stock": 
    return <AgentStockPage />; 
    case "waybill": 
    return <WaybillPage />; 
    case "faulty-stock": 
    return <FaultyStockPage />; 
    } }
