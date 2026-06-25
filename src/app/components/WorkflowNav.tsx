import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useWorkbench } from './WorkbenchContext';
import { WORKFLOW_STEPS, getStepForPath } from '../workflow';

interface WorkflowNavProps {
  onNext?: () => Promise<boolean> | boolean;
  nextDisabled?: boolean;
  nextDisabledReason?: string;
  warnOnBack?: boolean;
  nextLabel?: string;
}

export function WorkflowNav({
  onNext,
  nextDisabled = false,
  nextDisabledReason,
  warnOnBack = false,
  nextLabel,
}: WorkflowNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, saveWorkspace } = useWorkbench();
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);

  const currentStep = getStepForPath(location.pathname, location.search);
  if (!currentStep) return null;

  const currentIndex = WORKFLOW_STEPS.findIndex(s => s.n === currentStep.n);
  const prevStep = currentIndex > 0 ? WORKFLOW_STEPS[currentIndex - 1] : undefined;
  const nextStep = currentIndex < WORKFLOW_STEPS.length - 1 ? WORKFLOW_STEPS[currentIndex + 1] : undefined;

  const handleBack = () => {
    if (!prevStep) return;
    if (warnOnBack && state.azure.unsavedChanges) {
      setUnsavedDialogOpen(true);
    } else {
      navigate(prevStep.navPath);
    }
  };

  const handleNext = async () => {
    if (!nextStep) return;
    setNextLoading(true);
    try {
      if (onNext) {
        const ok = await onNext();
        if (ok) navigate(nextStep.navPath);
      } else {
        navigate(nextStep.navPath);
      }
    } finally {
      setNextLoading(false);
    }
  };

  const derivedNextLabel = nextLabel ?? (nextStep ? `${nextStep.name} →` : '');

  return (
    <>
      <div className="sticky bottom-0 z-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0">
        <div>
          {prevStep ? (
            <Button variant="outline" onClick={handleBack} className="gap-1.5">
              <ChevronLeft className="size-4" />
              {prevStep.name}
            </Button>
          ) : (
            <div />
          )}
        </div>

        <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
          Step {currentStep.n} of {WORKFLOW_STEPS.length}
        </span>

        <div>
          {nextStep ? (
            nextDisabled ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button disabled className="gap-1.5 opacity-50 cursor-not-allowed">
                        {derivedNextLabel}
                        <ChevronRight className="size-4" />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {nextDisabledReason && (
                    <TooltipContent side="top">
                      <p>{nextDisabledReason}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button
                onClick={handleNext}
                disabled={nextLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
              >
                {derivedNextLabel}
                <ChevronRight className="size-4" />
              </Button>
            )
          ) : (
            <div />
          )}
        </div>
      </div>

      <Dialog open={unsavedDialogOpen} onOpenChange={setUnsavedDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes in the estimation. What would you like to do?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setUnsavedDialogOpen(false)}
              className="sm:order-1"
            >
              Stay Here
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setUnsavedDialogOpen(false);
                if (prevStep) navigate(prevStep.navPath);
              }}
              className="sm:order-2"
            >
              Discard &amp; Go Back
            </Button>
            <Button
              onClick={() => {
                saveWorkspace();
                setUnsavedDialogOpen(false);
                if (prevStep) navigate(prevStep.navPath);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white sm:order-3"
            >
              Save &amp; Go Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
