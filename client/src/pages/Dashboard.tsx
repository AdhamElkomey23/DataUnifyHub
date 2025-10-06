import { DashboardCard } from "@/components/DashboardCard";
import { MetricCard } from "@/components/MetricCard";
import { TaskItem } from "@/components/TaskItem";
import { CheckSquare, DollarSign, Users, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Tasks"
          value={24}
          icon={CheckSquare}
          trend={{ value: 12, positive: true }}
        />
        <MetricCard
          title="Total Contacts"
          value={156}
          icon={Users}
          trend={{ value: 8, positive: true }}
        />
        <MetricCard
          title="Price Updates"
          value={18}
          icon={DollarSign}
        />
        <MetricCard
          title="This Week"
          value="92%"
          icon={TrendingUp}
          trend={{ value: 5, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Pending Tasks"
          icon={CheckSquare}
          action={{
            label: "View all tasks",
            onClick: () => console.log("Navigate to tasks"),
          }}
        >
          <TaskItem
            title="Update hotel prices for Dubai"
            assignee="Sarah Chen"
            dueDate="Today"
            priority="high"
            status="in-progress"
          />
          <TaskItem
            title="Contact new driver supplier"
            assignee="Mike Ross"
            dueDate="Tomorrow"
            priority="medium"
            status="todo"
          />
          <TaskItem
            title="Review supplier contracts"
            assignee="Alex Kim"
            dueDate="Mar 15"
            priority="medium"
            status="todo"
          />
        </DashboardCard>

        <DashboardCard
          title="Recent Price Updates"
          icon={DollarSign}
          action={{
            label: "View all prices",
            onClick: () => console.log("Navigate to prices"),
          }}
        >
          <div className="space-y-3">
            {[
              { service: "Luxury Hotel - Dubai", price: "$450", updatedBy: "Sarah Chen", time: "2h ago" },
              { service: "Tour Guide - Cairo", price: "$120", updatedBy: "Mike Ross", time: "5h ago" },
              { service: "Vehicle Rental - Istanbul", price: "$280", updatedBy: "Alex Kim", time: "1d ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.service}</p>
                  <p className="text-xs text-muted-foreground">{item.updatedBy} • {item.time}</p>
                </div>
                <p className="font-mono font-semibold text-primary ml-2">{item.price}</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Recently Added Contacts"
          icon={Users}
          action={{
            label: "View all contacts",
            onClick: () => console.log("Navigate to contacts"),
          }}
        >
          <div className="space-y-3">
            {[
              { name: "Ahmed Hassan", role: "Tour Guide", category: "Guide" },
              { name: "Sofia Martinez", role: "Hotel Manager", category: "Hotel" },
              { name: "Raj Patel", role: "Driver", category: "Driver" },
            ].map((contact, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.role}</p>
                </div>
                <Badge variant="outline" className="text-xs">{contact.category}</Badge>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Quick Actions"
          icon={TrendingUp}
        >
          <div className="space-y-2">
            {[
              { label: "Add New Price", action: "Add price" },
              { label: "Create Task", action: "Create task" },
              { label: "Add Contact", action: "Add contact" },
              { label: "Export Data", action: "Export data" },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => console.log(item.action)}
                className="w-full text-left p-3 rounded-lg hover-elevate active-elevate-2 text-sm font-medium"
                data-testid={`button-${item.action.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
