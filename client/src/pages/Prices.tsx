import { useState } from "react";
import { PriceTable } from "@/components/PriceTable";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

const mockPrices = [
  { id: "1", service: "Luxury Hotel - 5 Star", city: "Dubai", category: "Hotel", price: 450, updatedBy: "Sarah Chen", updatedAt: "2 hours ago" },
  { id: "2", service: "Private Tour Guide", city: "Cairo", category: "Guide", price: 120, updatedBy: "Mike Ross", updatedAt: "1 day ago" },
  { id: "3", service: "Luxury Vehicle Rental", city: "Dubai", category: "Vehicle", price: 280, updatedBy: "Alex Kim", updatedAt: "3 days ago" },
  { id: "4", service: "Museum Entrance Ticket", city: "Istanbul", category: "Ticket", price: 45, updatedBy: "Sarah Chen", updatedAt: "5 days ago" },
  { id: "5", service: "Budget Hotel - 3 Star", city: "Cairo", category: "Hotel", price: 85, updatedBy: "Mike Ross", updatedAt: "1 week ago" },
];

export default function Prices() {
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Price Management</h1>
          <p className="text-muted-foreground">Manage all service prices across cities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
          <Button data-testid="button-add-price">
            <Plus className="h-4 w-4 mr-2" />
            Add Price
          </Button>
        </div>
      </div>

      <FilterBar
        searchPlaceholder="Search services..."
        onSearch={(value) => console.log("Search:", value)}
        filters={[
          {
            label: "Category",
            value: category,
            onChange: setCategory,
            options: [
              { value: "all", label: "All Categories" },
              { value: "hotel", label: "Hotels" },
              { value: "guide", label: "Guides" },
              { value: "vehicle", label: "Vehicles" },
              { value: "ticket", label: "Tickets" },
            ],
          },
          {
            label: "City",
            value: city,
            onChange: setCity,
            options: [
              { value: "all", label: "All Cities" },
              { value: "dubai", label: "Dubai" },
              { value: "cairo", label: "Cairo" },
              { value: "istanbul", label: "Istanbul" },
            ],
          },
        ]}
      />

      <PriceTable
        data={mockPrices}
        onEdit={(id) => console.log("Edit price:", id)}
        onDelete={(id) => console.log("Delete price:", id)}
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4">
        <span>Showing 1-5 of 5 items</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
