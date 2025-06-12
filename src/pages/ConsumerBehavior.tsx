import DashboardLayout          from '@/layouts/DashboardLayout';
import RequestBehaviorMatrix    from '@/components/visualizations/RequestBehaviorMatrix';
import ConsumerProfileChart     from '@/components/visualizations/ConsumerProfileChart';
import useConsumerData          from '@/hooks/useConsumerData';

export default function ConsumerBehavior() {
  const { data, loading, error } = useConsumerData();
  if (loading) return <DashboardLayout><p>Loading consumer behavior…</p></DashboardLayout>;
  if (error)   return <DashboardLayout><p>Error loading consumer behavior</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <RequestBehaviorMatrix requests={data.requests} />
        <ConsumerProfileChart profile={data.profile} />
      </div>
    </DashboardLayout>
  );
}