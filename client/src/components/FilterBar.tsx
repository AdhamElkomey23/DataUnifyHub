import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
  }[];
  onSearch?: (value: string) => void;
}

export function FilterBar({ searchPlaceholder = "Search...", filters, onSearch }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-9"
          onChange={(e) => onSearch?.(e.target.value)}
          data-testid="input-search"
        />
      </div>
      {filters?.map((filter) => (
        <Select key={filter.label} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger className="w-44" data-testid={`select-${filter.label.toLowerCase().replace(/\s+/g, '-')}`}>
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
