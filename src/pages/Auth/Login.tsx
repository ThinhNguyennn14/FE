import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { User, Lock, Chrome, Facebook, Twitter, Loader } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import RegisterModal, { type RegisterFormData } from '../../components/RegisterModal'; 
import ForgotPasswordModal from '../../components/ForgotPasswordModal'; 

const AuthPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Khởi tạo hook điều hướng
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      
      // 1. Lưu thông tin đăng nhập
      login(data.user, data.token);

      // 2. Chuyển hướng sang trang Admin
      navigate('/admin'); 
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Đăng nhập thất bại');
      } else {
        setError('Đã xảy ra lỗi không xác định');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`Tính năng đăng nhập bằng ${provider} cần tích hợp Client ID thực tế.`);
  };

  const handleRegister = async (formData: RegisterFormData) => {
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      setIsRegisterOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Lỗi đăng ký: ${err.message}`);
      }
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      alert('Yêu cầu đã được gửi. Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.');
      setIsForgotOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Lỗi: ${err.message}. (Backend sẽ trả về thông báo chung để đảm bảo an toàn)`);
      }
    }
  };

  const UNSPLASH_IMAGE = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-400 flex items-center justify-center p-4">
      
      {/* Modals */}
      {isRegisterOpen && <RegisterModal onClose={() => setIsRegisterOpen(false)} onRegister={handleRegister} />}
      {isForgotOpen && <ForgotPasswordModal onClose={() => setIsForgotOpen(false)} onSend={handleForgotPassword} />}

      <div className="bg-white w-full max-w-4xl h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center backdrop-blur-sm">
            <Loader className="animate-spin h-10 w-10 text-blue-600" />
          </div>
        )}

        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white text-gray-800">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Member Login</h2>
          <p className="text-gray-400 mb-8 text-sm">Please fill in your basic info</p>
          
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-200 focus:border-blue-500 outline-none bg-transparent" required />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-200 focus:border-blue-500 outline-none bg-transparent" required />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              LOGIN
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              type="button" 
              onClick={() => setIsForgotOpen(true)} 
              className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Right Side: Decorative / Social Login */}
        <div className="w-full md:w-1/2 relative flex flex-col justify-center items-center text-white p-8 md:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 hover:scale-110" style={{ backgroundImage: `url(${UNSPLASH_IMAGE})` }}></div>
          <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>

          <div className="relative z-20 w-full text-center">
            <h2 className="text-3xl font-bold mb-2">Sign Up</h2>
            <p className="text-blue-100 mb-8 text-sm">Using your social media account</p>

            <div className="flex justify-center space-x-4 mb-8">
               <button type="button" onClick={() => handleSocialLogin('Google')} className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white hover:text-red-500 transition-all border border-white/30 group"><Chrome size={20} className="group-hover:scale-110 transition-transform" /></button>
               <button type="button" onClick={() => handleSocialLogin('Facebook')} className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white hover:text-blue-600 transition-all border border-white/30 group"><Facebook size={20} className="group-hover:scale-110 transition-transform" /></button>
               <button type="button" onClick={() => handleSocialLogin('Twitter')} className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white hover:text-sky-400 transition-all border border-white/30 group"><Twitter size={20} className="group-hover:scale-110 transition-transform" /></button>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-8 text-sm text-blue-100">
               <input type="checkbox" id="terms" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
               <label htmlFor="terms" className="cursor-pointer select-none">By signing up I agree with terms</label>
            </div>

            <button 
              type="button" 
              onClick={() => setIsRegisterOpen(true)}
              className="inline-block border-b border-white pb-1 hover:text-blue-200 hover:border-blue-200 transition-colors"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;