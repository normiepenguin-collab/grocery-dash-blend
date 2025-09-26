import { useState } from "react";
import { Upload, Plus, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ProductVariant {
  id: string;
  size: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  variants: ProductVariant[];
  isActive: boolean;
}

interface ProductFormProps {
  onSave: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  editProduct?: Product | null;
}

const categories = [
  "Fruits & Vegetables",
  "Dairy Products", 
  "Bakery Items",
  "Snacks & Beverages",
  "Sauces & Condiments",
  "Personal Care",
  "Household Items",
  "Other"
];

export const ProductForm = ({ onSave, onCancel, editProduct }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: editProduct?.name || "",
    category: editProduct?.category || "",
    description: editProduct?.description || "",
    image: editProduct?.image || "",
    isActive: editProduct?.isActive ?? true
  });

  const [variants, setVariants] = useState<ProductVariant[]>(
    editProduct?.variants || [{ id: "1", size: "", price: 0, stock: 0 }]
  );

  const [imagePreview, setImagePreview] = useState<string>(editProduct?.image || "");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      size: "",
      price: 0,
      stock: 0
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariant = (id: string) => {
    if (variants.length > 1) {
      setVariants(variants.filter(v => v.id !== id));
    }
  };

  const updateVariant = (id: string, field: keyof Omit<ProductVariant, 'id'>, value: string | number) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validVariants = variants.filter(v => v.size.trim() && v.price > 0);
    if (validVariants.length === 0) {
      alert("Please add at least one valid variant");
      return;
    }

    onSave({
      ...formData,
      variants: validVariants
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">
          {editProduct ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                  </div>
                </div>
              </div>
              {imagePreview && (
                <div className="w-24 h-24 rounded-lg overflow-hidden border">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Variants Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Product Variants</Label>
              <Button
                type="button"
                onClick={addVariant}
                variant="outline"
                size="sm"
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Variant
              </Button>
            </div>
            
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={variant.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <Label htmlFor={`size-${variant.id}`} className="text-sm">Size/Weight</Label>
                    <Input
                      id={`size-${variant.id}`}
                      value={variant.size}
                      onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                      placeholder="e.g., 500gm"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`price-${variant.id}`} className="text-sm">Price (₹)</Label>
                    <Input
                      id={`price-${variant.id}`}
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(variant.id, 'price', Number(e.target.value))}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`stock-${variant.id}`} className="text-sm">Stock</Label>
                    <Input
                      id={`stock-${variant.id}`}
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateVariant(variant.id, 'stock', Number(e.target.value))}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => removeVariant(variant.id)}
                      variant="outline"
                      size="sm"
                      disabled={variants.length === 1}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="active">Product Active</Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Save className="w-4 h-4 mr-2" />
              {editProduct ? "Update Product" : "Save Product"}
            </Button>
            <Button type="button" onClick={onCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};