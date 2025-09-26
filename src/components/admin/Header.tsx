import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddProduct: () => void;
}

export const Header = ({ onAddProduct }: HeaderProps) => {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Grocery Admin</h1>
              <p className="text-sm text-muted-foreground">Product Management Dashboard</p>
            </div>
          </div>
          
          <Button 
            onClick={onAddProduct}
            className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>
    </header>
  );
};