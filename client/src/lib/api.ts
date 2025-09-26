export interface RequestResult {
  data: any;
  error: string | null;
}

const API_BASE = import.meta.env.VITE_API_URL || "";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth-token');
};

// Helper function to make authenticated requests
async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers);
  
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });
}

// Dashboard APIs
export const dashboardApi = {
  // General Director Dashboard
  getGeneralDirectorDashboard: async (): Promise<RequestResult> => {
    try {
      const response = await authFetch('/api/dashboard/general-director');
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Project Engineer Dashboard
  getProjectEngineerDashboard: async (): Promise<RequestResult> => {
    try {
      const response = await authFetch('/api/dashboard/project-engineer');
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};

// Projects APIs
export const projectsApi = {
  // Get all projects with filters
  getProjects: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<RequestResult> => {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await authFetch(`/api/projects?${queryParams.toString()}`);
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get single project
  getProject: async (id: string): Promise<RequestResult> => {
    try {
      const response = await authFetch(`/api/projects/${id}`);
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Create project
  createProject: async (projectData: any): Promise<RequestResult> => {
    try {
      const response = await authFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Update project
  updateProject: async (id: string, projectData: any): Promise<RequestResult> => {
    try {
      const response = await authFetch(`/api/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get project dashboard
  getProjectDashboard: async (id: string): Promise<RequestResult> => {
    try {
      const response = await authFetch(`/api/projects/${id}/dashboard`);
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Add daily report
  addDailyReport: async (id: string, reportData: any): Promise<RequestResult> => {
    try {
      const response = await authFetch(`/api/projects/${id}/daily-report`, {
        method: 'POST',
        body: JSON.stringify(reportData),
      });
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Update project progress
  updateProgress: async (id: string, progressData: any): Promise<RequestResult> => {
    try {
      const response = await authFetch(`/api/projects/${id}/progress`, {
        method: 'PUT',
        body: JSON.stringify(progressData),
      });
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};

// Equipment APIs
export const equipmentApi = {
  // Get all equipment
  getEquipment: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    project?: string;
  }): Promise<RequestResult> => {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await authFetch(`/api/equipment?${queryParams.toString()}`);
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get equipment dashboard
  getEquipmentDashboard: async (): Promise<RequestResult> => {
    try {
      const response = await authFetch('/api/equipment/dashboard/overview');
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get equipment map data
  getEquipmentMap: async (): Promise<RequestResult> => {
    try {
      const response = await authFetch('/api/equipment/map');
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Request equipment transfer
  requestTransfer: async (equipmentId: string, transferData: any): Promise<RequestResult> => {
    try {
      const response = await authFetch(`/api/equipment/${equipmentId}/transfer`, {
        method: 'POST',
        body: JSON.stringify(transferData),
      });
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Add maintenance record
  addMaintenance: async (equipmentId: string, maintenanceData: any): Promise<RequestResult> => {
    try {
      const response = await authFetch(`/api/equipment/${equipmentId}/maintenance`, {
        method: 'POST',
        body: JSON.stringify(maintenanceData),
      });
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};

// Purchasing APIs
export const purchasingApi = {
  // Get purchase orders
  getPurchaseOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    supplier?: string;
    project?: string;
  }): Promise<RequestResult> => {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await authFetch(`/api/purchasing/orders?${queryParams.toString()}`);
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Create purchase order
  createPurchaseOrder: async (orderData: any): Promise<RequestResult> => {
    try {
      const response = await authFetch('/api/purchasing/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get suppliers
  getSuppliers: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
  }): Promise<RequestResult> => {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await authFetch(`/api/purchasing/suppliers?${queryParams.toString()}`);
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get purchasing dashboard
  getPurchasingDashboard: async (): Promise<RequestResult> => {
    try {
      const response = await authFetch('/api/purchasing/dashboard');
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Approve purchase order
  approvePurchaseOrder: async (orderId: string, notes?: string): Promise<RequestResult> => {
    try {
      const response = await authFetch(`/api/purchasing/orders/${orderId}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ notes }),
      });
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};

// Notifications APIs
export const notificationsApi = {
  // Get user notifications
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    priority?: string;
    unread?: boolean;
  }): Promise<RequestResult> => {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await authFetch(`/api/notifications?${queryParams.toString()}`);
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<RequestResult> => {
    try {
      const response = await authFetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<RequestResult> => {
    try {
      const response = await authFetch('/api/notifications/read-all', {
        method: 'PUT',
      });
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get notification statistics
  getNotificationStats: async (): Promise<RequestResult> => {
    try {
      const response = await authFetch('/api/notifications/stats');
      const data = await response.json();
      return { data, error: response.ok ? null : data.error };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};

// Export all APIs
export const api = {
  dashboard: dashboardApi,
  projects: projectsApi,
  equipment: equipmentApi,
  purchasing: purchasingApi,
  notifications: notificationsApi,
};

export default api;
