import { useState, useRef, useEffect } from "react";
import { Plus, Search, Edit, Trash2, MoreHorizontal, Package, Upload, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Product, Category } from "@/data/mockData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const prods = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name_ka || item.name_en, // Use Georgian name as default, fallback to English
        name_ka: item.name_ka,
        name_en: item.name_en,
        price: item.price,
        originalPrice: item.original_price,
        category: "", // Will be populated from categorySlug lookup
        categorySlug: item.category_slug,
        image: item.image,
        images: item.images,
        description: item.description_ka || item.description_en, // Use Georgian description as default
        description_ka: item.description_ka,
        description_en: item.description_en,
        inStock: item.in_stock,
        isNew: item.is_new,
        isFeatured: item.is_featured,
      }));

      setProducts(prods);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      const cats = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name_ka || item.name_en, // Use Georgian name as default, fallback to English
        name_ka: item.name_ka,
        name_en: item.name_en,
        slug: item.slug,
        image: item.image,
        productCount: item.product_count,
      }));

      setCategories(cats);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name_ka.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    fetchProducts(); // Refresh the product list
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-medium">Products</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">{products.length} total products</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="tocasa-button-primary rounded-lg gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg mx-auto">
            <DialogHeader>
              <DialogTitle className="font-serif">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm onSave={handleSave} product={editingProduct} categories={categories} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-4 sm:mb-6">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-sm font-medium text-muted-foreground p-4">
                      Product
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground p-4">
                      Category
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground p-4">
                      Price
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground p-4">
                      Status
                    </th>
                    <th className="text-right text-sm font-medium text-muted-foreground p-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1">{product.name_ka}</p>
                            <p className="text-xs text-muted-foreground">
                              SKU: TOCASA-{String(product.id).padStart(4, "0")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{product.category}</td>
                      <td className="p-4">
                        <span className="font-medium">₾{product.price}</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-muted-foreground line-through">
                            ₾{product.originalPrice}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            product.inStock
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingProduct(product);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(product.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border border-border bg-card p-3 sm:p-4"
              >
                <div className="flex gap-3">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base line-clamp-1">{product.name_ka}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingProduct(product);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="font-semibold text-sm">₾{product.price}</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-xs text-muted-foreground line-through">
                            ₾{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          product.inStock
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function ProductForm({
  product,
  onSave,
  categories,
}: {
  product?: Product | null;
  onSave: () => void;
  categories: Category[];
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [nameKa, setNameKa] = useState(product?.name_ka || product?.name || "");
  const [nameEn, setNameEn] = useState(product?.name_en || product?.name || "");
  const [descriptionKa, setDescriptionKa] = useState(product?.description_ka || product?.description || "");
  const [descriptionEn, setDescriptionEn] = useState(product?.description_en || product?.description || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice || 0);
  const [categorySlug, setCategorySlug] = useState(product?.categorySlug || "");
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveProduct = async () => {
    // Validation
    if (!nameKa.trim() || !nameEn.trim() || !descriptionKa.trim() || !descriptionEn.trim() || !price || !categorySlug) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate name length
    if (nameKa.length > 200 || nameEn.length > 200) {
      toast.error("Product name must be less than 200 characters");
      return;
    }

    // Validate description length
    if (descriptionKa.length > 2000 || descriptionEn.length > 2000) {
      toast.error("Product description must be less than 2000 characters");
      return;
    }

    // Validate price
    if (price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (originalPrice && originalPrice < price) {
      toast.error("Original price must be greater than current price");
      return;
    }

    // Validate image requirement
    if (!imageFile && !product?.image) {
      toast.error("Please upload a product image");
      return;
    }

    setIsUploading(true);
    try {
      // Check for duplicate product names
      const { data: existingProducts } = await supabase
        .from("products")
        .select("id, name_ka, name_en")
        .or(`name_ka.eq.${nameKa},name_en.eq.${nameEn}`);

      if (existingProducts && existingProducts.length > 0) {
        const isDuplicate = existingProducts.some(
          (prod) => prod.id !== product?.id
        );
        if (isDuplicate) {
          const duplicate = existingProducts.find((prod) => prod.id !== product?.id);
          if (duplicate?.name_ka === nameKa) {
            toast.error("A product with this Georgian name already exists");
          } else if (duplicate?.name_en === nameEn) {
            toast.error("A product with this English name already exists");
          }
          setIsUploading(false);
          return;
        }
      }

      let imageUrl = product?.image;

      // Upload image to Supabase if a new file was selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      // Find category name from categories
      const category = categories.find((c) => c.slug === categorySlug);

      // Prepare product data
      const productData = {
        name: nameKa, // For backwards compatibility
        name_ka: nameKa,
        name_en: nameEn,
        description: descriptionKa, // For backwards compatibility
        description_ka: descriptionKa,
        description_en: descriptionEn,
        price,
        original_price: originalPrice || null,
        category: category?.name || "",
        category_slug: categorySlug,
        image: imageUrl || "",
        in_stock: inStock,
        is_featured: isFeatured,
        is_new: isNew,
      };

      if (product?.id) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        // Create new product
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;
        toast.success("Product created successfully");
      }

      onSave();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-1">
      <div className="space-y-2">
        <Label>Product Image</Label>
        <div className="space-y-3">
          {imagePreview ? (
            <div className="relative w-full h-48 rounded-lg border border-border overflow-hidden">
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={handleRemoveImage}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="w-full h-48 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload image</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {!imagePreview && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          )}
        </div>
      </div>

      {/* Product Name - Georgian */}
      <div className="space-y-2">
        <Label>Product Name (Georgian) *</Label>
        <Input
          value={nameKa}
          onChange={(e) => setNameKa(e.target.value)}
          placeholder="პროდუქტის სახელი ქართულად"
          required
        />
      </div>

      {/* Product Name - English */}
      <div className="space-y-2">
        <Label>Product Name (English) *</Label>
        <Input
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="Product name in English"
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={categorySlug} onValueChange={setCategorySlug}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Fields */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Price (₾) *</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Original Price (₾)</Label>
          <Input
            type="number"
            value={originalPrice || ""}
            onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Description - Georgian */}
      <div className="space-y-2">
        <Label>Description (Georgian) *</Label>
        <Textarea
          value={descriptionKa}
          onChange={(e) => setDescriptionKa(e.target.value)}
          placeholder="პროდუქტის აღწერა ქართულად..."
          rows={3}
          required
        />
      </div>

      {/* Description - English */}
      <div className="space-y-2">
        <Label>Description (English) *</Label>
        <Textarea
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
          placeholder="Product description in English..."
          rows={3}
          required
        />
      </div>

      {/* In Stock Toggle */}
      <div className="flex items-center justify-between">
        <Label>In Stock</Label>
        <Switch checked={inStock} onCheckedChange={setInStock} />
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Featured Product</Label>
          <p className="text-xs text-muted-foreground">Show this product in featured section</p>
        </div>
        <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
      </div>

      {/* New Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>New Arrival</Label>
          <p className="text-xs text-muted-foreground">Mark this product as new</p>
        </div>
        <Switch checked={isNew} onCheckedChange={setIsNew} />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
        <Button variant="outline" onClick={() => onSave()} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button
          onClick={handleSaveProduct}
          className="tocasa-button-primary w-full sm:w-auto"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : product ? "Update" : "Create"} Product
        </Button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Package className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-serif text-xl font-medium mb-2">No products found</h3>
      <p className="text-muted-foreground max-w-sm">
        Try adjusting your search or add a new product to get started.
      </p>
    </div>
  );
}

export default AdminProducts;
