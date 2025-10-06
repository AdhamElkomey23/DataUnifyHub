import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle, Eye } from "lucide-react";
import type { Task } from "@shared/schema";

interface TaskSummaryWidgetProps {
  tasks: Task[];
  currentUser: string;
}

export function TaskSummaryWidget({ tasks, currentUser }: TaskSummaryWidgetProps) {
  const myTasks = tasks.filter(t => t.assignee === currentUser);
  
  const completedThisWeek = tasks.filter(t => {
    if (t.status !== "done") return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(t.updatedAt) >= weekAgo;
  }).length;

  const overdueTasks = tasks.filter(t => {
    if (t.status === "done" || t.status === "cancelled") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(t.dueDate) < today;
  }).length;

  const pendingReview = tasks.filter(t => t.status === "waiting-for-review").length;

  const metrics = [
    {
      title: "My Tasks",
      value: myTasks.length,
      icon: CheckCircle2,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      testId: "metric-my-tasks"
    },
    {
      title: "Completed This Week",
      value: completedThisWeek,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      testId: "metric-completed"
    },
    {
      title: "Overdue",
      value: overdueTasks,
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      testId: "metric-overdue"
    },
    {
      title: "Pending Review",
      value: pendingReview,
      icon: Eye,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      testId: "metric-pending-review"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} data-testid={metric.testId}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold mt-1" data-testid={`${metric.testId}-value`}>
                  {metric.value}
                </p>
              </div>
              <div className={`${metric.bgColor} p-3 rounded-full`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
