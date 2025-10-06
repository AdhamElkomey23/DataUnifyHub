
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddArticleDialog } from "@/components/AddArticleDialog";
import { ArticleViewDialog } from "@/components/ArticleViewDialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Knowledge() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editArticle, setEditArticle] = useState<Article | undefined>();
  const [viewArticle, setViewArticle] = useState<Article | undefined>();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; articleId?: number }>({ open: false });

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/articles/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Article deleted",
        description: "The article has been deleted successfully.",
      });
      setDeleteDialog({ open: false });
      setViewArticle(undefined);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredArticles = articles.filter((article) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      article.title.toLowerCase().includes(searchLower) ||
      article.excerpt.toLowerCase().includes(searchLower) ||
      article.category.toLowerCase().includes(searchLower) ||
      article.content.toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = (article: Article) => {
    setViewArticle(undefined);
    setEditArticle(article);
    setAddDialogOpen(true);
  };

  const handleDelete = (articleId: number) => {
    setDeleteDialog({ open: true, articleId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground">
            SOPs, procedures, and frequently used information — {filteredArticles.length} of {articles.length} articles
          </p>
        </div>
        <Button 
          onClick={() => { setEditArticle(undefined); setAddDialogOpen(true); }}
          data-testid="button-add-article"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search knowledge base..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="input-search-knowledge"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading articles...</div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {search ? "No articles found matching your search." : "No articles yet. Create your first one!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="hover-elevate cursor-pointer"
              onClick={() => setViewArticle(article)}
              data-testid={`card-article-${article.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <Badge variant="outline" className="text-xs">{article.category}</Badge>
                </div>
                <CardTitle className="text-base font-semibold">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Updated {formatDistanceToNow(new Date(article.updatedAt), { addSuffix: true })}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddArticleDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        article={editArticle}
      />

      <ArticleViewDialog
        open={!!viewArticle}
        onOpenChange={(open) => !open && setViewArticle(undefined)}
        article={viewArticle}
        onEdit={() => viewArticle && handleEdit(viewArticle)}
        onDelete={() => viewArticle && handleDelete(viewArticle.id)}
      />

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.articleId && deleteMutation.mutate(deleteDialog.articleId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
