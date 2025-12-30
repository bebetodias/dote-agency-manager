
import React from 'react';
import { X, Search } from 'lucide-react';

// --- TYPOGRAPHY HELPERS ---
// Fix: Added optional children to satisfy compiler in some environments where JSX children aren't correctly mapped to props
export const Heading = ({ children, className = "", level = 1 }: { children?: React.ReactNode, className?: string, level?: 1 | 2 | 3 }) => {
  const styles = {
    1: "text-4xl font-black uppercase tracking-tighter text-gray-900 leading-none",
    2: "text-2xl font-black uppercase tracking-tight text-gray-900 leading-tight",
    3: "text-lg font-black uppercase tracking-tight text-gray-900"
  };
  // Fix: use a specific union of allowed string literals to avoid JSX namespace issues and broad typing (string | number | symbol)
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  return <Tag className={`${styles[level]} ${className}`}>{children}</Tag>;
};

// Fix: Added optional children to satisfy compiler
export const Label = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <span className={`text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1 ${className}`}>
    {children}
  </span>
);

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-95";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primaryDark shadow-lg shadow-red-500/20",
    ghost: "hover:bg-gray-100 text-gray-500 hover:text-gray-900",
    outline: "border-2 border-gray-100 bg-white hover:border-primary hover:text-primary text-gray-700 shadow-sm",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-100",
    white: "bg-white text-gray-900 hover:bg-gray-50 shadow-xl"
  };

  const sizes = {
    sm: "h-9 px-4 text-[9px] rounded-xl",
    md: "h-11 px-6 text-[10px] rounded-xl",
    lg: "h-14 px-8 text-xs rounded-2xl",
    xl: "h-16 px-10 text-sm rounded-2xl"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  icon?: React.ElementType;
  multiline?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, multiline, className = '', ...props }) => {
  const inputStyles = `flex w-full rounded-2xl border-2 border-gray-100 bg-gray-50/30 text-gray-900 px-6 py-3 text-sm font-bold ring-offset-white placeholder:text-gray-300 focus-visible:outline-none focus-visible:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50 ${Icon ? 'pl-14' : ''} ${className}`;
  
  return (
    <div className="space-y-1 w-full">
      {label && <Label>{label}</Label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none flex items-center justify-center">
            <Icon size={20} />
          </div>
        )}
        {multiline ? (
          <textarea 
            className={`${inputStyles} min-h-[120px] py-5`} 
            {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>} 
          />
        ) : (
          <input
            className={`${inputStyles} h-14`}
            {...props as React.InputHTMLAttributes<HTMLInputElement>}
          />
        )}
      </div>
    </div>
  );
};

// --- SEARCH INPUT ---
export const SearchInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <div className="relative w-full">
    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
    <input 
      {...props}
      className="w-full h-14 pl-14 pr-6 bg-white rounded-2xl border-2 border-gray-100 text-sm font-bold focus:border-primary outline-none transition-all shadow-sm"
    />
  </div>
);

// --- CARD ---
// Fix: Added optional children to satisfy compiler
export const Card: React.FC<{ children?: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`rounded-[2rem] border-2 border-gray-100 bg-white text-gray-900 shadow-sm transition-all overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-2xl hover:border-primary/10' : ''} ${className}`}
  >
    {children}
  </div>
);

// --- MODAL ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode; // Fix: Added optional children to satisfy compiler
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, className = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className={`relative w-full ${className} rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-gray-50 p-8 shrink-0 bg-white">
          <Heading level={2}>{title}</Heading>
          <button onClick={onClose} className="rounded-2xl p-3 text-gray-300 hover:bg-gray-50 hover:text-primary transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-10 overflow-y-auto bg-white custom-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end gap-4 border-t border-gray-50 p-8 bg-gray-50 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- BADGE ---
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    variant?: 'default' | 'outline' | 'red' | 'green' | 'blue' | 'orange';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', ...props }) => {
    const styles = {
        default: "bg-gray-900 text-white border-transparent",
        outline: "text-gray-500 border-gray-100 bg-white",
        red: "bg-red-50 text-red-600 border-red-100",
        green: "bg-green-50 text-green-600 border-green-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100"
    };
    return (
        <div 
            className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] transition-colors ${styles[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
