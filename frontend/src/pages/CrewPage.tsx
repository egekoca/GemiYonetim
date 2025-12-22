import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatDate, getDaysUntil, getCertificateStatus } from '../lib/utils';

export default function CrewPage() {
  const { data: crewMembers, isLoading } = useQuery({
    queryKey: ['crew', 'members'],
    queryFn: async () => {
      const response = await api.get('/crew/members');
      return response.data;
    },
  });

  const { data: expiringCerts } = useQuery({
    queryKey: ['crew', 'certificates', 'expiring'],
    queryFn: async () => {
      const response = await api.get('/crew/certificates/expiring?days=30');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  return (
    <div className="p-6">
      {expiringCerts && expiringCerts.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-400 mb-2">
            Yakında Dolacak Mürettebat Sertifikaları ({expiringCerts.length})
          </h3>
          <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300">
            {expiringCerts.slice(0, 5).map((cert: any) => (
              <li key={cert.id}>
                {cert.crewMember?.firstName} {cert.crewMember?.lastName} - {cert.certificateType} -{' '}
                {new Date(cert.expiryDate).toLocaleDateString('tr-TR')}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {crewMembers?.map((member: any) => {
            const expiringCertsCount = member.certificates?.filter((c: any) => {
              const status = getCertificateStatus(c.expiryDate);
              return status === 'warning' || status === 'expired';
            }).length || 0;

            return (
              <li key={member.id}>
                <Link to={`/crew/${member.id}`}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {member.position} | {member.vessel?.name || 'Atanmamış'} |{' '}
                            {member.nationality || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {member.certificates?.length || 0} sertifika
                        </div>
                        {expiringCertsCount > 0 && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-sm text-yellow-600 dark:text-yellow-400">
                              {expiringCertsCount}
                            </span>
                          </div>
                        )}
                        {expiringCertsCount === 0 && member.certificates?.length > 0 && (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

