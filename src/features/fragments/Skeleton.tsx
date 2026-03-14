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
    <div
      className="rounded-md border bg-card shadow-sm w-full overflow-x-auto pb-2 sm:pb-0
        [&::-webkit-scrollbar]:h-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-primary/20 
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-primary
        transition-colors"
    >
      <Table className="min-w-200 w-full text-sm table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-muted/30">
            <TableHead className="w-14 font-bold border-r border-border/60 text-center">
              <Skeleton className="h-4 w-6 mx-auto" />
            </TableHead>
            <TableHead className="w-87.5 font-bold">
              <Skeleton className="h-4 w-28" />
            </TableHead>
            <TableHead className="w-37.5 font-bold">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead className="w-37.5 font-bold">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="w-25 font-bold">
              <Skeleton className="h-4 w-10" />
            </TableHead>
            <TableHead className="w-37.5 font-bold">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-6 rounded-md" />{" "}
              </div>
            </TableHead>
            <TableHead className="w-37.5 font-bold">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="w-12.5 text-right pr-6 font-bold">
              <Skeleton className="h-4 w-10 ml-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow
              key={index}
              className="border-b border-border transition-colors hover:bg-muted/50 h-14 sm:h-17"
            >
              <TableCell className="border-r border-border/60 text-center py-3 sm:py-4">
                <Skeleton className="h-4 w-6 mx-auto" />
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 sm:h-4.5 w-3/4 max-w-50" />
                  <Skeleton className="h-2.5 sm:h-3 w-1/2 max-w-30" />
                </div>
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <Skeleton className="h-4 w-20" />
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <Skeleton className="h-4 w-24" />
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <Skeleton className="h-4 w-8" />
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <Skeleton className="h-4 w-24 font-mono" />
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <Skeleton className="h-4 w-24 font-mono" />
              </TableCell>

              <TableCell className="text-right pr-6 py-3 sm:py-4">
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8 rounded-full" />
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
    <div
      className="rounded-md border bg-card shadow-sm w-full overflow-x-auto pb-2 sm:pb-0
        [&::-webkit-scrollbar]:h-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-primary/20 
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-primary
        transition-colors"
    >
      <Table className="min-w-275 w-full text-sm table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-muted/30">
            <TableHead className="w-32 font-bold border-r border-border/60 text-center">
              <Skeleton className="h-4 w-16 mx-auto" />
            </TableHead>
            <TableHead className="w-54 font-bold">
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead className="w-37.5 font-bold">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead className="w-37.5 font-bold">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="w-32 font-bold text-center">
              <Skeleton className="h-4 w-14 mx-auto" />
            </TableHead>
            <TableHead className="w-37.5 font-bold text-center">
              <Skeleton className="h-4 w-16 mx-auto" />
            </TableHead>
            <TableHead className="w-37.5 font-bold">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="w-37.5 font-bold">
              <Skeleton className="h-4 w-12" />
            </TableHead>
            <TableHead className="w-12.5 text-right pr-6 font-bold">
              <Skeleton className="h-4 w-8 ml-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow
              key={index}
              className="border-b border-border transition-colors hover:bg-muted/50 h-14 sm:h-17"
            >
              <TableCell className="border-r border-border/60 text-center py-3 sm:py-4">
                <Skeleton className="h-6 w-20 mx-auto rounded-sm" />
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <Skeleton className="h-4 w-32 sm:w-40" />
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-20 sm:w-24" />
                </div>
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-24 sm:w-28" />
                </div>
              </TableCell>

              <TableCell className="text-center py-3 sm:py-4">
                <div className="flex justify-center">
                  <Skeleton className="h-5 sm:h-6 w-20 rounded-full" />
                </div>
              </TableCell>

              <TableCell className="font-medium text-sm py-3 sm:py-4">
                <div className="flex w-full justify-center">
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-2.5 w-2.5 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-24 sm:w-28" />
                </div>
              </TableCell>

              <TableCell className="text-xs text-muted-foreground py-3 sm:py-4">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </TableCell>

              <TableCell className="text-right pr-6 py-3 sm:py-4">
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8 rounded-full" />
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
    <div
      className="rounded-md border bg-card shadow-sm w-full overflow-x-auto sm:pb-0
        [&::-webkit-scrollbar]:h-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-primary/20 
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-primary
        transition-colors"
    >
      <Table className="min-w-200 w-full text-sm table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-muted/30">
            <TableHead className="w-14 font-bold border-r border-border/60 text-center">
              <Skeleton className="h-4 w-6 mx-auto" />
            </TableHead>
            <TableHead className="w-64 font-bold">
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead className="w-32 font-bold text-center">
              <Skeleton className="h-4 w-12 mx-auto" />
            </TableHead>
            <TableHead className="w-40 font-bold">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="w-40 font-bold">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="w-20 text-right pr-6 font-bold">
              <Skeleton className="h-4 w-12 ml-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow
              key={index}
              className="border-b border-border transition-colors hover:bg-muted/50 h-14 sm:h-17"
            >
              <TableCell className="border-r border-border/60 text-center py-3 sm:py-4">
                <Skeleton className="h-4 w-6 mx-auto" />
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 sm:h-4.5 w-3/4 max-w-45" />
                  <Skeleton className="h-2.5 sm:h-3 w-1/2 max-w-30" />
                </div>
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <div className="flex justify-center">
                  <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
                </div>
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <Skeleton className="h-4 w-24 font-mono" />
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <Skeleton className="h-4 w-24 font-mono" />
              </TableCell>

              <TableCell className="text-right pr-6 py-3 sm:py-4">
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8 rounded-full" />
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
    <div
      className="rounded-md border bg-card shadow-sm w-full overflow-x-auto pb-2 sm:pb-0
        [&::-webkit-scrollbar]:h-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-primary/20 
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-primary
        transition-colors"
    >
      <Table className="min-w-250 w-full text-sm table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-muted/30">
            <TableHead className="w-12 font-bold border-r border-border/60 text-center">
              <Skeleton className="h-4 w-6 mx-auto" />
            </TableHead>

            <TableHead className="w-48 font-bold">
              <Skeleton className="h-4 w-20" />
            </TableHead>

            <TableHead className="w-40 font-bold">
              <Skeleton className="h-4 w-24" />
            </TableHead>

            <TableHead className="w-28 text-center font-bold">
              <Skeleton className="h-4 w-12 mx-auto" />
            </TableHead>

            <TableHead className="w-32 text-center font-bold">
              <Skeleton className="h-4 w-14 mx-auto" />
            </TableHead>

            <TableHead className="w-32 font-bold">
              <Skeleton className="h-4 w-20" />
            </TableHead>

            <TableHead className="w-32 font-bold">
              <Skeleton className="h-4 w-20" />
            </TableHead>

            <TableHead className="w-20 text-right pr-6 font-bold">
              <Skeleton className="h-4 w-12 ml-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow
              key={index}
              className="border-b border-border transition-colors hover:bg-muted/50 h-14 sm:h-17`"
            >
              <TableCell className="border-r border-border/60 text-center py-3 sm:py-4">
                <Skeleton className="h-4 w-6 mx-auto" />
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 sm:h-4.5 w-3/4 max-w-40" />
                  <Skeleton className="h-2.5 sm:h-3 w-1/2 max-w-25" />
                </div>
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <Skeleton className="h-4 w-24 sm:w-32" />
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <div className="flex justify-center">
                  <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
                </div>
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <div className="flex justify-center">
                  <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
                </div>
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <Skeleton className="h-4 w-20 sm:w-24 font-mono" />
              </TableCell>

              <TableCell className="py-3 sm:py-4">
                <Skeleton className="h-4 w-20 sm:w-24 font-mono" />
              </TableCell>

              <TableCell className="text-right pr-6 py-3 sm:py-4">
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8 rounded-full" />
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

