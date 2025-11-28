import React from 'react';
import { Link } from 'react-router-dom';
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = ''
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-light-blue-500 text-white hover:bg-light-blue-600 focus:ring-light-blue-400',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  };
  const sizes = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-2.5 px-5 text-lg'
  };
  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  // If it's a link, render a router Link (disabled not supported for links)
  if (href) {
    return <Link to={href} className={buttonClasses}>
        {children}
      </Link>;
  }

  const finalClasses = disabled ? `${buttonClasses} opacity-50 cursor-not-allowed` : buttonClasses;
  return <button type={type} onClick={onClick} disabled={disabled} className={finalClasses}>
      {children}
    </button>;
};
export default Button;