import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockArticles = [
  { id: "1", title: "How to contact a driver", category: "Procedures", updatedAt: "2 days ago", excerpt: "Step-by-step guide for contacting and booking drivers for tours..." },
  { id: "2", title: "Refund process guide", category: "Procedures", updatedAt: "1 week ago", excerpt: "Complete process for handling customer refunds and cancellations..." },
  { id: "3", title: "Tour quotation template", category: "Templates", updatedAt: "3 days ago", excerpt: "Standard template for creating tour quotations with pricing breakdown..." },
  { id: "4", title: "Supplier onboarding checklist", category: "Checklists", updatedAt: "5 days ago", excerpt: "Required documents and steps for adding new suppliers to the system..." },
  { id: "5", title: "Emergency contact protocols", category: "Procedures", updatedAt: "1 day ago", excerpt: "Important contacts and procedures for handling emergencies during tours..." },
];

export default function Knowledge() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground">SOPs, procedures, and frequently used information</p>
        </div>
        <Button data-testid="button-add-article">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockArticles.map((article) => (
          <Card
            key={article.id}
            className="hover-elevate cursor-pointer"
            onClick={() => console.log("View article:", article.id)}
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
                <span>Updated {article.updatedAt}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
