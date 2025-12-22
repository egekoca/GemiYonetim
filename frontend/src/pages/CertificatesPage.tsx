import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { FileCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatDate, getDaysUntil, getCertificateStatus } from '../lib/utils';

export default function CertificatesPage() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const response = await api.get('/certificates');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired':
        return <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {certificates?.map((cert: any) => {
            const status = getCertificateStatus(cert.expiryDate);
            const daysUntil = getDaysUntil(cert.expiryDate);
            return (
              <li key={cert.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {cert.document?.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {cert.issuingAuthority} | Bitiş: {formatDate(cert.expiryDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status)}
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
                          {status === 'expired' 
                            ? 'Süresi Dolmuş' 
                            : status === 'warning'
                            ? `${daysUntil} gün kaldı`
                            : 'Aktif'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

