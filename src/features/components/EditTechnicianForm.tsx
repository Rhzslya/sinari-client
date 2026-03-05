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
import { useTechnicianQueries } from "@/hooks/technician-queries";
import { useCooldown } from "@/hooks/use-cooldown";
import type {
  TechnicianResponse,
  UpdateTechnicianRequest,
} from "@/model/technician-model";
import { MAX_FILE_SIZE } from "@/types/type";
import { TechnicianValidation } from "@/validation/technician-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  AlertTriangle,
  FileImage,
  Loader2,
  PenLine,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { updateTechnicianMutation } = useTechnicianQueries();
  const {
    mutateAsync: updateTechnician,
    isPending,
    isError,
    error,
    reset,
  } = updateTechnicianMutation;

  const { cooldown, startCooldown } = useCooldown(
    "edit_technician",
    "ratelimit_",
  );

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;

  // Track state
  const [prevTechId, setPrevTechId] = useState(technician.id);
  const [preview, setPreview] = useState<string | null>(
    technician.signature_url || null,
  );
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (technician.id !== prevTechId) {
    setPrevTechId(technician.id);
    setPreview(technician.signature_url || null);
    setIsImageDeleted(false);
  }

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [technician.id]);

  type EditFormValues = Omit<UpdateTechnicianRequest, "id">;

  const formUpdate = useForm<EditFormValues>({
    resolver: zodResolver(
      TechnicianValidation.UPDATE,
    ) as Resolver<EditFormValues>,
    values: {
      name: technician?.name || "",
      is_active: technician?.is_active ?? true,
      signature: undefined,
    },
  });

  const { isDirty } = formUpdate.formState;

  const nameValue = useWatch({ control: formUpdate.control, name: "name" });
  const isActiveValue = useWatch({
    control: formUpdate.control,
    name: "is_active",
  });
  const imageValue = useWatch({
    control: formUpdate.control,
    name: "signature",
  });

  const isImageOversized =
    imageValue instanceof File && imageValue.size > MAX_FILE_SIZE;

  const isButtonDisabled =
    !nameValue ||
    isActiveValue === undefined ||
    isImageOversized ||
    isPending ||
    cooldown > 0;

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
    setIsImageDeleted(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: EditFormValues) => {
    try {
      await updateTechnician({
        id: technician.id,
        ...data,
        delete_image: isImageDeleted,
      });

      setIsImageDeleted(false);
      formUpdate.reset(data);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (onSuccess) onSuccess();
    } catch {
      // Handle by Hook
    }
  };

  useEffect(() => {
    if (isRateLimited) {
      const message = error.response?.data?.errors || "";
      const match = message.match(/(\d+)/);
      const seconds = match ? parseInt(match[1]) : 60;

      if (cooldown === 0) {
        startCooldown(seconds);
        reset();
      }
    }
  }, [isRateLimited, error, cooldown, startCooldown, reset]);

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-8";
  const labelStyle =
    "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  return (
    <Form {...formUpdate}>
      <form
        onSubmit={(e) => void formUpdate.handleSubmit(onSubmit)(e)}
        className="flex flex-col h-full"
      >
        <div
          className="flex-1 overflow-y-auto px-6 py-6 
            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-primary/20 
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-primary
            transition-colors"
        >
          <div className="grid gap-5">
            {(cooldown > 0 || isRateLimited) && (
              <div className="flex justify-center gap-2 mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-300">
                <div className="space-y-1 flex flex-col justify-center items-center">
                  <AlertTriangle className="h-7 w-7 shrink-0" />
                  <p className="font-semibold text-xs uppercase">
                    {t("technicians_management.forms.common.action_paused")}
                  </p>
                  <p
                    className="text-xs opacity-90"
                    dangerouslySetInnerHTML={{
                      __html: t(
                        "technicians_management.forms.common.too_many_attempts",
                      ).replace(
                        "{{seconds}}",
                        String(cooldown).padStart(2, "0"),
                      ),
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <h3 className="text-base font-semibold tracking-tight">
                {t("technicians_management.forms.edit.general_title")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("technicians_management.forms.edit.general_desc")}
              </p>
            </div>

            <FormField
              control={formUpdate.control}
              name="name"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0">
                  <FormLabel className={labelStyle}>
                    {t("technicians_management.forms.edit.name_label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder={t(
                        "technicians_management.forms.edit.name_placeholder",
                      )}
                      className={inputStyle}
                      {...field}
                      disabled={isPending}
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
                    {t("technicians_management.forms.edit.signature_label")}
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
                        disabled={isPending}
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
                                {t(
                                  "technicians_management.forms.edit.upload_prompt",
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t(
                                  "technicians_management.forms.edit.upload_format",
                                )}
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
                                {t(
                                  "technicians_management.forms.edit.click_to_change",
                                )}
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
                                disabled={isPending}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center px-4">
                              {isImageOversized ? (
                                <div className="flex items-center gap-2 bg-destructive/90 backdrop-blur-sm text-destructive-foreground px-3 py-1.5 rounded-full shadow-lg border border-white/10">
                                  <X className="w-3.5 h-3.5" />
                                  <span className="text-[10px] font-medium tracking-wide">
                                    {t(
                                      "technicians_management.forms.edit.file_too_large",
                                    )}
                                  </span>
                                </div>
                              ) : imageValue instanceof File ? (
                                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
                                  <span className="text-[10px] font-medium tracking-wide">
                                    {t(
                                      "technicians_management.forms.edit.bg_remove_auto",
                                    )}
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
                                  : t(
                                      "technicians_management.forms.edit.current_image",
                                    )}
                              </p>
                              <p
                                className={`text-xs absolute -bottom-4 left-0 ${isImageOversized ? "text-destructive font-semibold" : "text-muted-foreground"}`}
                              >
                                {imageValue instanceof File
                                  ? formatBytes(imageValue.size)
                                  : t(
                                      "technicians_management.forms.edit.click_to_replace",
                                    )}
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
                    <FormLabel className="text-base">
                      {t("technicians_management.forms.edit.active_status")}
                    </FormLabel>
                    <FormDescription>
                      {t(
                        "technicians_management.forms.edit.active_status_desc",
                      )}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
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
              disabled={isPending}
            >
              {t("technicians_management.forms.edit.btn_reset")}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className="w-1/4 text-sm font-semibold shadow-sm cursor-pointer text-foreground duration-300"
              onClick={onCancel}
              disabled={isPending}
            >
              {t("technicians_management.forms.edit.btn_cancel")}
            </Button>
          )}

          <Button
            size="sm"
            className="w-1/3 text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer text-foreground duration-300"
            type="submit"
            disabled={isButtonDisabled || (!isDirty && !isImageDeleted)}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              t("technicians_management.forms.edit.btn_save")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
