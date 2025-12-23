import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Fuel, Plus, Edit, Trash2, X, Calendar, TrendingUp } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { useAuthStore } from '../store/authStore';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function FuelManagementPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFuel, setEditingFuel] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    vesselId: user?.vesselId || '',
    operationType: 'CONSUMPTION',
    operationDate: new Date().toISOString().split('T')[0],
    quantity: '',
    unitPrice: '',
    totalCost: '',
    tank: '',
    tankLevelBefore: '',
    tankLevelAfter: '',
    supplier: '',
    port: '',
    qualityTest: '',
    remarks: '',
  });

  const { data: fuels, isLoading } = useQuery({
    queryKey: ['fuel-management', selectedDate],
    queryFn: async () => {
      const response = await api.get(`/fuel-management?vesselId=${user?.vesselId}&startDate=${selectedDate}&endDate=${selectedDate}`);
      return response.data;
    },
  });

  const { data: vessels } = useQuery({
    queryKey: ['vessels'],
    queryFn: async () => {
      const response = await api.get('/vessels');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/fuel-management', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-management'] });
      setIsCreateModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/fuel-management/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-management'] });
      setIsEditModalOpen(false);
      setEditingFuel(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/fuel-management/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-management'] });
    },
  });

  const resetForm = () => {
    setFormData({
      vesselId: user?.vesselId || '',
      operationType: 'CONSUMPTION',
      operationDate: new Date().toISOString().split('T')[0],
      quantity: '',
      unitPrice: '',
      totalCost: '',
      tank: '',
      tankLevelBefore: '',
      tankLevelAfter: '',
      supplier: '',
      port: '',
      qualityTest: '',
      remarks: '',
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      quantity: parseFloat(formData.quantity),
      unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : undefined,
      totalCost: formData.totalCost ? parseFloat(formData.totalCost) : undefined,
      tankLevelBefore: formData.tankLevelBefore ? parseFloat(formData.tankLevelBefore) : undefined,
      tankLevelAfter: formData.tankLevelAfter ? parseFloat(formData.tankLevelAfter) : undefined,
    });
  };

  const handleEdit = (fuel: any) => {
    setEditingFuel(fuel);
    setFormData({
      vesselId: fuel.vesselId || user?.vesselId || '',
      operationType: fuel.operationType,
      operationDate: fuel.operationDate ? fuel.operationDate.split('T')[0] : new Date().toISOString().split('T')[0],
      quantity: fuel.quantity?.toString() || '',
      unitPrice: fuel.unitPrice?.toString() || '',
      totalCost: fuel.totalCost?.toString() || '',
      tank: fuel.tank || '',
      tankLevelBefore: fuel.tankLevelBefore?.toString() || '',
      tankLevelAfter: fuel.tankLevelAfter?.toString() || '',
      supplier: fuel.supplier || '',
      port: fuel.port || '',
      qualityTest: fuel.qualityTest || '',
      remarks: fuel.remarks || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFuel) {
      updateMutation.mutate({
        id: editingFuel.id,
        data: {
          ...formData,
          quantity: parseFloat(formData.quantity),
          unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : undefined,
          totalCost: formData.totalCost ? parseFloat(formData.totalCost) : undefined,
          tankLevelBefore: formData.tankLevelBefore ? parseFloat(formData.tankLevelBefore) : undefined,
          tankLevelAfter: formData.tankLevelAfter ? parseFloat(formData.tankLevelAfter) : undefined,
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu yakıt kaydını silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  // Prepare chart data
  const consumptionData = fuels?.filter((f: any) => f.operationType === 'CONSUMPTION').map((f: any) => ({
    date: formatDate(f.operationDate),
    quantity: f.quantity,
  })) || [];

  const bunkerData = fuels?.filter((f: any) => f.operationType === 'BUNKER').map((f: any) => ({
    date: formatDate(f.operationDate),
    quantity: f.quantity,
    cost: f.totalCost || 0,
  })) || [];

  const renderForm = (onSubmit: (e: React.FormEvent) => void, isEdit: boolean) => (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gemi <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.vesselId}
            onChange={(e) => setFormData({ ...formData, vesselId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          >
            <option value="">Gemi Seçin</option>
            {vessels?.map((vessel: any) => (
              <option key={vessel.id} value={vessel.id}>
                {vessel.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            İşlem Tipi <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.operationType}
            onChange={(e) => setFormData({ ...formData, operationType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          >
            <option value="BUNKER">Bunker</option>
            <option value="CONSUMPTION">Tüketim</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tarih <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.operationDate}
            onChange={(e) => setFormData({ ...formData, operationDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Miktar (Litre) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
      </div>

      {formData.operationType === 'BUNKER' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Birim Fiyat (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Toplam Maliyet (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.totalCost}
                onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tedarikçi
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Liman
              </label>
              <input
                type="text"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kalite Testi
            </label>
            <textarea
              value={formData.qualityTest}
              onChange={(e) => setFormData({ ...formData, qualityTest: e.target.value })}
              rows={2}
              placeholder="Kalite test sonuçları..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tank
          </label>
          <input
            type="text"
            value={formData.tank}
            onChange={(e) => setFormData({ ...formData, tank: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Önceki Seviye (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.tankLevelBefore}
            onChange={(e) => setFormData({ ...formData, tankLevelBefore: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sonraki Seviye (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.tankLevelAfter}
            onChange={(e) => setFormData({ ...formData, tankLevelAfter: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notlar
        </label>
        <textarea
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          rows={2}
          placeholder="Ek notlar..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {
            if (isEdit) {
              setIsEditModalOpen(false);
              setEditingFuel(null);
            } else {
              setIsCreateModalOpen(false);
            }
            resetForm();
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isEdit ? updateMutation.isPending : createMutation.isPending}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEdit
            ? updateMutation.isPending
              ? 'Güncelleniyor...'
              : 'Güncelle'
            : createMutation.isPending
            ? 'Kaydediliyor...'
            : 'Kaydet'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="p-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Yakıt Yönetimi</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Bunker operasyonları ve yakıt tüketim takibi
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
            />
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Kayıt
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {consumptionData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Günlük Tüketim
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#3b82f6" name="Tüketim (Litre)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {bunkerData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Bunker Operasyonları
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={bunkerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="quantity" stroke="#3b82f6" name="Miktar (Litre)" />
                <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#10b981" name="Maliyet (USD)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Fuel Records List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {fuels && fuels.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {fuels.map((fuel: any) => (
              <li key={fuel.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <Fuel className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {fuel.operationType === 'BUNKER'
                              ? 'Bunker'
                              : fuel.operationType === 'CONSUMPTION'
                              ? 'Tüketim'
                              : 'Transfer'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(fuel.operationDate)}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {fuel.quantity} Litre
                          </div>
                          {fuel.totalCost && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ${fuel.totalCost.toLocaleString()}
                            </div>
                          )}
                          {fuel.tank && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Tank: {fuel.tank}
                            </div>
                          )}
                        </div>
                        {fuel.remarks && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            {fuel.remarks}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(fuel)}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        title="Düzenle"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fuel.id)}
                        className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-12 text-center">
            <Fuel className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Yakıt kaydı bulunamadı
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {formatDate(selectedDate)} tarihi için henüz kayıt eklenmemiş.
            </p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-0 md:top-10 mx-auto p-3 md:p-5 border w-full max-w-2xl m-2 md:m-0 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Yeni Yakıt Kaydı</h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderForm(handleCreate, false)}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingFuel && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-0 md:top-10 mx-auto p-3 md:p-5 border w-full max-w-2xl m-2 md:m-0 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Yakıt Kaydı Düzenle</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingFuel(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderForm(handleUpdate, true)}
          </div>
        </div>
      )}
    </div>
  );
}

