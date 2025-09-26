import { 
  type User, type InsertUser, type Project, type InsertProject,
  type AiPlanAnalysis, type InsertAiPlanAnalysis, type IoTEquipment, 
  type InsertIotEquipment, type QualityCheck, type InsertQualityCheck,
  type MobileSyncQueue, type OdooSync, type Prediction
} from "@shared/schema";

// Import MongoDB models
import UserModel, { type IUser } from "./models/User";
import ProjectModel, { type IProject } from "./models/Project";
import AiPlanAnalysisModel, { type IAiPlanAnalysis } from "./models/AiPlanAnalysis";
import IoTEquipmentModel, { type IIoTEquipment } from "./models/IoTEquipment";
import QualityCheckModel, { type IQualityCheck } from "./models/QualityCheck";
import MobileSyncQueueModel, { type IMobileSyncQueue } from "./models/MobileSyncQueue";
import OdooSyncModel, { type IOdooSync } from "./models/OdooSync";
import PredictionModel, { type IPrediction } from "./models/Prediction";

import { IStorage } from "./storage";

export class MongoStorage implements IStorage {
  constructor() {
    // Initialize with seed data if database is empty
    this.initializeSeedData();
  }

  private async initializeSeedData(): Promise<void> {
    try {
      // Check if we already have data
      const userCount = await UserModel.countDocuments();
      if (userCount > 0) return;

      console.log('Initializing database with seed data...');

      // Create seed user
      const seedUser = new UserModel({
        username: "marc.dubois",
        password: "password",
        name: "Marc Dubois",
        role: "Chef d'Exécution",
        email: "marc.dubois@civil360.fr"
      });
      await seedUser.save();

      // Create seed projects
      const project1 = new ProjectModel({
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
        createdBy: seedUser._id
      });

      const project2 = new ProjectModel({
        name: "Bureau Commercial Niveau 0",
        description: "Bureaux commerciaux en rez-de-chaussée",
        status: "active",
        location: "Lyon 3ème",
        latitude: "45.7640",
        longitude: "4.8357",
        budget: "890000",
        progress: 45,
        createdBy: seedUser._id
      });

      await project1.save();
      await project2.save();

      // Create seed AI analysis
      await AiPlanAnalysisModel.create([
        {
          projectId: project1._id,
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
          }
        },
        {
          projectId: project2._id,
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
          }
        }
      ]);

      // Create seed IoT equipment
      await IoTEquipmentModel.create([
        {
          name: "Pelle CAT 320D",
          type: "excavator",
          projectId: project1._id,
          status: "active",
          latitude: "48.8566",
          longitude: "2.3522",
          utilization: 87,
          batteryLevel: 85,
          sensorData: {
            temperature: 65,
            vibration: "normal",
            fuelLevel: 78
          }
        },
        {
          name: "Grue Potain MD 485",
          type: "crane",
          projectId: project2._id,
          status: "maintenance",
          latitude: "45.7640",
          longitude: "4.8357",
          utilization: 23,
          batteryLevel: 92,
          sensorData: {
            loadCapacity: "8.5T",
            windSpeed: "12 km/h"
          }
        },
        {
          name: "Compacteur Dynapac",
          type: "compactor",
          projectId: project1._id,
          status: "offline",
          latitude: "48.8600",
          longitude: "2.3550",
          utilization: 0,
          batteryLevel: 15,
          sensorData: {
            alert: "geofencing_violation"
          }
        }
      ]);

      // Create seed quality checks
      await QualityCheckModel.create([
        {
          projectId: project1._id,
          checkType: "concrete",
          location: "Coulage Béton - Niveau R+2",
          latitude: "48.8566",
          longitude: "2.3522",
          status: "passed",
          aiScore: "0.972",
          imageUrl: "/api/quality-images/concrete-pour-1.jpg",
          notes: "Coulage conforme, surface régulière",
          inspector: "Jean Martin",
          inspectorId: seedUser._id
        },
        {
          projectId: project1._id,
          checkType: "steel",
          location: "Ferraillage Poutre P12",
          latitude: "48.8566",
          longitude: "2.3522",
          status: "failed",
          aiScore: "0.892",
          imageUrl: "/api/quality-images/steel-beam-1.jpg",
          notes: "Espacement des armatures supérieur aux plans (25cm vs 20cm prévu)",
          inspector: "Sophie Dubois",
          inspectorId: seedUser._id
        }
      ]);

