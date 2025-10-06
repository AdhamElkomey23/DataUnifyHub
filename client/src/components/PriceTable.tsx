import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PriceEntry {
  id: string;
  service: string;
  city: string;
  category: string;
  price: number;
  updatedBy: string;
  updatedAt: string;
}

interface PriceTableProps {
  data: PriceEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PriceTable({ data, onEdit, onDelete }: PriceTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead className="font-medium text-xs uppercase tracking-wide">Service</TableHead>
            <TableHead className="font-medium text-xs uppercase tracking-wide">City</TableHead>
            <TableHead className="font-medium text-xs uppercase tracking-wide">Category</TableHead>
            <TableHead className="font-medium text-xs uppercase tracking-wide">Price</TableHead>
            <TableHead className="font-medium text-xs uppercase tracking-wide">Updated By</TableHead>
            <TableHead className="font-medium text-xs uppercase tracking-wide">Last Updated</TableHead>
            <TableHead className="font-medium text-xs uppercase tracking-wide text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
            <TableRow
              key={entry.id}
              className={index % 2 === 0 ? "bg-muted/30" : ""}
              data-testid={`row-price-${entry.id}`}
            >
              <TableCell className="font-medium">{entry.service}</TableCell>
              <TableCell>{entry.city}</TableCell>
              <TableCell>
                <Badge variant="outline">{entry.category}</Badge>
              </TableCell>
              <TableCell className="font-mono font-medium">${entry.price}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{entry.updatedBy}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{entry.updatedAt}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(entry.id)}
                    data-testid={`button-edit-${entry.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(entry.id)}
                    data-testid={`button-delete-${entry.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
