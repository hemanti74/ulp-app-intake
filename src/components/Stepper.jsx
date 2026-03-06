import { Check } from 'lucide-react';

export default function Stepper({ steps, currentStep }) {
  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={index} style={{ display: 'contents' }}>
            <div className="stepper-step">
              <div
                className={`stepper-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                {isCompleted ? <Check size={16} /> : index + 1}
              </div>
              <span
                className={`stepper-label ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`stepper-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
