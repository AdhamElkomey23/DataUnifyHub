import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Price } from "@shared/schema";

interface AddPriceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editPrice?: Price;
}

const serviceTypes = ["Hotel", "Guide", "Vehicle", "Cruise", "Ticket", "Activity", "Restaurant", "Add-on"];
const categories = ["Standard", "Deluxe", "Luxury"];
const currencies = ["USD", "EGP", "EUR"];
const cities = ["Cairo", "Luxor", "Aswan", "Dubai", "Istanbul", "Hurghada", "Siwa"];

export function AddPriceDialog({ open, onOpenChange, editPrice }: AddPriceDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    serviceName: editPrice?.serviceName || "",
    serviceType: editPrice?.serviceType || "",
    city: editPrice?.city || "",
    category: editPrice?.category || "",
    supplier: editPrice?.supplier || "",
    costPrice: editPrice?.costPrice || "",
    sellingPrice: editPrice?.sellingPrice || "",
    currency: editPrice?.currency || "USD",
    notes: editPrice?.notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        updatedBy: "Admin User",
        effectiveDate: new Date().toISOString(),
        expiryDate: null,
      };

      if (editPrice) {
        await apiRequest("PATCH", `/api/prices/${editPrice.id}`, payload);
        toast({
          title: "Price updated",
          description: "The price has been successfully updated.",
        });
      } else {
        await apiRequest("POST", "/api/prices", payload);
        toast({
          title: "Price added",
          description: "The new price has been successfully added.",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["/api/prices"] });
      onOpenChange(false);
      setFormData({
        serviceName: "",
        serviceType: "",
        city: "",
        category: "",
        supplier: "",
        costPrice: "",
        sellingPrice: "",
        currency: "USD",
        notes: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save price. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editPrice ? "Edit Price" : "Add New Price"}</DialogTitle>
          <DialogDescription>
            {editPrice ? "Update the price details below." : "Enter the details for the new service price."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceName">Service Name *</Label>
              <Input
                id="serviceName"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                placeholder="e.g., Luxury Hotel - 5 Star"
                required
                data-testid="input-service-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                required
              >
                <SelectTrigger id="serviceType" data-testid="select-service-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City / Destination *</Label>
              <Select
                value={formData.city}
                onValueChange={(value) => setFormData({ ...formData, city: value })}
                required
              >
                <SelectTrigger id="city" data-testid="select-city">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger id="category" data-testid="select-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier / Partner *</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="e.g., Luxury Resorts Dubai"
                required
                data-testid="input-supplier"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
                required
              >
                <SelectTrigger id="currency" data-testid="select-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price *</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                placeholder="0.00"
                required
                data-testid="input-cost-price"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price *</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="0.00"
                required
                data-testid="input-selling-price"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Conditions</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g., Includes breakfast and airport transfer"
              rows={3}
              data-testid="input-notes"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} data-testid="button-save-price">
              {loading ? "Saving..." : editPrice ? "Update Price" : "Add Price"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
