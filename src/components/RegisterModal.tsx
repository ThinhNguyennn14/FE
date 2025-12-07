import React, { useState } from 'react';
import { X, User, Mail, Lock, Save } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho form
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface RegisterModalProps {
  onClose: () => void;
  onRegister: (data: RegisterFormData) => Promise<void> | void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegister }) => {
  const [formData, setFormData] = useState<RegisterFormData>({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'STAFF' // Mặc định là STAFF hoặc USER
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    // Gọi hàm đăng ký chính
    onRegister(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-blue-500 text-white">
          <h3 className="font-bold text-lg">Create New Account</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="relative group">
            <User size={18} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="text" name="username" placeholder="Username" 
              value={formData.username} onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
              required
            />
          </div>

          <div className="relative group">
            <Mail size={18} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="email" name="email" placeholder="Email Address" 
              value={formData.email} onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
              required
            />
          </div>
          
          <div className="relative group">
            <Lock size={18} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="password" name="password" placeholder="Password" 
              value={formData.password} onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
              required
            />
          </div>

          <div className="relative group">
            <Lock size={18} className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="password" placeholder="Confirm Password" 
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition flex items-center"
            >
              <Save size={16} className="mr-2" /> Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;