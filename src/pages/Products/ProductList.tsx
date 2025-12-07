import React, { useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, Printer, 
  CheckSquare, Star, Package, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

// --- COMPONENT HỖ TRỢ: ĐÁNH GIÁ SAO ---
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex text-yellow-500">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={12} 
        fill={i < Math.floor(rating) ? "currentColor" : "none"} 
        strokeWidth={2} 
        className={i < rating ? "text-yellow-500" : "text-gray-300"} 
      />
    ))}
  </div>
);

// --- KIỂU DỮ LIỆU ---
interface Product {
  id: string;
  name: string;
  image: string; 
  category: string;
  price: number;
  importPrice: number;
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  status: 'active' | 'hidden';
}

// --- DỮ LIỆU MẪU ---
const INITIAL_PRODUCTS: Product[] = [
  { 
    id: 'P001', 
    name: 'Loa thông minh Echo Dot (Gen 4) - Tích hợp Alexa',
    image: '',
    category: 'Điện tử',
    price: 1500000, 
    importPrice: 800000, 
    stock: 145, 
    sold: 120, 
    rating: 4.5,
    reviewCount: 85,
    status: 'active' 
  },
  { 
    id: 'P002', 
    name: 'Máy đọc sách Kindle Paperwhite (8GB) - Màn hình 6.8"', 
    image: '',
    category: 'Máy tính bảng',
    price: 3200000, 
    importPrice: 2800000, 
    stock: 42, 
    sold: 450, 
    rating: 5.0, 
    reviewCount: 1200,
    status: 'active' 
  },
  { 
    id: 'P003', 
    name: 'Áo thun Cotton nam cao cấp - Thoáng mát', 
    image: '',
    category: 'Thời trang',
    price: 250000, 
    importPrice: 100000, 
    stock: 0, 
    sold: 85, 
    rating: 4.0, 
    reviewCount: 34,
    status: 'hidden' 
  },
  { 
    id: 'P004', 
    name: 'Tai nghe chống ồn Sony WH-1000XM5', 
    image: '',
    category: 'Âm thanh',
    price: 8490000, 
    importPrice: 6500000, 
    stock: 15, 
    sold: 22, 
    rating: 4.8, 
    reviewCount: 156,
    status: 'active' 
  },
];

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Product>({
    id: '', name: '', image: '', category: '', price: 0, importPrice: 0, stock: 0, sold: 0, rating: 5, reviewCount: 0, status: 'active'
  });
  const [isEditing, setIsEditing] = useState(false);

  // Xử lý xóa sản phẩm
  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Xử lý ẩn/hiện sản phẩm
  const handleToggleStatus = (id: string) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'active' ? 'hidden' : 'active' };
      }
      return p;
    }));
  };

  // Mở modal thêm mới
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ id: '', name: '', image: '', category: '', price: 0, importPrice: 0, stock: 0, sold: 0, rating: 5, reviewCount: 0, status: 'active' });
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const openEditModal = (product: Product) => {
    setIsEditing(true);
    setFormData(product);
    setIsModalOpen(true);
  };

  // Lưu dữ liệu form
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setProducts(products.map(p => p.id === formData.id ? formData : p));
    } else {
      setProducts([...products, { ...formData, id: formData.id || `P${Date.now()}` }]); 
    }
    setIsModalOpen(false);
  };

  // Lọc sản phẩm
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 animate-fadeIn font-sans text-[#232f3e] dark:text-gray-200">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-[#232f3e] dark:text-white">Kho Hàng</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quản lý danh sách sản phẩm và theo dõi lợi nhuận</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-dark-border rounded shadow-sm hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary text-gray-700 dark:text-gray-200 text-sm font-medium transition"
          >
            <Printer size={16} className="mr-2" /> In Báo Cáo
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-[#f0c14b] border border-[#a88734] rounded shadow-sm hover:bg-[#f4d078] text-[#111] text-sm font-medium transition"
          >
            <Plus size={16} className="mr-2" /> Thêm Sản Phẩm
          </button>
        </div>
      </div>

      {/* --- THANH TÌM KIẾM --- */}
      <div className="bg-white dark:bg-dark-bg-secondary p-4 rounded-sm border border-gray-200 dark:border-dark-border shadow-sm no-print">
        <Input 
          label="" 
          placeholder="Tìm kiếm theo tên sản phẩm, mã SKU..." 
          icon={Search} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* --- BẢNG DỮ LIỆU (Style Amazon) --- */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded border border-gray-200 dark:border-dark-border shadow-sm overflow-hidden print:border-none print:shadow-none card-print-style">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fafafa] dark:bg-dark-bg-tertiary border-b border-gray-200 dark:border-dark-border print:bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thông Tin Sản Phẩm</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Giá (Nhập / Bán)</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kho & Đánh Giá</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lợi Nhuận</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Trạng Thái</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right print:hidden">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {filteredProducts.map((p) => {
                const profit = p.price - p.importPrice;
                const profitMargin = p.price > 0 ? ((profit / p.price) * 100).toFixed(0) : '0';
                const isHidden = p.status === 'hidden';
                
                return (
                  <tr key={p.id} className={`hover:bg-[#f2fcfd] dark:hover:bg-dark-bg-tertiary/50 transition group ${isHidden ? 'opacity-60 bg-gray-50 dark:bg-dark-bg-tertiary/20' : ''}`}>
                    
                    {/* Cột 1: Thông tin */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center border border-gray-200 dark:border-gray-600">
                           {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover rounded"/> : <Package size={24} className="text-gray-400"/>}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#007185] dark:text-[#4dd0e1] hover:underline cursor-pointer line-clamp-2 leading-tight">
                            {p.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                            <span className="bg-gray-100 dark:bg-gray-700 px-1.5 rounded text-[10px] font-mono border border-gray-200 dark:border-gray-600">{p.id}</span>
                            <span>{p.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Giá cả */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Nhập: {p.importPrice.toLocaleString()}đ</span>
                        <span className="text-sm font-bold text-[#b12704] dark:text-[#ff6b6b]">{p.price.toLocaleString()}đ</span>
                      </div>
                    </td>

                    {/* Cột 3: Tồn kho & Rating */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div>
                          {p.stock > 10 
                            ? <span className="text-green-700 dark:text-green-400 text-xs font-bold flex items-center bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full w-fit"><CheckSquare size={12} className="mr-1"/> Còn {p.stock}</span> 
                            : <span className="text-[#b12704] dark:text-[#ff6b6b] text-xs font-bold flex items-center bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full w-fit"><AlertCircle size={12} className="mr-1"/> Chỉ còn {p.stock}</span>}
                        </div>
                        <div className="flex items-center mt-1" title={`${p.rating} sao`}>
                          <StarRating rating={p.rating} />
                          <span className="ml-1 text-xs text-gray-400">({p.reviewCount})</span>
                        </div>
                      </div>
                    </td>

                    {/* Cột 4: Lợi nhuận */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-green-700 dark:text-green-400">+{profit.toLocaleString()}đ</div>
                      <div className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded inline-block mt-1 border border-green-200 dark:border-green-800">
                        Lãi {profitMargin}%
                      </div>
                    </td>

                    {/* Cột 5: Trạng thái (Ẩn/Hiện) */}
                    <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleToggleStatus(p.id)}
                          className={`
                            p-1.5 rounded-md transition-colors border
                            ${isHidden 
                                ? 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600' 
                                : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'}
                          `}
                          title={isHidden ? "Nhấn để hiện sản phẩm" : "Nhấn để ẩn sản phẩm"}
                        >
                            {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <div className="text-[10px] mt-1 text-gray-400 font-medium">
                            {isHidden ? 'Đang ẩn' : 'Hiển thị'}
                        </div>
                    </td>

                    {/* Cột 6: Thao tác */}
                    <td className="px-6 py-4 text-right print:hidden">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(p)} 
                          className="p-2 text-gray-500 hover:text-[#007185] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)} 
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* --- MODAL (Thêm/Sửa) --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
      >
        <form onSubmit={handleSave} className="space-y-5">
           <Input 
            label="Đường dẫn ảnh (URL)" 
            placeholder="https://..." 
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Mã SKU" 
              placeholder="VD: P001" 
              value={formData.id}
              disabled={isEditing}
              onChange={(e) => setFormData({...formData, id: e.target.value})}
            />
            <Input 
              label="Danh mục" 
              placeholder="VD: Điện tử" 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
          </div>
          <Input 
            label="Tên sản phẩm" 
            placeholder="Nhập tên đầy đủ của sản phẩm" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
           <div className="grid grid-cols-2 gap-5">
            <Input 
              label="Giá nhập (VNĐ)" 
              type="number"
              value={formData.importPrice}
              onChange={(e) => setFormData({...formData, importPrice: Number(e.target.value)})}
            />
            <Input 
              label="Giá bán (VNĐ)" 
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
            />
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Input 
              label="Tồn kho" 
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
            />
            <Input 
              label="Đã bán" 
              type="number"
              value={formData.sold}
              onChange={(e) => setFormData({...formData, sold: Number(e.target.value)})}
            />
            <Input 
              label="Đánh giá (0-5)" 
              type="number"
              max="5" min="0" step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
            />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái:</label>
             <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'hidden'})}
                className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
             >
                <option value="active">Đang bán</option>
                <option value="hidden">Tạm ẩn</option>
             </select>
          </div>

          <div className="pt-4 flex gap-3 justify-end border-t border-gray-100 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
            <Button type="submit" className="bg-[#f0c14b] border border-[#a88734] hover:bg-[#f4d078] text-[#111] font-medium shadow-sm">
                {isEditing ? "Lưu thay đổi" : "Tạo sản phẩm"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductList;