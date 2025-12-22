// Mock mode indicator component
export default function MockModeIndicator() {
  const isMockMode = import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.MODE === 'development';
  
  if (!isMockMode) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50">
      🧪 Mock Mode Active
    </div>
  );
}

