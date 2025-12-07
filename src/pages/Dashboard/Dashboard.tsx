import { useState } from 'react';
import { 
  Printer, Package, DollarSign, TrendingUp, AlertTriangle, Calendar, Users, 
  type LucideIcon 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  Legend
} from 'recharts';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

// --- MOCK DATA ---

// 1. Dữ liệu Tồn kho
const INVENTORY_STATS = [
  { id: 'P001', name: 'Laptop Dell XPS 13', stock: 10, importPrice: 25000000, sellPrice: 30000000 },
  { id: 'P002', name: 'iPhone 15 Pro Max', stock: 5, importPrice: 28000000, sellPrice: 32000000 },
  { id: 'P003', name: 'Tai nghe Sony XM5', stock: 25, importPrice: 6000000, sellPrice: 8500000 },
  { id: 'P004', name: 'Chuột Logitech MX', stock: 0, importPrice: 1800000, sellPrice: 2800000 }, // Hết hàng
  { id: 'P005', name: 'Bàn phím Keychron', stock: 8, importPrice: 3000000, sellPrice: 4200000 },
  { id: 'P006', name: 'Màn hình LG 29"', stock: 12, importPrice: 4000000, sellPrice: 5500000 },
];

// 2. Dữ liệu Lịch sử mua hàng của khách
const CUSTOMER_STATS = [
  { id: 'KH001', name: 'Nguyễn Văn A', totalOrders: 5, totalSpent: 120000000, lastOrder: '2024-12-01' },
  { id: 'KH002', name: 'Trần Thị B', totalOrders: 2, totalSpent: 45000000, lastOrder: '2024-11-20' },
  { id: 'KH003', name: 'Lê Hoàng C', totalOrders: 12, totalSpent: 350000000, lastOrder: '2024-12-03' },
  { id: 'KH004', name: 'Phạm Minh D', totalOrders: 1, totalSpent: 8500000, lastOrder: '2024-10-15' },
  { id: 'KH005', name: 'Hoàng Thị E', totalOrders: 3, totalSpent: 28000000, lastOrder: '2024-11-30' },
  { id: 'KH006', name: 'Vũ Văn F', totalOrders: 1, totalSpent: 2500000, lastOrder: '2024-12-05' },
];

// --- HELPER COMPONENTS ---

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subText?: string;
}

