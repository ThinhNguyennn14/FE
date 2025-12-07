import React, { useState } from 'react';
import { X, Mail, ShieldCheck } from 'lucide-react';

interface ForgotPasswordModalProps {
  onClose: () => void;
  onSend: (email: string) => Promise<void> | void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose, onSend }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-orange-500 text-white">
          <h3 className="font-bold text-lg">Forgot Password</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Vui lòng nhập địa chỉ email bạn đã đăng ký. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
          </p>

          <div className="relative group">
            <Mail size={18} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="email" placeholder="Email Address" 
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none transition" 
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 shadow-md transition flex items-center"
            >
              <ShieldCheck size={16} className="mr-2" /> Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;