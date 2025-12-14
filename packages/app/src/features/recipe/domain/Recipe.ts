import { PageableQuery } from "@/domain/Page";

export interface GetRecipePageQuery extends PageableQuery {
  search?: string;
}
