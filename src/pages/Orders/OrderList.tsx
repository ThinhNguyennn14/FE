import { useState } from 'react';
import { 
  Plus, Search, Printer, 
  User, Calendar, Package, CheckCircle, RotateCcw, 
  ShoppingBag, Trash2 // Thêm icon Trash2
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';

// --- MOCK DATA ---
const INITIAL_PRODUCTS = [
  { id: 'P001', name: 'Laptop Dell XPS 13 Plus', price: 45000000, stock: 10 },
  { id: 'P002', name: 'iPhone 15 Pro Max 256GB', price: 32000000, stock: 5 },
  { id: 'P003', name: 'Tai nghe Sony WH-1000XM5', price: 8500000, stock: 15 },
  { id: 'P004', name: 'Chuột Logitech MX Master 3S', price: 2800000, stock: 30 },
  { id: 'P005', name: 'Bàn phím cơ Keychron Q1', price: 4200000, stock: 8 },
];

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'completed' | 'cancelled';
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'DH015',
    customerName: 'Khách lẻ',
    customerPhone: '---',
    date: '2025-01-16 10:30',
    items: [{ productId: 'P004', productName: 'Chuột Logitech MX Master 3S', quantity: 1, price: 2800000 }],
    totalAmount: 2800000,
    status: 'completed'
  },
  {
    id: 'DH014',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0909123456',
    date: '2025-01-16 09:15',
    items: [
        { productId: 'P002', productName: 'iPhone 15 Pro Max', quantity: 1, price: 32000000 },
        { productId: 'P003', productName: 'Tai nghe Sony', quantity: 1, price: 8500000 }
    ],
    totalAmount: 40500000,
    status: 'completed'
  },
  {
    id: 'DH013',
    customerName: 'Trần Thị Bích',
    customerPhone: '0912345678',
    date: '2025-01-15 14:20',
    items: [{ productId: 'P001', productName: 'Laptop Dell XPS 13', quantity: 1, price: 45000000 }],
    totalAmount: 45000000,
    status: 'cancelled'
  }
];

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrderCustomer, setNewOrderCustomer] = useState({ name: '', phone: '' });
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedProdId, setSelectedProdId] = useState('');
  const [buyQty, setBuyQty] = useState<number | string>(1);

  // --- LOGIC HELPER ---
  const getCurrentFormattedDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };
  
  const generateNextOrderId = () => {
    if (orders.length === 0) return 'DH001';
    const lastId = orders[0].id; 
    const numberPart = parseInt(lastId.replace('DH', '')); 
    return `DH${(numberPart + 1).toString().padStart(3, '0')}`;
  };

  // --- LOGIC GIỎ HÀNG ---
  const handleAddToCart = () => {
    const product = products.find(p => p.id === selectedProdId);
    const qty = Number(buyQty);
    if (!product || qty <= 0) return;

    if (qty > product.stock) {
        alert(`Kho chỉ còn ${product.stock}!`);
        return;
    }

    const existingIdx = cart.findIndex(i => i.productId === product.id);
    if (existingIdx >= 0) {
      const newCart = [...cart];
      newCart[existingIdx].quantity += qty;
      setCart(newCart);
    } else {
      setCart([...cart, { productId: product.id, productName: product.name, price: product.price, quantity: qty }]);
    }
    setBuyQty(1);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // --- LOGIC HỦY NHẬP ĐƠN (Khách không mua nữa) ---
  const handleCancelInput = () => {
    if (cart.length > 0) {
        if (!confirm("Khách không mua nữa? Dữ liệu đang nhập sẽ bị xóa.")) return;
    }
    // Chỉ đóng modal và reset form, KHÔNG LƯU vào danh sách
    setIsModalOpen(false);
    setCart([]);
    setNewOrderCustomer({ name: '', phone: '' });
  };

  // --- LOGIC TẠO ĐƠN (Khách mua xong) ---
  const handleCreateOrder = () => {
    if (!newOrderCustomer.name || cart.length === 0) {
      alert("Thiếu thông tin khách hoặc sản phẩm!");
      return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: generateNextOrderId(),
      customerName: newOrderCustomer.name,
      customerPhone: newOrderCustomer.phone || 'N/A', 
      date: getCurrentFormattedDate(),
      items: cart,
      totalAmount: total,
      status: 'completed' // Mua xong là xong
    };

    setOrders([newOrder, ...orders]);

    // Trừ kho
    const updatedProducts = products.map(p => {
        const itemInCart = cart.find(i => i.productId === p.id);
        if (itemInCart) {
            return { ...p, stock: p.stock - itemInCart.quantity };
        }
        return p;
    });
    setProducts(updatedProducts);

    setIsModalOpen(false);
    setCart([]);
    setNewOrderCustomer({ name: '', phone: '' });
    alert(`Đã hoàn tất đơn hàng ${newOrder.id}!`);
  };

  // --- LOGIC HOÀN TRẢ (Khách quay lại trả hàng) ---
  const handleRefundOrder = (orderId: string) => {
    if (!confirm(`Xác nhận HOÀN TRẢ (Khách trả hàng) cho đơn ${orderId}? \nKho sẽ được cộng lại.`)) return;

    const orderToRefund = orders.find(o => o.id === orderId);
    if (!orderToRefund) return;

    // Chuyển trạng thái thành 'cancelled' (Đã hoàn trả)
    const updatedOrders = orders.map(o => 
        o.id === orderId ? { ...o, status: 'cancelled' as const } : o
    );
    setOrders(updatedOrders);

    // Cộng lại kho
    const updatedProducts = products.map(p => {
        const itemInOrder = orderToRefund.items.find(i => i.productId === p.id);
        if (itemInOrder) {
            return { ...p, stock: p.stock + itemInOrder.quantity };
        }
        return p;
    });
    setProducts(updatedProducts);
  };

  // --- UI COMPONENTS ---
  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'completed') {
        return (
            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-semibold w-fit">
                <CheckCircle size={14} className="fill-green-600 text-white" /> 
                <span>Hoàn thành</span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-1.5 text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full text-xs font-semibold w-fit">
            <RotateCcw size={14} /> 
            <span>Đã hoàn trả</span>
        </div>
    );
  };

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Lịch sử giao dịch</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
             <ShoppingBag size={14} />
             <span>Danh sách đơn hàng bán tại quầy</span>
          </div>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="h-10 px-4 border-gray-200" icon={<Printer size={18} />} onClick={() => window.print()}>In</Button>
           <Button icon={<Plus size={18} />} className="h-10 px-5 shadow-lg shadow-blue-500/20" onClick={() => setIsModalOpen(true)}>Ghi đơn mới</Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-shadow hover:shadow-md"
          placeholder="Tìm kiếm theo mã đơn, tên khách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 dark:bg-dark-bg-tertiary text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Đơn hàng</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4 text-right">Tổng tiền</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-border text-sm">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-blue-50/50 dark:hover:bg-dark-bg-tertiary/50 transition-colors group">
                
                {/* ID & Date */}
                <td className="px-6 py-4 align-top">
                  <div className="font-bold text-gray-800 dark:text-white">{order.id}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <Calendar size={12}/> {order.date}
                  </div>
                </td>

                {/* Info Khách */}
                <td className="px-6 py-4 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mt-0.5">
                      <User size={16}/>
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                    </div>
                  </div>
                </td>

                {/* Sản phẩm */}
                <td className="px-6 py-4 align-top">
                  <div className="space-y-1">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="truncate max-w-[200px]" title={item.productName}>{item.productName}</span>
                        <span className="text-xs font-semibold text-gray-400">x{item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                        <div className="text-xs text-blue-500 pl-3.5 font-medium">+ {order.items.length - 2} sản phẩm khác</div>
                    )}
                  </div>
                </td>

                {/* Tổng tiền */}
                <td className="px-6 py-4 text-right align-top">
                  <div className="font-bold text-gray-900 dark:text-white text-base">
                    {order.totalAmount.toLocaleString()}đ
                  </div>
                </td>

                {/* Trạng thái */}
                <td className="px-6 py-4 align-top">
                  <div className="flex justify-center">
                    <StatusBadge status={order.status} />
                  </div>
                </td>

                {/* Hành động */}
                <td className="px-6 py-4 text-right align-top">
                    {order.status === 'completed' && (
                        <button 
                            onClick={() => handleRefundOrder(order.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Khách trả hàng (Hoàn tiền)"
                        >
                            <RotateCcw size={18} />
                        </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
            <div className="p-12 text-center text-gray-400">
                <Package size={48} className="mx-auto mb-3 opacity-20"/>
                <p>Chưa có giao dịch nào</p>
            </div>
        )}
      </div>

      {/* --- MODAL GHI ĐƠN --- */}
      <Modal isOpen={isModalOpen} onClose={handleCancelInput} title="Ghi Nhận Giao Dịch">
        <div className="space-y-5">
          {/* Thông tin khách hàng */}
          <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
              <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Khách hàng</label>
              <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Tên khách hàng" value={newOrderCustomer.name} onChange={e => setNewOrderCustomer({...newOrderCustomer, name: e.target.value})} className="bg-white"/>
                  <Input placeholder="Số điện thoại" value={newOrderCustomer.phone} onChange={e => setNewOrderCustomer({...newOrderCustomer, phone: e.target.value})} className="bg-white"/>
              </div>
          </div>

          {/* Chọn sản phẩm */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Sản phẩm</label>
            <div className="flex gap-2 items-center">
                <div className="flex-1">
                    <Select 
                    options={products.map(p => ({ value: p.id, label: `${p.name} (${p.stock})` }))}
                    value={selectedProdId} onChange={e => setSelectedProdId(e.target.value)} placeholder="-- Chọn sản phẩm --"
                    />
                </div>
                <Input type="number" className="w-20" value={buyQty} onChange={e => setBuyQty(e.target.value)} />
                <Button onClick={handleAddToCart} icon={<Plus size={20}/>} className="w-[42px] px-0 h-[42px]"/>
            </div>
          </div>

          {/* List sản phẩm trong giỏ */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
             {cart.length === 0 ? (
                 <div className="p-8 text-center text-gray-400 text-sm bg-gray-50/50">
                    Chưa có sản phẩm nào
                 </div>
             ) : (
                 <div className="max-h-[200px] overflow-y-auto divide-y divide-gray-100">
                     {cart.map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 transition-colors">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">{idx + 1}</div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.productName}</p>
                                    <p className="text-xs text-gray-500">{item.price.toLocaleString()}đ x {item.quantity}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-900 text-sm">{(item.price * item.quantity).toLocaleString()}</span>
                                <button onClick={() => removeFromCart(idx)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
             
             {cart.length > 0 && (
                 <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-100">
                     <span className="text-gray-500 text-sm font-medium">Tổng thanh toán</span>
                     <span className="text-xl font-bold text-blue-600">
                        {cart.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString()}đ
                     </span>
                 </div>
             )}
          </div>

          <div className="pt-2 flex justify-end gap-3">
             <Button variant="outline" onClick={handleCancelInput}>Hủy (Không mua)</Button>
             <Button onClick={handleCreateOrder} disabled={cart.length === 0} className="px-6 shadow-lg shadow-blue-500/30">Thanh toán & Lưu</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default OrderList;