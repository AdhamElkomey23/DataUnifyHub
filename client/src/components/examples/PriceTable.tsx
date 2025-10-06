import { PriceTable } from "../PriceTable";

const mockData = [
  {
    id: "1",
    service: "Luxury Hotel - 5 Star",
    city: "Dubai",
    category: "Hotel",
    price: 450,
    updatedBy: "Sarah Chen",
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    service: "Private Tour Guide",
    city: "Cairo",
    category: "Guide",
    price: 120,
    updatedBy: "Mike Ross",
    updatedAt: "1 day ago",
  },
  {
    id: "3",
    service: "Luxury Vehicle Rental",
    city: "Dubai",
    category: "Vehicle",
    price: 280,
    updatedBy: "Alex Kim",
    updatedAt: "3 days ago",
  },
];

export default function PriceTableExample() {
  return (
    <div className="p-6">
      <PriceTable
        data={mockData}
        onEdit={(id) => console.log("Edit", id)}
        onDelete={(id) => console.log("Delete", id)}
      />
    </div>
  );
}
