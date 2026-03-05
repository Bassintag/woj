import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Drawer, DrawerTitle } from "@/components/Drawer";
import { TagLabel } from "@/features/tag/components/TagLabel";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { TagIcon } from "lucide-react";
import { tagsOptions } from "../queries";

export interface TagSelectProps {
  value: number[];
  onChange: (value: number[]) => void;
}

export const TagSelect = ({ value, onChange }: TagSelectProps) => {
  const { data: tags } = useQuery(tagsOptions());

  const handleToggle = (id: number) => {
    const copy = [...value];
    const index = copy.indexOf(id);
    if (index >= 0) {
      copy.splice(index, 1);
    } else {
      copy.push(id);
    }
    onChange(copy);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button colorScheme="white">
          <TagIcon />
        </Button>
      </DialogTrigger>
      <Drawer className="flex flex-col gap-6 container">
        <DrawerTitle>Tags</DrawerTitle>
        <ul className="flex flex-col gap-3">
          {tags?.map((tag) => (
            <li key={tag.id} className="flex flex-row items-center gap-3">
              <Checkbox
                checked={value.includes(tag.id)}
                onCheckedChange={() => handleToggle(tag.id)}
              />
              <TagLabel tag={tag} />
            </li>
          ))}
        </ul>
      </Drawer>
    </Dialog>
  );
};