      // Create seed mobile sync queue
      const equipment = await IoTEquipmentModel.findOne();
      await MobileSyncQueueModel.create([
        {
          deviceId: "mobile-001",
          action: "create",
          entityType: "quality_check",
          entityData: { checkType: "visual", status: "pending" },
          synced: false
        },
        {
          deviceId: "mobile-002", 
          action: "update",
          entityType: "equipment_status",
          entityData: { equipmentId: equipment?._id, status: "maintenance" },
          synced: false
        }
      ]);

      // Create seed Odoo sync
      await OdooSyncModel.create([
        {
          entityType: "personnel",
          entityId: "sync-personnel",
          syncType: "import",
          status: "success",
          errorMessage: null,
          lastSync: new Date(Date.now() - 28 * 60 * 1000)
        },
        {
          entityType: "projects",
          entityId: "sync-projects",
          syncType: "import",
          status: "success",
          errorMessage: null,
          lastSync: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          entityType: "facturation",
          entityId: "sync-billing",
          syncType: "export",
          status: "pending",
          errorMessage: null,
          lastSync: new Date(Date.now() - 45 * 60 * 1000)
        }
      ]);

      // Create seed predictions
      await PredictionModel.create({
        projectId: project1._id,
        predictionType: "delay",
        confidence: "0.947",
        prediction: {
          delayDays: "3-5",
          causes: ["weather", "supply_chain"],
          recommendations: ["reallocate_teams", "adjust_planning"]
        }
      });

