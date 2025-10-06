import { useState } from "react";
import { ContactCard } from "@/components/ContactCard";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Plus, Grid3x3, List } from "lucide-react";

const mockContacts = [
  { id: "1", name: "Ahmed Hassan", role: "Senior Tour Guide", company: "Desert Adventures", category: "Guide", whatsapp: "+971501234567", email: "ahmed@desertadv.com", tags: ["reliable", "preferred"] },
  { id: "2", name: "Sofia Martinez", role: "Hotel Manager", company: "Luxury Resorts Dubai", category: "Hotel", whatsapp: "+971502345678", email: "sofia@luxresorts.com", tags: ["preferred"] },
  { id: "3", name: "Raj Patel", role: "Driver", company: "Premium Transport", category: "Driver", whatsapp: "+971503456789", email: "raj@premtransport.com", tags: ["reliable", "new"] },
  { id: "4", name: "Fatima Al-Sayed", role: "Travel Agent", company: "Global Tours", category: "Agency", email: "fatima@globaltours.com", tags: ["partner"] },
  { id: "5", name: "Marco Rossi", role: "Restaurant Manager", company: "Italian Cuisine Co", category: "Restaurant", whatsapp: "+971504567890", email: "marco@italiancuisine.com", tags: [] },
  { id: "6", name: "Yuki Tanaka", role: "Supplier", company: "Asian Imports", category: "Supplier", whatsapp: "+971505678901", email: "yuki@asianimports.com", tags: ["reliable"] },
];

export default function Contacts() {
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Contacts Directory</h1>
          <p className="text-muted-foreground">Manage all suppliers, partners, and team contacts</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-md">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("grid")}
              data-testid="button-view-grid"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              data-testid="button-view-list"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button data-testid="button-add-contact">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      <FilterBar
        searchPlaceholder="Search contacts..."
        onSearch={(value) => console.log("Search:", value)}
        filters={[
          {
            label: "Category",
            value: category,
            onChange: setCategory,
            options: [
              { value: "all", label: "All Categories" },
              { value: "guide", label: "Guides" },
              { value: "hotel", label: "Hotels" },
              { value: "driver", label: "Drivers" },
              { value: "agency", label: "Agencies" },
              { value: "supplier", label: "Suppliers" },
            ],
          },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockContacts.map((contact) => (
          <ContactCard key={contact.id} {...contact} />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4">
        <span>Showing 1-6 of 6 contacts</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
