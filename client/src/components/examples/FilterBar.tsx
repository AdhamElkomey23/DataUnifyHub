import { FilterBar } from "../FilterBar";
import { useState } from "react";

export default function FilterBarExample() {
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState("all");

  return (
    <div className="p-6">
      <FilterBar
        searchPlaceholder="Search prices..."
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
    </div>
  );
}
