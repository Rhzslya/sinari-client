// pages/DashboardProductPage.tsx
import { DashboardProductTable } from "@/features/components/fragments/DashboardProductTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Filter } from "lucide-react";
import { DashboardHeader } from "@/features/components/fragments/DashboardHeader";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductForm } from "@/features/components/ProductForm";

const DashboardProductPage = () => {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Products Management">
        <div className="relative w-48 md:w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8 bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-0 focus-visible:ring-2"
          />
        </div>

        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Filter className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Filter
          </span>
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1 cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </SheetTrigger>

          <SheetContent className="w-100 sm:w-135 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Add New Product</SheetTitle>
              <SheetDescription>
                Add a new item to your inventory. Click save when you're done.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6">
              <ProductForm />
            </div>
          </SheetContent>
        </Sheet>
      </DashboardHeader>

      <div className="flex-1 overflow-auto">
        <DashboardProductTable />
      </div>
    </div>
  );
};

export default DashboardProductPage;
