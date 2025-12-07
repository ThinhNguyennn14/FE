import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'outline' | 'success' | 'neon'; // Thêm variant 'neon'
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "flex items-center justify-center px-5 py-2.5 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm transform active:scale-[0.98]";
  
  const variants = {
   
    primary: "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/30 focus:ring-primary dark:bg-dark-neon-blue dark:hover:bg-dark-neon-blue/80 dark:shadow-neon-blue dark:text-dark-bg-primary dark:focus:ring-dark-neon-blue dark:focus:ring-offset-dark-bg-primary",
    
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 focus:ring-red-500 dark:shadow-none",
   
    success: "bg-[#05CD99] hover:bg-[#04B78A] text-white shadow-lg shadow-[#05CD99]/20 focus:ring-[#05CD99] dark:shadow-none",
  
    outline: "bg-transparent border-2 border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary hover:border-gray-300 dark:hover:border-dark-neon-blue/50 transition-colors",
    
    neon: "bg-white text-primary border-2 border-transparent hover:bg-gray-50 dark:bg-transparent dark:border-dark-neon-blue dark:text-dark-neon-blue dark:hover:bg-dark-neon-blue/10 dark:shadow-neon-blue"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {icon && <span className={children ? "mr-2" : ""}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;