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
import type { CreateTechnicianRequest } from "@/model/technician-model";
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

interface CreateTechnicianFormProps {
  onSuccess?: () => void;
}

export function CreateTechnicianForm({ onSuccess }: CreateTechnicianFormProps) {
  const { t } = useTranslation();
  const { createMutation } = useTechnicianQueries();
  const {
    mutateAsync: createTechnician,
    isPending,
    isError,
    error,
    reset,
  } = createMutation;

  const { cooldown, startCooldown } = useCooldown(
    "create_technician",
    "ratelimit_",
  );

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formCreate = useForm<CreateTechnicianRequest>({
    resolver: zodResolver(
      TechnicianValidation.CREATE,
    ) as Resolver<CreateTechnicianRequest>,
    mode: "onChange",
    defaultValues: {
      name: "",
      is_active: true,
      signature: undefined,
    },
  });

  const { isSubmitting, isDirty } = formCreate.formState;

  const nameValue = useWatch({
    control: formCreate.control,
    name: "name",
  });
  const signatureValue = useWatch({
    control: formCreate.control,
    name: "signature",
  });

  const isImageOversized =
    signatureValue instanceof File && signatureValue.size > MAX_FILE_SIZE;

  const isButtonDisabled =
    isSubmitting || !nameValue || isImageOversized || isPending || cooldown > 0;

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | undefined) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
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
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    formCreate.reset();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: CreateTechnicianRequest) => {
    try {
      await createTechnician(data);

      formCreate.reset();
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
    <Form {...formCreate}>
      <form
        onSubmit={(e) => void formCreate.handleSubmit(onSubmit)(e)}
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
                {t("technicians_management.forms.create.identity_title")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("technicians_management.forms.create.identity_desc")}
              </p>
            </div>

            <FormField
              control={formCreate.control}
              name="name"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0">
                  <FormLabel className={labelStyle}>
                    {t("technicians_management.forms.create.full_name")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder={t(
                        "technicians_management.forms.create.name_placeholder",
                      )}
                      className={inputStyle}
                      {...field}
                      disabled={isSubmitting || isPending}
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={formCreate.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-input/20 p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className={labelStyle}>
                      {t("technicians_management.forms.create.active_status")}
                    </FormLabel>
                    <FormDescription className="text-[10px]">
                      {t(
                        "technicians_management.forms.create.active_status_desc",
                      )}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting || isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="mt-2">
              <h3 className="text-base font-semibold tracking-tight">
                {t("technicians_management.forms.create.signature_title")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("technicians_management.forms.create.signature_desc")}
              </p>
            </div>

            <FormField
              control={formCreate.control}
              name="signature"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel className={labelStyle}>
                    {t("technicians_management.forms.create.signature_label")}
                  </FormLabel>
                  <FormControl>
                    <div className="w-full max-w-100mx-auto">
                      <Input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) => handleImageChange(e, field.onChange)}
                        disabled={isSubmitting || isPending}
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
                                  "technicians_management.forms.create.upload_prompt",
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t(
                                  "technicians_management.forms.create.upload_format",
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
                            <div className="absolute inset-0 bg-white"></div>

                            <img
                              src={preview}
                              alt="Signature Preview"
                              className="relative h-full w-full object-contain z-10 p-4"
                            />

                            <div className="absolute inset-0 z-20 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <PenLine className="w-8 h-8 text-white mb-2" />
                              <span className="text-white text-xs font-medium">
                                {t(
                                  "technicians_management.forms.create.click_to_change",
                                )}
                              </span>
                            </div>

                            <div className="absolute top-2 right-2 flex gap-1 z-30">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6 rounded-md shadow-sm transition-transform hover:scale-110 cursor-pointer"
                                onClick={(e) =>
                                  handleRemoveImage(e, field.onChange)
                                }
                                disabled={isSubmitting || isPending}
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
                                      "technicians_management.forms.create.file_too_large",
                                    )}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
                                  <span className="text-[10px] font-medium tracking-wide">
                                    {t(
                                      "technicians_management.forms.create.transparent_check",
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-1.5 bg-card border-t z-30 relative">
                            <div
                              className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isImageOversized
                                  ? "bg-destructive/10"
                                  : "bg-background"
                              }`}
                            >
                              <FileImage
                                className={`h-4 w-4 ${
                                  isImageOversized
                                    ? "text-destructive"
                                    : "text-foreground"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-xs font-medium truncate ${
                                  isImageOversized
                                    ? "text-destructive"
                                    : "text-foreground"
                                }`}
                              >
                                {signatureValue instanceof File
                                  ? signatureValue.name
                                  : t(
                                      "technicians_management.forms.create.signature_file",
                                    )}
                              </p>
                              <p
                                className={`text-xs absolute -bottom-4 left-0 ${
                                  isImageOversized
                                    ? "text-destructive font-semibold"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {signatureValue instanceof File
                                  ? formatBytes(signatureValue.size)
                                  : t(
                                      "technicians_management.forms.create.click_to_replace",
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
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t bg-background mt-auto">
          {isDirty ? (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className="w-1/4 text-sm font-semibold shadow-sm cursor-pointer text-foreground duration-300"
              onClick={handleReset}
              disabled={isSubmitting || isPending}
            >
              {t("technicians_management.forms.create.btn_reset")}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className="w-1/4 text-sm font-semibold shadow-sm cursor-pointer text-foreground duration-300"
              disabled={isSubmitting || isPending}
            >
              {t("technicians_management.forms.create.btn_cancel")}
            </Button>
          )}

          <Button
            size="sm"
            className="w-1/3 text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer text-foreground duration-300"
            type="submit"
            disabled={isButtonDisabled}
          >
            {isPending || isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              t("technicians_management.forms.create.btn_save")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
