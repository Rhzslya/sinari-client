import { Separator } from "@/components/ui/separator";
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
            <TableHead className="w-54 font-bold">Customer Info</TableHead>
            <TableHead className="w-37.5 font-bold">Brand</TableHead>
            <TableHead className="w-37.5 font-bold">Device Name</TableHead>
            <TableHead className="w-32 font-bold text-center">Status</TableHead>
            <TableHead className="w-37.5 font-bold">Total Price</TableHead>
            <TableHead className="w-37.5 font-bold">Technician</TableHead>
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

              <TableCell className="flex gap-1 items-center">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-20" />
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

export function DashboardLayoutSkeleton() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <aside className="hidden md:flex w-[16rem] flex-col border-r bg-sidebar h-full shrink-0">
        <div className="flex-1 p-2 mt-4">
          <div className="px-2 mb-2">
            <Skeleton className="h-3 w-20 opacity-50" />
          </div>
          <div className="space-y-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-2 py-2 h-9 w-full rounded-md"
              >
                <Skeleton className="h-4 w-4 shrink-0" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <header className="sticky top-0 z-50 w-full border-b bg-background h-16 shrink-0">
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <Skeleton className="h-7 w-32 rounded-md" />

            <div className="hidden md:flex items-center gap-6">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </header>

        <div className="p-4">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-md -ml-4" />{" "}
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Skeleton className="h-5 w-40" /> {/* Page Title */}
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="hidden md:block h-9 w-48 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </header>
        </div>
        <main className="flex-1 overflow-hidden bg-background p-4"></main>
      </div>
    </div>
  );
}
