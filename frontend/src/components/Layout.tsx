import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Ship, 
  FileText, 
  FileCheck, 
  Users,
  Package,
  ShoppingCart,
  Wrench,
  Navigation,
  LogOut,
  Moon,
  Sun,
  User,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Gemiler', href: '/vessels', icon: Ship },
    { name: 'Dokümanlar', href: '/documents', icon: FileText },
    { name: 'Sertifikalar', href: '/certificates', icon: FileCheck },
    { name: 'Mürettebat', href: '/crew', icon: Users },
    { name: 'Envanter', href: '/inventory', icon: Package },
    { name: 'Tedarik', href: '/procurement', icon: ShoppingCart },
    { name: 'Bakım', href: '/maintenance', icon: Wrench },
    { name: 'Seferler', href: '/voyages', icon: Navigation },
    { name: 'Gemi Jurnali', href: '/logbook', icon: FileText },
    { name: 'Makine Jurnali', href: '/engine-log', icon: Wrench },
    { name: 'Yakıt Yönetimi', href: '/fuel-management', icon: Package },
    { name: 'PSC Hazırlık', href: '/psc', icon: FileCheck },
    { name: 'Güvenlik Tatbikatları', href: '/safety', icon: Users },
    { name: 'Olay Raporlama', href: '/incidents', icon: AlertTriangle },
  ];

  // Get current page name
  const getCurrentPageName = () => {
    // Special cases for detail pages
    if (location.pathname.startsWith('/crew/') && location.pathname !== '/crew') {
      return 'Mürettebat Detayı';
    }
    if (location.pathname === '/inventory/transactions') {
      return 'Stok Hareketleri';
    }
    if (location.pathname === '/procurement/orders') {
      return 'Siparişler';
    }
    if (location.pathname === '/procurement/suppliers') {
      return 'Tedarikçiler';
    }
    if (location.pathname === '/maintenance/work-orders') {
      return 'İş Emirleri';
    }
    if (location.pathname === '/crew-rotation') {
      return 'Rotasyon Takvimi';
    }
    
    const currentNav = navigation.find((nav) => {
      if (nav.href === '/dashboard') {
        return location.pathname === '/dashboard' || location.pathname === '/';
      }
      return location.pathname.startsWith(nav.href);
    });
    return currentNav?.name || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">GDYS</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = 
              item.href === '/dashboard' 
                ? location.pathname === '/dashboard' || location.pathname === '/'
                : location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Page Title */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {getCurrentPageName()}
                </h2>
              </div>

              {/* Right Side - Profile & Actions */}
              <div className="flex items-center space-x-4">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  title={darkMode ? 'Light Mode' : 'Dark Mode'}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.role?.replace('_', ' ')}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>

                  {/* Profile Dropdown */}
                  {profileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Çıkış Yap
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
