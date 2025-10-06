import { DashboardCard } from "../DashboardCard";
import { CheckSquare } from "lucide-react";
import { TaskItem } from "../TaskItem";

export default function DashboardCardExample() {
  return (
    <div className="p-6 max-w-md">
      <DashboardCard
        title="Pending Tasks"
        icon={CheckSquare}
        action={{
          label: "View all tasks",
          onClick: () => console.log("View all tasks"),
        }}
      >
        <TaskItem
          title="Update hotel prices for Dubai"
          assignee="Sarah Chen"
          dueDate="Today"
          priority="high"
          status="in-progress"
        />
        <TaskItem
          title="Contact new driver supplier"
          assignee="Mike Ross"
          dueDate="Tomorrow"
          priority="medium"
          status="todo"
        />
      </DashboardCard>
    </div>
  );
}
