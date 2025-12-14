import { StepDto } from "@woj/common/dto";

export interface StepListProps {
  steps: StepDto[];
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
  step: StepDto;
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
