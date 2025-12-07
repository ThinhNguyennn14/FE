import { useState, useMemo, useRef } from 'react';
import { 
  Search, ShoppingCart, Plus, Minus, X, 
  Trash2, ShoppingBag, CreditCard, Users, 
  QrCode, Printer, CheckCircle, ArrowLeft 
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';

// --- ĐỊNH NGHĨA INTERFACE (SỬA LỖI ANY TẠI ĐÂY) ---
interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

// --- MOCK DATA SẢN PHẨM ---
const PRODUCTS = [
  { 
    id: 'P001', 
    name: 'Laptop Dell XPS 13 Plus', 
    price: 45000000, 
    category: 'Laptop',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 'P002', 
    name: 'iPhone 15 Pro Max Titanium', 
    price: 32000000, 
    category: 'Điện thoại',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 'P003', 
    name: 'Sony WH-1000XM5 ANC', 
    price: 8500000, 
    category: 'Phụ kiện',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 'P004', 
    name: 'Chuột Logitech MX Master 3S', 
    price: 2800000, 
    category: 'Phụ kiện',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 'P005', 
    name: 'Keychron Q1 Pro Wireless', 
    price: 4200000, 
    category: 'Phụ kiện',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 'P006', 
    name: 'Màn hình LG UltraView 29"', 
    price: 5500000, 
    category: 'Màn hình',
    stock: 0, 
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 'P007', 
    name: 'iPad Air 5 M1 WiFi 64GB', 
    price: 14500000, 
    category: 'Tablet',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 'P008', 
    name: 'Apple Watch Series 9', 
    price: 10500000, 
    category: 'Đồng hồ',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=500&q=80'
  },
];

// --- MOCK DATA KHÁCH HÀNG (Sử dụng interface Customer) ---
const CUSTOMERS: Customer[] = [
  { id: 'GUEST', name: 'Khách lẻ (Walk-in)', phone: '---' },
  { id: 'KH001', name: 'Nguyễn Văn A', phone: '0909123456' },
  { id: 'KH002', name: 'Trần Thị B', phone: '0912345678' },
  { id: 'KH003', name: 'Phạm Thị C', phone: '0988777666' },
];

const ShopPage = () => {
  const [products] = useState(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  // --- STATES CHO THANH TOÁN ---
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'method' | 'qr' | 'receipt'>('method');
  
  // Sửa lỗi any ở đây: Định nghĩa rõ kiểu cho customer
  const [currentOrder, setCurrentOrder] = useState<{
    id: string;
    customer: Customer | undefined; // <--- Thay vì 'any'
    items: CartItem[];
    total: number;
    date: string;
  } | null>(null);

  const invoiceRef = useRef<HTMLDivElement>(null);

  // --- LOGIC GIỎ HÀNG ---
  const addToCart = (product: typeof PRODUCTS[0]) => {
    if (product.stock === 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      setIsCartOpen(true); 
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > item.stock) {
          alert(`Kho chỉ còn ${item.stock} sản phẩm!`);
          return item;
        }
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    if (confirm("Bạn có chắc chắn muốn HỦY đơn hàng này và xóa sạch giỏ hàng?")) {
        setCart([]);
        setSelectedCustomerId('');
        setIsCartOpen(false);
    }
  }

  // --- LOGIC THANH TOÁN ---
  
  const totalCartValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalTotal = totalCartValue * 1.08; // VAT 8%

  const startCheckout = () => {
    if (cart.length === 0) return;
    if (!selectedCustomerId) {
        alert("⚠️ Vui lòng chọn khách hàng trước khi thanh toán!");
        return;
    }
    
    // Tìm khách hàng
    const customer = CUSTOMERS.find(c => c.id === selectedCustomerId);
    
    setCurrentOrder({
        id: `INV-${Date.now().toString().slice(-6)}`,
        customer: customer,
        items: [...cart],
        total: finalTotal,
        date: new Date().toLocaleString('vi-VN')
    });

    setPaymentStep('method');
    setIsPaymentModalOpen(true);
  };

  const completeOrder = () => {
      setPaymentStep('receipt');
      setCart([]); 
      setSelectedCustomerId('');
      setIsCartOpen(false);
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (printContent) {
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>In Hóa Đơn</title>
                    <style>
                        body { font-family: 'Courier New', monospace; padding: 20px; }
                        .text-center { text-align: center; }
                        .text-right { text-align: right; }
                        .font-bold { font-weight: bold; }
                        .border-b { border-bottom: 1px dashed #000; }
                        .mb-2 { margin-bottom: 8px; }
                        .py-2 { padding-top: 8px; padding-bottom: 8px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { text-align: left; padding: 5px 0; }
                        td:last-child, th:last-child { text-align: right; }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    }
  };

  // --- FILTER ---
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory, products]);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex h-[calc(100vh-theme(spacing.24))] -m-4 md:-m-6 relative overflow-hidden font-sans">
      
      <style>{`
        @media print {
            .no-print { display: none !important; }
            #invoice-print-area { display: block !important; position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      {/* --- LEFT: PRODUCT GRID --- */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-dark-bg-primary no-print">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#2B3674] dark:text-white">Cửa hàng</h1>
            <p className="text-sm text-gray-500 mt-1">Chọn sản phẩm và thêm vào giỏ</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
               <Input 
                 placeholder="Tìm sản phẩm..." 
                 icon={Search} 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="bg-white dark:bg-dark-bg-secondary"
               />
            </div>
            <button onClick={() => setIsCartOpen(!isCartOpen)} className="md:hidden relative p-3 bg-blue-600 text-white rounded-xl shadow-lg">
              <ShoppingCart size={20} />
              {totalCartItems > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{totalCartItems}</span>}
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-[#2B3674] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-200 dark:bg-dark-bg-secondary dark:text-gray-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredProducts.map(product => (
            <div key={product.id} className="group bg-white dark:bg-dark-bg-secondary rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-blue-100 dark:border-dark-border dark:hover:border-blue-900/50 flex flex-col">
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                {product.stock === 0 && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-white font-bold px-3 py-1 border-2 border-white rounded-lg -rotate-12">HẾT HÀNG</span></div>}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">{product.category}</div>
                   <div className={`text-xs font-bold px-2 py-0.5 rounded ${product.stock > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>Tồn: {product.stock}</div>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-1 line-clamp-2 min-h-[48px]">{product.name}</h3>
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{product.price.toLocaleString()}đ</span>
                  <button onClick={() => addToCart(product)} disabled={product.stock === 0} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- RIGHT: CART SIDEBAR --- */}
      <div className={`absolute top-0 right-0 h-full w-full md:w-[400px] bg-white dark:bg-dark-bg-secondary shadow-2xl transform transition-transform duration-300 z-40 flex flex-col border-l border-gray-100 dark:border-dark-border ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} no-print`}>
        <div className="p-6 border-b border-gray-100 dark:border-dark-border flex justify-between items-center bg-white dark:bg-dark-bg-secondary">
          <div className="flex items-center gap-3"><ShoppingBag className="text-blue-600" /><h2 className="text-xl font-bold text-[#2B3674] dark:text-white">Giỏ hàng ({totalCartItems})</h2></div>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500"><X size={24} /></button>
        </div>

        <div className="px-6 py-4 bg-blue-50/50 dark:bg-blue-900/10 border-b border-gray-100 dark:border-dark-border">
            <div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"><Users size={16} className="text-blue-600"/>Thông tin khách hàng</div>
            <Select placeholder="-- Chọn khách mua hàng --" options={CUSTOMERS.map(c => ({ value: c.id, label: `${c.name} ${c.phone !== '---' ? `(${c.phone})` : ''}` }))} value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} className="bg-white" />
            {!selectedCustomerId && <p className="text-xs text-red-500 mt-1.5">* Vui lòng chọn khách hàng trước</p>}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4"><ShoppingBag size={64} className="opacity-20" /><p>Giỏ hàng đang trống</p><Button variant="outline" onClick={() => setIsCartOpen(false)}>Tiếp tục mua sắm</Button></div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 animate-fadeIn">
                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
                <div className="flex-1 flex flex-col justify-between">
                  <div><h4 className="font-bold text-gray-800 dark:text-white line-clamp-1">{item.name}</h4><p className="text-sm text-blue-600 font-medium">{item.price.toLocaleString()}đ</p></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-red-500 px-2"><Minus size={14}/></button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-green-500 px-2"><Plus size={14}/></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 dark:bg-dark-bg-tertiary border-t border-gray-200 dark:border-dark-border">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-500 text-sm"><span>Tạm tính</span><span>{totalCartValue.toLocaleString()}đ</span></div>
            <div className="flex justify-between text-gray-500 text-sm"><span>Thuế (8%)</span><span>{(totalCartValue * 0.08).toLocaleString()}đ</span></div>
            <div className="flex justify-between text-xl font-bold text-[#2B3674] dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700"><span>Tổng cộng</span><span className="text-blue-600">{finalTotal.toLocaleString()}đ</span></div>
          </div>
          
          <div className="flex gap-3">
             <button onClick={handleClearCart} disabled={cart.length === 0} className="px-4 py-4 rounded-xl border border-red-200 bg-white text-red-500 font-bold hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"><Trash2 size={20} /></button>
             <Button onClick={startCheckout} disabled={cart.length === 0} className={`flex-1 py-4 text-lg shadow-xl ${!selectedCustomerId ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : 'shadow-blue-200 dark:shadow-none'}`} icon={<CreditCard size={20} />}>Thanh toán</Button>
          </div>
        </div>
      </div>
      
      {isCartOpen && <div onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"></div>}
      
      {/* --- PAYMENT MODAL --- */}
      <Modal 
        isOpen={isPaymentModalOpen} 
        onClose={() => {
            if(paymentStep === 'receipt') return;
            setIsPaymentModalOpen(false);
        }} 
        title={
            paymentStep === 'method' ? "Chọn phương thức thanh toán" : 
            paymentStep === 'qr' ? "Quét mã QR để thanh toán" : "Hóa đơn thanh toán"
        }
      >
        <div className="p-4 space-y-6">
            
            {/* STEP 1: CHỌN PHƯƠNG THỨC */}
            {paymentStep === 'method' && (
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={completeOrder}
                        className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                             <div className="text-2xl font-bold text-green-600">💵</div>
                        </div>
                        <span className="font-bold text-gray-700">Tiền mặt</span>
                    </button>

                    <button 
                        onClick={() => setPaymentStep('qr')}
                        className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                             <QrCode size={32} className="text-blue-600"/>
                        </div>
                        <span className="font-bold text-gray-700">Chuyển khoản QR</span>
                    </button>
                </div>
            )}

            {/* STEP 2: QR CODE */}
            {paymentStep === 'qr' && (
                <div className="flex flex-col items-center text-center">
                    <p className="text-gray-500 mb-4">Vui lòng quét mã bên dưới để thanh toán số tiền:</p>
                    <h3 className="text-2xl font-bold text-blue-600 mb-6">{currentOrder?.total.toLocaleString()}đ</h3>
                    
                    <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-inner mb-6">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT:${currentOrder?.id}|AMOUNT:${currentOrder?.total}`} 
                            alt="Payment QR" 
                            className="w-48 h-48"
                        />
                    </div>
                    
                    <div className="flex gap-3 w-full">
                        <Button variant="outline" onClick={() => setPaymentStep('method')} className="flex-1" icon={<ArrowLeft size={18}/>}>Quay lại</Button>
                        <Button onClick={completeOrder} className="flex-1" icon={<CheckCircle size={18}/>}>Đã nhận tiền</Button>
                    </div>
                </div>
            )}

            {/* STEP 3: HÓA ĐƠN (RECEIPT) */}
            {paymentStep === 'receipt' && currentOrder && (
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto max-h-[400px] border border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-4">
                        <div ref={invoiceRef} className="text-sm font-mono text-gray-800">
                            <div className="text-center mb-4">
                                <h2 className="text-xl font-bold uppercase">SHOP ADMIN</h2>
                                <p>ĐC: 123 Đường ABC, Quận XYZ, TP.HCM</p>
                                <p>SĐT: 0909.123.456</p>
                                <div className="border-b border-dashed border-gray-400 my-2"></div>
                                <h3 className="text-lg font-bold">HÓA ĐƠN THANH TOÁN</h3>
                                <p>Mã HĐ: {currentOrder.id}</p>
                                <p>Ngày: {currentOrder.date}</p>
                            </div>
                            
                            <div className="mb-4">
                                <p><span className="font-bold">Khách hàng:</span> {currentOrder.customer?.name}</p>
                                <p><span className="font-bold">SĐT:</span> {currentOrder.customer?.phone}</p>
                            </div>

                            <table className="w-full mb-4">
                                <thead>
                                    <tr className="border-b border-dashed border-gray-400">
                                        <th className="text-left py-1">SP</th>
                                        <th className="text-center py-1">SL</th>
                                        <th className="text-right py-1">Tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrder.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-1">{item.name}</td>
                                            <td className="text-center py-1">{item.quantity}</td>
                                            <td className="text-right py-1">{(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="border-t border-dashed border-gray-400 pt-2 space-y-1">
                                <div className="flex justify-between">
                                    <span>Tạm tính:</span>
                                    <span>{totalCartValue.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>VAT (8%):</span>
                                    <span>{(totalCartValue * 0.08).toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold mt-2">
                                    <span>TỔNG CỘNG:</span>
                                    <span>{currentOrder.total.toLocaleString()}đ</span>
                                </div>
                            </div>
                            
                            <div className="text-center mt-6 italic text-xs">
                                <p>Cảm ơn quý khách và hẹn gặp lại!</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button 
                            onClick={() => setIsPaymentModalOpen(false)} 
                            variant="outline" 
                            className="flex-1"
                        >
                            Đóng
                        </Button>
                        <Button 
                            onClick={handlePrint} 
                            className="flex-1"
                            icon={<Printer size={18}/>}
                        >
                            In Hóa Đơn
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </Modal>

    </div>
  );
};

export default ShopPage;