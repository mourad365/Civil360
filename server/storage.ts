import { 
  type User, type InsertUser, type Project, type InsertProject,
  type AiPlanAnalysis, type InsertAiPlanAnalysis, type IoTEquipment, 
  type InsertIotEquipment, type QualityCheck, type InsertQualityCheck,
  type MobileSyncQueue, type OdooSync, type Prediction
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project>;
  
  // AI Plan Analysis
  getAllAiAnalysis(): Promise<AiPlanAnalysis[]>;
  getAiAnalysis(id: string): Promise<AiPlanAnalysis | undefined>;
  createAiAnalysis(analysis: InsertAiPlanAnalysis): Promise<AiPlanAnalysis>;
  updateAiAnalysis(id: string, updates: Partial<AiPlanAnalysis>): Promise<AiPlanAnalysis>;
  
  // IoT Equipment
  getAllIotEquipment(): Promise<IoTEquipment[]>;
  getIotEquipment(id: string): Promise<IoTEquipment | undefined>;
  createIotEquipment(equipment: InsertIotEquipment): Promise<IoTEquipment>;
  updateIotEquipment(id: string, updates: Partial<IoTEquipment>): Promise<IoTEquipment>;
  
  // Quality Checks
  getAllQualityChecks(): Promise<QualityCheck[]>;
  getQualityCheck(id: string): Promise<QualityCheck | undefined>;
  createQualityCheck(check: InsertQualityCheck): Promise<QualityCheck>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    activeProjects: number;
    activeTeams: number;
    qualityAlerts: number;
    productivityGain: number;
  }>;
  
  // Mobile sync
  getMobileSyncQueue(): Promise<MobileSyncQueue[]>;
  
  // Odoo sync
  getOdooSyncStatus(): Promise<OdooSync[]>;
  
  // Predictions
  getProjectPredictions(projectId: string): Promise<Prediction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private aiAnalysis: Map<string, AiPlanAnalysis>;
  private iotEquipment: Map<string, IoTEquipment>;
  private qualityChecks: Map<string, QualityCheck>;
  private mobileSyncQueue: MobileSyncQueue[];
  private odooSync: OdooSync[];
  private predictions: Map<string, Prediction>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.aiAnalysis = new Map();
    this.iotEquipment = new Map();
    this.qualityChecks = new Map();
    this.mobileSyncQueue = [];
    this.odooSync = [];
    this.predictions = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed initial user
    const user: User = {
      id: randomUUID(),
      username: "marc.dubois",
      password: "password",
      name: "Marc Dubois",
      role: "Chef d'Exécution",
      email: "marc.dubois@civil360.fr"
    };
    this.users.set(user.id, user);

    // Seed projects
    const project1: Project = {
      id: randomUUID(),
      name: "Résidence Les Jardins",
      description: "Construction résidentielle R+3",
      status: "active",
      location: "Paris 15ème",
      latitude: "48.8566",
      longitude: "2.3522",
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-08-15'),
      budget: "2450000",
      progress: 67,
      createdAt: new Date()
    };

    const project2: Project = {
      id: randomUUID(),
      name: "Bureau Commercial Niveau 0",
      description: "Bureaux commerciaux en rez-de-chaussée",
      status: "active",
      location: "Lyon 3ème",
      latitude: "45.7640",
      longitude: "4.8357",
      budget: "890000",
      progress: 45,
      createdAt: new Date()
    };

    this.projects.set(project1.id, project1);
    this.projects.set(project2.id, project2);

    // Seed AI analysis
    const aiAnalysis1: AiPlanAnalysis = {
      id: randomUUID(),
      projectId: project1.id,
      fileName: "Résidence_Les_Jardins_R+3.dwg",
      fileSize: 12300000,
      fileType: "dwg",
      status: "processing",
      progress: 78,
      aiConfidence: "0.972",
      extractedData: {
        elements: 347,
        openings: 89,
        networks: 12,
        concrete: "247.5 m³",
        steel: "12.8 T",
        formwork: "1234 m²"
      },
      createdAt: new Date()
    };

    const aiAnalysis2: AiPlanAnalysis = {
      id: randomUUID(),
      projectId: project2.id,
      fileName: "Bureau_Commercial_Niveau_0.ifc",
      fileSize: 23700000,
      fileType: "ifc",
      status: "completed",
      progress: 100,
      aiConfidence: "0.972",
      extractedData: {
        concrete: "247.5 m³",
        steel: "12.8 T",
        formwork: "1234 m²"
      },
      createdAt: new Date()
    };

    this.aiAnalysis.set(aiAnalysis1.id, aiAnalysis1);
    this.aiAnalysis.set(aiAnalysis2.id, aiAnalysis2);

    // Seed IoT equipment
    const equipment1: IoTEquipment = {
      id: randomUUID(),
      name: "Pelle CAT 320D",
      type: "excavator",
      projectId: project1.id,
      status: "active",
      latitude: "48.8566",
      longitude: "2.3522",
      utilization: 87,
      batteryLevel: 85,
      lastUpdate: new Date(),
      sensorData: {
        temperature: 65,
        vibration: "normal",
        fuelLevel: 78
      }
    };

    const equipment2: IoTEquipment = {
      id: randomUUID(),
      name: "Grue Potain MD 485",
      type: "crane",
      projectId: project2.id,
      status: "maintenance",
      latitude: "45.7640",
      longitude: "4.8357",
      utilization: 23,
      batteryLevel: 92,
      lastUpdate: new Date(),
      sensorData: {
        loadCapacity: "8.5T",
        windSpeed: "12 km/h"
      }
    };

    const equipment3: IoTEquipment = {
      id: randomUUID(),
      name: "Compacteur Dynapac",
      type: "compactor",
      projectId: project1.id,
      status: "offline",
      latitude: "48.8600",
      longitude: "2.3550",
      utilization: 0,
      batteryLevel: 15,
      lastUpdate: new Date(),
      sensorData: {
        alert: "geofencing_violation"
      }
    };

    this.iotEquipment.set(equipment1.id, equipment1);
    this.iotEquipment.set(equipment2.id, equipment2);
    this.iotEquipment.set(equipment3.id, equipment3);

    // Seed quality checks
    const qualityCheck1: QualityCheck = {
      id: randomUUID(),
      projectId: project1.id,
      checkType: "concrete",
      location: "Coulage Béton - Niveau R+2",
      latitude: "48.8566",
      longitude: "2.3522",
      status: "passed",
      aiScore: "0.972",
      imageUrl: "/api/quality-images/concrete-pour-1.jpg",
      notes: "Coulage conforme, surface régulière",
      inspector: "Jean Martin",
      createdAt: new Date()
    };

    const qualityCheck2: QualityCheck = {
      id: randomUUID(),
      projectId: project1.id,
      checkType: "steel",
      location: "Ferraillage Poutre P12",
      latitude: "48.8566",
      longitude: "2.3522",
      status: "failed",
      aiScore: "0.892",
      imageUrl: "/api/quality-images/steel-beam-1.jpg",
      notes: "Espacement des armatures supérieur aux plans (25cm vs 20cm prévu)",
      inspector: "Sophie Dubois",
      createdAt: new Date()
    };

    this.qualityChecks.set(qualityCheck1.id, qualityCheck1);
    this.qualityChecks.set(qualityCheck2.id, qualityCheck2);

    // Seed mobile sync queue
    this.mobileSyncQueue = [
      {
        id: randomUUID(),
        deviceId: "mobile-001",
        action: "create",
        entityType: "quality_check",
        entityData: { checkType: "visual", status: "pending" },
        synced: false,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        deviceId: "mobile-002", 
        action: "update",
        entityType: "equipment_status",
        entityData: { equipmentId: equipment1.id, status: "maintenance" },
        synced: false,
        createdAt: new Date()
      }
    ];

    // Seed Odoo sync status
    this.odooSync = [
      {
        id: randomUUID(),
        entityType: "personnel",
        entityId: "sync-personnel",
        syncType: "import",
        status: "success",
        errorMessage: null,
        lastSync: new Date(Date.now() - 28 * 60 * 1000) // 28 minutes ago
      },
      {
        id: randomUUID(),
        entityType: "projects",
        entityId: "sync-projects",
        syncType: "import",
        status: "success",
        errorMessage: null,
        lastSync: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        id: randomUUID(),
        entityType: "facturation",
        entityId: "sync-billing",
        syncType: "export",
        status: "pending",
        errorMessage: null,
        lastSync: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
      }
    ];

    // Seed predictions
    const prediction1: Prediction = {
      id: randomUUID(),
      projectId: project1.id,
      predictionType: "delay",
      confidence: "0.947",
      prediction: {
        delayDays: "3-5",
        causes: ["weather", "supply_chain"],
        recommendations: ["reallocate_teams", "adjust_planning"]
      },
      createdAt: new Date()
    };

    this.predictions.set(prediction1.id, prediction1);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      ...insertProject, 
      id,
      progress: 0,
      createdAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) throw new Error("Project not found");
    
    const updatedProject = { ...project, ...updates };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  // AI Analysis methods
  async getAllAiAnalysis(): Promise<AiPlanAnalysis[]> {
    return Array.from(this.aiAnalysis.values());
  }

  async getAiAnalysis(id: string): Promise<AiPlanAnalysis | undefined> {
    return this.aiAnalysis.get(id);
  }

  async createAiAnalysis(insertAnalysis: InsertAiPlanAnalysis): Promise<AiPlanAnalysis> {
    const id = randomUUID();
    const analysis: AiPlanAnalysis = { 
      ...insertAnalysis, 
      id,
      status: "processing",
      progress: 0,
      createdAt: new Date()
    };
    this.aiAnalysis.set(id, analysis);
    return analysis;
  }

  async updateAiAnalysis(id: string, updates: Partial<AiPlanAnalysis>): Promise<AiPlanAnalysis> {
    const analysis = this.aiAnalysis.get(id);
    if (!analysis) throw new Error("Analysis not found");
    
    const updatedAnalysis = { ...analysis, ...updates };
    this.aiAnalysis.set(id, updatedAnalysis);
    return updatedAnalysis;
  }

  // IoT Equipment methods
  async getAllIotEquipment(): Promise<IoTEquipment[]> {
    return Array.from(this.iotEquipment.values());
  }

  async getIotEquipment(id: string): Promise<IoTEquipment | undefined> {
    return this.iotEquipment.get(id);
  }

  async createIotEquipment(insertEquipment: InsertIotEquipment): Promise<IoTEquipment> {
    const id = randomUUID();
    const equipment: IoTEquipment = { 
      ...insertEquipment, 
      id,
      status: "active",
      utilization: 0,
      batteryLevel: 100,
      lastUpdate: new Date()
    };
    this.iotEquipment.set(id, equipment);
    return equipment;
  }

  async updateIotEquipment(id: string, updates: Partial<IoTEquipment>): Promise<IoTEquipment> {
    const equipment = this.iotEquipment.get(id);
    if (!equipment) throw new Error("Equipment not found");
    
    const updatedEquipment = { ...equipment, ...updates, lastUpdate: new Date() };
    this.iotEquipment.set(id, updatedEquipment);
    return updatedEquipment;
  }

  // Quality Check methods
  async getAllQualityChecks(): Promise<QualityCheck[]> {
    return Array.from(this.qualityChecks.values());
  }

  async getQualityCheck(id: string): Promise<QualityCheck | undefined> {
    return this.qualityChecks.get(id);
  }

  async createQualityCheck(insertCheck: InsertQualityCheck): Promise<QualityCheck> {
    const id = randomUUID();
    const check: QualityCheck = { 
      ...insertCheck, 
      id,
      status: "pending",
      createdAt: new Date()
    };
    this.qualityChecks.set(id, check);
    return check;
  }

  // Dashboard stats
  async getDashboardStats() {
    const activeProjects = Array.from(this.projects.values()).filter(p => p.status === "active").length;
    const activeEquipment = Array.from(this.iotEquipment.values()).filter(e => e.status === "active").length;
    const qualityAlerts = Array.from(this.qualityChecks.values()).filter(q => q.status === "failed").length;
    
    return {
      activeProjects,
      activeTeams: activeEquipment * 3, // Simulated team count
      qualityAlerts,
      productivityGain: 32
    };
  }

  // Mobile sync
  async getMobileSyncQueue(): Promise<MobileSyncQueue[]> {
    return this.mobileSyncQueue.filter(item => !item.synced);
  }

  // Odoo sync
  async getOdooSyncStatus(): Promise<OdooSync[]> {
    return this.odooSync;
  }

  // Predictions
  async getProjectPredictions(projectId: string): Promise<Prediction[]> {
    return Array.from(this.predictions.values()).filter(p => p.projectId === projectId);
  }
}

export const storage = new MemStorage();
