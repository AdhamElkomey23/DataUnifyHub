import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TaskItem } from "@/components/TaskItem";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Plus, Kanban, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { queryClient } from "@/lib/queryClient";
import type { Task } from "@shared/schema";

export default function Tasks() {
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks", { search, status, priority }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status !== "all") params.append("status", status);
      if (priority !== "all") params.append("priority", priority);
      
      const res = await fetch(`/api/tasks?${params.toString()}`, {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
      }
      
      return res.json();
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Task> }) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      
      if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedTask(undefined);
    setDialogOpen(true);
  };

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === "todo"),
    "in-progress": tasks.filter(t => t.status === "in-progress"),
    done: tasks.filter(t => t.status === "done"),
  };

  const formatDueDate = (date: Date | string) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
          <Button onClick={handleCreateClick} data-testid="button-create-task">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>
      </div>

      <FilterBar
        searchPlaceholder="Search tasks..."
        onSearch={setSearch}
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
                <div key={task.id} onClick={() => handleTaskClick(task)}>
                  <TaskItem 
                    title={task.title}
                    assignee={task.assignee}
                    dueDate={formatDueDate(task.dueDate)}
                    priority={task.priority as "high" | "medium" | "low"}
                    status={task.status as "todo" | "in-progress" | "done"}
                  />
                </div>
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
                <div key={task.id} onClick={() => handleTaskClick(task)}>
                  <TaskItem 
                    title={task.title}
                    assignee={task.assignee}
                    dueDate={formatDueDate(task.dueDate)}
                    priority={task.priority as "high" | "medium" | "low"}
                    status={task.status as "todo" | "in-progress" | "done"}
                  />
                </div>
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
                <div key={task.id} onClick={() => handleTaskClick(task)}>
                  <TaskItem 
                    title={task.title}
                    assignee={task.assignee}
                    dueDate={formatDueDate(task.dueDate)}
                    priority={task.priority as "high" | "medium" | "low"}
                    status={task.status as "todo" | "in-progress" | "done"}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} onClick={() => handleTaskClick(task)}>
              <TaskItem 
                title={task.title}
                assignee={task.assignee}
                dueDate={formatDueDate(task.dueDate)}
                priority={task.priority as "high" | "medium" | "low"}
                status={task.status as "todo" | "in-progress" | "done"}
              />
            </div>
          ))}
        </div>
      )}

      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
      />
    </div>
  );
}
