import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SkeletonTable() {
  return (
    <div className="rounded-md border bg-card w-full">
      <Table className="min-w-200">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-14 font-bold border-r border-border/60 text-center">
              ID
            </TableHead>
            <TableHead className="w-87.5 font-bold">Product Name</TableHead>
            <TableHead className="w-37.5 font-bold">Brand</TableHead>
            <TableHead className="w-37.5 font-bold">Category</TableHead>
            <TableHead className="w-25 font-bold">Stock</TableHead>
            <TableHead className="w-37.5 font-bold">Cost</TableHead>
            <TableHead className="w-37.5 font-bold">Price</TableHead>
            <TableHead className="w-12.5 text-right font-bold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent h-13.75">
              {/* ID Column */}
              <TableCell className="border-r border-border/60 text-center">
                <Skeleton className="h-4 w-4 mx-auto" />
              </TableCell>

              {/* Product Name (Title + Manufacturer) */}
              <TableCell className="">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-62.5" /> {/* Nama Produk */}
                  <Skeleton className="h-3 w-37.5" /> {/* Manufacturer */}
                </div>
              </TableCell>

              {/* Brand */}
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>

              {/* Category */}
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              {/* Stock */}
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>

              {/* Cost */}
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              {/* Price */}
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
