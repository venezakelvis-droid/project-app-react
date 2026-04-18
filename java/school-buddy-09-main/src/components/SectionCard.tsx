import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

const SectionCard = ({ title, description, children, actions }: SectionCardProps) => (
  <div className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
    <div className="border-b border-border bg-gradient-to-r from-muted/50 to-muted/25 px-6 py-4 flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default SectionCard;
