import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  Sun, Moon, Search, Bell, Menu, 
} from 'lucide-react';

const MainLayout = () => {
  const location = useLocation();
  // Logic Theme: Mặc định là 'light' (false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Apply class 'dark' vào thẻ html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Lấy tiêu đề trang dựa trên URL
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/products')) return 'Sản phẩm';
    if (path.includes('/customers')) return 'Khách hàng';
    if (path.includes('/orders')) return 'Đơn hàng';
    if (path.includes('/import')) return 'Nhập kho';
    return 'Admin Dashboard';
  };

  return (
    <div className="flex h-screen bg-[#F4F7FE] dark:bg-dark-bg-primary transition-colors duration-300">
      
      {/* Sidebar - Truyền props để control thu gọn nếu muốn */}
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* --- HEADER / NAVBAR --- */}
        <header className="h-20 px-6 flex items-center justify-between bg-white/50 dark:bg-dark-bg-secondary/50 backdrop-blur-md border-b border-white/20 dark:border-dark-border sticky top-0 z-30 transition-all no-print">
          
          {/* Left: Breadcrumbs / Title */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary lg:hidden"
            >
              <Menu size={20} />
            </button>
            
            <div className="hidden md:block">
              <p className="text-xs text-gray-500 dark:text-dark-text-muted font-medium">Pages / {getPageTitle()}</p>
              <h1 className="text-xl font-bold text-[#2B3674] dark:text-dark-text-primary mt-0.5">{getPageTitle()} Overview</h1>
            </div>
          </div>

          {/* Right: Search & Actions */}
          <div className="bg-white dark:bg-dark-bg-secondary p-2 rounded-full shadow-sm dark:shadow-card-dark flex items-center gap-2 border border-gray-100 dark:border-dark-border">
            
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-dark-text-muted" />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="bg-[#F4F7FE] dark:bg-dark-bg-primary text-sm rounded-full pl-9 pr-4 py-2 w-48 focus:w-64 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-dark-neon-blue/20 dark:text-dark-text-primary border-none placeholder-gray-400 dark:placeholder-dark-text-muted"
              />
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-primary dark:text-dark-text-secondary dark:hover:text-dark-neon-blue hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification */}
            <button className="p-2 rounded-full text-gray-500 hover:text-primary dark:text-dark-text-secondary dark:hover:text-dark-neon-blue hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-dark-bg-secondary"></span>
            </button>

            {/* Avatar */}
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-blue-500 dark:from-dark-neon-blue dark:to-dark-neon-purple p-[2px] cursor-pointer ml-1">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
                alt="Admin" 
                className="rounded-full bg-white dark:bg-dark-bg-secondary" 
              />
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
          {/* Header cho chế độ in */}
          <div className="hidden print-header">
            <h1>Báo cáo {getPageTitle()}</h1>
            <p>Ngày xuất: {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default MainLayout;