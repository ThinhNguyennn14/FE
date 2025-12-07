import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-dark-text-primary">
          {label}
        </label>
      )}
      <textarea
        className="w-full px-3 py-2.5 text-sm text-gray-700 dark:text-dark-text-primary bg-white dark:bg-dark-bg-tertiary border border-gray-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-dark-neon-blue focus:border-transparent placeholder-gray-400 dark:placeholder-dark-text-muted transition-all min-h-[100px] resize-y"
        {...props}
      />
    </div>
  );
};

export default TextArea;