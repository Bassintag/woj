import { Step } from "@/features/recipe/domain/Recipe";

export interface StepListProps {
  steps: Step[];
}

export const StepList = ({ steps }: StepListProps) => {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <StepListRow key={step.id} step={step} index={i} />
      ))}
    </ol>
  );
};

export interface StepListRowProps {
  step: Step;
  index: number;
}

export const StepListRow = ({ step, index }: StepListRowProps) => {
  return (
    <li>
      <h3 className="text-sm text-stone-400 font-semibold">
        Etape {index + 1}
      </h3>
      <p className="whitespace-pre-wrap">{step.description}</p>
    </li>
  );
};
