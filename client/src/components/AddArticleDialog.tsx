
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Article, InsertArticle } from "@shared/schema";

interface AddArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: Article;
}

export function AddArticleDialog({ open, onOpenChange, article }: AddArticleDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InsertArticle>({
    title: article?.title || "",
    content: article?.content || "",
    category: article?.category || "Procedures",
    excerpt: article?.excerpt || "",
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      if (article) {
        return apiRequest<Article>(`/api/articles/${article.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
      }
      return apiRequest<Article>("/api/articles", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: article ? "Article updated" : "Article created",
        description: article ? "The article has been updated successfully." : "The article has been created successfully.",
      });
      onOpenChange(false);
      setFormData({ title: "", content: "", category: "Procedures", excerpt: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article ? "Edit Article" : "Add New Article"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              data-testid="input-article-title"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger data-testid="select-article-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Procedures">Procedures</SelectItem>
                <SelectItem value="Templates">Templates</SelectItem>
                <SelectItem value="Checklists">Checklists</SelectItem>
                <SelectItem value="Guides">Guides</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary of the article..."
              rows={2}
              required
              data-testid="input-article-excerpt"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full article content..."
              rows={12}
              required
              data-testid="input-article-content"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-article">
              {mutation.isPending ? "Saving..." : article ? "Update Article" : "Create Article"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
