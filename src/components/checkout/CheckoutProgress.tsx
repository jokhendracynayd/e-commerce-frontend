'use client';

interface CheckoutProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const CheckoutProgress = ({ currentStep, totalSteps = 2 }: CheckoutProgressProps) => {
  const steps = [
    { number: 1, title: 'Information', description: 'Delivery & Billing Details' },
    { number: 2, title: 'Payment', description: 'Payment Method & Processing' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] p-4 sm:p-6 border border-gray-100 dark:border-gray-700 rounded-lg mb-6 sm:mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {currentStep > step.number ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              
              {/* Step Info */}
              <div className="mt-2 text-center">
                <div className={`text-xs sm:text-sm font-medium ${
                  currentStep >= step.number
                    ? 'text-[#ed875a] dark:text-[#ed8c61]'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 sm:mx-4 mt-5">
                <div 
                  className={`h-full transition-all duration-300 ${
                    currentStep > step.number
                      ? 'bg-gradient-to-r from-[#ed875a] to-[#ed8c61]'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Current Step Description */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h3 className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
            Step {currentStep} of {totalSteps}: {steps[currentStep - 1]?.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            {steps[currentStep - 1]?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProgress;
