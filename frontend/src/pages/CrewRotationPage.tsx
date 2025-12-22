import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Calendar, Ship, User } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function CrewRotationPage() {
  const { data: rotations, isLoading } = useQuery({
    queryKey: ['crew', 'rotations'],
    queryFn: async () => {
      const response = await api.get('/crew/rotations');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  const getRotationTypeColor = (type: string) => {
    switch (type) {
      case 'JOINING':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'SIGN_OFF':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'TRANSFER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'LEAVE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getRotationTypeLabel = (type: string) => {
    switch (type) {
      case 'JOINING':
        return 'Gemiye Katılma';
      case 'SIGN_OFF':
        return 'Gemiden Ayrılma';
      case 'TRANSFER':
        return 'Transfer';
      case 'LEAVE':
        return 'İzin';
      default:
        return type;
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {rotations?.map((rotation: any) => (
            <li key={rotation.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {rotation.crewMember?.firstName} {rotation.crewMember?.lastName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Ship className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {rotation.vessel?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(rotation.plannedDate)}
                      </p>
                      {rotation.actualDate && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Gerçek: {formatDate(rotation.actualDate)}
                        </p>
                      )}
                      {rotation.port && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Liman: {rotation.port}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getRotationTypeColor(
                        rotation.rotationType,
                      )}`}
                    >
                      {getRotationTypeLabel(rotation.rotationType)}
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

