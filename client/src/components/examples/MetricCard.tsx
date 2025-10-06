import { MetricCard } from "../MetricCard";
import { CheckSquare } from "lucide-react";

export default function MetricCardExample() {
  return (
    <div className="p-6 max-w-xs">
      <MetricCard
        title="Active Tasks"
        value={24}
        icon={CheckSquare}
        trend={{ value: 12, positive: true }}
      />
    </div>
  );
}
