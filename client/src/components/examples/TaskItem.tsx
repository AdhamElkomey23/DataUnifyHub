import { TaskItem } from "../TaskItem";

export default function TaskItemExample() {
  return (
    <div className="p-6 max-w-md space-y-3">
      <TaskItem
        title="Update hotel prices for Dubai"
        assignee="Sarah Chen"
        dueDate="Today"
        priority="high"
        status="in-progress"
      />
      <TaskItem
        title="Review supplier contracts"
        assignee="Mike Ross"
        dueDate="Mar 15"
        priority="medium"
        status="todo"
      />
      <TaskItem
        title="Send quotation to client"
        assignee="Alex Kim"
        dueDate="Mar 10"
        priority="low"
        status="done"
      />
    </div>
  );
}
