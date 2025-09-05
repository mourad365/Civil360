import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertAiPlanAnalysisSchema, insertIotEquipmentSchema, insertQualityCheckSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard endpoint
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Projects endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // AI Plan Analysis endpoints
  app.get("/api/ai/analysis", async (req, res) => {
    try {
      const analyses = await storage.getAllAiAnalysis();
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI analyses" });
    }
  });

  app.post("/api/ai/analysis", async (req, res) => {
    try {
      const validatedData = insertAiPlanAnalysisSchema.parse(req.body);
      const analysis = await storage.createAiAnalysis(validatedData);
      
      // Simulate AI processing
      setTimeout(async () => {
        await storage.updateAiAnalysis(analysis.id, {
          progress: 100,
          status: "completed",
          aiConfidence: "0.952",
          extractedData: {
            elements: Math.floor(Math.random() * 500) + 200,
            openings: Math.floor(Math.random() * 100) + 50,
            concrete: `${Math.floor(Math.random() * 300) + 100}.${Math.floor(Math.random() * 10)} m³`,
            steel: `${Math.floor(Math.random() * 20) + 5}.${Math.floor(Math.random() * 10)} T`,
            formwork: `${Math.floor(Math.random() * 2000) + 800} m²`
          }
        });
      }, 10000);

      res.status(201).json(analysis);
    } catch (error) {
      res.status(400).json({ error: "Invalid analysis data" });
    }
  });

  app.put("/api/ai/analysis/:id", async (req, res) => {
    try {
      const analysis = await storage.updateAiAnalysis(req.params.id, req.body);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to update analysis" });
    }
  });

  // IoT Equipment endpoints
  app.get("/api/iot/equipment", async (req, res) => {
    try {
      const equipment = await storage.getAllIotEquipment();
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch IoT equipment" });
    }
  });

  app.post("/api/iot/equipment", async (req, res) => {
    try {
      const validatedData = insertIotEquipmentSchema.parse(req.body);
      const equipment = await storage.createIotEquipment(validatedData);
      res.status(201).json(equipment);
    } catch (error) {
      res.status(400).json({ error: "Invalid equipment data" });
    }
  });

  app.put("/api/iot/equipment/:id", async (req, res) => {
    try {
      const equipment = await storage.updateIotEquipment(req.params.id, req.body);
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update equipment" });
    }
  });

  // Simulate real-time IoT updates
  app.post("/api/iot/simulate-update", async (req, res) => {
    try {
      const equipment = await storage.getAllIotEquipment();
      const randomEquipment = equipment[Math.floor(Math.random() * equipment.length)];
      
      if (randomEquipment) {
        const updates = {
          utilization: Math.floor(Math.random() * 100),
          batteryLevel: Math.max(10, randomEquipment.batteryLevel! - Math.floor(Math.random() * 5)),
          sensorData: {
            ...randomEquipment.sensorData,
            temperature: Math.floor(Math.random() * 40) + 30,
            lastReading: new Date().toISOString()
          }
        };
        
        await storage.updateIotEquipment(randomEquipment.id, updates);
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to simulate IoT update" });
    }
  });

  // Quality Control endpoints
  app.get("/api/quality/checks", async (req, res) => {
    try {
      const checks = await storage.getAllQualityChecks();
      res.json(checks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quality checks" });
    }
  });

  app.post("/api/quality/checks", async (req, res) => {
    try {
      const validatedData = insertQualityCheckSchema.parse(req.body);
      
      // Simulate AI analysis
      const aiScore = (Math.random() * 0.3 + 0.7).toFixed(3); // 0.7-1.0
      const status = parseFloat(aiScore) > 0.9 ? "passed" : "failed";
      
      const checkData = {
        ...validatedData,
        status,
        aiScore
      };
      
      const check = await storage.createQualityCheck(checkData);
      res.status(201).json(check);
    } catch (error) {
      res.status(400).json({ error: "Invalid quality check data" });
    }
  });

  // Mobile sync endpoints
  app.get("/api/mobile/sync-queue", async (req, res) => {
    try {
      const queue = await storage.getMobileSyncQueue();
      res.json(queue);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mobile sync queue" });
    }
  });

  // Odoo integration endpoints
  app.get("/api/odoo/sync-status", async (req, res) => {
    try {
      const syncStatus = await storage.getOdooSyncStatus();
      res.json(syncStatus);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Odoo sync status" });
    }
  });

  app.post("/api/odoo/trigger-sync", async (req, res) => {
    try {
      const { entityType } = req.body;
      
      // Simulate Odoo sync process
      setTimeout(async () => {
        // Update sync status in storage
        console.log(`Odoo sync triggered for ${entityType}`);
      }, 1000);
      
      res.json({ success: true, message: `Sync initiated for ${entityType}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to trigger Odoo sync" });
    }
  });

  // Predictions endpoints
  app.get("/api/predictions/:projectId", async (req, res) => {
    try {
      const predictions = await storage.getProjectPredictions(req.params.projectId);
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch predictions" });
    }
  });

  // File upload simulation for AI plan analysis
  app.post("/api/ai/upload-plan", async (req, res) => {
    try {
      const { fileName, fileSize, fileType, projectId } = req.body;
      
      const analysis = await storage.createAiAnalysis({
        fileName,
        fileSize,
        fileType,
        projectId
      });

      // Simulate processing progress
      let progress = 0;
      const progressInterval = setInterval(async () => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          
          await storage.updateAiAnalysis(analysis.id, {
            progress: 100,
            status: "completed",
            aiConfidence: (Math.random() * 0.2 + 0.8).toFixed(3),
            extractedData: {
              elements: Math.floor(Math.random() * 500) + 200,
              openings: Math.floor(Math.random() * 150) + 50,
              networks: Math.floor(Math.random() * 20) + 5,
              concrete: `${Math.floor(Math.random() * 300) + 100}.${Math.floor(Math.random() * 10)} m³`,
              steel: `${Math.floor(Math.random() * 30) + 10}.${Math.floor(Math.random() * 10)} T`,
              formwork: `${Math.floor(Math.random() * 3000) + 1000} m²`
            }
          });
        } else {
          await storage.updateAiAnalysis(analysis.id, { progress });
        }
      }, 2000);

      res.status(201).json(analysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload plan for analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
