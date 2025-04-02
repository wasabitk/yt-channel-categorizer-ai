
import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { BrandName } from "@/types";
import { 
  BRANDS, 
  getSelectedBrand, 
  saveSelectedBrand 
} from "@/utils/constants";
import { toast } from "sonner";

interface BrandSelectorProps {
  onBrandChange: (brandName: BrandName) => void;
}

const BrandSelector = ({ onBrandChange }: BrandSelectorProps) => {
  const [selectedBrand, setSelectedBrand] = useState<BrandName>(getSelectedBrand());

  useEffect(() => {
    // Initialize with the stored brand on component mount
    onBrandChange(selectedBrand);
  }, []);

  const handleBrandChange = (value: string) => {
    const brandName = value as BrandName;
    setSelectedBrand(brandName);
    saveSelectedBrand(brandName);
    onBrandChange(brandName);
    toast.success(`Switched to ${brandName} categories`);
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <label htmlFor="brand-select" className="text-sm font-medium">
        Select Brand
      </label>
      <Select value={selectedBrand} onValueChange={handleBrandChange}>
        <SelectTrigger className="w-full" id="brand-select">
          <SelectValue placeholder="Select a brand" />
        </SelectTrigger>
        <SelectContent>
          {BRANDS.map((brand) => (
            <SelectItem key={brand.name} value={brand.name}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BrandSelector;