const StatCard = ({ title, value, icon: Icon, color, subText }: StatCardProps) => (
  <div className="bg-white dark:bg-dark-bg-secondary p-5 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-[#2B3674] dark:text-white">{value}</h3>
      {subText && <p className="text-xs text-gray-400 mt-1">{subText}</p>}
    </div>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'customer'>('inventory');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  
  // State tìm kiếm khách hàng
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');

  // --- TÍNH TOÁN SỐ LIỆU TỒN KHO ---
  const totalStock = INVENTORY_STATS.reduce((acc, item) => acc + item.stock, 0);
  const totalValue = INVENTORY_STATS.reduce((acc, item) => acc + (item.stock * item.importPrice), 0);
  const lowStockItems = INVENTORY_STATS.filter(item => item.stock <= 5);
  
  // Format tiền tệ
  const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // --- LỌC KHÁCH HÀNG ---
  const filteredCustomers = CUSTOMER_STATS.filter(c => 
    c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(customerSearchTerm.toLowerCase())
  ).sort((a, b) => b.totalSpent - a.totalSpent); // Sắp xếp theo chi tiêu giảm dần

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2B3674] dark:text-white">Thống kê & Báo cáo</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi sức khỏe kho hàng và hành vi khách hàng</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Printer size={18} />} onClick={() => window.print()}>
            Xuất Báo Cáo
          </Button>
        </div>
      </div>

      {/* TABS CHUYỂN ĐỔI */}
      <div className="flex border-b border-gray-200 dark:border-dark-border">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 ${
            activeTab === 'inventory' 
            ? 'border-blue-600 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2"><Package size={16}/> Tồn kho</div>
        </button>
        <button
          onClick={() => setActiveTab('customer')}
          className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 ${
            activeTab === 'customer' 
            ? 'border-blue-600 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
           <div className="flex items-center gap-2"><Users size={16}/> Lịch sử khách hàng</div>
        </button>
      </div>

      {/* --- NỘI DUNG TAB TỒN KHO --- */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          
          {/* FILTER NGÀY (Mô phỏng) */}
          <div className="flex items-center gap-3 bg-white dark:bg-dark-bg-secondary p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
             <Calendar size={18} className="text-gray-500"/>
             <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Tính đến ngày:</span>
             <input 
               type="date" 
               value={filterDate} 
               onChange={(e) => setFilterDate(e.target.value)}
               className="bg-gray-50 dark:bg-dark-bg-tertiary border border-gray-300 dark:border-dark-border rounded px-3 py-1 text-sm outline-none focus:border-blue-500"
             />
             <span className="text-xs text-gray-400 italic ml-2">(Dữ liệu được cập nhật tự động sau mỗi giao dịch nhập/xuất)</span>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Tổng giá trị kho" 
              value={formatCurrency(totalValue)} 
              icon={DollarSign} 
              color="bg-green-500" 
              subText="Dựa trên giá nhập"
            />
            <StatCard 
              title="Tổng sản phẩm tồn" 
              value={totalStock} 
              icon={Package} 
              color="bg-blue-500"
            />
            <StatCard 
              title="Cảnh báo sắp hết" 
              value={lowStockItems.length} 
              icon={AlertTriangle} 
              color="bg-red-500"
              subText="Sản phẩm có tồn kho <= 5"
            />
          </div>

          {/* CHART & TABLE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart */}
            <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
              <h3 className="font-bold text-lg mb-6 text-[#2B3674] dark:text-white">Biểu đồ số lượng tồn kho</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={INVENTORY_STATS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" hide />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(val: number) => val}
                      labelStyle={{color: '#333'}}
                    />
                    <Legend />
                    <Bar dataKey="stock" name="Số lượng tồn" fill="#4318FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table chi tiết */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
               <div className="p-6 border-b border-gray-100 dark:border-dark-border">
                  <h3 className="font-bold text-lg text-[#2B3674] dark:text-white">Chi tiết trạng thái kho</h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-gray-50 dark:bg-dark-bg-tertiary">
                     <tr>
                       <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Sản phẩm</th>
                       <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-center">Tồn</th>
                       <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Giá trị (VNĐ)</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                     {INVENTORY_STATS.map((item) => (
                       <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary/50">
                         <td className="px-6 py-4">
                           <div className="text-sm font-bold text-gray-800 dark:text-white">{item.name}</div>
                           <div className="text-xs text-gray-400">{item.id}</div>
                         </td>
                         <td className="px-6 py-4 text-center">
                           {item.stock === 0 ? (
                             <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">Hết hàng</span>
                           ) : item.stock <= 5 ? (
                             <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-bold">{item.stock}</span>
                           ) : (
                             <span className="text-gray-700 dark:text-gray-300 font-bold">{item.stock}</span>
                           )}
                         </td>
                         <td className="px-6 py-4 text-right text-sm text-gray-700 dark:text-gray-300">
                           {(item.stock * item.importPrice).toLocaleString()}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- NỘI DUNG TAB KHÁCH HÀNG --- */}
      {activeTab === 'customer' && (
        <div className="space-y-6">
           {/* Top Stats Customers */}
           <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendingUp size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">TOP 5</h3>
                  <p className="opacity-90">Khách hàng chi tiêu cao nhất tháng này</p>
                </div>
              </div>
           </div>

           {/* Table History */}
           <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
             <div className="p-6 border-b border-gray-100 dark:border-dark-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-lg text-[#2B3674] dark:text-white">Lịch sử mua hàng & Chi tiêu</h3>
                <div className="w-full sm:w-64">
                   <Input 
                      placeholder="Tìm khách hàng (Tên, Mã)..." 
                      icon={Users} 
                      className="py-2"
                      value={customerSearchTerm}
                      onChange={(e) => setCustomerSearchTerm(e.target.value)}
                    />
                </div>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 dark:bg-dark-bg-tertiary">
                   <tr>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mã KH</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Họ Tên</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Số đơn hàng</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Lần mua cuối</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Tổng chi tiêu</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                   {filteredCustomers.length > 0 ? (
                     filteredCustomers.map((cus) => (
                       <tr key={cus.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary/50 transition-colors">
                         <td className="px-6 py-4 font-bold text-blue-600 text-sm">{cus.id}</td>
                         <td className="px-6 py-4 font-bold text-gray-700 dark:text-white">{cus.name}</td>
                         <td className="px-6 py-4 text-center">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                              {cus.totalOrders}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(cus.lastOrder).toLocaleDateString('vi-VN')}
                         </td>
                         <td className="px-6 py-4 text-right font-bold text-green-600">
                            {formatCurrency(cus.totalSpent)}
                         </td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                         Không tìm thấy khách hàng nào phù hợp với "{customerSearchTerm}"
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;