import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ElementType; 
}

const Input: React.FC<InputProps> = ({ label, icon: Icon, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block mb-2 text-sm font-semibold text-[#2B3674] dark:text-dark-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-primary dark:text-dark-neon-blue">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`
            w-full py-3 ${Icon ? 'pl-11' : 'pl-4'} pr-4 
            text-sm text-[#2B3674] dark:text-dark-text-primary font-medium
            bg-white dark:bg-dark-bg-tertiary
            border border-gray-200 dark:border-dark-border
            rounded-xl 
            placeholder-gray-400 dark:placeholder-dark-text-muted
            focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-neon-blue focus:border-transparent 
            transition-all duration-200
            disabled:bg-gray-50 dark:disabled:bg-dark-bg-secondary disabled:text-gray-500 dark:disabled:text-dark-text-muted
          `}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;