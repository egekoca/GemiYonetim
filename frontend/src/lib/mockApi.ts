import {
  mockUsers,
  mockVessels,
  mockCategories,
  mockDocuments,
  mockCertificates,
  mockCrewMembers,
  mockCrewCertificates,
  mockCrewTrainings,
  mockCrewRotations,
  mockInventoryItems,
  mockInventoryTransactions,
  mockProcurementSuppliers,
  mockProcurementRequests,
  mockProcurementOrders,
  mockMaintenanceTasks,
  mockMaintenanceWorkOrders,
  mockVoyages,
  delay,
} from './mockData';

// Mock API service that simulates backend responses
export const mockApi = {
  // Auth
  async login(email: string, password: string) {
    await delay(500);
    const user = mockUsers.find((u) => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const { password: _, ...userWithoutPassword } = user;
    return {
      access_token: `mock-token-${user.id}`,
      user: userWithoutPassword,
    };
  },

  async register(data: any) {
    await delay(500);
    const newUser = {
      id: String(mockUsers.length + 1),
      ...data,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  async getProfile() {
    await delay(300);
    return mockUsers[0];
  },

  // Vessels
  async getVessels() {
    await delay(400);
    return mockVessels;
  },

  async getVessel(id: string) {
    await delay(300);
    const vessel = mockVessels.find((v) => v.id === id);
    if (!vessel) throw new Error('Vessel not found');
    return vessel;
  },

  async createVessel(data: any) {
    await delay(500);
    const newVessel = {
      id: String(mockVessels.length + 1),
      ...data,
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockVessels.push(newVessel);
    return newVessel;
  },

  // Categories
  async getCategories() {
    await delay(300);
    return mockCategories;
  },

  async getCategory(id: string) {
    await delay(300);
    const category = mockCategories.find((c) => c.id === id);
    if (!category) throw new Error('Category not found');
    return category;
  },

  // Documents
  async getDocuments(vesselId?: string) {
    await delay(400);
    if (vesselId) {
      return mockDocuments.filter((d) => d.vesselId === vesselId);
    }
    return mockDocuments;
  },

  async getDocument(id: string) {
    await delay(300);
    const document = mockDocuments.find((d) => d.id === id);
    if (!document) throw new Error('Document not found');
    return document;
  },

  async createDocument(data: any, file?: File) {
    await delay(800);
    const newDocument = {
      id: String(mockDocuments.length + 1),
      ...data,
      fileName: file?.name || 'document.pdf',
      fileSize: file?.size || 0,
      mimeType: file?.type || 'application/pdf',
      fileHash: `hash-${Date.now()}`,
      version: 1,
      status: 'DRAFT',
      isActive: true,
      vessel: mockVessels.find((v) => v.id === data.vesselId),
      category: mockCategories.find((c) => c.id === data.categoryId),
      uploadedBy: mockUsers[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDocuments.push(newDocument);
    return newDocument;
  },

  async approveDocument(id: string) {
    await delay(400);
    const document = mockDocuments.find((d) => d.id === id);
    if (!document) throw new Error('Document not found');
    document.status = 'APPROVED';
    document.updatedAt = new Date().toISOString();
    return document;
  },

  async rejectDocument(id: string, reason?: string) {
    await delay(400);
    const document = mockDocuments.find((d) => d.id === id);
    if (!document) throw new Error('Document not found');
    document.status = 'REJECTED';
    document.updatedAt = new Date().toISOString();
    return document;
  },

  // Certificates
  async getCertificates() {
    await delay(400);
    return mockCertificates;
  },

  async getCertificate(id: string) {
    await delay(300);
    const certificate = mockCertificates.find((c) => c.id === id);
    if (!certificate) throw new Error('Certificate not found');
    return certificate;
  },

  async getExpiringCertificates(days: number = 30) {
    await delay(400);
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return mockCertificates.filter((cert) => {
      const expiryDate = new Date(cert.expiryDate);
      return expiryDate >= today && expiryDate <= futureDate;
    });
  },

  async getExpiredCertificates() {
    await delay(400);
    const today = new Date();
    return mockCertificates.filter((cert) => {
      const expiryDate = new Date(cert.expiryDate);
      return expiryDate < today;
    });
  },

  // Crew Members
  async getCrewMembers(vesselId?: string) {
    await delay(400);
    let members = mockCrewMembers;
    if (vesselId) {
      members = members.filter((m) => m.vesselId === vesselId);
    }
    // Attach certificates and trainings to members
    return members.map((member) => ({
      ...member,
      certificates: mockCrewCertificates.filter((c) => c.crewMemberId === member.id),
      trainings: mockCrewTrainings.filter((t) => t.crewMemberId === member.id),
      rotations: mockCrewRotations.filter((r) => r.crewMemberId === member.id),
    }));
  },

  async getCrewMember(id: string) {
    await delay(300);
    const member = mockCrewMembers.find((m) => m.id === id);
    if (!member) throw new Error('Crew member not found');
    return {
      ...member,
      certificates: mockCrewCertificates.filter((c) => c.crewMemberId === id),
      trainings: mockCrewTrainings.filter((t) => t.crewMemberId === id),
      rotations: mockCrewRotations.filter((r) => r.crewMemberId === id),
    };
  },

  async createCrewMember(data: any) {
    await delay(500);
    const newMember = {
      id: String(mockCrewMembers.length + 1),
      ...data,
      certificates: [],
      trainings: [],
      rotations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCrewMembers.push(newMember);
    return newMember;
  },

  // Crew Certificates
  async getExpiringCrewCertificates(days: number = 30) {
    await delay(400);
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return mockCrewCertificates
      .filter((cert) => {
        const expiryDate = new Date(cert.expiryDate);
        return expiryDate >= today && expiryDate <= futureDate;
      })
      .map((cert) => ({
        ...cert,
        crewMember: mockCrewMembers.find((m) => m.id === cert.crewMemberId),
      }));
  },

  async getExpiredCrewCertificates() {
    await delay(400);
    const today = new Date();
    return mockCrewCertificates
      .filter((cert) => {
        const expiryDate = new Date(cert.expiryDate);
        return expiryDate < today;
      })
      .map((cert) => ({
        ...cert,
        crewMember: mockCrewMembers.find((m) => m.id === cert.crewMemberId),
      }));
  },

  // Crew Trainings
  async getCrewTrainings(crewMemberId?: string) {
    await delay(400);
    let trainings = mockCrewTrainings;
    if (crewMemberId) {
      trainings = trainings.filter((t) => t.crewMemberId === crewMemberId);
    }
    return trainings.map((training) => ({
      ...training,
      crewMember: mockCrewMembers.find((m) => m.id === training.crewMemberId),
    }));
  },

  // Crew Rotations
  async getCrewRotations(crewMemberId?: string, vesselId?: string) {
    await delay(400);
    let rotations = mockCrewRotations;
    if (crewMemberId) {
      rotations = rotations.filter((r) => r.crewMemberId === crewMemberId);
    }
    if (vesselId) {
      rotations = rotations.filter((r) => r.vesselId === vesselId);
    }
    return rotations.map((rotation) => ({
      ...rotation,
      crewMember: mockCrewMembers.find((m) => m.id === rotation.crewMemberId),
      vessel: mockVessels.find((v) => v.id === rotation.vesselId),
    }));
  },

  // Inventory Items
  async getInventoryItems(vesselId?: string, locationId?: string) {
    await delay(400);
    console.log('mockApi.getInventoryItems called', { vesselId, locationId, totalItems: mockInventoryItems.length });
    let items = [...mockInventoryItems]; // Create a copy
    if (vesselId) {
      items = items.filter((i) => i.vesselId === vesselId);
    }
    if (locationId) {
      items = items.filter((i) => i.locationId === locationId);
    }
    console.log('mockApi.getInventoryItems returning', items.length, 'items');
    return items;
  },

  async getInventoryItem(id: string) {
    await delay(300);
    const item = mockInventoryItems.find((i) => i.id === id);
    if (!item) throw new Error('Inventory item not found');
    return {
      ...item,
      transactions: mockInventoryTransactions.filter((t) => t.itemId === id),
    };
  },

  async createInventoryItem(data: any) {
    await delay(500);
    const newItem = {
      id: String(mockInventoryItems.length + 1),
      ...data,
      quantity: data.quantity || 0,
      vessel: mockVessels.find((v) => v.id === data.vesselId),
      location: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockInventoryItems.push(newItem);
    return newItem;
  },

  async getLowStockItems(vesselId?: string) {
    await delay(400);
    let items = mockInventoryItems;
    if (vesselId) {
      items = items.filter((i) => i.vesselId === vesselId);
    }
    return items.filter((item) => {
      if (!item.minimumQuantity) return false;
      return item.quantity <= item.minimumQuantity;
    });
  },

  async getExpiringItems(days: number = 30, vesselId?: string) {
    await delay(400);
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    let items = mockInventoryItems;
    if (vesselId) {
      items = items.filter((i) => i.vesselId === vesselId);
    }
    return items.filter((item) => {
      if (!item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      return expiry >= today && expiry <= futureDate;
    });
  },

  // Inventory Transactions
  async getInventoryTransactions(itemId?: string, vesselId?: string) {
    await delay(400);
    let transactions = mockInventoryTransactions;
    if (itemId) {
      transactions = transactions.filter((t) => t.itemId === itemId);
    } else if (vesselId) {
      transactions = transactions.filter((t) => t.item.vesselId === vesselId);
    }
    return transactions;
  },

  async createInventoryTransaction(data: any, userId: string) {
    await delay(500);
    const item = mockInventoryItems.find((i) => i.id === data.itemId);
    if (!item) throw new Error('Inventory item not found');

    // Update quantity
    if (data.transactionType === 'IN') {
      item.quantity = Number(item.quantity) + Number(data.quantity);
    } else if (data.transactionType === 'OUT') {
      if (Number(item.quantity) < Number(data.quantity)) {
        throw new Error('Insufficient quantity in stock');
      }
      item.quantity = Number(item.quantity) - Number(data.quantity);
    } else if (data.transactionType === 'ADJUSTMENT') {
      item.quantity = Number(data.quantity);
    }

    const newTransaction = {
      id: String(mockInventoryTransactions.length + 1),
      ...data,
      item,
      createdById: userId,
      createdBy: mockUsers.find((u) => u.id === userId) || mockUsers[0],
      createdAt: new Date().toISOString(),
    };
    mockInventoryTransactions.push(newTransaction);
    return newTransaction;
  },

  // Procurement
  async getProcurementRequests(vesselId?: string) {
    await delay(400);
    let requests = mockProcurementRequests;
    if (vesselId) {
      requests = requests.filter((r) => r.vesselId === vesselId);
    }
    return requests;
  },

  async getProcurementRequest(id: string) {
    await delay(300);
    const request = mockProcurementRequests.find((r) => r.id === id);
    if (!request) throw new Error('Procurement request not found');
    return request;
  },

  async getProcurementOrders(vesselId?: string, status?: string) {
    await delay(400);
    let orders = mockProcurementOrders;
    if (vesselId) {
      orders = orders.filter((o) => o.request.vesselId === vesselId);
    }
    if (status) {
      orders = orders.filter((o) => o.status === status);
    }
    return orders;
  },

  async getProcurementOrder(id: string) {
    await delay(300);
    const order = mockProcurementOrders.find((o) => o.id === id);
    if (!order) throw new Error('Procurement order not found');
    return order;
  },

  async getSuppliers() {
    await delay(300);
    return mockProcurementSuppliers.filter((s) => s.isActive);
  },

  async getSupplier(id: string) {
    await delay(300);
    const supplier = mockProcurementSuppliers.find((s) => s.id === id);
    if (!supplier) throw new Error('Supplier not found');
    return supplier;
  },

  // Maintenance
  async getMaintenanceTasks(vesselId?: string, status?: string) {
    await delay(400);
    let tasks = mockMaintenanceTasks;
    if (vesselId) {
      tasks = tasks.filter((t) => t.vesselId === vesselId);
    }
    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }
    return tasks;
  },

  async getMaintenanceTask(id: string) {
    await delay(300);
    const task = mockMaintenanceTasks.find((t) => t.id === id);
    if (!task) throw new Error('Maintenance task not found');
    return task;
  },

  async getOverdueTasks(vesselId?: string) {
    await delay(400);
    const today = new Date();
    let tasks = mockMaintenanceTasks;
    if (vesselId) {
      tasks = tasks.filter((t) => t.vesselId === vesselId);
    }
    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate < today && task.status === 'PENDING';
    });
  },

  async getWorkOrders(vesselId?: string, status?: string) {
    await delay(400);
    let workOrders = mockMaintenanceWorkOrders;
    if (vesselId) {
      workOrders = workOrders.filter((wo) => wo.task.vesselId === vesselId);
    }
    if (status) {
      workOrders = workOrders.filter((wo) => wo.status === status);
    }
    return workOrders;
  },

  async getWorkOrder(id: string) {
    await delay(300);
    const workOrder = mockMaintenanceWorkOrders.find((wo) => wo.id === id);
    if (!workOrder) throw new Error('Work order not found');
    return workOrder;
  },

  // Voyages
  async getVoyages(vesselId?: string, status?: string) {
    await delay(400);
    let voyages = mockVoyages;
    if (vesselId) {
      voyages = voyages.filter((v) => v.vesselId === vesselId);
    }
    if (status) {
      voyages = voyages.filter((v) => v.status === status);
    }
    return voyages;
  },

  async getVoyage(id: string) {
    await delay(300);
    const voyage = mockVoyages.find((v) => v.id === id);
    if (!voyage) throw new Error('Voyage not found');
    return voyage;
  },

  // Analytics
  async getDashboardKPIs(vesselId?: string) {
    await delay(400);
    return {
      expiringCertificates: 2,
      expiredCertificates: 1,
      overdueTasks: 1,
      lowStockItems: 2,
      pendingRequests: 1,
      activeVoyages: 1,
    };
  },

  async getMaintenanceStats(vesselId?: string) {
    await delay(400);
    return {
      total: 3,
      completed: 1,
      pending: 1,
      inProgress: 0,
      overdue: 1,
    };
  },

  async getInventoryStats(vesselId?: string) {
    await delay(400);
    return {
      totalItems: 3,
      lowStock: 2,
      totalValue: 12500,
    };
  },

  async getProcurementStats(vesselId?: string) {
    await delay(400);
    return {
      totalRequests: 2,
      totalOrders: 1,
      totalValue: 4800,
    };
  },
};

