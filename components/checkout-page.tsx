'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Check, Copy, CreditCard, Eye, ShoppingCart } from 'lucide-react';

type CheckoutSettings = {
  paystackEnabled: boolean;
  mode: 'Test' | 'Live';
  publicKey: string;
  secretKey: string;
  codEnabled: boolean;
  codLabel: string;
  codInstructions: string;
};

const defaults: CheckoutSettings = {
  paystackEnabled: false,
  mode: 'Live',
  publicKey: '',
  secretKey: '',
  codEnabled: false,
  codLabel: 'Cash on Delivery',
  codInstructions: 'Customer pays when the order is delivered.',
};

export function CheckoutPage() {
  const [settings, setSettings] = useState<CheckoutSettings>(defaults);
  const [notice, setNotice] = useState('');
  const [loaded, setLoaded] = useState(false);
  const checkoutUrl = '/shop/checkout';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('salesgee-checkout-settings');
      if (saved) setSettings({ ...defaults, ...JSON.parse(saved) });
    } catch {
      // Keep defaults if browser storage contains invalid data.
    }
    setLoaded(true);
  }, []);

  const update = <K extends keyof CheckoutSettings>(key: K, value: CheckoutSettings[K]) => {
    setSettings(current => ({ ...current, [key]: value }));
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    try {
      // Never persist the Paystack secret key in browser storage. A production
      // implementation must send it to a protected server-side settings API.
      const { secretKey: _secretKey, ...browserSafeSettings } = settings;
      localStorage.setItem('salesgee-checkout-settings', JSON.stringify(browserSafeSettings));
      setNotice('Checkout settings saved. The secret key has not been stored in this browser.');
    } catch {
      setNotice('Unable to save settings in this browser.');
    }
    window.setTimeout(() => setNotice(''), 3000);
  };

  const copyCheckoutUrl = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${checkoutUrl}`);
      setNotice('Checkout URL copied.');
    } catch {
      setNotice(`Checkout URL: ${window.location.origin}${checkoutUrl}`);
    }
    window.setTimeout(() => setNotice(''), 3000);
  };

  const openCheckout = () => window.open(checkoutUrl, '_blank', 'noopener,noreferrer');

  return (
    <div className="sg-page sg-checkout-page">
      <div className="page-heading">
        <div>
          <h1>Checkout</h1>
          <p>Configure storefront payment options</p>
        </div>
        <button type="button" className="button primary sg-open-checkout" onClick={openCheckout}>
          <Eye size={14} /> Open Checkout
        </button>
      </div>

      <div className="sg-checkout-overview">
        <div className="sg-checkout-stat">
          <span className="sg-checkout-stat-icon card"><CreditCard size={25} /></span>
          <div>
            <strong>{settings.paystackEnabled ? 'Enabled' : 'Disabled'}</strong>
            <span>Card Payment</span>
            <small>{settings.paystackEnabled ? `Paystack · ${settings.mode} mode` : 'Add Paystack keys'}</small>
          </div>
        </div>
        <div className="sg-checkout-stat">
          <span className="sg-checkout-stat-icon cash"><ShoppingCart size={26} /></span>
          <div>
            <strong>{settings.codEnabled ? 'Enabled' : 'Disabled'}</strong>
            <span>Cash on Delivery</span>
            <small>{settings.codEnabled ? 'Available at checkout' : 'Enable COD for checkout'}</small>
          </div>
        </div>
        <div className="sg-checkout-stat sg-checkout-url-stat">
          <span className="sg-checkout-stat-icon cash"><ShoppingCart size={26} /></span>
          <div>
            <strong>{checkoutUrl}</strong>
            <span>Checkout URL</span>
            <small>Customers can buy without login</small>
          </div>
          <button type="button" className="sg-copy-checkout" onClick={copyCheckoutUrl} aria-label="Copy checkout URL"><Copy size={16} /></button>
        </div>
      </div>

      <form onSubmit={save}>
        <section className="sg-checkout-panel">
          <h2>Paystack card payment</h2>
          <p>Customers can pay by card through Paystack. Salesgee verifies the payment, creates the order, and reduces storefront stock automatically.</p>
          <label className="sg-checkout-checkbox">
            <input type="checkbox" checked={settings.paystackEnabled} onChange={e => update('paystackEnabled', e.target.checked)} />
            <b>Enable Paystack payments</b>
          </label>
          <div className="sg-checkout-fields">
            <label className="sg-checkout-field">
              <span>Mode</span>
              <select value={settings.mode} onChange={e => update('mode', e.target.value as 'Test' | 'Live')}>
                <option value="Live">Live</option>
                <option value="Test">Test</option>
              </select>
            </label>
            <label className="sg-checkout-field">
              <span>Paystack public key</span>
              <input value={settings.publicKey} onChange={e => update('publicKey', e.target.value)} placeholder={settings.mode === 'Live' ? 'pk_live_...' : 'pk_test_...'} autoComplete="off" />
            </label>
            <label className="sg-checkout-field full">
              <span>Paystack secret key</span>
              <input type="password" value={settings.secretKey} onChange={e => update('secretKey', e.target.value)} placeholder={settings.mode === 'Live' ? 'sk_live_...' : 'sk_test_...'} autoComplete="new-password" />
              <small className="sg-checkout-security-note">For security, the secret key is not saved in browser storage. Production use requires a secure server-side settings endpoint.</small>
            </label>
          </div>
        </section>

        <section className="sg-checkout-panel">
          <h2>Cash on delivery</h2>
          <p>Enable this to let customers place storefront orders and pay when the product is delivered.</p>
          <label className="sg-checkout-checkbox">
            <input type="checkbox" checked={settings.codEnabled} onChange={e => update('codEnabled', e.target.checked)} />
            <b>Enable cash on delivery</b>
          </label>
          <div className="sg-checkout-fields">
            <label className="sg-checkout-field">
              <span>Checkout label</span>
              <input value={settings.codLabel} onChange={e => update('codLabel', e.target.value)} placeholder="Cash on Delivery" />
            </label>
            <label className="sg-checkout-field">
              <span>Delivery/payment instructions</span>
              <textarea rows={2} value={settings.codInstructions} onChange={e => update('codInstructions', e.target.value)} placeholder="Customer pays when the order is delivered." />
            </label>
          </div>
        </section>

        <div className="sg-checkout-flow"><b>Checkout flow:</b> customer visits /shop, adds products to cart, reviews the cart, then chooses card payment or cash on delivery on /shop/checkout. No customer login is required.</div>
        <div className="sg-checkout-save-row"><button type="submit" className="sg-primary"><Check size={15} /> Save Changes</button></div>
      </form>

      {notice && <div className="sg-notice" role="status">{notice}</div>}
      {!loaded && <span className="sg-checkout-loading" aria-live="polite">Loading checkout settings…</span>}
    </div>
  );
}
