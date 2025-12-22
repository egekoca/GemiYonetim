import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function MaintenancePage() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['maintenance', 'tasks'],
    queryFn: async () => {
      const response = await api.get('/maintenance/tasks');
      return response.data;
    },
  });

  const { data: overdueTasks } = useQuery({
    queryKey: ['maintenance', 'tasks', 'overdue'],
    queryFn: async () => {
      const response = await api.get('/maintenance/tasks/overdue');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

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
    <div className="p-6">
      {overdueTasks && overdueTasks.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">
            Geciken Bakım Görevleri ({overdueTasks.length})
          </h3>
          <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300">
            {overdueTasks.slice(0, 5).map((task: any) => (
              <li key={task.id}>
                {task.title} - {task.vessel?.name} - {formatDate(task.dueDate)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {tasks?.map((task: any) => (
            <li key={task.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {task.vessel?.name} | {task.equipment || 'Ekipman belirtilmemiş'} |{' '}
                        {task.location || 'Konum belirtilmemiş'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Bitiş: {formatDate(task.dueDate)} |{' '}
                        <span className={getPriorityColor(task.priority)}>
                          Öncelik: {task.priority}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {task.estimatedHours && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {task.estimatedHours} saat
                      </div>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

