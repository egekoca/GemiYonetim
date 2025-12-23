import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Wrench, Plus, Edit, Trash2, X, Calendar, TrendingUp, Gauge } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { useAuthStore } from '../store/authStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function EngineLogPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    vesselId: user?.vesselId || '',
    logDate: new Date().toISOString().split('T')[0],
    logTime: new Date().toTimeString().slice(0, 5),
    engineHours: '',
    rpm: '',
    fuelLevel: '',
    oilPressure: '',
    waterTemperature: '',
    exhaustTemperature: '',
    oilTemperature: '',
    loadPercentage: '',
    alarms: '',
    maintenanceNotes: '',
    remarks: '',
    engineerId: user?.id || '',
  });

  const { data: logs, isLoading } = useQuery({
    queryKey: ['engine-log', selectedDate],
    queryFn: async () => {
      const response = await api.get(`/engine-log?vesselId=${user?.vesselId}&startDate=${selectedDate}&endDate=${selectedDate}`);
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
      const response = await api.post('/engine-log', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engine-log'] });
      setIsCreateModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/engine-log/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engine-log'] });
      setIsEditModalOpen(false);
      setEditingLog(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/engine-log/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engine-log'] });
    },
  });

  const resetForm = () => {
    setFormData({
      vesselId: user?.vesselId || '',
      logDate: new Date().toISOString().split('T')[0],
      logTime: new Date().toTimeString().slice(0, 5),
      engineHours: '',
      rpm: '',
      fuelLevel: '',
      oilPressure: '',
      waterTemperature: '',
      exhaustTemperature: '',
      oilTemperature: '',
      loadPercentage: '',
      alarms: '',
      maintenanceNotes: '',
      remarks: '',
      engineerId: user?.id || '',
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      engineHours: formData.engineHours ? parseFloat(formData.engineHours) : undefined,
      rpm: formData.rpm ? parseFloat(formData.rpm) : undefined,
      fuelLevel: formData.fuelLevel ? parseFloat(formData.fuelLevel) : undefined,
      oilPressure: formData.oilPressure ? parseFloat(formData.oilPressure) : undefined,
      waterTemperature: formData.waterTemperature ? parseFloat(formData.waterTemperature) : undefined,
      exhaustTemperature: formData.exhaustTemperature ? parseFloat(formData.exhaustTemperature) : undefined,
      oilTemperature: formData.oilTemperature ? parseFloat(formData.oilTemperature) : undefined,
      loadPercentage: formData.loadPercentage ? parseFloat(formData.loadPercentage) : undefined,
    });
  };

  const handleEdit = (log: any) => {
    setEditingLog(log);
    setFormData({
      vesselId: log.vesselId || user?.vesselId || '',
      logDate: log.logDate ? log.logDate.split('T')[0] : new Date().toISOString().split('T')[0],
      logTime: log.logTime || new Date().toTimeString().slice(0, 5),
      engineHours: log.engineHours?.toString() || '',
      rpm: log.rpm?.toString() || '',
      fuelLevel: log.fuelLevel?.toString() || '',
      oilPressure: log.oilPressure?.toString() || '',
      waterTemperature: log.waterTemperature?.toString() || '',
      exhaustTemperature: log.exhaustTemperature?.toString() || '',
      oilTemperature: log.oilTemperature?.toString() || '',
      loadPercentage: log.loadPercentage?.toString() || '',
      alarms: log.alarms || '',
      maintenanceNotes: log.maintenanceNotes || '',
      remarks: log.remarks || '',
      engineerId: log.engineerId || user?.id || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLog) {
      updateMutation.mutate({
        id: editingLog.id,
        data: {
          ...formData,
          engineHours: formData.engineHours ? parseFloat(formData.engineHours) : undefined,
          rpm: formData.rpm ? parseFloat(formData.rpm) : undefined,
          fuelLevel: formData.fuelLevel ? parseFloat(formData.fuelLevel) : undefined,
          oilPressure: formData.oilPressure ? parseFloat(formData.oilPressure) : undefined,
          waterTemperature: formData.waterTemperature ? parseFloat(formData.waterTemperature) : undefined,
          exhaustTemperature: formData.exhaustTemperature ? parseFloat(formData.exhaustTemperature) : undefined,
          oilTemperature: formData.oilTemperature ? parseFloat(formData.oilTemperature) : undefined,
          loadPercentage: formData.loadPercentage ? parseFloat(formData.loadPercentage) : undefined,
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this engine log entry?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  // Prepare chart data
  const chartData = logs?.map((log: any) => ({
    time: log.logTime,
    temperature: log.waterTemperature || 0,
    pressure: log.oilPressure || 0,
    rpm: log.rpm || 0,
  })) || [];

  const renderForm = (onSubmit: (e: React.FormEvent) => void, isEdit: boolean) => (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
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
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.logDate}
            onChange={(e) => setFormData({ ...formData, logDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Time <span className="text-red-500">*</span>
        </label>
        <input
          type="time"
          required
          value={formData.logTime}
          onChange={(e) => setFormData({ ...formData, logTime: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Engine Hours
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.engineHours}
            onChange={(e) => setFormData({ ...formData, engineHours: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            RPM
          </label>
          <input
            type="number"
            step="1"
            value={formData.rpm}
            onChange={(e) => setFormData({ ...formData, rpm: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fuel Level (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.fuelLevel}
            onChange={(e) => setFormData({ ...formData, fuelLevel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Oil Pressure (bar)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.oilPressure}
            onChange={(e) => setFormData({ ...formData, oilPressure: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Water Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.waterTemperature}
            onChange={(e) => setFormData({ ...formData, waterTemperature: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Exhaust Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.exhaustTemperature}
            onChange={(e) => setFormData({ ...formData, exhaustTemperature: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Oil Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.oilTemperature}
            onChange={(e) => setFormData({ ...formData, oilTemperature: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Load Percentage (%)
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={formData.loadPercentage}
          onChange={(e) => setFormData({ ...formData, loadPercentage: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Alarms
        </label>
        <textarea
          value={formData.alarms}
          onChange={(e) => setFormData({ ...formData, alarms: e.target.value })}
          rows={2}
          placeholder="Any alarms..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Maintenance Notes
        </label>
        <textarea
          value={formData.maintenanceNotes}
          onChange={(e) => setFormData({ ...formData, maintenanceNotes: e.target.value })}
          rows={2}
          placeholder="Maintenance notes..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Remarks
        </label>
        <textarea
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          rows={2}
          placeholder="Additional notes..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 modal-input"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {
            if (isEdit) {
              setIsEditModalOpen(false);
              setEditingLog(null);
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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Engine Logbook</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Daily engine room records and parameter tracking
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
            New Entry
          </button>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Parameter Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#3b82f6" name="Water Temperature (°C)" />
              <Line type="monotone" dataKey="pressure" stroke="#10b981" name="Oil Pressure (bar)" />
              <Line type="monotone" dataKey="rpm" stroke="#f59e0b" name="RPM" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Logs List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {logs && logs.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {logs.map((log: any) => (
              <li key={log.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {log.logTime}
                          </p>
                          {log.rpm && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Gauge className="h-3 w-3 mr-1" />
                              {log.rpm} RPM
                            </div>
                          )}
                          {log.waterTemperature && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Water: {log.waterTemperature}°C
                            </div>
                          )}
                          {log.oilPressure && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Oil: {log.oilPressure} bar
                            </div>
                          )}
                        </div>
                        {log.maintenanceNotes && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                            {log.maintenanceNotes}
                          </p>
                        )}
                        {log.alarms && (
                          <p className="text-xs text-red-600 dark:text-red-400">
                            ⚠️ {log.alarms}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(log)}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        title="Delete"
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
            <Wrench className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No engine log entries found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No entries added yet for {formatDate(selectedDate)}.
            </p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-0 md:top-10 mx-auto p-3 md:p-5 border w-full max-w-2xl m-2 md:m-0 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">New Engine Log Entry</h3>
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
      {isEditModalOpen && editingLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-0 md:top-10 mx-auto p-3 md:p-5 border w-full max-w-2xl m-2 md:m-0 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Engine Log Entry</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingLog(null);
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

