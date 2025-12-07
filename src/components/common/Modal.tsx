import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 no-print">
      {/* Overlay: Backdrop blur & Darken */}
      <div 
        className="absolute inset-0 bg-[#2B3674]/30 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-dark-bg-secondary rounded-[20px] shadow-2xl dark:shadow-card-dark transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200 border border-transparent dark:border-dark-border">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-dark-border">
          <h3 className="text-xl font-bold text-[#2B3674] dark:text-dark-text-primary">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 dark:text-dark-text-muted dark:hover:text-red-500 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar text-[#2B3674] dark:text-dark-text-secondary">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;