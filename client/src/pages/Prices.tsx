import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Plus, Download, Pencil, Trash2, History, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddPriceDialog } from "@/components/AddPriceDialog";
import { PriceHistoryDialog } from "@/components/PriceHistoryDialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Price } from "@shared/schema";
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

export default function Prices() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [serviceType, setServiceType] = useState("all");
  const [category, setCategory] = useState("all");
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editPrice, setEditPrice] = useState<Price | undefined>();
  const [historyDialog, setHistoryDialog] = useState<{ open: boolean; priceId?: number; serviceName?: string }>({
    open: false,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; priceId?: number }>({ open: false });

  const { data: prices = [], isLoading } = useQuery<Price[]>({
    queryKey: ["/api/prices"],
  });

  const filteredPrices = prices.filter((price) => {
    let matches = true;
    
    if (search) {
      const searchLower = search.toLowerCase();
      matches = matches && (
        price.serviceName.toLowerCase().includes(searchLower) ||
        price.city.toLowerCase().includes(searchLower)
      );
    }
    
    if (city !== "all") {
      matches = matches && price.city.toLowerCase() === city.toLowerCase();
    }
    
    if (serviceType !== "all") {
      matches = matches && price.serviceType.toLowerCase() === serviceType.toLowerCase();
    }
    
    if (category !== "all") {
      matches = matches && price.category.toLowerCase() === category.toLowerCase();
    }
    
    return matches;
  });

  const isOutdated = (date: Date | string) => {
    const updatedAt = new Date(date);
    const daysSince = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > 90;
  };

  const handleEdit = (price: Price) => {
    setEditPrice(price);
    setAddDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteDialog.priceId) return;

    try {
      await apiRequest("DELETE", `/api/prices/${deleteDialog.priceId}`);
      
      queryClient.invalidateQueries({ queryKey: ["/api/prices"] });
      
      toast({
        title: "Price deleted",
        description: "The price has been successfully removed.",
      });
      
      setDeleteDialog({ open: false });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete price. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Service Name", "City", "Type", "Category", "Cost Price", "Currency", "Updated By", "Last Updated", "Notes"],
      ...filteredPrices.map(p => [
        p.id,
        p.serviceName,
        p.city,
        p.serviceType,
        p.category,
        p.costPrice,
        p.currency,
        p.updatedBy,
        new Date(p.updatedAt).toLocaleDateString(),
        p.notes || "",
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prices_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast({
      title: "Export successful",
      description: "Prices have been exported to CSV.",
    });
  };

  const cities = Array.from(new Set(prices.map(p => p.city))).sort();
  const serviceTypes = Array.from(new Set(prices.map(p => p.serviceType))).sort();
  const categories = Array.from(new Set(prices.map(p => p.category))).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Service Prices Database</h1>
          <p className="text-muted-foreground">
            Centralized pricing for all services — {filteredPrices.length} of {prices.length} entries
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
          <Button onClick={() => { setEditPrice(undefined); setAddDialogOpen(true); }} data-testid="button-add-price">
            <Plus className="h-4 w-4 mr-2" />
            Add New Price
          </Button>
        </div>
      </div>

      <FilterBar
        searchPlaceholder="Search services or cities..."
        onSearch={setSearch}
        filters={[
          {
            label: "Service Type",
            value: serviceType,
            onChange: setServiceType,
            options: [
              { value: "all", label: "All Types" },
              ...serviceTypes.map(t => ({ value: t, label: t })),
            ],
          },
          {
            label: "City",
            value: city,
            onChange: setCity,
            options: [
              { value: "all", label: "All Cities" },
              ...cities.map(c => ({ value: c, label: c })),
            ],
          },
          {
            label: "Category",
            value: category,
            onChange: setCategory,
            options: [
              { value: "all", label: "All Categories" },
              ...categories.map(c => ({ value: c, label: c })),
            ],
          },
        ]}
      />

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading prices...</div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="font-medium text-xs uppercase tracking-wide w-16">#</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Service Name</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">City</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Type</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Category</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Cost Price</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Updated By</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Last Updated</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      No prices found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrices.map((price, index) => (
                    <TableRow
                      key={price.id}
                      className={index % 2 === 0 ? "bg-muted/30" : ""}
                      data-testid={`row-price-${price.id}`}
                    >
                      <TableCell className="font-mono text-muted-foreground">{price.id}</TableCell>
                      <TableCell className="font-medium max-w-xs">
                        <div className="flex items-center gap-2">
                          {price.serviceName}
                          {isOutdated(price.updatedAt) && (
                            <Badge variant="destructive" className="text-xs gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Outdated
                            </Badge>
                          )}
                        </div>
                        {price.notes && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{price.notes}</p>
                        )}
                      </TableCell>
                      <TableCell>{price.city}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{price.serviceType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{price.category}</Badge>
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        {price.currency} {Number(price.costPrice).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{price.updatedBy}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(price.updatedAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setHistoryDialog({ open: true, priceId: price.id, serviceName: price.serviceName })}
                            data-testid={`button-history-${price.id}`}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(price)}
                            data-testid={`button-edit-${price.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteDialog({ open: true, priceId: price.id })}
                            data-testid={`button-delete-${price.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredPrices.length} of {prices.length} prices</span>
            <div className="flex items-center gap-4">
              <span className="text-xs">
                {filteredPrices.filter(p => isOutdated(p.updatedAt)).length} prices need review (90+ days old)
              </span>
            </div>
          </div>
        </>
      )}

      <AddPriceDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) setEditPrice(undefined);
        }}
        editPrice={editPrice}
      />

      <PriceHistoryDialog
        open={historyDialog.open}
        onOpenChange={(open) => setHistoryDialog({ open })}
        priceId={historyDialog.priceId || 0}
        serviceName={historyDialog.serviceName || ""}
      />

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Price</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this price? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
