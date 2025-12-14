import { fetchApi } from "@/utils/fetchApi";
import { CreateMenuDto, MenuDto } from "@/features/menu/domain/Menu";
import { useMutation } from "@tanstack/react-query";

export const createMenu = (body: CreateMenuDto) => {
  return fetchApi<MenuDto>("menus", {
    method: "POST",
    json: body,
  });
};

export const useCreateMenu = () => {
  return useMutation({
    mutationFn: createMenu,
  });
};
