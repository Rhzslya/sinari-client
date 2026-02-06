import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ProductSkeletonTable() {
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
              <TableCell className="border-r border-border/60 text-center">
                <Skeleton className="h-4 w-4 mx-auto" />
              </TableCell>

              <TableCell className="">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-62.5" />
                  <Skeleton className="h-3 w-37.5" />
                </div>
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

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

export function ServiceSkeletonTable() {
  return (
    <div className="rounded-md border bg-card w-full">
      <Table className="min-w-200">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-32 font-bold border-r border-border/60 text-center">
              Service ID
            </TableHead>
            <TableHead className="w-64 font-bold">Customer Info</TableHead>
            <TableHead className="w-37.5 font-bold">Brand</TableHead>
            <TableHead className="w-37.5 font-bold">Device Name</TableHead>
            <TableHead className="w-32 font-bold text-center">Status</TableHead>
            <TableHead className="w-37.5 font-bold">Total Price</TableHead>
            <TableHead className="w-37.5 font-bold">Date</TableHead>
            <TableHead className="w-12.5 text-right font-bold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent h-11">
              <TableCell className="border-r border-border/60 text-center">
                <Skeleton className="h-5 w-20 mx-auto" />
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              <TableCell>
                <div className="flex justify-center">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </TableCell>

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

export function TechnicianSkeletonTable() {
  return (
    <div className="rounded-md border bg-card w-full">
      <Table className="min-w-200">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-14 font-bold border-r border-border/60 text-center">
              ID
            </TableHead>
            <TableHead className="w-87.5 font-bold">Technician Name</TableHead>
            <TableHead className="w-37.5 font-bold">
              <div className="flex justify-center w-full">Status</div>
            </TableHead>
            <TableHead className="w-37.5 font-bold">Created At</TableHead>
            <TableHead className="w-37.5 font-bold">Updated At</TableHead>
            <TableHead className="w-12.5 text-right font-bold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent h-13.75">
              <TableCell className="border-r border-border/60 text-center">
                <Skeleton className="h-4 w-4 mx-auto" />
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </TableCell>

              <TableCell>
                <div className="flex justify-center">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>

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

export function UserSkeletonTable() {
  return (
    <div className="rounded-md border bg-card w-full">
      <Table className="min-w-250">
        <TableHeader>
          <TableRow className="hover:bg-transparent h-10">
            <TableHead className="w-11.5 font-bold border-r border-border/60 text-center">
              ID
            </TableHead>
            <TableHead className="w-50 font-bold">Email</TableHead>
            <TableHead className="w-37.5 font-bold">Username</TableHead>
            <TableHead className="w-30 text-center font-bold">Role</TableHead>
            <TableHead className="w-30 text-center font-bold">Status</TableHead>
            <TableHead className="w-35 font-bold">Created At</TableHead>
            <TableHead className="w-35 font-bold">Updated At</TableHead>
            <TableHead className="w-15 text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 4 }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell className="border-r border-border/60 text-center">
                <Skeleton className="h-4 w-4 mx-auto" />
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-30" />
                  <Skeleton className="h-4 w-4 rounded-full opacity-50" />
                </div>
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              <TableCell>
                <div className="flex justify-center">
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
              </TableCell>

              <TableCell>
                <div className="flex justify-center">
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-24 font-mono" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-24 font-mono" />
              </TableCell>

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
