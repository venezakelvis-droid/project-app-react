import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  variant?: "default" | "accent" | "secondary";
}

const StatCard = ({ title, value, description, icon, variant = "default" }: StatCardProps) => {
  const variantClasses = {
    default: "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20",
    accent: "bg-gradient-to-br from-blue-50 to-blue-25 border-blue-200",
    secondary: "bg-gradient-to-br from-slate-50 to-slate-25 border-slate-200",
  };

  return (
    <div className={`rounded-xl border ${variantClasses[variant]} p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
        </div>
        {icon && <div className="text-2xl ml-2 opacity-60">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
