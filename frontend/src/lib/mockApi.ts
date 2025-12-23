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
  mockInventoryLocations,
  mockInventoryTransactions,
  mockProcurementSuppliers,
  mockProcurementRequests,
  mockProcurementOrders,
  mockMaintenanceTasks,
  mockMaintenanceWorkOrders,
  mockVoyages,
  mockLogbookEntries,
  mockEngineLogs,
  mockFuelConsumptions,
  mockPSCChecklists,
  mockSafetyDrills,
  mockIncidents,
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

  async updateVessel(id: string, data: any) {
    await delay(500);
    const vesselIndex = mockVessels.findIndex((v) => v.id === id);
    if (vesselIndex === -1) throw new Error('Vessel not found');
    mockVessels[vesselIndex] = {
      ...mockVessels[vesselIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockVessels[vesselIndex];
  },

  async deleteVessel(id: string) {
    await delay(500);
    const vesselIndex = mockVessels.findIndex((v) => v.id === id);
    if (vesselIndex === -1) throw new Error('Vessel not found');
    mockVessels.splice(vesselIndex, 1);
    return { success: true };
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

  async updateCrewMember(id: string, data: any) {
    await delay(500);
    const memberIndex = mockCrewMembers.findIndex((m) => m.id === id);
    if (memberIndex === -1) throw new Error('Crew member not found');
    mockCrewMembers[memberIndex] = {
      ...mockCrewMembers[memberIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockCrewMembers[memberIndex];
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
      location: data.locationId ? mockInventoryLocations.find((l) => l.id === data.locationId) : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockInventoryItems.push(newItem);
    return newItem;
  },

  async updateInventoryItem(id: string, data: any) {
    await delay(500);
    const itemIndex = mockInventoryItems.findIndex((i) => i.id === id);
    if (itemIndex === -1) throw new Error('Inventory item not found');
    mockInventoryItems[itemIndex] = {
      ...mockInventoryItems[itemIndex],
      ...data,
      vessel: data.vesselId ? mockVessels.find((v) => v.id === data.vesselId) : mockInventoryItems[itemIndex].vessel,
      location: data.locationId ? mockInventoryLocations.find((l) => l.id === data.locationId) : (data.locationId === null ? null : mockInventoryItems[itemIndex].location),
      updatedAt: new Date().toISOString(),
    };
    return mockInventoryItems[itemIndex];
  },

  async deleteInventoryItem(id: string) {
    await delay(500);
    const itemIndex = mockInventoryItems.findIndex((i) => i.id === id);
    if (itemIndex === -1) throw new Error('Inventory item not found');
    mockInventoryItems.splice(itemIndex, 1);
    return { success: true };
  },

  async getInventoryLocations(vesselId?: string) {
    await delay(300);
    let locations = mockInventoryLocations;
    if (vesselId) {
      locations = locations.filter((l) => l.vesselId === vesselId);
    }
    return locations;
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

  async createProcurementRequest(data: any) {
    await delay(500);
    const newRequest = {
      id: `REQ-2024-${String(mockProcurementRequests.length + 1).padStart(4, '0')}`,
      requestNumber: `REQ-2024-${String(mockProcurementRequests.length + 1).padStart(4, '0')}`,
      ...data,
      status: 'DRAFT',
      vessel: mockVessels.find((v) => v.id === data.vesselId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProcurementRequests.push(newRequest);
    return newRequest;
  },

  async updateProcurementRequest(id: string, data: any) {
    await delay(500);
    const requestIndex = mockProcurementRequests.findIndex((r) => r.id === id);
    if (requestIndex === -1) throw new Error('Procurement request not found');
    mockProcurementRequests[requestIndex] = {
      ...mockProcurementRequests[requestIndex],
      ...data,
      vessel: data.vesselId ? mockVessels.find((v) => v.id === data.vesselId) : mockProcurementRequests[requestIndex].vessel,
      updatedAt: new Date().toISOString(),
    };
    return mockProcurementRequests[requestIndex];
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
    return tasks.map((task) => ({
      ...task,
      vessel: mockVessels.find((v) => v.id === task.vesselId),
    }));
  },

  async getMaintenanceTask(id: string) {
    await delay(300);
    const task = mockMaintenanceTasks.find((t) => t.id === id);
    if (!task) throw new Error('Maintenance task not found');
    return {
      ...task,
      vessel: mockVessels.find((v) => v.id === task.vesselId),
    };
  },

  async createMaintenanceTask(data: any) {
    await delay(500);
    const newTask = {
      id: String(mockMaintenanceTasks.length + 1),
      ...data,
      status: data.status || 'PENDING',
      priority: data.priority || 'MEDIUM',
      vessel: mockVessels.find((v) => v.id === data.vesselId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockMaintenanceTasks.push(newTask);
    return newTask;
  },

  async updateMaintenanceTask(id: string, data: any) {
    await delay(500);
    const taskIndex = mockMaintenanceTasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) throw new Error('Maintenance task not found');
    mockMaintenanceTasks[taskIndex] = {
      ...mockMaintenanceTasks[taskIndex],
      ...data,
      vessel: data.vesselId ? mockVessels.find((v) => v.id === data.vesselId) : mockMaintenanceTasks[taskIndex].vessel,
      updatedAt: new Date().toISOString(),
    };
    return mockMaintenanceTasks[taskIndex];
  },

  async deleteMaintenanceTask(id: string) {
    await delay(500);
    const taskIndex = mockMaintenanceTasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) throw new Error('Maintenance task not found');
    mockMaintenanceTasks.splice(taskIndex, 1);
    return { success: true };
  },

  async getOverdueMaintenanceTasks(vesselId?: string) {
    await delay(400);
    const today = new Date();
    let tasks = mockMaintenanceTasks.filter((t) => {
      const dueDate = new Date(t.dueDate);
      return dueDate < today && t.status !== 'COMPLETED';
    });
    if (vesselId) {
      tasks = tasks.filter((t) => t.vesselId === vesselId);
    }
    return tasks.map((task) => ({
      ...task,
      vessel: mockVessels.find((v) => v.id === task.vesselId),
    }));
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

  async createVoyage(data: any) {
    await delay(500);
    const newVoyage = {
      id: `VOY-2024-${String(mockVoyages.length + 1).padStart(4, '0')}`,
      voyageNumber: `VOY-2024-${String(mockVoyages.length + 1).padStart(4, '0')}`,
      ...data,
      status: 'PLANNED',
      vessel: mockVessels.find((v) => v.id === data.vesselId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockVoyages.push(newVoyage);
    return newVoyage;
  },

  async updateVoyage(id: string, data: any) {
    await delay(500);
    const voyageIndex = mockVoyages.findIndex((v) => v.id === id);
    if (voyageIndex === -1) throw new Error('Voyage not found');
    mockVoyages[voyageIndex] = {
      ...mockVoyages[voyageIndex],
      ...data,
      vessel: data.vesselId ? mockVessels.find((v) => v.id === data.vesselId) : mockVoyages[voyageIndex].vessel,
      updatedAt: new Date().toISOString(),
    };
    return mockVoyages[voyageIndex];
  },

  // Logbook
  async getLogbookEntries(vesselId?: string, startDate?: string, endDate?: string) {
    await delay(400);
    let entries = mockLogbookEntries;
    if (vesselId) {
      entries = entries.filter((e) => e.vesselId === vesselId);
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      entries = entries.filter((e) => {
        const entryDate = new Date(e.entryDate);
        return entryDate >= start && entryDate <= end;
      });
    }
    return entries.map((entry) => ({
      ...entry,
      vessel: mockVessels.find((v) => v.id === entry.vesselId),
      officer: mockUsers.find((u) => u.id === entry.officerId),
      captain: entry.captainId ? mockUsers.find((u) => u.id === entry.captainId) : null,
    }));
  },

  async getLogbookEntry(id: string) {
    await delay(300);
    const entry = mockLogbookEntries.find((e) => e.id === id);
    if (!entry) throw new Error('Logbook entry not found');
    return {
      ...entry,
      vessel: mockVessels.find((v) => v.id === entry.vesselId),
      officer: mockUsers.find((u) => u.id === entry.officerId),
      captain: entry.captainId ? mockUsers.find((u) => u.id === entry.captainId) : null,
    };
  },

  async createLogbookEntry(data: any) {
    await delay(500);
    const newEntry = {
      id: String(mockLogbookEntries.length + 1),
      ...data,
      vessel: mockVessels.find((v) => v.id === data.vesselId),
      officer: mockUsers.find((u) => u.id === data.officerId),
      captain: null,
      isSigned: false,
      signedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLogbookEntries.push(newEntry);
    return newEntry;
  },

  async updateLogbookEntry(id: string, data: any) {
    await delay(500);
    const entryIndex = mockLogbookEntries.findIndex((e) => e.id === id);
    if (entryIndex === -1) throw new Error('Logbook entry not found');
    mockLogbookEntries[entryIndex] = {
      ...mockLogbookEntries[entryIndex],
      ...data,
      vessel: data.vesselId ? mockVessels.find((v) => v.id === data.vesselId) : mockLogbookEntries[entryIndex].vessel,
      updatedAt: new Date().toISOString(),
    };
    return mockLogbookEntries[entryIndex];
  },

  async deleteLogbookEntry(id: string) {
    await delay(500);
    const entryIndex = mockLogbookEntries.findIndex((e) => e.id === id);
    if (entryIndex === -1) throw new Error('Logbook entry not found');
    mockLogbookEntries.splice(entryIndex, 1);
    return { success: true };
  },

  async signLogbookEntry(id: string, captainId: string) {
    await delay(500);
    const entryIndex = mockLogbookEntries.findIndex((e) => e.id === id);
    if (entryIndex === -1) throw new Error('Logbook entry not found');
    mockLogbookEntries[entryIndex].isSigned = true;
    mockLogbookEntries[entryIndex].captainId = captainId;
    mockLogbookEntries[entryIndex].captain = mockUsers.find((u) => u.id === captainId) || null;
    mockLogbookEntries[entryIndex].signedAt = new Date().toISOString();
    mockLogbookEntries[entryIndex].updatedAt = new Date().toISOString();
    return mockLogbookEntries[entryIndex];
  },

  // Engine Log
  async getEngineLogs(vesselId?: string, startDate?: string, endDate?: string) {
    await delay(400);
    let logs = mockEngineLogs;
    if (vesselId) {
      logs = logs.filter((l) => l.vesselId === vesselId);
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      logs = logs.filter((l) => {
        const logDate = new Date(l.logDate);
        return logDate >= start && logDate <= end;
      });
    }
    return logs.map((log) => ({
      ...log,
      vessel: mockVessels.find((v) => v.id === log.vesselId),
      engineer: mockUsers.find((u) => u.id === log.engineerId),
    }));
  },

  async getEngineLog(id: string) {
    await delay(300);
    const log = mockEngineLogs.find((l) => l.id === id);
    if (!log) throw new Error('Engine log not found');
    return {
      ...log,
      vessel: mockVessels.find((v) => v.id === log.vesselId),
      engineer: mockUsers.find((u) => u.id === log.engineerId),
    };
  },

  async createEngineLog(data: any) {
    await delay(500);
    const newLog = {
      id: String(mockEngineLogs.length + 1),
      ...data,
      vessel: mockVessels.find((v) => v.id === data.vesselId),
      engineer: mockUsers.find((u) => u.id === data.engineerId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockEngineLogs.push(newLog);
    return newLog;
  },

  async updateEngineLog(id: string, data: any) {
    await delay(500);
    const logIndex = mockEngineLogs.findIndex((l) => l.id === id);
    if (logIndex === -1) throw new Error('Engine log not found');
    mockEngineLogs[logIndex] = {
      ...mockEngineLogs[logIndex],
      ...data,
      vessel: data.vesselId ? mockVessels.find((v) => v.id === data.vesselId) : mockEngineLogs[logIndex].vessel,
      updatedAt: new Date().toISOString(),
    };
    return mockEngineLogs[logIndex];
  },

  async deleteEngineLog(id: string) {
    await delay(500);
    const logIndex = mockEngineLogs.findIndex((l) => l.id === id);
    if (logIndex === -1) throw new Error('Engine log not found');
    mockEngineLogs.splice(logIndex, 1);
    return { success: true };
  },

  // Fuel Management
  async getFuelConsumptions(vesselId?: string, startDate?: string, endDate?: string) {
    await delay(400);
    let consumptions = mockFuelConsumptions;
    if (vesselId) {
      consumptions = consumptions.filter((f) => f.vesselId === vesselId);
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      consumptions = consumptions.filter((f) => {
        const opDate = new Date(f.operationDate);
        return opDate >= start && opDate <= end;
      });
    }
    return consumptions.map((fuel) => ({
      ...fuel,
      vessel: mockVessels.find((v) => v.id === fuel.vesselId),
      recordedBy: mockUsers.find((u) => u.id === fuel.recordedById),
    }));
  },

  async getFuelConsumption(id: string) {
    await delay(300);
    const fuel = mockFuelConsumptions.find((f) => f.id === id);
    if (!fuel) throw new Error('Fuel consumption not found');
    return {
      ...fuel,
      vessel: mockVessels.find((v) => v.id === fuel.vesselId),
      recordedBy: mockUsers.find((u) => u.id === fuel.recordedById),
    };
  },

  async createFuelConsumption(data: any) {
    await delay(500);
    const newFuel = {
      id: String(mockFuelConsumptions.length + 1),
      ...data,
      vessel: mockVessels.find((v) => v.id === data.vesselId),
      recordedBy: mockUsers.find((u) => u.id === data.recordedById),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockFuelConsumptions.push(newFuel);
    return newFuel;
  },

  async updateFuelConsumption(id: string, data: any) {
    await delay(500);
    const fuelIndex = mockFuelConsumptions.findIndex((f) => f.id === id);
    if (fuelIndex === -1) throw new Error('Fuel consumption not found');
    mockFuelConsumptions[fuelIndex] = {
      ...mockFuelConsumptions[fuelIndex],
      ...data,
      vessel: data.vesselId ? mockVessels.find((v) => v.id === data.vesselId) : mockFuelConsumptions[fuelIndex].vessel,
      updatedAt: new Date().toISOString(),
    };
    return mockFuelConsumptions[fuelIndex];
  },

  async deleteFuelConsumption(id: string) {
    await delay(500);
    const fuelIndex = mockFuelConsumptions.findIndex((f) => f.id === id);
    if (fuelIndex === -1) throw new Error('Fuel consumption not found');
    mockFuelConsumptions.splice(fuelIndex, 1);
    return { success: true };
  },

  // PSC
  async getPSCChecklists(vesselId?: string) {
    await delay(400);
    let checklists = mockPSCChecklists;
    if (vesselId) {
      checklists = checklists.filter((c) => c.vesselId === vesselId);
    }
    return checklists.map((psc) => ({
      ...psc,
      vessel: mockVessels.find((v) => v.id === psc.vesselId),
      preparedBy: mockUsers.find((u) => u.id === psc.preparedById),
    }));
  },

  async getPSCChecklist(id: string) {
    await delay(300);
    const psc = mockPSCChecklists.find((c) => c.id === id);
    if (!psc) throw new Error('PSC checklist not found');
    return {
      ...psc,
      vessel: mockVessels.find((v) => v.id === psc.vesselId),
      preparedBy: mockUsers.find((u) => u.id === psc.preparedById),
    };
  },

  async createPSCChecklist(data: any) {
    await delay(500);
    const newPSC = {
      id: String(mockPSCChecklists.length + 1),
      ...data,
      vessel: mockVessels.find((v) => v.id === data.vesselId),
      preparedBy: mockUsers.find((u) => u.id === data.preparedById),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPSCChecklists.push(newPSC);
    return newPSC;
  },

  async updatePSCChecklist(id: string, data: any) {
    await delay(500);
    const pscIndex = mockPSCChecklists.findIndex((c) => c.id === id);
    if (pscIndex === -1) throw new Error('PSC checklist not found');
    mockPSCChecklists[pscIndex] = {
      ...mockPSCChecklists[pscIndex],
      ...data,
      vessel: data.vesselId ? mockVessels.find((v) => v.id === data.vesselId) : mockPSCChecklists[pscIndex].vessel,
      updatedAt: new Date().toISOString(),
    };
    return mockPSCChecklists[pscIndex];
  },

  async deletePSCChecklist(id: string) {
    await delay(500);
    const pscIndex = mockPSCChecklists.findIndex((c) => c.id === id);
    if (pscIndex === -1) throw new Error('PSC checklist not found');
    mockPSCChecklists.splice(pscIndex, 1);
    return { success: true };
  },

  // Safety
  async getSafetyDrills(vesselId?: string) {
    await delay(400);
    let drills = mockSafetyDrills;
    if (vesselId) {
      drills = drills.filter((d) => d.vesselId === vesselId);
    }
    return drills.map((drill) => ({
      ...drill,
      vessel: mockVessels.find((v) => v.id === drill.vesselId),
      conductedBy: mockUsers.find((u) => u.id === drill.conductedById),
    }));
  },

  async getSafetyDrill(id: string) {
    await delay(300);
    const drill = mockSafetyDrills.find((d) => d.id === id);
    if (!drill) throw new Error('Safety drill not found');
    return {
      ...drill,
      vessel: mockVessels.find((v) => v.id === drill.vesselId),
      conductedBy: mockUsers.find((u) => u.id === drill.conductedById),
    };
  },

  async createSafetyDrill(data: any) {
    await delay(500);
    const newDrill = {
      id: String(mockSafetyDrills.length + 1),
      ...data,
      vessel: mockVessels.find((v) => v.id === data.vesselId),
      conductedBy: mockUsers.find((u) => u.id === data.conductedById),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSafetyDrills.push(newDrill);
    return newDrill;
  },

  async updateSafetyDrill(id: string, data: any) {
    await delay(500);
    const drillIndex = mockSafetyDrills.findIndex((d) => d.id === id);
    if (drillIndex === -1) throw new Error('Safety drill not found');
    mockSafetyDrills[drillIndex] = {
      ...mockSafetyDrills[drillIndex],
      ...data,
      vessel: data.vesselId ? mockVessels.find((v) => v.id === data.vesselId) : mockSafetyDrills[drillIndex].vessel,
      updatedAt: new Date().toISOString(),
    };
    return mockSafetyDrills[drillIndex];
  },

  async deleteSafetyDrill(id: string) {
    await delay(500);
    const drillIndex = mockSafetyDrills.findIndex((d) => d.id === id);
    if (drillIndex === -1) throw new Error('Safety drill not found');
    mockSafetyDrills.splice(drillIndex, 1);
    return { success: true };
  },

  // Incidents
  async getIncidents(vesselId?: string) {
    await delay(400);
    let incidents = mockIncidents;
    if (vesselId) {
      incidents = incidents.filter((i) => i.vesselId === vesselId);
    }
    return incidents.map((incident) => ({
      ...incident,
      vessel: mockVessels.find((v) => v.id === incident.vesselId),
      reportedBy: mockUsers.find((u) => u.id === incident.reportedById),
      investigatedBy: incident.investigatedById ? mockUsers.find((u) => u.id === incident.investigatedById) : null,
    }));
  },

  async getIncident(id: string) {
    await delay(300);
    const incident = mockIncidents.find((i) => i.id === id);
    if (!incident) throw new Error('Incident not found');
    return {
      ...incident,
      vessel: mockVessels.find((v) => v.id === incident.vesselId),
      reportedBy: mockUsers.find((u) => u.id === incident.reportedById),
      investigatedBy: incident.investigatedById ? mockUsers.find((u) => u.id === incident.investigatedById) : null,
    };
  },

  async createIncident(data: any) {
    await delay(500);
    const newIncident = {
      id: String(mockIncidents.length + 1),
      ...data,
      vessel: mockVessels.find((v) => v.id === data.vesselId),
      reportedBy: mockUsers.find((u) => u.id === data.reportedById),
      investigatedBy: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockIncidents.push(newIncident);
    return newIncident;
  },

  async updateIncident(id: string, data: any) {
    await delay(500);
    const incidentIndex = mockIncidents.findIndex((i) => i.id === id);
    if (incidentIndex === -1) throw new Error('Incident not found');
    mockIncidents[incidentIndex] = {
      ...mockIncidents[incidentIndex],
      ...data,
      vessel: data.vesselId ? mockVessels.find((v) => v.id === data.vesselId) : mockIncidents[incidentIndex].vessel,
      investigatedBy: data.investigatedById ? mockUsers.find((u) => u.id === data.investigatedById) : mockIncidents[incidentIndex].investigatedBy,
      updatedAt: new Date().toISOString(),
    };
    return mockIncidents[incidentIndex];
  },

  async deleteIncident(id: string) {
    await delay(500);
    const incidentIndex = mockIncidents.findIndex((i) => i.id === id);
    if (incidentIndex === -1) throw new Error('Incident not found');
    mockIncidents.splice(incidentIndex, 1);
    return { success: true };
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

