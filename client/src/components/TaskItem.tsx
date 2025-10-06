import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";

interface TaskItemProps {
  title: string;
  assignee: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "done";
}

const priorityColors = {
  high: "border-l-destructive",
  medium: "border-l-chart-4",
  low: "border-l-muted-foreground",
};

const statusColors = {
  todo: "bg-muted/50 text-muted-foreground",
  "in-progress": "bg-primary/20 text-primary",
  done: "bg-chart-2/20 text-chart-2",
};

const statusLabels = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
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
