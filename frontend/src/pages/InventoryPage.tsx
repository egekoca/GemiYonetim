import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Package, AlertTriangle, CheckCircle, Plus, Edit, Trash2, X } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

export default function InventoryPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    partNumber: '',
    manufacturer: '',
    unit: 'PIECE',
    quantity: '',
    minimumQuantity: '',
    maximumQuantity: '',
    unitPrice: '',
    expiryDate: '',
    category: '',
    vesselId: user?.vesselId || '',
    locationId: '',
  });

  const { data: items, isLoading, error } = useQuery({
    queryKey: ['inventory', 'items'],
    queryFn: async () => {
      console.log('InventoryPage: Fetching inventory items');
      const response = await api.get('/inventory/items');
      console.log('InventoryPage: Received response', response.data);
      return response.data;
    },
  });

  const { data: lowStockItems } = useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: async () => {
      const response = await api.get('/inventory/items/low-stock');
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

  const { data: locations } = useQuery({
    queryKey: ['inventory', 'locations'],
    queryFn: async () => {
      const response = await api.get('/inventory/locations');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/inventory/items', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'items'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'low-stock'] });
      setIsCreateModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/inventory/items/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'items'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'low-stock'] });
      setIsEditModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/inventory/items/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'items'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'low-stock'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      partNumber: '',
      manufacturer: '',
      unit: 'PIECE',
      quantity: '',
      minimumQuantity: '',
      maximumQuantity: '',
      unitPrice: '',
      expiryDate: '',
      category: '',
      vesselId: user?.vesselId || '',
      locationId: '',
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      quantity: formData.quantity ? parseFloat(formData.quantity) : 0,
      minimumQuantity: formData.minimumQuantity ? parseFloat(formData.minimumQuantity) : undefined,
      maximumQuantity: formData.maximumQuantity ? parseFloat(formData.maximumQuantity) : undefined,
      unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : undefined,
      locationId: formData.locationId || undefined,
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      partNumber: item.partNumber || '',
      manufacturer: item.manufacturer || '',
      unit: item.unit || 'PIECE',
      quantity: item.quantity?.toString() || '',
      minimumQuantity: item.minimumQuantity?.toString() || '',
      maximumQuantity: item.maximumQuantity?.toString() || '',
      unitPrice: item.unitPrice?.toString() || '',
      expiryDate: item.expiryDate || '',
      category: item.category || '',
      vesselId: item.vesselId || user?.vesselId || '',
      locationId: item.locationId || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({
        id: editingItem.id,
        data: {
          ...formData,
          quantity: formData.quantity ? parseFloat(formData.quantity) : 0,
          minimumQuantity: formData.minimumQuantity ? parseFloat(formData.minimumQuantity) : undefined,
          maximumQuantity: formData.maximumQuantity ? parseFloat(formData.maximumQuantity) : undefined,
          unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : undefined,
          locationId: formData.locationId || undefined,
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    console.error('InventoryPage error:', error);
    return <div className="text-center py-12 text-red-600">Error: {String(error)}</div>;
  }

  const renderForm = (onSubmit: (e: React.FormEvent) => void, isEdit: boolean) => (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Part Number
          </label>
          <input
            type="text"
            value={formData.partNumber}
            onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Manufacturer
          </label>
          <input
            type="text"
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Unit <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          >
            <option value="PIECE">Piece</option>
            <option value="KG">Kilogram</option>
            <option value="LITER">Liter</option>
            <option value="METER">Meter</option>
            <option value="BOX">Box</option>
            <option value="PALLET">Pallet</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantity <span className="text-red-500">*</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Minimum Quantity
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.minimumQuantity}
            onChange={(e) => setFormData({ ...formData, minimumQuantity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Maximum Quantity
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.maximumQuantity}
            onChange={(e) => setFormData({ ...formData, maximumQuantity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Unit Price
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
            Expiry Date
          </label>
          <input
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Vessel <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.vesselId}
            onChange={(e) => setFormData({ ...formData, vesselId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          >
            <option value="">Select Vessel</option>
            {vessels?.map((vessel: any) => (
              <option key={vessel.id} value={vessel.id}>
                {vessel.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <select
            value={formData.locationId}
            onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          >
                  <option value="">Select Location</option>
            {locations?.map((location: any) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {
            if (isEdit) {
              setIsEditModalOpen(false);
              setEditingItem(null);
            } else {
              setIsCreateModalOpen(false);
            }
            resetForm();
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isEdit ? updateMutation.isPending : createMutation.isPending}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEdit
            ? updateMutation.isPending
              ? 'Updating...'
              : 'Update'
            : createMutation.isPending
            ? 'Saving...'
            : 'Save'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="p-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Inventory</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Stock tracking and management
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-outline-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Inventory Item
        </button>
      </div>

      {lowStockItems && lowStockItems.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-400 mb-2">
            Low Stock Warning ({lowStockItems.length} items)
          </h3>
          <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300">
            {lowStockItems.slice(0, 5).map((item: any) => (
              <li key={item.id}>
                {item.name} - Current: {item.quantity} {item.unit} | Minimum: {item.minimumQuantity}{' '}
                {item.unit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Inventory Items List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {!items || items.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No inventory items found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No inventory records added yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                    <span className="sr-only">Icon</span>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                    Product
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                    Vessel
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                    Location
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                    Part No
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[140px]">
                    Quantity
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]">
                    Warnings
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item: any) => {
                  const isLowStock =
                    item.minimumQuantity && item.quantity <= item.minimumQuantity;
                  const isExpiring =
                    item.expiryDate &&
                    new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                          {item.name}
                        </div>
                        {item.expiryDate && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Expiry: {formatDate(item.expiryDate)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                          {item.vessel?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                          {item.location?.name || 'Location not specified'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
                          {item.partNumber || 'Part No: N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.quantity} {item.unit}
                        </div>
                        {item.minimumQuantity && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Min: {item.minimumQuantity} {item.unit}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {isLowStock && (
                            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          )}
                          {isExpiring && (
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          )}
                          {!isLowStock && !isExpiring && (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start md:items-center justify-center p-2 md:p-4">
          <div className="relative w-full max-w-2xl border shadow-lg rounded-md bg-white dark:bg-gray-800 p-3 md:p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Add New Inventory Item
              </h3>
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
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start md:items-center justify-center p-2 md:p-4">
          <div className="relative w-full max-w-2xl border shadow-lg rounded-md bg-white dark:bg-gray-800 p-3 md:p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Edit Inventory Item
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
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
