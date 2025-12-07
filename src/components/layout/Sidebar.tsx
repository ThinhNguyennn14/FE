import { 
  Package, Users, ShoppingCart, 
  LogOut, Layers, BarChart2, User, X, Store 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar = ({ isOpen, toggle }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Cấu hình Menu: Đưa Cửa hàng lên đầu, Thống kê xuống cuối
  const menuItems = [
    { path: '/admin/shop', icon: Store, label: 'Cửa hàng' }, // <--- MỚI
    { path: '/admin/products', icon: Package, label: 'Sản phẩm' },
    { path: '/admin/customers', icon: Users, label: 'Khách hàng' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng' },
    { path: '/admin/import', icon: Layers, label: 'Nhập kho' },
    { path: '/admin/dashboard', icon: BarChart2, label: 'Thống kê' },
  ];

  return (
    <aside 
      className={`
        fixed lg:static inset-y-0 left-0 z-50 
        w-[280px] flex-shrink-0 bg-white dark:bg-dark-bg-secondary 
        border-r border-gray-100 dark:border-dark-border
        transition-transform duration-300 ease-in-out no-print
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-none'}
      `}
    >
      <div className="h-full flex flex-col">
        
        {/* Logo Area */}
        <div className="h-24 flex items-center justify-between px-6 border-b border-gray-100 dark:border-dark-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary dark:bg-dark-neon-blue flex items-center justify-center text-white dark:text-dark-bg-primary font-bold shadow-lg dark:shadow-neon-blue">
              S
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-[#2B3674] dark:text-dark-text-primary leading-none">SHOP<span className="text-primary dark:text-dark-neon-blue">ADMIN</span></h1>
              <span className="text-[10px] text-gray-400 dark:text-dark-text-muted font-medium tracking-wider mt-1">MANAGEMENT</span>
            </div>
          </div>

          <button 
            onClick={toggle}
            className="lg:hidden p-2 text-gray-400 dark:text-dark-text-muted hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="px-4 mb-2 text-xs font-bold text-gray-400 dark:text-dark-text-muted uppercase tracking-wider">Menu Chính</div>
          
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  relative flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl cursor-pointer transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primary dark:bg-dark-neon-blue text-white dark:text-dark-bg-primary shadow-lg shadow-primary/30 dark:shadow-neon-blue' 
                    : 'text-gray-600 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary hover:text-primary dark:hover:text-dark-neon-blue'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white dark:text-dark-bg-primary' : 'text-gray-400 dark:text-dark-text-muted group-hover:text-primary dark:group-hover:text-dark-neon-blue'}`} />
                {item.label}
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-[#868CFF] to-[#4318FF] dark:from-dark-bg-tertiary dark:to-dark-bg-secondary dark:border dark:border-dark-border text-white dark:text-dark-text-primary relative overflow-hidden shadow-lg dark:shadow-card-dark">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 dark:bg-dark-neon-blue/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent dark:from-dark-bg-primary/50"></div>
          
          <div className="relative z-10 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white/20 dark:bg-dark-bg-primary/30 flex items-center justify-center backdrop-blur-sm border border-white/10 dark:border-dark-neon-blue/20">
                 <User size={20} className="text-white dark:text-dark-neon-blue" />
               </div>
               <div>
                 <p className="text-sm font-bold">Admin</p>
                 <p className="text-xs text-white/70 dark:text-dark-text-muted">View Profile</p>
               </div>
             </div>
             
             <button 
               onClick={() => navigate('/login')}
               className="p-2 hover:bg-white/20 dark:hover:bg-dark-bg-primary/30 rounded-lg transition-colors text-white dark:text-dark-text-secondary dark:hover:text-red-400" title="Đăng xuất"
             >
               <LogOut size={18} />
             </button>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;