import { fetchApi } from "@/utils/fetchApi";
import { CreateMenu, Menu } from "@/features/menu/domain/Menu";
import { useMutation } from "@tanstack/react-query";

export const createMenu = (body: CreateMenu) => {
  return fetchApi<Menu>("menus", {
    method: "POST",
    json: body,
  });
};

export const useCreateMenu = () => {
  return useMutation({
    mutationFn: createMenu,
  });
};
