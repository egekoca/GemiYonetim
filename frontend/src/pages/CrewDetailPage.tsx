import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeft, FileCheck, BookOpen, Calendar } from 'lucide-react';
import { formatDate, getDaysUntil, getCertificateStatus } from '../lib/utils';

export default function CrewDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: crewMember, isLoading } = useQuery({
    queryKey: ['crew', 'members', id],
    queryFn: async () => {
      const response = await api.get(`/crew/members/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!crewMember) {
    return <div className="text-center py-12">Crew member not found</div>;
  }

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
      <Link
        to="/crew"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Crew
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Certificates */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Certificates</h2>
          </div>
          <div className="space-y-3">
            {crewMember.certificates?.map((cert: any) => {
              const status = getCertificateStatus(cert.expiryDate);
              const daysUntil = getDaysUntil(cert.expiryDate);
              return (
                <div
                  key={cert.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {cert.certificateType}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {cert.certificateNumber} | {cert.issuingAuthority}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Expiry: {formatDate(cert.expiryDate)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
                      {status === 'expired'
                        ? 'Expired'
                        : status === 'warning'
                        ? `${daysUntil} days left`
                        : 'Active'}
                    </span>
                  </div>
                </div>
              );
            })}
            {(!crewMember.certificates || crewMember.certificates.length === 0) && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No certificates found</p>
            )}
          </div>
        </div>

        {/* Trainings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Trainings</h2>
          </div>
          <div className="space-y-3">
            {crewMember.trainings?.map((training: any) => (
              <div
                key={training.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {training.trainingName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {training.trainingType} | {training.provider || 'N/A'}
                </p>
                {training.startDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(training.startDate)} -{' '}
                    {training.endDate ? formatDate(training.endDate) : 'In progress'}
                  </p>
                )}
              </div>
            ))}
            {(!crewMember.trainings || crewMember.trainings.length === 0) && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No trainings found</p>
            )}
          </div>
        </div>
      </div>

      {/* Rotations */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Rotation History</h2>
        </div>
        <div className="space-y-3">
          {crewMember.rotations?.map((rotation: any) => (
            <div
              key={rotation.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {rotation.rotationType} - {rotation.vessel?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Planned: {formatDate(rotation.plannedDate)}
                    {rotation.actualDate && ` | Actual: ${formatDate(rotation.actualDate)}`}
                  </p>
                  {rotation.port && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Port: {rotation.port}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {(!crewMember.rotations || crewMember.rotations.length === 0) && (
            <p className="text-sm text-gray-500 dark:text-gray-400">No rotations found</p>
          )}
        </div>
      </div>
    </div>
  );
}

