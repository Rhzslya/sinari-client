import { api } from "@/lib/axios";
import {
  toStoreSettingResponse,
  type ApiResponse,
  type StoreSettingResponse,
  type UpdateStoreSettingRequest,
} from "@/model/store-setting-model";
import { StoreSettingValidation } from "@/validation/store-setting-validation";
import { Validation } from "@/validation/validation";

export class StoreSettingService {
  static async update(
    request: UpdateStoreSettingRequest,
  ): Promise<StoreSettingResponse> {
    const updateRequest = Validation.validate(
      StoreSettingValidation.UPDATE,
      request,
    );

    const response = await api.patch<ApiResponse<StoreSettingResponse>>(
      "/store-setting",
      updateRequest,
    );

    return toStoreSettingResponse(response.data.data);
  }

  static async get(): Promise<StoreSettingResponse> {
    const response =
      await api.get<ApiResponse<StoreSettingResponse>>("/store-setting");

    return toStoreSettingResponse(response.data.data);
  }
}
