import { useParams } from "react-router-dom";

export const useIdParam = () => {
  const { id } = useParams<{ id: string }>();
  return parseInt(id as string);
};