export function ProfilePageSkeleton() {
  return (
    <div className="container mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-6xl overflow-hidden w-full">
      <div className="mb-8 sm:mb-10 border-b border-border pb-6 space-y-2">
        <Skeleton className="h-8 sm:h-9 w-48 sm:w-64" />
        <Skeleton className="h-4 sm:h-5 w-64 sm:w-80 max-w-full" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
        <div className="w-full md:w-1/3 flex flex-col gap-6 md:sticky md:top-8">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4" />
              <Skeleton className="h-6 sm:h-7 w-40 sm:w-48 mb-2" />
              <Skeleton className="h-4 w-24 sm:w-32 mb-4" />
              <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 rounded-full" />
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 pb-4 p-5 sm:p-6">
              <Skeleton className="h-5 sm:h-6 w-40 sm:w-48" />
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 sm:gap-y-6 gap-x-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-20 sm:w-24" />
                    <Skeleton className="h-4 sm:h-5 w-full max-w-50" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 pb-4 p-5 sm:p-6">
              <Skeleton className="h-5 sm:h-6 w-32 sm:w-40" />
            </CardHeader>
            <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 sm:h-5 w-32 sm:w-40" />
                <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 max-w-full" />
              </div>
              <Skeleton className="h-10 w-full sm:w-1/2 shrink-0 rounded-md" />
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/30 dark:border-red-900/40 dark:bg-red-950/20 shadow-sm">
            <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 sm:h-5 w-24 sm:w-32" />
                <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 max-w-full" />
              </div>
              <Skeleton className="h-10 w-full sm:w-1/2 shrink-0 rounded-md bg-destructive/20" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function UserDetailSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 pb-10 overflow-x-hidden w-full">
      <div className="flex items-center gap-3 sm:gap-4 w-full">
        <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-md shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-6 sm:h-7 w-48 sm:w-64 max-w-full" />
          <Skeleton className="h-3 sm:h-4 w-64 sm:w-80 max-w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
        <div className="lg:col-span-2 flex h-full">
          <Card className="w-full flex flex-col shadow-sm border-border/60">
            <CardHeader className="pb-6 sm:pb-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <Skeleton className="w-14 h-14 sm:w-20 sm:h-20 rounded-full shrink-0" />
                <div className="min-w-0 flex-1 space-y-2.5">
                  <Skeleton className="h-6 sm:h-8 w-40 sm:w-64 max-w-full" />
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-4 w-24 sm:w-32" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="-mt-4 sm:-mt-6 flex-1 px-4 sm:px-6">
              <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 h-full">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-16 sm:w-20" />
                  <Skeleton className="h-5 w-40 sm:w-48 max-w-full" />
                </div>
                <div className="space-y-1.5 md:flex md:flex-col md:items-center">
                  <Skeleton className="h-3 w-16 sm:w-20" />
                  <Skeleton className="h-6 w-16 sm:w-20 rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20 sm:w-24" />
                  <Skeleton className="h-5 w-32 sm:w-40 max-w-full" />
                </div>
                <div className="space-y-1.5 md:flex md:flex-col md:items-center">
                  <Skeleton className="h-3 w-16 sm:w-20" />
                  <Skeleton className="h-6 w-20 sm:w-24 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex h-full">
          <Card className="bg-muted/30 w-full flex flex-col shadow-sm border-dashed sm:border-solid border-2 sm:border">
            <CardHeader className="pb-3 sm:pb-4">
              <Skeleton className="h-5 sm:h-6 w-32" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 sm:gap-3 flex-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-9 sm:h-10 rounded-md" />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 flex h-full">
          <Card className="w-full flex flex-col shadow-sm border-border/60">
            <CardHeader className="pb-4">
              <Skeleton className="h-5 sm:h-6 w-40 sm:w-48" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="space-y-6 sm:space-y-8">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2.5">
                    <div className="flex justify-between items-end">
                      <Skeleton className="h-4 w-32 sm:w-40" />
                      <Skeleton className="h-4 w-8 sm:w-10" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                    <div className="flex justify-end mt-1">
                      <Skeleton className="h-3 w-32 sm:w-40" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex h-full">
          <Card className="w-full flex flex-col shadow-sm border-border/60">
            <CardHeader className="pb-4">
              <Skeleton className="h-5 sm:h-6 w-32 sm:w-40" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center space-y-5 sm:space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="space-y-1.5 border-b border-border/50 pb-2"
                >
                  <Skeleton className="h-3 w-20 sm:w-24" />
                  <Skeleton className="h-4 sm:h-5 w-40 sm:w-48" />
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1 sm:pt-2">
                <Skeleton className="h-2 w-2 rounded-full shrink-0" />
                <Skeleton className="h-3 w-32 sm:w-40" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 pb-10 overflow-x-hidden w-full">
      <div className="flex items-center gap-3 sm:gap-4 w-full">
        <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-md shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-6 sm:h-7 w-48 sm:w-64 max-w-full" />
          <Skeleton className="h-3 sm:h-4 w-64 sm:w-80 max-w-full" />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6 h-full">
            <Card className="flex flex-col overflow-hidden shrink-0 shadow-sm border-border/60">
              <CardHeader className="pb-6 sm:pb-8 border-b">
                <div className="flex items-start md:items-center gap-4 sm:gap-6 flex-col md:flex-row">
                  <Skeleton className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0 rounded-lg mx-auto md:mx-0" />

                  <div className="flex-1 space-y-3 sm:space-y-4 min-w-0 w-full flex flex-col items-center md:items-start">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-8 sm:h-10 w-full max-w-100" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 sm:h-10 w-48 max-w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-4" />
                    </div>
                    <Skeleton className="h-6 sm:h-8 w-40 max-w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <Skeleton className="h-16 sm:h-20 w-full rounded-lg" />
                  <Skeleton className="h-16 sm:h-20 w-full rounded-lg" />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 flex-1">
              <Card className="h-full flex flex-col shadow-sm border-border/60">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="space-y-4 pt-3 sm:pt-4 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between py-1 border-b border-dashed">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between py-1 border-b border-dashed">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between py-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full flex flex-col shadow-sm border-border/60">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center text-center space-y-3 pt-3 sm:pt-4">
                  <Skeleton className="w-full h-10 sm:h-12 rounded" />
                  <div className="space-y-1.5 w-full flex flex-col items-center">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-8 w-40 rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
            <Card className="bg-muted/30 h-fit border-l-4 border-l-primary/50 shadow-sm border-border/60">
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="flex flex-col gap-2.5 sm:gap-3">
                <Skeleton className="h-9 sm:h-10 w-full rounded-md" />
                <Skeleton className="h-9 sm:h-10 w-full rounded-md" />
                <Separator className="my-0.5 sm:my-1" />
                <Skeleton className="h-9 sm:h-10 w-full rounded-md" />
              </CardContent>
            </Card>

            <Card className="h-fit shadow-sm border-border/60">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-5 sm:space-y-6">
                <div className="py-3 sm:py-4 bg-muted/10 rounded-lg border border-dashed flex flex-col items-center justify-center gap-2">
                  <Skeleton className="h-10 sm:h-12 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-2 sm:h-2.5 w-full rounded-full" />
                  <div className="flex justify-end">
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 shadow-sm border-border/60">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 h-full flex flex-col justify-center">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 sm:h-4 w-24" />
                  <Skeleton className="h-3 sm:h-4 w-32" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card className="mt-4 sm:mt-6 shadow-sm border-border/60">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export function ServiceDetailSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 pb-10 overflow-x-hidden w-full">
      <div className="flex items-center gap-3 sm:gap-4 w-full">
        <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-md shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-6 sm:h-7 w-48 sm:w-64 max-w-full" />
          <Skeleton className="h-3 sm:h-4 w-64 sm:w-80 max-w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        <div className="lg:col-span-2 flex flex-col h-full min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col shadow-sm min-h-0 border-border/60">
              <CardHeader className="pb-6 sm:pb-8 border-b shrink-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Skeleton className="w-14 h-14 sm:w-20 sm:h-20 rounded-full shrink-0" />
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <Skeleton className="h-6 sm:h-7 w-40 sm:w-64 max-w-full" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3.5 w-3.5 rounded-full" />
                      <Skeleton className="h-4 w-24 sm:w-32" />
                    </div>
                    <Skeleton className="h-5 sm:h-6 w-20 rounded-full" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="-mt-4 sm:-mt-2 flex-1 flex flex-col min-h-0">
                {/* 1. Device Info Boxes */}
                <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 shrink-0 relative z-10">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Skeleton className="h-3 sm:h-4 w-24" /> {/* Label */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <Skeleton className="h-4 sm:h-5 w-16" /> {/* Brand */}
                      <Skeleton className="h-4 sm:h-5 w-4" /> {/* Hyphen */}
                      <Skeleton className="h-4 sm:h-5 w-32" /> {/* Model */}
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Skeleton className="h-3 sm:h-4 w-28" /> {/* Label */}
                    <Skeleton className="h-5 sm:h-7 w-28 rounded border" />{" "}
                    {/* Badge ID */}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
                    <Skeleton className="h-3 sm:h-4 w-40" /> {/* Label */}
                    <Skeleton className="h-20 sm:h-24 w-full rounded-md border" />{" "}
                    {/* Textarea */}
                  </div>
                </div>

                {/* 2. Cost Table Card */}
                <Card className="flex-1 flex flex-col mt-4 sm:mt-6 border shadow-sm overflow-hidden min-h-0">
                  <CardHeader className="py-3 sm:py-4 border-b shrink-0">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 shrink-0" /> {/* Icon */}
                      <Skeleton className="h-5 sm:h-6 w-32" /> {/* Title */}
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 mt-2 sm:mt-6 flex-1 flex flex-col min-h-0">
                    <div className="flex-1 px-4 sm:px-6 pb-6 overflow-hidden">
                      {/* Tabel HTML agar padding & alignment sama persis */}
                      <table className="w-full min-w-87.5 text-left">
                        <thead className="border-b bg-muted/20">
                          <tr>
                            <th className="px-4 sm:px-6 py-2 sm:py-3 w-10 sm:w-12">
                              <Skeleton className="h-4 w-4 mx-auto" />
                            </th>
                            <th className="px-4 sm:px-6 py-2 sm:py-3">
                              <Skeleton className="h-4 w-32" />
                            </th>
                            <th className="px-4 sm:px-6 py-2 sm:py-3 text-right">
                              <Skeleton className="h-4 w-20 ml-auto" />
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <tr key={i}>
                              <td className="px-4 sm:px-6 py-3 sm:py-4">
                                <Skeleton className="h-4 w-4 mx-auto" />
                              </td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4">
                                <Skeleton className="h-4 w-48 sm:w-64 max-w-full" />
                              </td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4">
                                <Skeleton className="h-4 w-24 ml-auto" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="border-t mt-auto px-4 sm:px-5 py-3 sm:py-4 shrink-0">
                      <table className="w-full md:w-1/2 lg:w-1/3 ml-auto">
                        <tbody className="space-y-2">
                          <tr>
                            <td className="px-2 sm:px-6 py-1.5 sm:py-2">
                              <Skeleton className="h-4 w-16" />
                            </td>
                            <td className="px-2 sm:px-6 py-1.5 sm:py-2">
                              <Skeleton className="h-4 w-24 ml-auto" />
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 sm:px-6 py-1.5 sm:py-2">
                              <Skeleton className="h-4 w-20" />
                            </td>
                            <td className="px-2 sm:px-6 py-1.5 sm:py-2">
                              <Skeleton className="h-4 w-20 ml-auto" />
                            </td>
                          </tr>
                          <tr className="bg-primary/5 border-t border-primary/10">
                            <td className="px-2 sm:px-6 py-2 sm:py-3">
                              <Skeleton className="h-5 w-24" />
                            </td>
                            <td className="px-2 sm:px-6 py-2 sm:py-3">
                              <Skeleton className="h-6 sm:h-7 w-32 ml-auto" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 flex flex-col h-full">
          <Card className="bg-muted/40 h-fit shadow-sm border-l-4 border-l-primary/50 border-border/60">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 sm:gap-3">
              <Skeleton className="h-9 sm:h-10 w-full rounded-md" />
              <Skeleton className="h-9 sm:h-10 w-full rounded-md" />
              <Skeleton className="h-9 sm:h-10 w-full rounded-md" />
              <Separator className="my-0.5 sm:my-1" />
              <Skeleton className="h-9 sm:h-10 w-full rounded-md" />
            </CardContent>
          </Card>

          <Card className="h-fit shadow-sm border-border/60">
            <CardHeader className="pb-3 sm:pb-4">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-12 rounded-md" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-16 sm:h-20 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-20 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 shadow-sm flex flex-col border-border/60">
            <CardHeader className="pb-3 sm:pb-4 shrink-0">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 sm:h-10 w-full rounded" />
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32 border-b pb-2" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32 border-b pb-2" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>

              <div className="mt-auto pt-6">
                <div className="bg-muted/10 border border-dashed rounded-xl p-4 flex flex-col gap-3.5">
                  <div className="space-y-2 flex flex-col items-center">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2 w-48" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Skeleton className="h-8 sm:h-9 w-full rounded-md" />
                    <Skeleton className="h-8 sm:h-9 w-full rounded-md" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-4 sm:mt-6 shadow-sm border-border/60">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingSkeleton() {
  return (
    <div className="flex flex-col h-full space-y-4 sm:space-y-6 w-full">
      <div className="flex flex-row justify-between items-center gap-2 sm:gap-4 mb-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <Skeleton className="h-7 sm:h-9 w-7 sm:w-9 shrink-0" />
          <Skeleton className="h-7 sm:h-9 w-32 sm:w-64 shrink-0" />
        </div>

        <Skeleton className="h-8 sm:h-10 w-24 sm:w-32 rounded-md shrink-0" />
      </div>

      <Separator className="my-0.5 sm:my-1" />

      <div className="flex flex-col flex-1 mt-6">
        <div className="flex-1">
          <div className="w-full flex flex-col">
            <div className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 p-1 h-auto shrink-0 mb-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 sm:h-10 w-full rounded-md" />
              ))}
            </div>

            <div className="mt-2">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-border/30">
                  <Skeleton className="h-6 sm:h-7 w-48 mb-2" />
                  <Skeleton className="h-4 sm:h-4 w-72 max-w-full" />
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 sm:h-4 w-24" />
                    <Skeleton className="h-9 sm:h-10 w-full rounded-md" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-3 sm:h-4 w-32" />
                    <Skeleton className="h-9 sm:h-10 w-full rounded-md" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 sm:h-4 w-28" />
                      <Skeleton className="h-9 sm:h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 sm:h-4 w-24" />
                      <Skeleton className="h-9 sm:h-10 w-full rounded-md" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-3 sm:h-4 w-32" />
                    <Skeleton className="h-9 sm:h-10 w-full rounded-md" />
                  </div>

                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-3 sm:h-4 w-32" />
                    <Skeleton className="min-h-25 w-full rounded-md" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-30 pt-4 pb-2 sm:py-4 mt-6 bg-background/95 backdrop-blur border-t border-border flex justify-end px-1">
          <Skeleton className="h-10 sm:h-11 w-full sm:w-1/4 rounded-md" />
        </div>
      </div>
    </div>
  );
}
