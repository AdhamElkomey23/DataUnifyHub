import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function DashboardCard({ title, icon: Icon, children, action }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
        {action && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between mt-2"
            onClick={action.onClick}
            data-testid={`button-${title.toLowerCase().replace(/\s+/g, '-')}-view-all`}
          >
            <span>{action.label}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
