import { ReactNode } from "react";

const DashboardCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="rounded-lg border border-border bg-card p-6 space-y-4">
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    {children}
  </div>
);

export default DashboardCard;
