import React from 'react';

interface DashboardCardProps {
  title: string;
  description: React.ReactNode;
  toggles?: React.ReactNode;
  visuals?: React.ReactNode;
}

export default function DashboardCard({ title, description, toggles, visuals }: DashboardCardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-lg bg-black text-white p-6 w-full">
      <h3 className="text-lg font-semibold tracking-wide">{title}</h3>

      <div className="text-sm leading-relaxed">{description}</div>

      {toggles && (
        <>
          <hr className="border-gray-700" />
          <div className="space-y-1">{toggles}</div>
        </>
      )}

      {visuals && (
        <>
          <hr className="border-gray-700" />
          <div className="space-y-1">{visuals}</div>
        </>
      )}
    </section>
  );
}