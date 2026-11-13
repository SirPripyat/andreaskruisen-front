import { useState } from 'react';

type Step<TStepId extends string> = { id: TStepId };

export const useStepNavigation = <TStepId extends string>(
  steps: readonly Step<TStepId>[],
  validateStep: (stepId: TStepId) => Promise<boolean>,
) => {
  const [currentStep, setCurrentStep] = useState<TStepId>(steps[0].id);
  const [furthestStepIndex, setFurthestStepIndex] = useState(0);

  const stepIndex = (step: TStepId) =>
    steps.findIndex((candidate) => candidate.id === step);

  const goToStep = (step: TStepId) => {
    if (stepIndex(step) <= furthestStepIndex) setCurrentStep(step);
  };

  const goBack = () => {
    const previous = steps[stepIndex(currentStep) - 1];
    if (previous) setCurrentStep(previous.id);
  };

  const goNext = () => {
    const index = stepIndex(currentStep);
    validateStep(currentStep).then((valid) => {
      if (!valid) return;
      const next = steps[index + 1];
      if (!next) return;
      setCurrentStep(next.id);
      setFurthestStepIndex((furthest) => Math.max(furthest, index + 1));
    });
  };

  const resetSteps = () => {
    setCurrentStep(steps[0].id);
    setFurthestStepIndex(0);
  };

  return {
    currentStep,
    furthestStepIndex,
    goToStep,
    goBack,
    goNext,
    resetSteps,
    isFirstStep: currentStep === steps[0].id,
    isLastStep: currentStep === steps[steps.length - 1].id,
  };
};
