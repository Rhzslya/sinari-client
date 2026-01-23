import { cva } from "class-variance-authority";

export const navigationMenuTriggerStyle = cva(
  // 1. Layout & Base (TETAP)
  "cursor-pointer group inline-flex h-9 w-max items-center justify-center rounded-none bg-transparent px-4 py-2 text-sm font-bold relative " +
    // 2. Typography Colors & Transition (TETAP)
    // Base color
    "text-secondary-foreground transition-colors duration-400 " +
    // Hover/Focus/Open colors
    "hover:text-popover-foreground focus:text-popover-foreground data-[active]:text-popover-foreground data-[state=open]:text-popover-foreground " +
    // 3. Force Background Transparent (TETAP)
    "hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent " +
    // --- BAGIAN GARIS (after:...) SUDAH SAYA HAPUS DISINI ---

    // 4. Reset Utils (TETAP)
    "disabled:pointer-events-none disabled:opacity-50 focus:outline-none",
);
