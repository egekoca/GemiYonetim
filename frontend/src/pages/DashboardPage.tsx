import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Ship, Users, Wrench, Package } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const { data: certificates } = useQuery({
    queryKey: ['certificates', 'expiring'],
    queryFn: async () => {
      const response = await api.get('/certificates/expiring?days=30');
      return response.data;
    },
  });

  const { data: expired } = useQuery({
    queryKey: ['certificates', 'expired'],
    queryFn: async () => {
      const response = await api.get('/certificates/expired');
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

  const { data: kpis } = useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    },
  });

  const { data: maintenanceStats } = useQuery({
    queryKey: ['analytics', 'maintenance'],
    queryFn: async () => {
      const response = await api.get('/analytics/maintenance');
      return response.data;
    },
  });

  const { data: maintenanceTasks } = useQuery({
    queryKey: ['maintenance', 'tasks'],
    queryFn: async () => {
      const response = await api.get('/maintenance/tasks');
      return response.data;
    },
  });

  // Prepare chart data
  const maintenanceChartData = maintenanceStats
    ? [
        { name: 'Completed', value: maintenanceStats.completed, color: '#10b981' },
        { name: 'Pending', value: maintenanceStats.pending, color: '#f59e0b' },
        { name: 'In Progress', value: maintenanceStats.inProgress || 0, color: '#3b82f6' },
        { name: 'Overdue', value: maintenanceStats.overdue, color: '#ef4444' },
      ].filter((item) => item.value > 0)
    : [];

  const certificateChartData = [
    { name: 'Active', value: 10, color: '#10b981' },
    { name: 'Expiring Soon', value: certificates?.length || 0, color: '#f59e0b' },
    { name: 'Expired', value: expired?.length || 0, color: '#ef4444' },
  ].filter((item) => item.value > 0);

  return (
    <div className="p-6">

      {/* KPI Cards - 4 cards side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Ship className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Vessels
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {vessels?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Expiring Certificates
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {kpis?.expiringCertificates || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Overdue Maintenance
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {kpis?.overdueTasks || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Low Stock
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {kpis?.lowStockItems || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts - 2 charts side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Maintenance Status Pie Chart */}
        {maintenanceChartData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Maintenance Tasks Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={maintenanceChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {maintenanceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Certificate Status Bar Chart */}
        {certificateChartData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Certificate Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={certificateChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {certificateChartData.map((entry, index) => (
                    <Cell key={`cell-cert-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Maintenance Tasks
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vessel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {maintenanceTasks?.slice(0, 5).map((task: any) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'COMPLETED':
                      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                    case 'IN_PROGRESS':
                      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
                    case 'OVERDUE':
                      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                    case 'PENDING':
                      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
                    default:
                      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
                  }
                };

                const getPriorityColor = (priority: string) => {
                  switch (priority) {
                    case 'CRITICAL':
                      return 'text-red-600 dark:text-red-400';
                    case 'HIGH':
                      return 'text-orange-600 dark:text-orange-400';
                    case 'MEDIUM':
                      return 'text-yellow-600 dark:text-yellow-400';
                    default:
                      return 'text-gray-600 dark:text-gray-400';
                  }
                };

                return (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </div>
                      {task.equipment && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {task.equipment}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {task.vessel?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          task.status,
                        )}`}
                      >
                        {task.status === 'COMPLETED'
                          ? 'Completed'
                          : task.status === 'IN_PROGRESS'
                          ? 'In Progress'
                          : task.status === 'OVERDUE'
                          ? 'Overdue'
                          : task.status === 'PENDING'
                          ? 'Pending'
                          : task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'CRITICAL'
                          ? 'Critical'
                          : task.priority === 'HIGH'
                          ? 'High'
                          : task.priority === 'MEDIUM'
                          ? 'Medium'
                          : task.priority === 'LOW'
                          ? 'Low'
                          : task.priority}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {(!maintenanceTasks || maintenanceTasks.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No maintenance tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
