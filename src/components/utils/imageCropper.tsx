// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Slider } from "@/components/ui/slider";
// import { Loader2, ZoomIn } from "lucide-react";
// import { useState, useCallback } from "react";
// import Cropper, { type Area } from "react-easy-crop";

// // --- LOGIC UTAMA: CROP + PAD (CLOUDINARY STYLE) ---
// async function getCroppedAndPaddedImg(
//   imageSrc: string,
//   pixelCrop: Area,
// ): Promise<File> {
//   const image = new Image();
//   image.src = imageSrc;
//   await new Promise((resolve) => (image.onload = resolve));

//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   if (!ctx) {
//     throw new Error("No 2d context");
//   }

//   // 1. SETUP KANVAS TARGET (1000x1000)
//   // Ini menyamakan dengan settingan Cloudinary Backend
//   const TARGET_SIZE = 1000;
//   canvas.width = TARGET_SIZE;
//   canvas.height = TARGET_SIZE;

//   // 2. ISI BACKGROUND PUTIH
//   ctx.fillStyle = "#ffffff";
//   ctx.fillRect(0, 0, TARGET_SIZE, TARGET_SIZE);

//   // 3. HITUNG DIMENSI AGAR GAMBAR MUAT (CONTAIN) DI 1000x1000
//   // Kita ambil aspek rasio dari area yang di-crop
//   const cropAspectRatio = pixelCrop.width / pixelCrop.height;

//   let drawWidth = TARGET_SIZE;
//   let drawHeight = TARGET_SIZE;
//   let drawX = 0;
//   let drawY = 0;

//   // Logika "Object Fit: Contain" / Cloudinary "crop: pad"
//   if (cropAspectRatio > 1) {
//     // Gambar Landscape (Lebar > Tinggi)
//     // Lebar dipentokin 1000, Tinggi menyesuaikan
//     drawHeight = TARGET_SIZE / cropAspectRatio;
//     drawY = (TARGET_SIZE - drawHeight) / 2; // Center Vertikal
//   } else {
//     // Gambar Portrait (Tinggi > Lebar) atau Kotak
//     // Tinggi dipentokin 1000, Lebar menyesuaikan
//     drawWidth = TARGET_SIZE * cropAspectRatio;
//     drawX = (TARGET_SIZE - drawWidth) / 2; // Center Horizontal
//   }

//   // 4. GAMBAR (DRAW) HASIL CROP KE KANVAS PUTIH
//   ctx.drawImage(
//     image,
//     pixelCrop.x, // Source X (Crop)
//     pixelCrop.y, // Source Y (Crop)
//     pixelCrop.width, // Source W (Crop)
//     pixelCrop.height, // Source H (Crop)
//     drawX, // Dest X (Canvas 1000px)
//     drawY, // Dest Y (Canvas 1000px)
//     drawWidth, // Dest W (Scaled)
//     drawHeight, // Dest H (Scaled)
//   );

//   return new Promise((resolve, reject) => {
//     canvas.toBlob(
//       (blob) => {
//         if (!blob) {
//           reject(new Error("Canvas is empty"));
//           return;
//         }
//         // Simpan sebagai JPG agar background putih tersimpan (PNG bisa transparan)
//         const file = new File([blob], "product-image.jpg", {
//           type: "image/jpeg",
//         });
//         resolve(file);
//       },
//       "image/jpeg",
//       0.9, // Quality 90%
//     );
//   });
// }

// interface ImageCropperProps {
//   imageSrc: string | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onCropComplete: (croppedFile: File) => void;
// }

// export function ImageCropper({
//   imageSrc,
//   isOpen,
//   onClose,
//   onCropComplete,
// }: ImageCropperProps) {
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const onCropChange = (crop: { x: number; y: number }) => {
//     setCrop(crop);
//   };

//   const onZoomChange = (zoom: number) => {
//     setZoom(zoom);
//   };

//   const onCropCompleteHandler = useCallback(
//     (_croppedArea: Area, croppedAreaPixels: Area) => {
//       setCroppedAreaPixels(croppedAreaPixels);
//     },
//     [],
//   );

//   const handleSave = async () => {
//     if (!imageSrc || !croppedAreaPixels) return;

//     setIsProcessing(true);
//     try {
//       // Panggil fungsi baru kita
//       const croppedFile = await getCroppedAndPaddedImg(
//         imageSrc,
//         croppedAreaPixels,
//       );
//       onCropComplete(croppedFile);
//       onClose();
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (!imageSrc) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-xl">
//         <DialogHeader>
//           <DialogTitle>Adjust Image</DialogTitle>
//         </DialogHeader>

//         <div className="relative w-full h-80 bg-black/5 rounded-md overflow-hidden border">
//           <Cropper
//             image={imageSrc}
//             crop={crop}
//             zoom={zoom}
//             aspect={1}
//             onCropChange={onCropChange}
//             onCropComplete={onCropCompleteHandler}
//             onZoomChange={onZoomChange}
//             // TAMBAHAN: Agar user melihat seluruh gambar di awal (bukan di-zoom in)
//             objectFit="contain"
//           />
//         </div>

//         <p className="text-[10px] text-muted-foreground text-center">
//           Result will be resized to 1000x1000 with white padding.
//         </p>

//         <div className="flex items-center gap-4 py-2">
//           <ZoomIn className="w-4 h-4 text-muted-foreground" />
//           <Slider
//             value={[zoom]}
//             min={1}
//             max={3}
//             step={0.1}
//             onValueChange={(v: number[]) => setZoom(v[0])}
//             className="flex-1"
//           />
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={onClose} disabled={isProcessing}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave} disabled={isProcessing}>
//             {isProcessing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
//               </>
//             ) : (
//               "Save Image"
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
