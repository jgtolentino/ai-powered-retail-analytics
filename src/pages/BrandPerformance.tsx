import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardCard from '@/components/DashboardCard';
import AIRecommendationPanel from '@/components/AIRecommendationPanel';

export default function BrandPerformance() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 p-8 xl:grid-cols-4 lg:grid-cols-2">
        {/* Transaction Trends */}
        <DashboardCard
          title="TRANSACTION TRENDS"
          description={
            <>
              <p>• Volume of transactions by time of day &amp; location</p>
              <p>• Peso value distribution</p>
              <p>• Duration of transaction</p>
              <p>• Units per transaction</p>
            </>
          }
          toggles={
            <>
              <p>Time of day • Barangay/Region • Category • Week vs Weekend • Location</p>
            </>
          }
          visuals={<p>Time-series • Box plot • Heat-map (goal: reveal temporal & spatial patterns)</p>}
        />

        {/* Product Mix & SKU Info */}
        <DashboardCard
          title="PRODUCT MIX & SKU INFO"
          description={
            <>
              <p>• Category + brand breakdown per transaction</p>
              <p>• Top SKUs per category</p>
              <p>• Basket item count (1, 2, 3+)</p>
              <p>• Substitution patterns (brand A → brand B)</p>
            </>
          }
          toggles={<p>Category filter • Brand filter • SKU name • Location</p>}
          visuals={<p>Stacked bar • Pareto • Sankey/flow (goal: what's bought, combos, swaps)</p>}
        />

        {/* Consumer Behaviour & Preference Signals */}
        <DashboardCard
          title="CONSUMER BEHAVIOR & PREFERENCE SIGNALS"
          description={
            <>
              <p>• How the product was requested (branded, unbranded, unsure)</p>
              <p>• Pointing vs verbal indirect request</p>
              <p>• Acceptance of store-owner suggestion</p>
            </>
          }
          toggles={<p>Brand/Category • Age group • Gender</p>}
          visuals={<p>Pie • Stacked bar • Funnel (goal: decode purchase decision flow)</p>}
        />

        {/* Consumer Profiling */}
        <DashboardCard
          title="CONSUMER PROFILING"
          description={
            <>
              <p>• Gender (inferred)</p>
              <p>• Age bracket (audio/video)</p>
              <p>• Location mapping</p>
            </>
          }
          toggles={<p>Barangay • Product category • Brand</p>}
          visuals={<p>Donut • Demographic tree • Geo heat-map (goal: who buys, where)</p>}
        />

        {/* AI Recommendations */}
        <div className="xl:col-span-4 lg:col-span-2">
          <AIRecommendationPanel />
        </div>
      </div>
    </DashboardLayout>
  );
}