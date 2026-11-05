import { ArrowUpRight, Plus, Search } from 'lucide-react';

export default function SectionPage({ title, description, metric, metricLabel }: { title: string; description: string; metric: string; metricLabel: string }) {
    return (
        <>
            <div className="page-heading">
                <div>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
                <button className="button primary"><Plus size={16} /> Add new</button>
            </div>
            <div className="section-metric panel">
                <div>
                    <small>{metricLabel}</small>
                    <strong>{metric}</strong>
                    <p>Demo store overview</p>
                </div>
                <span><ArrowUpRight size={20} /></span>
            </div>
            <section className="panel placeholder-panel">
                <div className="placeholder-icon"><Search size={24} /></div>
                <h2>{title} workspace</h2>
                <p>This page has its own Next.js route and is ready for its dedicated features, data and workflows.</p>
            </section>
        </>
    )
}
