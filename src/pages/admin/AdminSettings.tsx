import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const AdminSettings = () => {
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-medium">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your store settings</p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Store Information */}
        <section>
          <h2 className="font-serif text-base sm:text-lg font-medium mb-3 sm:mb-4">Store Information</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Store Name</Label>
              <Input defaultValue="TOCASA" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Store Email</Label>
              <Input type="email" defaultValue="hello@tocasa.ge" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Store Phone</Label>
              <Input type="tel" defaultValue="+995 599 123 456" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Store Address</Label>
              <Input defaultValue="Tbilisi, Georgia" />
            </div>
          </div>
        </section>

        <Separator />

        {/* Shipping */}
        <section>
          <h2 className="font-serif text-base sm:text-lg font-medium mb-3 sm:mb-4">Shipping</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Free Shipping Threshold (₾)</Label>
              <Input type="number" defaultValue="200" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Standard Shipping Rate (₾)</Label>
              <Input type="number" defaultValue="15" />
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="tocasa-button-primary rounded-lg w-full sm:w-auto">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
