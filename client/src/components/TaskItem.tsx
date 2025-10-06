import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";

interface TaskItemProps {
  title: string;
  assignee: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "waiting-for-review" | "done" | "cancelled";
}

const priorityColors = {
  high: "border-l-red-500",
  medium: "border-l-orange-500",
  low: "border-l-green-500",
};

const statusColors = {
  todo: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  "in-progress": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  "waiting-for-review": "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  done: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

const statusLabels = {
  todo: "To Do",
  "in-progress": "In Progress",
  "waiting-for-review": "Waiting for Review",
  done: "Done",
  cancelled: "Cancelled",
};

export function TaskItem({ title, assignee, dueDate, priority, status }: TaskItemProps) {
  return (
    <div
      className={`border-l-4 ${priorityColors[priority]} rounded-md p-3 hover-elevate active-elevate-2 cursor-pointer`}
      data-testid={`task-item-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium flex-1">{title}</p>
        <Badge variant="outline" className={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {assignee.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span>{assignee}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{dueDate}</span>
        </div>
      </div>
    </div>
  );
}
