import axios from 'axios';
import { mockApi } from './mockApi';

// Use mock API if VITE_USE_MOCK_API is true or if backend is not available
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.MODE === 'development';

// Helper to normalize URL path
const normalizePath = (url: string): string => {
  // Remove /api/ prefix if present
  let path = url.startsWith('/api/') ? url.substring(5) : url;
  // Remove leading slash if present
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  // Remove trailing slash if present
  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path;
};

// Mock API wrapper to match axios interface
const createMockApi = () => {
  return {
    get: async (url: string, config?: any) => {
      // Normalize URL
      const normalizedUrl = normalizePath(url);
      const [pathPart, queryPart] = normalizedUrl.split('?');
      const path = pathPart;
      const queryParams: Record<string, string> = {};
      
      console.log('Mock API GET:', { originalUrl: url, normalizedUrl, path });
      
      // Parse query params
      if (queryPart) {
        queryPart.split('&').forEach((param) => {
          const [key, value] = param.split('=');
          if (key) queryParams[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
      }
      
      // Also check config.params (axios style)
      if (config?.params) {
        Object.assign(queryParams, config.params);
      }
      
      if (path === 'auth/profile' || path === '/auth/profile') {
        return { data: await mockApi.getProfile() };
      }
      if (path === 'vessels') {
        return { data: await mockApi.getVessels() };
      }
      if (path.startsWith('vessels/')) {
        const id = path.split('/')[1];
        return { data: await mockApi.getVessel(id) };
      }
      if (path === 'categories') {
        return { data: await mockApi.getCategories() };
      }
      if (path === 'documents') {
        const vesselId = queryParams.vesselId;
        return { data: await mockApi.getDocuments(vesselId) };
      }
      if (path.startsWith('documents/')) {
        const parts = path.split('/');
        const id = parts[1];
        if (parts[2] === 'download') {
          return { data: await mockApi.getDocument(id) };
        }
        return { data: await mockApi.getDocument(id) };
      }
      if (path === 'certificates') {
        return { data: await mockApi.getCertificates() };
      }
      if (path === 'certificates/expiring') {
        const days = queryParams.days ? parseInt(queryParams.days, 10) : 30;
        return { data: await mockApi.getExpiringCertificates(days) };
      }
      if (path === 'certificates/expired') {
        return { data: await mockApi.getExpiredCertificates() };
      }
      if (path.startsWith('certificates/') && !path.includes('expiring') && !path.includes('expired')) {
        const id = path.split('/')[1];
        return { data: await mockApi.getCertificate(id) };
      }
      if (path === 'crew/members') {
        const vesselId = queryParams.vesselId;
        return { data: await mockApi.getCrewMembers(vesselId) };
      }
      if (path.startsWith('crew/members/')) {
        const id = path.split('/')[2];
        return { data: await mockApi.getCrewMember(id) };
      }
      if (path === 'crew/certificates/expiring') {
        const days = queryParams.days ? parseInt(queryParams.days, 10) : 30;
        return { data: await mockApi.getExpiringCrewCertificates(days) };
      }
      if (path === 'crew/certificates/expired') {
        return { data: await mockApi.getExpiredCrewCertificates() };
      }
      if (path === 'crew/trainings') {
        const crewMemberId = queryParams.crewMemberId;
        return { data: await mockApi.getCrewTrainings(crewMemberId) };
      }
      if (path === 'crew/rotations') {
        const crewMemberId = queryParams.crewMemberId;
        const vesselId = queryParams.vesselId;
        return { data: await mockApi.getCrewRotations(crewMemberId, vesselId) };
      }
      if (path === 'inventory/items') {
        const vesselId = queryParams.vesselId;
        const locationId = queryParams.locationId;
      console.log('Mock API: Getting inventory items', { path, vesselId, locationId });
      const data = await mockApi.getInventoryItems(vesselId, locationId);
      console.log('Mock API: Inventory items result', data);
      return { data };
      }
      if (path === 'inventory/items/low-stock') {
        const vesselId = queryParams.vesselId;
        return { data: await mockApi.getLowStockItems(vesselId) };
      }
      if (path === 'inventory/items/expiring') {
        const days = queryParams.days ? parseInt(queryParams.days, 10) : 30;
        const vesselId = queryParams.vesselId;
        return { data: await mockApi.getExpiringItems(days, vesselId) };
      }
      if (path.startsWith('inventory/items/')) {
        const id = path.split('/')[2];
        return { data: await mockApi.getInventoryItem(id) };
      }
      if (path === 'inventory/transactions') {
        const itemId = queryParams.itemId;
        const vesselId = queryParams.vesselId;
        return { data: await mockApi.getInventoryTransactions(itemId, vesselId) };
      }
      if (path === 'procurement/requests') {
        const vesselId = queryParams.vesselId;
        return { data: await mockApi.getProcurementRequests(vesselId) };
      }
      if (path.startsWith('procurement/requests/')) {
        const id = path.split('/')[2];
        return { data: await mockApi.getProcurementRequest(id) };
      }
      if (path === 'procurement/orders') {
        const vesselId = queryParams.vesselId;
        const status = queryParams.status;
        return { data: await mockApi.getProcurementOrders(vesselId, status) };
      }
      if (path.startsWith('procurement/orders/')) {
        const id = path.split('/')[2];
        return { data: await mockApi.getProcurementOrder(id) };
      }
      if (path === 'procurement/suppliers') {
        return { data: await mockApi.getSuppliers() };
      }
      if (path.startsWith('procurement/suppliers/')) {
        const id = path.split('/')[2];
        return { data: await mockApi.getSupplier(id) };
      }
      if (path === 'maintenance/tasks') {
        const vesselId = queryParams.vesselId;
        const status = queryParams.status;
        return { data: await mockApi.getMaintenanceTasks(vesselId, status) };
      }
      if (path === 'maintenance/tasks/overdue') {
        const vesselId = queryParams.vesselId;
        return { data: await mockApi.getOverdueTasks(vesselId) };
      }
      if (path.startsWith('maintenance/tasks/')) {
        const id = path.split('/')[2];
        return { data: await mockApi.getMaintenanceTask(id) };
      }
      if (path === 'maintenance/work-orders') {
        const vesselId = queryParams.vesselId;
        const status = queryParams.status;
        return { data: await mockApi.getWorkOrders(vesselId, status) };
      }
      if (path.startsWith('maintenance/work-orders/')) {
        const id = path.split('/')[2];
        return { data: await mockApi.getWorkOrder(id) };
      }
      if (path === 'voyages') {
        const vesselId = queryParams.vesselId;
        const status = queryParams.status;
        return { data: await mockApi.getVoyages(vesselId, status) };
      }
      if (path.startsWith('voyages/')) {
        const id = path.split('/')[1];
        return { data: await mockApi.getVoyage(id) };
      }
      if (path === 'logbook') {
        const vesselId = queryParams.vesselId;
        const startDate = queryParams.startDate;
        const endDate = queryParams.endDate;
        return { data: await mockApi.getLogbookEntries(vesselId, startDate, endDate) };
      }
      if (path.startsWith('logbook/')) {
        const parts = path.split('/');
        const id = parts[1];
        if (parts[2] === 'sign') {
          return { data: await mockApi.signLogbookEntry(id, '1') };
        }
        return { data: await mockApi.getLogbookEntry(id) };
      }
      if (path === 'analytics/dashboard') {
        const vesselId = queryParams.vesselId;
        return { data: await mockApi.getDashboardKPIs(vesselId) };
      }
      if (path === 'analytics/maintenance') {
        const vesselId = queryParams.vesselId;
        return { data: await mockApi.getMaintenanceStats(vesselId) };
      }
      if (path === 'analytics/inventory') {
        const vesselId = queryParams.vesselId;
        return { data: await mockApi.getInventoryStats(vesselId) };
      }
      if (path === 'analytics/procurement') {
        const vesselId = queryParams.vesselId;
        return { data: await mockApi.getProcurementStats(vesselId) };
      }
      
      throw new Error(`Mock API: Route not found - ${path}`);
    },
    post: async (url: string, data?: any, config?: any) => {
      const normalizedUrl = normalizePath(url);
      let path = normalizedUrl.split('?')[0];
      
      // Ensure path doesn't start with /
      if (path.startsWith('/')) {
        path = path.substring(1);
      }
      
      // Handle auth routes
      if (path === 'auth/login') {
        return { data: await mockApi.login(data.email, data.password) };
      }
      if (path === 'auth/register') {
        return { data: await mockApi.register(data) };
      }
      if (path === 'vessels') {
        return { data: await mockApi.createVessel(data) };
      }
      if (path.startsWith('vessels/')) {
        const parts = path.split('/');
        const id = parts[1];
        if (parts.length === 2) {
          // PUT /vessels/:id
          return { data: await mockApi.updateVessel(id, data) };
        }
      }
      if (path === 'documents') {
        // For file upload, data will be FormData
        if (data instanceof FormData) {
          const documentData = {
            title: data.get('title') || 'Untitled',
            description: data.get('description') || '',
            vesselId: data.get('vesselId') || '',
            categoryId: data.get('categoryId') || '',
          };
          const file = data.get('file') as File;
          return { data: await mockApi.createDocument(documentData, file) };
        }
        // Regular POST with JSON
        return { data: await mockApi.createDocument(data, null) };
      }
      if (path.includes('/approve')) {
        const id = path.split('/')[1];
        return { data: await mockApi.approveDocument(id) };
      }
      if (path.includes('/reject')) {
        const id = path.split('/')[1];
        return { data: await mockApi.rejectDocument(id, data.reason) };
      }
      if (path === 'crew/members') {
        return { data: await mockApi.createCrewMember(data) };
      }
      if (path === 'inventory/items') {
        return { data: await mockApi.createInventoryItem(data) };
      }
      if (path === 'inventory/transactions') {
        return { data: await mockApi.createInventoryTransaction(data, '1') };
      }
      if (path === 'maintenance/tasks') {
        return { data: await mockApi.createMaintenanceTask(data) };
      }
      if (path === 'voyages') {
        return { data: await mockApi.createVoyage(data) };
      }
      if (path === 'procurement/requests') {
        return { data: await mockApi.createProcurementRequest(data) };
      }
      if (path === 'logbook') {
        return { data: await mockApi.createLogbookEntry(data) };
      }
      if (path === 'engine-log') {
        return { data: await mockApi.createEngineLog(data) };
      }
      if (path === 'fuel-management') {
        return { data: await mockApi.createFuelConsumption(data) };
      }
      if (path === 'psc') {
        return { data: await mockApi.createPSCChecklist(data) };
      }
      if (path === 'safety') {
        return { data: await mockApi.createSafetyDrill(data) };
      }
      if (path === 'incidents') {
        return { data: await mockApi.createIncident(data) };
      }
      
      throw new Error(`Mock API: Route not found - ${path} (original URL: ${url})`);
    },
    put: async (url: string, data?: any) => {
      const normalizedUrl = normalizePath(url);
      const path = normalizedUrl.split('?')[0];

      console.log(`Mock API PUT: path=${path}, data=${JSON.stringify(data)}, originalUrl=${url}`);

      // Mock update operations
      if (path.startsWith('crew/members/')) {
        const id = path.split('/')[2];
        return { data: await mockApi.updateCrewMember(id, data) };
      }
      if (path.startsWith('crew-members/')) {
        const id = path.split('/')[1];
        return { data: await mockApi.updateCrewMember(id, data) };
      }
      if (path.startsWith('vessels/')) {
        const id = path.split('/')[1];
        return { data: await mockApi.updateVessel(id, data) };
      }
      if (path.startsWith('inventory/items/')) {
        const id = path.split('/')[2];
        return { data: await mockApi.updateInventoryItem(id, data) };
      }
      if (path.startsWith('inventory-items/')) {
        const id = path.split('/')[1];
        return { data: await mockApi.updateInventoryItem(id, data) };
      }
      if (path.startsWith('maintenance/tasks/')) {
        const id = path.split('/')[2];
        return { data: await mockApi.updateMaintenanceTask(id, data) };
      }
      if (path.startsWith('voyages/')) {
        const id = path.split('/')[1];
        return { data: await mockApi.updateVoyage(id, data) };
      }
      if (path.startsWith('procurement/requests/')) {
        const id = path.split('/')[2];
        return { data: await mockApi.updateProcurementRequest(id, data) };
      }
      if (path.startsWith('logbook/') && !path.includes('/sign')) {
        const id = path.split('/')[1];
        return { data: await mockApi.updateLogbookEntry(id, data) };
      }
      if (path.startsWith('engine-log/')) {
        const id = path.split('/')[1];
        return { data: await mockApi.updateEngineLog(id, data) };
      }
      if (path.startsWith('fuel-management/')) {
        const id = path.split('/')[1];
        return { data: await mockApi.updateFuelConsumption(id, data) };
      }
      if (path.startsWith('psc/')) {
        const id = path.split('/')[1];
        return { data: await mockApi.updatePSCChecklist(id, data) };
      }
      return { data: { ...data, updatedAt: new Date().toISOString() } };
    },
    delete: async (url: string) => {
      const normalizedUrl = normalizePath(url);
      const path = normalizedUrl.split('?')[0];
      // Mock delete operations
      return { data: { success: true } };
    },
  };
};

const realApi = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and vesselId
realApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const parsed = JSON.parse(token);
        if (parsed.state?.token) {
          config.headers.Authorization = `Bearer ${parsed.state.token}`;
        }
        // Add vesselId to query params if user has one and it's not already set
        if (parsed.state?.user?.vesselId && !config.params?.vesselId) {
          // Only add vesselId if user is not SYSTEM_ADMIN or DPA_OFFICE
          const userRole = parsed.state?.user?.role;
          if (userRole !== 'SYSTEM_ADMIN' && userRole !== 'DPA_OFFICE') {
            config.params = config.params || {};
            config.params.vesselId = parsed.state.user.vesselId;
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
realApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Export mock or real API based on configuration
const api = USE_MOCK_API ? createMockApi() : realApi;

export default api;

