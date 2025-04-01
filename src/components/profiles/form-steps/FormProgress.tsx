'use client';

import * as React from 'react';

interface Step {
  id: string;
  title: string;
}

interface FormProgressProps {
  steps: Step[];
  currentStep: number;
}

export function FormProgress({ steps, currentStep }: FormProgressProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex flex-col items-center ${
              index <= currentStep ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div
              className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                index <= currentStep
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground bg-background'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm font-medium">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 