import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Tag, Building2, FileText, Clock, MessageCircle, Activity } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Task, TaskComment, TaskActivityLog } from "@shared/schema";
import { format } from "date-fns";

const CURRENT_USER = "Islam";

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColors = {
  todo: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  "in-progress": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  "waiting-for-review": "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  done: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

const priorityColors = {
  high: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  medium: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  low: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
};

export function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState<"comments" | "activity">("comments");

  const { data: comments = [] } = useQuery<TaskComment[]>({
    queryKey: ["/api/tasks", task?.id, "comments"],
    queryFn: async () => {
      if (!task) return [];
      const res = await fetch(`/api/tasks/${task.id}/comments`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json();
    },
    enabled: !!task && open,
  });

  const { data: activity = [] } = useQuery<TaskActivityLog[]>({
    queryKey: ["/api/tasks", task?.id, "activity"],
    queryFn: async () => {
      if (!task) return [];
      const res = await fetch(`/api/tasks/${task.id}/activity`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch activity");
      return res.json();
    },
    enabled: !!task && open,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (comment: string) => {
      if (!task) return;
      return await apiRequest(`/api/tasks/${task.id}/comments`, {
        method: "POST",
        body: JSON.stringify({ username: CURRENT_USER, comment }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", task?.id, "comments"] });
      setNewComment("");
    },
  });

  const handleAddComment = () => {
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-task-detail">
        <DialogHeader>
          <DialogTitle className="text-2xl" data-testid="text-task-title">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2" data-testid="text-task-status">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                  {task.status.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              </div>

              <div className="flex items-center gap-2" data-testid="text-task-priority">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Priority:</span>
                <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center gap-2" data-testid="text-task-assignee">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Assigned to:</span>
                <div className="flex items-center gap-1">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {task.assignee.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{task.assignee}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2" data-testid="text-task-due-date">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Due Date:</span>
                <span className="text-sm font-medium">
                  {format(new Date(task.dueDate), "MMM dd, yyyy")}
                </span>
              </div>

              {task.department && (
                <div className="flex items-center gap-2" data-testid="text-task-department">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Department:</span>
                  <span className="text-sm font-medium">{task.department}</span>
                </div>
              )}

              <div className="flex items-center gap-2" data-testid="text-task-created-by">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Created by:</span>
                <span className="text-sm font-medium">{task.createdBy}</span>
              </div>
            </div>
          </div>

          {task.description && (
            <>
              <Separator />
              <div data-testid="text-task-description">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Description</h3>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.description}</p>
              </div>
            </>
          )}

          {task.notes && (
            <>
              <Separator />
              <div data-testid="text-task-notes">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Notes</h3>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.notes}</p>
              </div>
            </>
          )}

          <Separator />

          <div>
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant={activeTab === "comments" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("comments")}
                className="gap-2"
                data-testid="button-comments-tab"
              >
                <MessageCircle className="h-4 w-4" />
                Comments ({comments.length})
              </Button>
              <Button
                variant={activeTab === "activity" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("activity")}
                className="gap-2"
                data-testid="button-activity-tab"
              >
                <Activity className="h-4 w-4" />
                Activity ({activity.length})
              </Button>
            </div>

            {activeTab === "comments" ? (
              <div className="space-y-4" data-testid="section-comments">
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-3" data-testid={`comment-${comment.id}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {comment.username.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{comment.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap ml-8">{comment.comment}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                    data-testid="textarea-new-comment"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || addCommentMutation.isPending}
                    data-testid="button-add-comment"
                  >
                    {addCommentMutation.isPending ? "Adding..." : "Add Comment"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3" data-testid="section-activity">
                {activity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-sm" data-testid={`activity-${log.id}`}>
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p>
                        <span className="font-medium">{log.username}</span>{" "}
                        <span className="text-muted-foreground">{log.action}</span>
                        {log.field && (
                          <>
                            {" "}<span className="text-muted-foreground">the</span>{" "}
                            <span className="font-medium">{log.field}</span>
                            {log.oldValue && log.newValue && (
                              <>
                                {" "}<span className="text-muted-foreground">from</span>{" "}
                                <span className="font-medium">{log.oldValue}</span>{" "}
                                <span className="text-muted-foreground">to</span>{" "}
                                <span className="font-medium">{log.newValue}</span>
                              </>
                            )}
                          </>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(log.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
