import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
            <TableHead className="w-30.5 font-bold border-r border-border/60 text-center">
              Service ID
            </TableHead>
            <TableHead className="w-54 font-bold">Customer Info</TableHead>
            <TableHead className="w-37.5 font-bold">Brand</TableHead>
            <TableHead className="w-37.5 font-bold">Device Name</TableHead>
            <TableHead className="w-32 font-bold text-center">Status</TableHead>
            <TableHead className="w-37.5 font-bold">Total Price</TableHead>
            <TableHead className="w-37.5 font-bold">Technician</TableHead>

            <TableHead className="w-51 font-bold">Customer Info</TableHead>
            <TableHead className="w-35 font-bold">Brand</TableHead>
            <TableHead className="w-37.5 font-bold">Device Name</TableHead>
            <TableHead className="w-32 font-bold text-center">Status</TableHead>
            <TableHead className="w-40 font-bold text-center">
              Total Price
            </TableHead>
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
                <div className="gap-2">
                  <Skeleton className="h-4 w-42" />
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
                <div className="flex justify-center">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
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
    <div className="rounded-md border bg-card">
      <Table className="min-w-250 table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-11 font-bold border-r border-border/60 text-center">
              ID
            </TableHead>
            <TableHead className="w-50 font-bold">Email</TableHead>
            <TableHead className="w-37.5 font-bold">Username</TableHead>
            <TableHead className="w-30 text-center font-bold">Role</TableHead>
            <TableHead className="w-30 text-center font-bold">Status</TableHead>
            <TableHead className="w-30 font-bold">Created At</TableHead>
            <TableHead className="w-30 font-bold">Updated At</TableHead>
            <TableHead className="w-15 text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell className="border-r border-border/60 text-center">
                <Skeleton className="h-6 w-6 mx-auto" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-42.5" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-33" />
              </TableCell>

              <TableCell>
                <div className="flex justify-center">
                  <Skeleton className="h-5 w-20 rounded-full" />
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

