import DashboardLayout     from '@/layouts/DashboardLayout';
import TrendVolumeChart    from '@/components/visualizations/TrendVolumeChart';
import TrendLocationMap    from '@/components/visualizations/TrendLocationMap';
import useTransactionData  from '@/hooks/useTransactionData';

export default function TransactionTrends() {
  const { data, loading, error } = useTransactionData();
  if (loading) return <DashboardLayout><p>Loading transaction trends…</p></DashboardLayout>;
  if (error)   return <DashboardLayout><p>Error loading transaction trends</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-8 grid gap-8 lg:grid-cols-2">
        <TrendVolumeChart data={data.volumeOverTime} />
        <TrendLocationMap data={data.locationHeatmap} />
      </div>
    </DashboardLayout>
  );
}