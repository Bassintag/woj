import { Button } from "@/components/Button";
import { ForkKnifeIcon, MinusIcon, PlusIcon } from "lucide-react";

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export const QuantitySelector = ({
  value,
  onChange,
  max,
}: QuantitySelectorProps) => {
  return (
    <div className="flex flex-row items-center gap-6">
      <Button
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className="shadow-lg"
        colorScheme="white"
        size="lg"
      >
        <MinusIcon />
      </Button>
      <div className="flex flex-row gap-3 items-center">
        <ForkKnifeIcon className="size-6" />
        <span className="font-semibold">{value}</span>
      </div>
      <Button
        disabled={max != null && value >= max}
        onClick={() => onChange(value + 1)}
        className="shadow-lg"
        colorScheme="white"
        size="lg"
      >
        <PlusIcon />
      </Button>
    </div>
  );
};
