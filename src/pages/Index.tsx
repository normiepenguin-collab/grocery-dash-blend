import { useState } from "react";
import { Header } from "@/components/admin/Header";
import { ProductForm, Product } from "@/components/admin/ProductForm";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; productId: string | null }>({
    open: false,
    productId: null
  });
  const { toast } = useToast();

  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...productData, id: editingProduct.id }
          : p
      ));
      toast({
        title: "Product Updated",
        description: "Product has been successfully updated.",
      });
    } else {
      // Add new product
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString()
      };
      setProducts(prev => [...prev, newProduct]);
      toast({
        title: "Product Added",
        description: "New product has been successfully added.",
      });
    }
    
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    setDeleteDialog({ open: true, productId: id });
  };

  const confirmDelete = () => {
    if (deleteDialog.productId) {
      setProducts(prev => prev.filter(p => p.id !== deleteDialog.productId));
      toast({
        title: "Product Deleted",
        description: "Product has been successfully deleted.",
        variant: "destructive"
      });
    }
    setDeleteDialog({ open: false, productId: null });
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAddProduct={handleAddProduct} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {showForm && (
            <ProductForm
              onSave={handleSaveProduct}
              onCancel={handleCancelForm}
              editProduct={editingProduct}
            />
          )}
          
          <ProductsTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        </div>
      </main>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, productId: null })}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Index;
