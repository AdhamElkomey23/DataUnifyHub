
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { KnowledgeArticle } from "@shared/schema";

interface ArticleViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: KnowledgeArticle;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ArticleViewDialog({ open, onOpenChange, article, onEdit, onDelete }: ArticleViewDialogProps) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{article.category}</Badge>
              </div>
              <DialogTitle className="text-2xl">{article.title}</DialogTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Calendar className="h-3 w-3" />
                <span>Updated {formatDistanceToNow(new Date(article.updatedAt), { addSuffix: true })}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit} data-testid="button-edit-article">
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="outline" size="sm" onClick={onDelete} data-testid="button-delete-article">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4 prose prose-sm max-w-none">
          <p className="text-muted-foreground italic">{article.excerpt}</p>
          <div className="mt-4 whitespace-pre-wrap">{article.content}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
