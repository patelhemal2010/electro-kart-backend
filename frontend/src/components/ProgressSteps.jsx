import { FaCheck, FaUser, FaTruck, FaReceipt } from "react-icons/fa";

const ProgressSteps = ({ step1, step2, step3 }) => {
  const steps = [
    { id: 1, name: "Login", icon: FaUser, completed: step1 },
    { id: 2, name: "Shipping", icon: FaTruck, completed: step2 },
    { id: 3, name: "Summary", icon: FaReceipt, completed: step3 },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-500 ease-in-out"
            style={{ 
              width: step3 ? '100%' : step2 ? '66%' : step1 ? '33%' : '0%' 
            }}
          />
        </div>

        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            {/* Step Circle */}
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm
              transition-all duration-300 ease-in-out
              ${step.completed 
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg shadow-pink-500/30' 
                : 'bg-gray-300 text-gray-600'
              }
            `}>
              {step.completed ? (
                <FaCheck className="text-lg" />
              ) : (
                <step.icon className="text-lg" />
              )}
            </div>

            {/* Step Label */}
            <div className={`
              mt-3 text-sm font-medium transition-colors duration-300
              ${step.completed ? 'text-pink-600' : 'text-gray-500'}
            `}>
              {step.name}
            </div>

            {/* Step Number */}
            <div className={`
              mt-1 text-xs transition-colors duration-300
              ${step.completed ? 'text-pink-500' : 'text-gray-400'}
            `}>
              Step {step.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
