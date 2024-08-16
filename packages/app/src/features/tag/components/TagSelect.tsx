import { useTags } from "@/features/tag/hooks/useTags";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/Button";
import { TagIcon } from "lucide-react";
import { Drawer, DrawerTitle } from "@/components/Drawer";
import { TagLabel } from "@/features/tag/components/TagLabel";
import { Checkbox } from "@/components/Checkbox";

export interface TagSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const TagSelect = ({ value, onChange }: TagSelectProps) => {
  const { data: tags } = useTags();

  const handleToggle = (id: string) => {
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
        <Button colorScheme="white" size="lg">
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
