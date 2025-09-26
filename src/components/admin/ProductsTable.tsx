import { Edit3, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "./ProductForm";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductsTable = ({ products, onEdit, onDelete }: ProductsTableProps) => {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Products Yet</h3>
            <p className="text-muted-foreground">Start by adding your first product to the inventory.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Products Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-table-header">
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-table-row-hover">
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden border bg-muted">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {product.variants.slice(0, 2).map((variant) => (
                        <div key={variant.id} className="text-sm">
                          <span className="font-medium">{variant.size}</span>
                          <span className="text-muted-foreground"> - ₹{variant.price}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            Stock: {variant.stock}
                          </span>
                        </div>
                      ))}
                      {product.variants.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{product.variants.length - 2} more variants
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={product.isActive ? "default" : "destructive"}
                      className={product.isActive 
                        ? "bg-status-active text-success-foreground" 
                        : "bg-status-inactive text-destructive-foreground"
                      }
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={() => onEdit(product)}
                        variant="outline"
                        size="sm"
                        className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => onDelete(product.id)}
                        variant="outline"
                        size="sm"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};