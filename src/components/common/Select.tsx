import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, placeholder, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-dark-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className="w-full px-3 py-2.5 text-sm text-gray-700 dark:text-dark-text-primary bg-white dark:bg-dark-bg-tertiary border border-gray-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-dark-neon-blue focus:border-transparent appearance-none transition-all"
          {...props}
        >
          <option value="">
            {placeholder || `-- Chọn ${label ? label.toLowerCase() : 'giá trị'} --`}
          </option>
          
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Mũi tên icon */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
};

export default Select;