'use client'

interface Step {
  number: number
  label: string
  sublabel: string
}

const STEPS: Step[] = [
  { number: 1, label: 'Sua Foto', sublabel: 'Upload' },
  { number: 2, label: 'Peça', sublabel: 'Seleção' },
  { number: 3, label: 'Look', sublabel: 'Geração' },
]

interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, index) => {
        const isActive = step.number === currentStep
        const isComplete = step.number < currentStep

        return (
          <div key={step.number} className="flex items-center">
            {/* Step */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isComplete
                    ? 'bg-navy-900 text-cream'
                    : isActive
                    ? 'bg-cream border-2 border-navy-900 text-navy-900'
                    : 'bg-sand-100 border border-sand-300 text-sand-400'
                }`}
              >
                {isComplete ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7L6 11L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="font-mono text-xs font-medium">{step.number}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-label transition-colors duration-300 ${isActive ? 'text-navy-900' : isComplete ? 'text-sand-500' : 'text-sand-300'}`}
                  style={{ fontSize: '0.6rem' }}>
                  {step.sublabel}
                </p>
                <p className={`font-serif text-xs mt-0.5 transition-colors duration-300 ${isActive ? 'text-navy-900 font-medium' : isComplete ? 'text-sand-500' : 'text-sand-300'}`}>
                  {step.label}
                </p>
              </div>
            </div>

            {/* Connector */}
            {index < STEPS.length - 1 && (
              <div className="mx-4 mb-6 relative w-16 md:w-24">
                <div className="h-px bg-sand-200 absolute top-0 left-0 right-0" />
                <div
                  className="h-px bg-navy-900 absolute top-0 left-0 transition-all duration-700"
                  style={{ width: isComplete ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
