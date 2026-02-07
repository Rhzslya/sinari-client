import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { formatBytes } from "@/components/utils/formatBytes";
import { handleApiError } from "@/lib/utils";
import type {
  TechnicianResponse,
  UpdateTechnicianRequest,
} from "@/model/technician-model";
import { TechnicianServices } from "@/services/technician-services";
import { MAX_FILE_SIZE } from "@/types/type";
import { TechnicianValidation } from "@/validation/technician-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileImage,
  Loader2,
  PenLine,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

interface EditTechnicianFormProps {
  technician: TechnicianResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditTechnicianForm({
  technician,
  onSuccess,
  onCancel,
}: EditTechnicianFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    technician.signature_url || null,
  );
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  type EditFormValues = Omit<UpdateTechnicianRequest, "id">;

  const formUpdate = useForm<EditFormValues>({
    resolver: zodResolver(
      TechnicianValidation.UPDATE,
    ) as Resolver<EditFormValues>,
    defaultValues: {
      name: technician.name,
      is_active: technician.is_active,
      signature: undefined,
    },
  });

  const { isSubmitting, isDirty } = formUpdate.formState;
  const nameValue = formUpdate.watch("name");
  const isActiveValue = formUpdate.watch("is_active");
  const imageValue = formUpdate.watch("signature");

  const isImageOversized =
    imageValue instanceof File && imageValue.size > MAX_FILE_SIZE;

  const isButtonDisabled = isSubmitting || !nameValue || !isActiveValue;

  const onSubmit = async (data: EditFormValues) => {
    setIsLoading(true);

    try {
      await TechnicianServices.update({
        id: technician.id,
        ...data,
        delete_image: isImageDeleted,
      });

      setIsImageDeleted(false);

      toast.success("Technician updated successfully", {
        description: `${data.name} has been successfully updated.`,
      });
      formUpdate.reset();
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (onSuccess) onSuccess();
    } catch (error) {
      handleApiError(error, "Failed to update technician");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (technician) {
      formUpdate.reset({
        name: technician.name,
        is_active: technician.is_active,
        signature: undefined,
      });
      setPreview(technician.signature_url || null);
      setIsImageDeleted(false);
    }
  }, [technician, formUpdate]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | undefined) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setIsImageDeleted(false);
    }
  };

  const handleRemoveImage = (
    e: React.MouseEvent,
    onChange: (file: undefined) => void,
  ) => {
    e.stopPropagation();
    onChange(undefined);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (technician.signature_url) {
      setIsImageDeleted(true);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
    setIsImageDeleted(false);
  };

  const handleResetToOriginal = () => {
    formUpdate.reset({
      name: technician.name,
      is_active: technician.is_active,
      signature: undefined,
    });
    setPreview(technician.signature_url || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-8";
  const labelStyle =
    "text-xs font-semibold text-muted-foreground uppercase tracking-wider";
  return (
    <Form {...formUpdate}>
      <form
        onSubmit={formUpdate.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div
          className="flex-1 overflow-y-auto px-6 py-6 
            /* Lebar scrollbar */
            [&::-webkit-scrollbar]:w-1
            
            /* Track (Jalur) transparan */
            [&::-webkit-scrollbar-track]:bg-transparent
            
            /* Thumb (Batang) warna primary transparan & bulat */
            [&::-webkit-scrollbar-thumb]:bg-primary/20 
            [&::-webkit-scrollbar-thumb]:rounded-full
            
            hover:[&::-webkit-scrollbar-thumb]:bg-primary
            transition-colors"
        >
          <div className="grid gap-5">
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                General Information
              </h3>
              <p className="text-xs text-muted-foreground">
                Basic details about your Technician.
              </p>
            </div>

            <FormField
              control={formUpdate.control}
              name="name"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0">
                  <FormLabel className={labelStyle}>Technician Name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="e.g. iPhone 15 Pro Titanium"
                      className={inputStyle}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={formUpdate.control}
              name="signature"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel className={labelStyle}>
                    Signature Image (Optional)
                  </FormLabel>
                  <FormControl>
                    <div
                      key={technician.id}
                      className="w-full max-w-100 mx-auto"
                    >
                      <Input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) => handleImageChange(e, field.onChange)}
                        disabled={isSubmitting}
                      />

                      {!preview ? (
                        <div className="flex items-center justify-center w-full">
                          <div
                            onClick={triggerFileInput}
                            className="flex flex-col items-center justify-center w-full aspect-2/1 border-2 border-dashed rounded-xl cursor-pointer bg-muted/5 hover:bg-muted/20 border-border transition-all group"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                              <div className="p-3 rounded-full bg-background shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-6 h-6 text-primary" />
                              </div>
                              <p className="text-sm font-medium text-foreground">
                                Click to upload image
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                SVG, PNG, JPG or WEBP (max. 2MB)
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`w-full overflow-hidden rounded-xl border bg-background shadow-sm group relative cursor-pointer ${
                            isImageOversized
                              ? "border-destructive"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={triggerFileInput}
                        >
                          <div className="relative w-full aspect-2/1 bg-white flex items-center justify-center border-b">
                            <img
                              src={preview}
                              alt="Preview"
                              className="relative h-full w-full object-contain z-10 p-2"
                            />
                            <div className="absolute inset-0 z-20 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <PenLine className="w-8 h-8 text-white mb-2" />
                              <span className="text-white text-xs font-medium">
                                Click to change
                              </span>
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1 z-30">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6 rounded-md shadow-sm transition-transform hover:scale-110"
                                onClick={(e) =>
                                  handleRemoveImage(e, field.onChange)
                                }
                                disabled={isSubmitting}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center px-4">
                              {isImageOversized ? (
                                <div className="flex items-center gap-2 bg-destructive/90 backdrop-blur-sm text-destructive-foreground px-3 py-1.5 rounded-full shadow-lg border border-white/10">
                                  <X className="w-3.5 h-3.5" />
                                  <span className="text-[10px] font-medium tracking-wide">
                                    File too large (Max 2MB)
                                  </span>
                                </div>
                              ) : imageValue instanceof File ? (
                                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
                                  <span className="text-[10px] font-medium tracking-wide">
                                    Background will be removed automatically
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-1.5 bg-card border-t z-30 relative">
                            <div
                              className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${isImageOversized ? "bg-destructive/10" : "bg-background"}`}
                            >
                              <FileImage
                                className={`h-4 w-4 ${isImageOversized ? "text-destructive" : "text-foreground"}`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-xs font-medium truncate ${isImageOversized ? "text-destructive" : "text-foreground"}`}
                              >
                                {imageValue instanceof File
                                  ? imageValue.name
                                  : "Current Image"}
                              </p>
                              <p
                                className={`text-xs absolute -bottom-4 left-0 ${isImageOversized ? "text-destructive font-semibold" : "text-muted-foreground"}`}
                              >
                                {imageValue instanceof File
                                  ? formatBytes(imageValue.size)
                                  : "Click image to replace"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={formUpdate.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Technicians can be assigned to services when active.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="h-4"></div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t bg-background mt-auto">
          {isDirty || isImageDeleted ? (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className="w-1/4 text-sm font-semibold shadow-sm cursor-pointer text-foreground duration-300"
              onClick={handleResetToOriginal}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className="w-1/4 text-sm font-semibold shadow-sm cursor-pointer text-foreground duration-300"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}

          <Button
            size="sm"
            className="w-1/3 text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer text-foreground duration-300"
            type="submit"
            disabled={
              isButtonDisabled || isLoading || (!isDirty && !isImageDeleted)
            }
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save Product"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
