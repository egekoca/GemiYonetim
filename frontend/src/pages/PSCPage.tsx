import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { FileCheck, Plus, Edit, Trash2, X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

const STANDARD_PSC_ITEMS = [
  { category: 'Certificates', item: 'Safety Management Certificate', status: 'COMPLIANT' },
  { category: 'Certificates', item: 'International Tonnage Certificate', status: 'COMPLIANT' },
  { category: 'Certificates', item: 'Load Line Certificate', status: 'COMPLIANT' },
  { category: 'Safety Equipment', item: 'Lifeboats', status: 'COMPLIANT' },
  { category: 'Safety Equipment', item: 'Life Rafts', status: 'COMPLIANT' },
  { category: 'Safety Equipment', item: 'Fire Extinguishers', status: 'COMPLIANT' },
  { category: 'Safety Equipment', item: 'Fire Hoses', status: 'COMPLIANT' },
  { category: 'Navigation', item: 'Radar', status: 'COMPLIANT' },
  { category: 'Navigation', item: 'GPS', status: 'COMPLIANT' },
  { category: 'Navigation', item: 'EPIRB', status: 'COMPLIANT' },
  { category: 'Crew', item: 'Valid Certificates', status: 'COMPLIANT' },
  { category: 'Crew', item: 'Medical Certificates', status: 'COMPLIANT' },
];

export default function PSCPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPSC, setEditingPSC] = useState<any>(null);
  const [formData, setFormData] = useState({
    vesselId: user?.vesselId || '',
    inspectionDate: new Date().toISOString().split('T')[0],
    port: '',
    inspector: '',
    overallStatus: 'COMPLIANT',
    checklistItems: STANDARD_PSC_ITEMS,
    deficiencies: '',
    remarks: '',
  });

  const { data: checklists, isLoading } = useQuery({
    queryKey: ['psc'],
    queryFn: async () => {
      const response = await api.get(`/psc?vesselId=${user?.vesselId}`);
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
      const response = await api.post('/psc', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psc'] });
      setIsCreateModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/psc/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psc'] });
      setIsEditModalOpen(false);
      setEditingPSC(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/psc/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psc'] });
    },
  });

  const resetForm = () => {
    setFormData({
      vesselId: user?.vesselId || '',
      inspectionDate: new Date().toISOString().split('T')[0],
      port: '',
      inspector: '',
      overallStatus: 'COMPLIANT',
      checklistItems: STANDARD_PSC_ITEMS,
      deficiencies: '',
      remarks: '',
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleEdit = (psc: any) => {
    setEditingPSC(psc);
    setFormData({
      vesselId: psc.vesselId || user?.vesselId || '',
      inspectionDate: psc.inspectionDate ? psc.inspectionDate.split('T')[0] : new Date().toISOString().split('T')[0],
      port: psc.port || '',
      inspector: psc.inspector || '',
      overallStatus: psc.overallStatus,
      checklistItems: psc.checklistItems || STANDARD_PSC_ITEMS,
      deficiencies: psc.deficiencies || '',
      remarks: psc.remarks || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPSC) {
      updateMutation.mutate({
        id: editingPSC.id,
        data: formData,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu PSC kontrol listesini silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const updateChecklistItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.checklistItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, checklistItems: newItems });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'NON_COMPLIANT':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'PARTIAL':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getItemStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'NON_COMPLIANT':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  const renderForm = (onSubmit: (e: React.FormEvent) => void, isEdit: boolean) => (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gemi <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.vesselId}
            onChange={(e) => setFormData({ ...formData, vesselId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
            İnceleme Tarihi <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.inspectionDate}
            onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Liman
          </label>
          <input
            type="text"
            value={formData.port}
            onChange={(e) => setFormData({ ...formData, port: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Müfettiş
          </label>
          <input
            type="text"
            value={formData.inspector}
            onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Genel Durum
        </label>
        <select
          value={formData.overallStatus}
          onChange={(e) => setFormData({ ...formData, overallStatus: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="COMPLIANT">Uyumlu</option>
          <option value="PARTIAL">Kısmen Uyumlu</option>
          <option value="NON_COMPLIANT">Uyumsuz</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Kontrol Listesi
        </label>
        <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
          {formData.checklistItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                <p className="text-sm text-gray-900 dark:text-white">{item.item}</p>
              </div>
              <select
                value={item.status}
                onChange={(e) => updateChecklistItem(index, 'status', e.target.value)}
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="COMPLIANT">Uyumlu</option>
                <option value="NON_COMPLIANT">Uyumsuz</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Eksiklikler
        </label>
        <textarea
          value={formData.deficiencies}
          onChange={(e) => setFormData({ ...formData, deficiencies: e.target.value })}
          rows={3}
          placeholder="Tespit edilen eksiklikler..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {
            if (isEdit) {
              setIsEditModalOpen(false);
              setEditingPSC(null);
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">PSC Hazırlık</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Port State Control hazırlık kontrol listesi
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kontrol Listesi
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {checklists && checklists.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {checklists.map((psc: any) => {
              const compliantCount = psc.checklistItems?.filter((i: any) => i.status === 'COMPLIANT').length || 0;
              const nonCompliantCount = psc.checklistItems?.filter((i: any) => i.status === 'NON_COMPLIANT').length || 0;
              const totalCount = psc.checklistItems?.length || 0;

              return (
                <li key={psc.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatDate(psc.inspectionDate)}
                            </p>
                            {psc.port && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {psc.port}
                              </p>
                            )}
                            {psc.inspector && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Müfettiş: {psc.inspector}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(psc.overallStatus)}`}>
                              {psc.overallStatus === 'COMPLIANT'
                                ? 'Uyumlu'
                                : psc.overallStatus === 'PARTIAL'
                                ? 'Kısmen Uyumlu'
                                : 'Uyumsuz'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {compliantCount}/{totalCount} Uyumlu
                            </span>
                            {nonCompliantCount > 0 && (
                              <span className="text-xs text-red-600 dark:text-red-400">
                                {nonCompliantCount} Eksiklik
                              </span>
                            )}
                          </div>
                          {psc.deficiencies && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              ⚠️ {psc.deficiencies}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(psc)}
                          className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(psc.id)}
                          className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-4 py-12 text-center">
            <FileCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              PSC kontrol listesi bulunamadı
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Henüz kontrol listesi eklenmemiş.
            </p>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Yeni PSC Kontrol Listesi</h3>
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

      {isEditModalOpen && editingPSC && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">PSC Kontrol Listesi Düzenle</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingPSC(null);
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