export function PublicProductSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-xl sm:rounded-2xl bg-muted/20 border border-border/40 p-2.5 sm:p-4 h-full"
        >
          <Skeleton className="aspect-square w-full rounded-lg sm:rounded-xl mb-3 sm:mb-4" />

          <div className="flex flex-col flex-1 pt-1 sm:pt-2">
            <div className="space-y-1.5 mb-2.5 sm:mb-3">
              <Skeleton className="h-3 sm:h-4 w-full" />
              <Skeleton className="h-3 sm:h-4 w-[75%]" />
            </div>

            <div className="mb-2 sm:mb-3">
              <Skeleton className="h-3.5 sm:h-4 w-16 sm:w-20 rounded" />
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <div className="flex flex-col border-l-2 border-primary/20 pl-1.5 sm:pl-2 space-y-1.5">
                <Skeleton className="h-2 w-8" />
                <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-16" />
              </div>
              <div className="flex flex-col border-l-2 border-muted pl-1.5 sm:pl-2 space-y-1.5">
                <Skeleton className="h-2 w-8" />
                <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-16" />
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between bg-muted/40 p-2 sm:p-2.5 rounded-lg border border-border/50">
              <Skeleton className="h-4 sm:h-5 w-16 sm:w-24" />
              <Skeleton className="h-4 sm:h-5 w-8 sm:w-10 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CatalogProductSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col h-full rounded-xl sm:rounded-2xl bg-muted/20 border border-border/40 p-2.5 sm:p-4"
        >
          <Skeleton className="aspect-square w-full rounded-lg sm:rounded-xl mb-3 sm:mb-4" />

          <div className="flex flex-col flex-1 pt-1 sm:pt-2">
            <div className="space-y-1.5 mb-2.5 sm:mb-3">
              <Skeleton className="h-3 sm:h-4 md:h-5 w-full" />
              <Skeleton className="h-3 sm:h-4 md:h-5 w-[75%]" />
            </div>

            <div className="mb-2 sm:mb-3">
              <Skeleton className="h-3.5 sm:h-4 w-16 sm:w-20 rounded" />
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <div className="flex flex-col border-l-2 border-primary/20 pl-1.5 sm:pl-2 space-y-1.5">
                <Skeleton className="h-2 w-8" />
                <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-16" />
              </div>
              <div className="flex flex-col border-l-2 border-muted pl-1.5 sm:pl-2 space-y-1.5">
                <Skeleton className="h-2 w-8" />
                <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-16" />
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between bg-muted/40 p-2 sm:p-2.5 rounded-lg border border-border/50 gap-1">
              <Skeleton className="h-4 sm:h-5 md:h-6 w-16 sm:w-24" />
              <Skeleton className="h-4 sm:h-5 w-12 sm:w-16 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailProductPublicSkeleton() {
  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl overflow-hidden">
      <div className="space-y-6 pb-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-md shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-5 sm:h-6 w-48 sm:w-64" />
            <Skeleton className="h-3 sm:h-4 w-32 sm:w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 flex flex-col gap-6 h-full">
            <Card className="flex flex-col overflow-hidden shrink-0 shadow-sm border-border/60">
              <CardHeader className="p-5 sm:p-6 md:p-8 pb-6 sm:pb-8 border-b">
                <div className="flex items-start md:items-center gap-4 sm:gap-6 flex-col md:flex-row">
                  <Skeleton className="w-full md:w-48 h-48 sm:h-56 md:h-48 shrink-0 rounded-xl" />

                  <div className="flex-1 space-y-4 w-full min-w-0 py-2">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-24 rounded-full" />
                    </div>

                    <div className="space-y-2 pt-2">
                      <Skeleton className="h-7 sm:h-8 md:h-10 w-full" />
                      <Skeleton className="h-7 sm:h-8 md:h-10 w-3/4" />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Skeleton className="h-5 w-20 rounded-md" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 md:p-8">
                <div className="space-y-3">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 sm:h-12 w-48 sm:w-64" />
                </div>
              </CardContent>
            </Card>

            {/* Spec & ID Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              {/* Specs Card Skeleton */}
              <Card className="h-full flex flex-col shadow-sm border-border/60">
                <CardHeader className="pb-2 p-5 sm:p-6">
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent className="space-y-4 p-5 sm:p-6 pt-4 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between py-2 border-b border-dashed">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between py-2 border-b border-dashed">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between py-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardContent>
              </Card>

              {/* ID/Barcode Card Skeleton */}
              <Card className="h-full flex flex-col shadow-sm border-border/60">
                <CardHeader className="pb-2 p-5 sm:p-6">
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent className="p-5 sm:p-6 pt-4 flex-1 flex flex-col items-center justify-center space-y-4">
                  <Skeleton className="w-full h-14 sm:h-16 rounded-lg" />
                  <Skeleton className="w-full h-14 sm:h-16 rounded-md" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* RIGHT COLUMN: CTA & Stock sidebar Skeleton */}
          <div className="space-y-6 h-full flex flex-col">
            {/* WA CTA Card Skeleton */}
            <Card className="h-fit shadow-md border-t-4 border-t-muted">
              <CardHeader className="pb-4 bg-muted/10 p-5 sm:p-6 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full max-w-50" />
              </CardHeader>
              <CardContent className="flex flex-col gap-3 p-5 sm:p-6 pt-5 sm:pt-6">
                <Skeleton className="w-full h-12 rounded-md" />
                <Skeleton className="h-2.5 w-3/4 mx-auto mt-1" />
              </CardContent>
            </Card>

            {/* Stock Card Skeleton */}
            <Card className="h-fit shadow-sm border-border/60">
              <CardHeader className="pb-2 p-5 sm:p-6">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-5 sm:space-y-6 p-5 sm:p-6 pt-4">
                <Skeleton className="w-full h-24 sm:h-28 rounded-xl" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-2.5 w-full rounded-full" />
                </div>
              </CardContent>
            </Card>

            {/* Store Info Card Skeleton */}
            <Card className="h-full shadow-sm border-border/60 bg-muted/10">
              <CardHeader className="pb-2 p-5 sm:p-6">
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent className="space-y-4 h-full flex flex-col p-5 sm:p-6 pt-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  const chartHeights = [35, 60, 25, 80, 45, 90, 55, 60, 15, 20, 25, 55];

  return (
    <div className="space-y-6 sm:space-y-8 pb-8 w-full">
      <div className="flex flex-row justify-between items-center gap-2 sm:gap-4 mb-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <Skeleton className="h-7 sm:h-9 w-7 sm:w-9 shrink-0" />
          <Skeleton className="h-7 sm:h-9 w-32 sm:w-64 shrink-0" />
        </div>

        <Skeleton className="h-8 sm:h-10 w-24 sm:w-32 rounded-md shrink-0" />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="shadow-sm border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 sm:h-5 w-24 sm:w-32" />
              <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 sm:h-8 w-32 sm:w-40 mb-2.5" />
              <Skeleton className="h-3 w-48 sm:w-56 max-w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-6">
        {/* Chart Card Skeleton */}
        <Card className="lg:col-span-4 flex flex-col shadow-sm border-border/60">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 sm:h-7 w-40 sm:w-48 mb-2" />
            <Skeleton className="h-3 sm:h-4 w-64 sm:w-80 max-w-full" />
          </CardHeader>
          <CardContent className="pl-4 sm:pl-6 pb-6 pt-4 h-75 sm:h-112.5` flex items-end gap-2 sm:gap-4">
            {chartHeights.map((height, i) => (
              <Skeleton
                key={i}
                className="w-full rounded-t-md rounded-b-none bg-primary/20"
                style={{ height: `${height}%` }}
              />
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity Card Skeleton */}
        <Card className="lg:col-span-2 flex flex-col shadow-sm border-border/60">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 sm:h-7 w-32 sm:w-40 mb-2" />
            <Skeleton className="h-3 sm:h-4 w-48 sm:w-56 max-w-full" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 space-y-6 sm:space-y-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0 hidden sm:block" />
                <div className="space-y-2 w-full">
                  <div className="flex justify-between gap-2">
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-20 sm:w-24" />
                      <Skeleton className="h-4 w-12 sm:w-16" />
                    </div>
                    <Skeleton className="h-3 w-12 sm:w-16 shrink-0" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
