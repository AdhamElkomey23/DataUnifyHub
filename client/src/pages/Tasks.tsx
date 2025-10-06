import { useState } from "react";
import { TaskItem } from "@/components/TaskItem";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Plus, Kanban, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockTasks = [
  { id: "1", title: "Update hotel prices for Dubai", assignee: "Sarah Chen", dueDate: "Today", priority: "high" as const, status: "in-progress" as const },
  { id: "2", title: "Contact new driver supplier", assignee: "Mike Ross", dueDate: "Tomorrow", priority: "medium" as const, status: "todo" as const },
  { id: "3", title: "Review supplier contracts", assignee: "Alex Kim", dueDate: "Mar 15", priority: "medium" as const, status: "todo" as const },
  { id: "4", title: "Send quotation to client", assignee: "Sarah Chen", dueDate: "Mar 10", priority: "low" as const, status: "done" as const },
  { id: "5", title: "Update contact database", assignee: "Mike Ross", dueDate: "Mar 20", priority: "high" as const, status: "in-progress" as const },
  { id: "6", title: "Prepare weekly report", assignee: "Alex Kim", dueDate: "Tomorrow", priority: "medium" as const, status: "todo" as const },
];

export default function Tasks() {
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const tasksByStatus = {
    todo: mockTasks.filter(t => t.status === "todo"),
    "in-progress": mockTasks.filter(t => t.status === "in-progress"),
    done: mockTasks.filter(t => t.status === "done"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Task Management</h1>
          <p className="text-muted-foreground">Track and manage team tasks</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-md">
            <Button
              variant={view === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("kanban")}
              data-testid="button-view-kanban"
            >
              <Kanban className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              data-testid="button-view-list"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button data-testid="button-create-task">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>
      </div>

      <FilterBar
        searchPlaceholder="Search tasks..."
        onSearch={(value) => console.log("Search:", value)}
        filters={[
          {
            label: "Priority",
            value: priority,
            onChange: setPriority,
            options: [
              { value: "all", label: "All Priorities" },
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ],
          },
          {
            label: "Status",
            value: status,
            onChange: setStatus,
            options: [
              { value: "all", label: "All Statuses" },
              { value: "todo", label: "To Do" },
              { value: "in-progress", label: "In Progress" },
              { value: "done", label: "Done" },
            ],
          },
        ]}
      />

      {view === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span>To Do</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {tasksByStatus.todo.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus.todo.map(task => (
                <TaskItem key={task.id} {...task} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span>In Progress</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {tasksByStatus["in-progress"].length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus["in-progress"].map(task => (
                <TaskItem key={task.id} {...task} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span>Done</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {tasksByStatus.done.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus.done.map(task => (
                <TaskItem key={task.id} {...task} />
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-3">
          {mockTasks.map(task => (
            <TaskItem key={task.id} {...task} />
          ))}
        </div>
      )}
    </div>
  );
}
