import { EmptyState } from "../EmptyState";
import { CheckSquare } from "lucide-react";

export default function EmptyStateExample() {
  return (
    <div className="p-6">
      <EmptyState
        icon={CheckSquare}
        title="No tasks yet"
        description="Get started by creating your first task. Assign it to a team member and track progress."
        action={{
          label: "Create Task",
          onClick: () => console.log("Create task"),
        }}
      />
    </div>
  );
}
