import DashboardLayout    from '@/layouts/DashboardLayout';
import OverviewCards      from '@/components/visualizations/OverviewCards';
import OverviewHeatmap    from '@/components/visualizations/OverviewHeatmap';
import useOverviewData    from '@/hooks/useOverviewData';

export default function Overview() {
  const { data, loading, error } = useOverviewData();
  if (loading) return <DashboardLayout><p>Loading overview…</p></DashboardLayout>;
  if (error)   return <DashboardLayout><p>Error loading overview</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <OverviewCards metrics={data.metrics} />
        <OverviewHeatmap heatmap={data.heatmap} />
      </div>
    </DashboardLayout>
  );
}