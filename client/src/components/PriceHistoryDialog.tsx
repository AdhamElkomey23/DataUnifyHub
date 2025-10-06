import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { PriceHistory } from "@shared/schema";

interface PriceHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceId: number;
  serviceName: string;
}

export function PriceHistoryDialog({ open, onOpenChange, priceId, serviceName }: PriceHistoryDialogProps) {
  const { data: history = [], isLoading } = useQuery<PriceHistory[]>({
    queryKey: [`/api/prices/${priceId}/history`],
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Price Change History</DialogTitle>
          <DialogDescription>{serviceName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No changes recorded yet</div>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{entry.changedBy}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(entry.changedAt), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Field</p>
                          <p className="font-medium capitalize">{entry.field.replace(/([A-Z])/g, ' $1').trim()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Old Value</p>
                          <p className="font-mono">{entry.oldValue}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">New Value</p>
                          <p className="font-mono text-primary">{entry.newValue}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