      console.log('Seed data created successfully');
    } catch (error) {
      console.error('Error creating seed data:', error);
    }
  }

  // Helper method to convert MongoDB documents to plain objects
  private toPlainObject(doc: any): any {
    if (!doc) return doc;
    return JSON.parse(JSON.stringify(doc.toObject ? doc.toObject() : doc));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findById(id);
      return user ? this.toPlainObject(user) : undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ username });
      return user ? this.toPlainObject(user) : undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const user = new UserModel(insertUser);
      await user.save();
      return this.toPlainObject(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    try {
      const projects = await ProjectModel.find().sort({ createdAt: -1 });
      return projects.map(project => this.toPlainObject(project));
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  }

  async getProject(id: string): Promise<Project | undefined> {
    try {
      const project = await ProjectModel.findById(id);
      return project ? this.toPlainObject(project) : undefined;
    } catch (error) {
      console.error('Error getting project:', error);
      return undefined;
    }
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    try {
      const project = new ProjectModel(insertProject);
      await project.save();
      return this.toPlainObject(project);
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const project = await ProjectModel.findByIdAndUpdate(id, updates, { new: true });
      if (!project) throw new Error("Project not found");
      return this.toPlainObject(project);
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }

  // AI Analysis methods
  async getAllAiAnalysis(): Promise<AiPlanAnalysis[]> {
    try {
      const analyses = await AiPlanAnalysisModel.find().sort({ createdAt: -1 });
      return analyses.map(analysis => this.toPlainObject(analysis));
    } catch (error) {
      console.error('Error getting AI analyses:', error);
      return [];
    }
  }

  async getAiAnalysis(id: string): Promise<AiPlanAnalysis | undefined> {
    try {
      const analysis = await AiPlanAnalysisModel.findById(id);
      return analysis ? this.toPlainObject(analysis) : undefined;
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      return undefined;
    }
  }

  async createAiAnalysis(insertAnalysis: InsertAiPlanAnalysis): Promise<AiPlanAnalysis> {
    try {
      const analysis = new AiPlanAnalysisModel(insertAnalysis);
      await analysis.save();
      return this.toPlainObject(analysis);
    } catch (error) {
      console.error('Error creating AI analysis:', error);
      throw new Error('Failed to create AI analysis');
    }
  }

  async updateAiAnalysis(id: string, updates: Partial<AiPlanAnalysis>): Promise<AiPlanAnalysis> {
    try {
      const analysis = await AiPlanAnalysisModel.findByIdAndUpdate(id, updates, { new: true });
      if (!analysis) throw new Error("Analysis not found");
      return this.toPlainObject(analysis);
    } catch (error) {
      console.error('Error updating AI analysis:', error);
      throw new Error('Failed to update AI analysis');
    }
  }

  // IoT Equipment methods
  async getAllIotEquipment(): Promise<IoTEquipment[]> {
    try {
      const equipment = await IoTEquipmentModel.find().sort({ lastUpdate: -1 });
      return equipment.map(item => this.toPlainObject(item));
    } catch (error) {
      console.error('Error getting IoT equipment:', error);
      return [];
    }
  }

  async getIotEquipment(id: string): Promise<IoTEquipment | undefined> {
    try {
      const equipment = await IoTEquipmentModel.findById(id);
      return equipment ? this.toPlainObject(equipment) : undefined;
    } catch (error) {
      console.error('Error getting IoT equipment:', error);
      return undefined;
    }
  }

  async createIotEquipment(insertEquipment: InsertIotEquipment): Promise<IoTEquipment> {
    try {
      const equipment = new IoTEquipmentModel(insertEquipment);
      await equipment.save();
      return this.toPlainObject(equipment);
    } catch (error) {
      console.error('Error creating IoT equipment:', error);
      throw new Error('Failed to create IoT equipment');
    }
  }

  async updateIotEquipment(id: string, updates: Partial<IoTEquipment>): Promise<IoTEquipment> {
    try {
      const equipment = await IoTEquipmentModel.findByIdAndUpdate(id, updates, { new: true });
      if (!equipment) throw new Error("Equipment not found");
      return this.toPlainObject(equipment);
    } catch (error) {
      console.error('Error updating IoT equipment:', error);
      throw new Error('Failed to update IoT equipment');
    }
  }

  // Quality Check methods
  async getAllQualityChecks(): Promise<QualityCheck[]> {
    try {
      const checks = await QualityCheckModel.find().sort({ createdAt: -1 });
      return checks.map(check => this.toPlainObject(check));
    } catch (error) {
      console.error('Error getting quality checks:', error);
      return [];
    }
  }

  async getQualityCheck(id: string): Promise<QualityCheck | undefined> {
    try {
      const check = await QualityCheckModel.findById(id);
      return check ? this.toPlainObject(check) : undefined;
    } catch (error) {
      console.error('Error getting quality check:', error);
      return undefined;
    }
  }

  async createQualityCheck(insertCheck: InsertQualityCheck): Promise<QualityCheck> {
    try {
      const check = new QualityCheckModel(insertCheck);
      await check.save();
      return this.toPlainObject(check);
    } catch (error) {
      console.error('Error creating quality check:', error);
      throw new Error('Failed to create quality check');
    }
  }

  // Dashboard stats
  async getDashboardStats() {
    try {
      const activeProjects = await ProjectModel.countDocuments({ status: "active" });
      const activeEquipment = await IoTEquipmentModel.countDocuments({ status: "active" });
      const qualityAlerts = await QualityCheckModel.countDocuments({ status: "failed" });
      
      return {
        activeProjects,
        activeTeams: activeEquipment * 3, // Simulated team count
        qualityAlerts,
        productivityGain: 32
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        activeProjects: 0,
        activeTeams: 0,
        qualityAlerts: 0,
        productivityGain: 0
      };
    }
  }

  // Mobile sync
  async getMobileSyncQueue(): Promise<MobileSyncQueue[]> {
    try {
      const queue = await MobileSyncQueueModel.find({ synced: false }).sort({ createdAt: 1 });
      return queue.map(item => this.toPlainObject(item));
    } catch (error) {
      console.error('Error getting mobile sync queue:', error);
      return [];
    }
  }

  // Odoo sync
  async getOdooSyncStatus(): Promise<OdooSync[]> {
    try {
      const syncStatus = await OdooSyncModel.find().sort({ lastSync: -1 });
      return syncStatus.map(item => this.toPlainObject(item));
    } catch (error) {
      console.error('Error getting Odoo sync status:', error);
      return [];
    }
  }

  // Predictions
  async getProjectPredictions(projectId: string): Promise<Prediction[]> {
    try {
      const predictions = await PredictionModel.find({ projectId }).sort({ createdAt: -1 });
      return predictions.map(prediction => this.toPlainObject(prediction));
    } catch (error) {
      console.error('Error getting predictions:', error);
      return [];
    }
  }
}

export const mongoStorage = new MongoStorage();
