import { useState, useEffect, ChangeEvent } from "react";
import { Plus, Edit, Trash2, MoreHorizontal, FolderTree, Upload, X } from "lucide-react";
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
import { Category } from "@/data/mockData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminCategories = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      const cats = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        name_ka: item.name_ka,
        name_en: item.name_en,
        slug: item.slug,
        image: item.image,
        productCount: item.product_count,
      }));

      setCategories(cats);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    fetchCategories(); // Refresh the list
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Category deleted successfully");
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-medium">Categories</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">{categories.length} categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="tocasa-button-primary rounded-lg gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="font-serif">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm onSave={handleSave} category={editingCategory} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid */}
      {categories.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative rounded-lg border border-border bg-card overflow-hidden"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-2.5 sm:p-4">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm sm:text-base truncate">{category.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {category.productCount} products
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingCategory(category);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(category.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2 truncate">
                  Slug: {category.slug}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function CategoryForm({
  category,
  onSave,
}: {
  category?: Category | null;
  onSave: () => void;
}) {
  const [nameKa, setNameKa] = useState(category?.name_ka || category?.name || "");
  const [nameEn, setNameEn] = useState(category?.name_en || "");

  const generateSlug = (name: string) =>
    name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const slug = generateSlug(nameEn);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(category?.image || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!nameKa.trim()) {
      toast.error("Please enter a category name (Georgian)");
      return;
    }

    if (!nameEn.trim()) {
      toast.error("Please enter a category name (English)");
      return;
    }

    if (!imageFile && !category?.image) {
      toast.error("Please select an image");
      return;
    }

    setIsUploading(true);

    try {
      // Check for duplicate category names
      const { data: existingCategories } = await supabase
        .from("categories")
        .select("id, name_ka, name_en, slug")
        .or(`name_ka.eq.${nameKa},name_en.eq.${nameEn},slug.eq.${slug}`);

      if (existingCategories && existingCategories.length > 0) {
        const isDuplicate = existingCategories.some(
          (cat) => cat.id !== category?.id
        );
        if (isDuplicate) {
          const duplicate = existingCategories.find((cat) => cat.id !== category?.id);
          if (duplicate?.name_ka === nameKa) {
            toast.error("A category with this Georgian name already exists");
          } else if (duplicate?.name_en === nameEn) {
            toast.error("A category with this English name already exists");
          } else if (duplicate?.slug === slug) {
            toast.error("A category with this slug already exists");
          }
          setIsUploading(false);
          return;
        }
      }

      let imageUrl = category?.image || "";

      // Upload image if a new file was selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `categories/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("category-images")
          .upload(filePath, imageFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error("Failed to upload image");
        }

        const { data } = supabase.storage
          .from("category-images")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      // Insert or update category
      const categoryData = {
        name: nameKa, // For backwards compatibility
        name_ka: nameKa,
        name_en: nameEn,
        slug: slug.toLowerCase(),
        image: imageUrl,
      };

      if (category) {
        // Update existing category
        const { error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", category.id);

        if (error) throw error;
        toast.success("Category updated successfully");
      } else {
        // Create new category
        const { error } = await supabase
          .from("categories")
          .insert([categoryData]);

        if (error) throw error;
        toast.success("Category created successfully");
      }

      onSave();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(error.message || "Failed to save category");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label>Category Name (Georgian)</Label>
        <Input
          value={nameKa}
          onChange={(e) => setNameKa(e.target.value)}
          placeholder="Enter category name in Georgian"
        />
      </div>
      <div className="space-y-2">
        <Label>Category Name (English)</Label>
        <Input
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="Enter category name in English"
        />
      </div>
      <div className="space-y-2">
        <Label>Category Image</Label>
        <div className="space-y-3">
          {imagePreview && (
            <div className="relative w-full h-48 rounded-lg border overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  setImageFile(null);
                  setImagePreview("");
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1"
              id="category-image"
            />
            <Label
              htmlFor="category-image"
              className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPG up to 10MB
          </p>
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
        <Button
          variant="outline"
          onClick={() => onSave()}
          className="w-full sm:w-auto"
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="tocasa-button-primary w-full sm:w-auto"
          disabled={isUploading}
        >
          {isUploading ? "Saving..." : category ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FolderTree className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-serif text-xl font-medium mb-2">No categories yet</h3>
      <p className="text-muted-foreground max-w-sm">
        Create your first category to organize your products.
      </p>
    </div>
  );
}

export default AdminCategories;
