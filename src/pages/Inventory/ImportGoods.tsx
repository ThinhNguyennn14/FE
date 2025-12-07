import { useState, useRef, useMemo } from 'react';
import { Plus, Trash2, Calendar, Package, Box } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

// Mock Data
const PRODUCTS = [
  { id: 'P001', name: 'Laptop Dell XPS 13' },
  { id: 'P002', name: 'iPhone 15 Pro Max' },
  { id: 'P003', name: 'Samsung Galaxy S24' },
];

interface ImportItem {
  productId: string;
  productName: string;
  quantity: number;
  importPrice: number;
}

interface ImportSlip {
  id: string;
  date: string;
  supplier: string;
  items: ImportItem[];
  totalValue: number;
}

const MOCK_HISTORY: ImportSlip[] = [
  {
    id: '#I001',
    supplier: 'Công ty TNHH ABC',
    date: '2024-11-15',
    items: [
      { productId: 'P001', productName: 'Laptop Dell XPS 13', quantity: 10, importPrice: 25000000 },
      { productId: 'P002', productName: 'iPhone 15 Pro Max', quantity: 15, importPrice: 28000000 },
    ],
    totalValue: 670000000
  }
];

const extractId = (id: string) => parseInt(id.replace('#I', ''));
const maxId = MOCK_HISTORY.reduce((max, item) => {
  const num = extractId(item.id);
  return num > max ? num : max;
}, 0);
const formatId = (num: number) => num.toString().padStart(3, '0');

