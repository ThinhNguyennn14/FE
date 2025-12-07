import React, { useState, useEffect } from 'react';
import { Plus, Search, History, User, Printer, Loader } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { apiFetch } from '../../utils/api'; // Import

interface Customer {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  orders_count?: number;
  spent?: number;
  customer_code?: string;
}

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch Data
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const data = await apiFetch('/customers');
        setCustomers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Err fetching customers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.customer_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => window.print();

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-[#2B3674] dark:text-dark-text-primary">Khách hàng</h2>
          <p className="text-sm text-gray-500 mt-1">Thông tin và lịch sử mua hàng</p>
        </div>
        <div className="flex gap-3">
          <Button variant="neon" icon={<Printer size={18} />} onClick={handlePrint}>In danh sách</Button>
          <Button icon={<Plus size={18} />}>Thêm khách hàng</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-bg-secondary p-4 rounded-[20px] shadow-sm border border-gray-100 dark:border-dark-border">
        <Input 
          label="" placeholder="Tìm kiếm khách hàng..." icon={Search} 
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-md"
        />
      </div>

      <div className="bg-white dark:bg-dark-bg-secondary rounded-[20px] shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden card-print-style">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-dark-bg-tertiary border-b border-gray-100 dark:border-dark-border">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mã KH</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Thông tin cá nhân</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Liên hệ</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Chi tiêu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary/50 transition-colors">
                <td className="px-6 py-4 font-bold text-primary">{customer.customer_code || `#${customer.id}`}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#2B3674] dark:text-white">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  <div>{customer.email}</div>
                  <div className="text-xs text-gray-400">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="font-bold text-green-600">{customer.spent?.toLocaleString()}đ</div>
                  <div className="text-xs text-gray-400">{customer.orders_count} đơn hàng</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;