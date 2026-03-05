import { fetchApi } from "@/utils/fetchApi";
import { mutationOptions } from "@tanstack/react-query";
import { CreateMenuDto, MenuDto } from "@woj/common/dto";

export const createMenuOptions = () => {
  return mutationOptions({
    mutationFn: (body: CreateMenuDto) => {
      return fetchApi<MenuDto>("menus", {
        method: "POST",
        json: body,
      });
    },
  });
};