const ImportGoods = () => {
  const [history, setHistory] = useState<ImportSlip[]>(MOCK_HISTORY);
  const nextIdCounter = useRef(maxId + 1);

  const [importDate, setImportDate] = useState(new Date().toISOString().split('T')[0]);
  const [supplier, setSupplier] = useState('');

  const [tempItems, setTempItems] = useState<ImportItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState<number | string>('');
  const [importPrice, setImportPrice] = useState<number | string>('');

  const currentTotal = useMemo(() => {
    return tempItems.reduce((acc, item) => acc + (item.quantity * item.importPrice), 0);
  }, [tempItems]);

  // Hàm xử lý thêm vào danh sách tạm (Nút dấu +)
  const handleAddToTemp = () => {
    const product = PRODUCTS.find(p => p.id === selectedProductId);
    const qty = Number(quantity);
    const price = Number(importPrice);

    if (!product) {
        alert("Vui lòng chọn sản phẩm!");
        return;
    }
    if (!price || price < 0) {
        alert("Vui lòng nhập giá nhập hợp lệ!");
        return;
    }
    if (!qty || qty <= 0) {
        alert("Vui lòng nhập số lượng lớn hơn 0!");
        return;
    }

    const existingItemIndex = tempItems.findIndex(item => item.productId === product.id && item.importPrice === price);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...tempItems];
      updatedItems[existingItemIndex].quantity += qty;
      setTempItems(updatedItems);
    } else {
      setTempItems([...tempItems, {
        productId: product.id,
        productName: product.name,
        quantity: qty,
        importPrice: price
      }]);
    }

    // Reset các ô nhập liệu sau khi thêm thành công
    setSelectedProductId('');
    setQuantity('');
    setImportPrice(''); 
  };

  const handleRemoveTemp = (index: number) => {
    const newItems = [...tempItems];
    newItems.splice(index, 1);
    setTempItems(newItems);
  };

  // Hàm xử lý nút Xác nhận nhập kho (Đã sửa logic check lỗi)
  const handleConfirmAction = () => {
    // 1. Kiểm tra Nhà cung cấp
    if (!supplier.trim()) {
        alert("⚠️ Bạn chưa nhập tên 'Nhà cung cấp'!");
        return;
    }

    // 2. Kiểm tra danh sách hàng
    if (tempItems.length === 0) {
        alert("⚠️ Danh sách nhập đang trống! \n\nVui lòng chọn sản phẩm, nhập giá, số lượng rồi bấm nút dấu cộng (+) màu xanh để thêm vào danh sách trước.");
        return;
    }

    // Nếu đủ điều kiện thì lưu
    const newId = `#I${formatId(nextIdCounter.current)}`;
    const newSlip: ImportSlip = {
      id: newId, date: importDate, supplier: supplier, items: tempItems, totalValue: currentTotal
    };

    setHistory([newSlip, ...history]); 
    nextIdCounter.current += 1;
    
    // Reset form
    setSupplier('');
    setTempItems([]);
    alert("✅ Đã nhập kho thành công!");
  };

  const handleDeleteSlip = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa phiếu nhập này?')) {
      setHistory(history.filter(slip => slip.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
  
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý nhập kho</h2>
          <p className="text-sm text-gray-500 mt-1">Nhập hàng mới vào kho và cập nhật tồn kho</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- FORM NHẬP KHO (BÊN TRÁI) --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Phiếu nhập kho</h3>
            
            <div className="space-y-4">

              {/* Ngày & NCC */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">Thời gian nhập</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm text-gray-700 dark:text-white"
                      value={importDate}
                      onChange={(e) => setImportDate(e.target.value)}
                    />
                  </div>
                </div>

                <Input 
                  label="Nhà cung cấp (*)" 
                  placeholder="VD: Công ty TNHH ABC" 
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                />
              </div>

              {/* INPUT FORM THÊM SẢN PHẨM */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Thêm sản phẩm nhập</label>
                <div className="flex flex-col md:flex-row gap-3 items-end">
                  <div className="flex-[2] w-full">
                    <Select 
                      options={PRODUCTS.map(p => ({ value: p.id, label: p.name }))}
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      placeholder="-- Chọn sản phẩm --"
                    />
                  </div>
                  
                  <div className="w-full md:w-36">
                    <Input 
                      label="" type="number" placeholder="Giá nhập" 
                      value={importPrice} onChange={(e) => setImportPrice(e.target.value)}
                    />
                  </div>

                  <div className="w-full md:w-32">
                    <Input 
                      label="" type="number" placeholder="Số lượng" 
                      value={quantity} onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <div className="w-full md:w-[42px]">
                     <Button 
                       onClick={handleAddToTemp}
                       variant="success"
                       title="Thêm vào danh sách bên dưới"
                       className="px-0 h-[42px] w-full bg-[#05CD99] hover:bg-[#04B78A] text-white shadow-lg shadow-[#05CD99]/20"
                       icon={<Plus size={20} />} 
                     />
                  </div>
                </div>
              </div>

              {/* DANH SÁCH CHI TIẾT */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Danh sách chi tiết</label>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg min-h-[120px] bg-white dark:bg-gray-800">
                  {tempItems.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center">
                        <Box size={32} className="mb-2 opacity-50"/>
                        <p>Chưa có sản phẩm nào.</p>
                        <p className="text-xs mt-1">Vui lòng nhập thông tin ở trên và bấm nút (+) để thêm.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {tempItems.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 gap-3">
                          
                          {/* Thông tin sản phẩm */}
                          <div className="flex items-center w-full sm:w-auto">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 mr-3 flex-shrink-0">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800 dark:text-white line-clamp-1">{item.productName}</p>
                              <div className="text-xs text-gray-500 flex gap-2">
                                <span>{item.productId}</span>
                                <span className="text-gray-300">|</span>
                                <span>Giá: {item.importPrice.toLocaleString()}đ</span>
                              </div>
                            </div>
                          </div>

                          {/* Số lượng & Thành tiền */}
                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            
                            {/* Badge Số Lượng */}
                            <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800 min-w-[80px]">
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Số lượng</span>
                                <span className="text-xl font-bold text-blue-700 dark:text-blue-400 leading-none mt-0.5">{item.quantity}</span>
                            </div>

                            <div className="text-right min-w-[100px]">
                                <div className="text-xs text-gray-400 mb-0.5">Thành tiền</div>
                                <div className="text-sm font-bold text-gray-800 dark:text-white">
                                    {(item.quantity * item.importPrice).toLocaleString()}đ
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleRemoveTemp(index)} 
                                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Tổng tiền */}
                {tempItems.length > 0 && (
                    <div className="flex justify-end mt-4 items-center gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {currentTotal.toLocaleString()}đ
                        </span>
                    </div>
                )}
              </div>
            </div>

            {/* NÚT XÁC NHẬN (LUÔN SÁNG) */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <Button 
                onClick={handleConfirmAction}
                className="w-full py-3 text-base"
              >
                Xác nhận nhập kho
              </Button>
            </div>
          </div>
        </div>

        {/* --- LỊCH SỬ (BÊN PHẢI) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Lịch sử nhập kho</h3>
            <div className="space-y-4">
              {history.map((slip) => (
                <div key={slip.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800 group">
                  <div className="mb-3">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors">{slip.id}</span>
                      <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded dark:bg-green-900 dark:text-green-300">
                        {slip.totalValue ? slip.totalValue.toLocaleString() : 0}đ
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1 truncate">{slip.supplier}</p>
                    <p className="text-xs text-gray-400 mt-1">{slip.date}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-2 mb-3 border border-gray-100 dark:border-gray-700">
                    {slip.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs items-center">
                        <div className="flex items-center gap-2 overflow-hidden">
                             <Box size={12} className="text-gray-400 flex-shrink-0" />
                             <span className="text-gray-700 dark:text-gray-300 truncate">{item.productName}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                             <span className="text-gray-400">{item.importPrice?.toLocaleString()}</span>
                             <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1.5 rounded">x{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => handleDeleteSlip(slip.id)} variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 text-xs flex justify-center" icon={<Trash2 size={14} />}>
                    Xóa phiếu nhập
                  </Button>
                </div>
              ))}
              {history.length === 0 && <div className="text-center text-gray-400 text-sm py-4">Chưa có lịch sử nhập</div>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImportGoods;