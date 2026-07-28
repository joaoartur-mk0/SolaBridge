import { Check } from "lucide-react";
import { cn } from "../../utils/cn";

export type StepperStep = {
  id: string;
  label: string;
};

type StepperProps = {
  steps: StepperStep[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
};

export function Stepper({ steps, currentStepIndex, onStepClick }: StepperProps) {
  return (
    <div>
      <ol className="hidden items-center sm:flex">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isClickable = Boolean(onStepClick) && index <= currentStepIndex;

          return (
            <li key={step.id} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => onStepClick?.(index)}
                className={cn(
                  "flex items-center gap-2 text-left",
                  isClickable ? "cursor-pointer" : "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition",
                    isCompleted && "border-brand bg-brand text-slate-50",
                    isCurrent && "border-brand text-brand-light",
                    !isCompleted && !isCurrent && "border-slate-700 text-slate-500"
                  )}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>

                <span
                  className={cn(
                    "whitespace-nowrap text-sm font-medium",
                    isCurrent ? "text-slate-100" : "text-slate-500"
                  )}
                >
                  {step.label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <span
                  className={cn(
                    "mx-3 h-px flex-1",
                    isCompleted ? "bg-brand" : "bg-slate-800"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="sm:hidden">
        <p className="text-sm font-medium text-slate-200">
          Passo {currentStepIndex + 1} de {steps.length}
          <span className="text-slate-500"> — {steps[currentStepIndex].label}</span>
        </p>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-1.5 rounded-full bg-brand transition-all"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
