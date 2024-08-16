import { useParams } from "react-router-dom";

export const useIdParam = () => {
  const { id } = useParams<{ id: string }>();
  return id as string;
};
