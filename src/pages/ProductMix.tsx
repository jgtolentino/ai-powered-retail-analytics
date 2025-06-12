import DashboardLayout       from '@/layouts/DashboardLayout';
import CategoryBreakdownChart from '@/components/visualizations/CategoryBreakdownChart';
import SKUListTable          from '@/components/visualizations/SKUListTable';
import useProductData        from '@/hooks/useProductData';

export default function ProductMix() {
  const { data, loading, error } = useProductData();
  if (loading) return <DashboardLayout><p>Loading product mix…</p></DashboardLayout>;
  if (error)   return <DashboardLayout><p>Error loading product mix</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <CategoryBreakdownChart categories={data.categories} />
        <SKUListTable skus={data.skus} />
      </div>
    </DashboardLayout>
  );
}