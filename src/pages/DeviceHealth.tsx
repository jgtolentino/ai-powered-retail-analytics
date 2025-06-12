import ComingSoonPage from '../components/ComingSoonPage';

export default function DeviceHealth() {
  return (
    <ComingSoonPage
      title="Device Health"
      subtitle="Edge device monitoring"
      description="Monitor and manage the health of edge devices across your retail network. Get real-time insights into device performance, connectivity, and operational status."
      features={[
        "Real-time device status monitoring",
        "Performance metrics and diagnostics", 
        "Automated health alerts and notifications",
        "Device configuration management",
        "Network connectivity analysis",
        "Predictive maintenance insights"
      ]}
      estimatedDate="Q2 2025"
    />
  );
}