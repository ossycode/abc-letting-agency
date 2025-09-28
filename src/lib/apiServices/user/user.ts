import { axiosClient } from "@/lib/axiosClient";
import { ApiResult } from "@/types/shared";
import {
  ChangePasswordRequest,
  DeleteMeRequest,
  UpdateMeRequest,
  User,
} from "@/types/user";

export const userApi = {
  getMe: async () => {
    const res = await axiosClient.get<User>("/api/user");
    return res.data;
  },

  updateMe: async (payload: UpdateMeRequest) => {
    await axiosClient.patch<void>("/api/user", payload);
  },

  changePassword: async (payload: ChangePasswordRequest) => {
    await axiosClient.put<void>("/api/user/password", payload);
  },

  deleteMe: async (payload: DeleteMeRequest) => {
    await axiosClient.delete<ApiResult<unknown>>("/api/user", {
      data: payload,
    });
  },
};
