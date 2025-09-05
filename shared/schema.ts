import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // Chef d'Exécution, Chef de Chantier, etc.
  email: text("email"),
});

// Construction projects
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull(), // active, completed, paused
  location: text("location"),
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  budget: decimal("budget"),
  progress: integer("progress").default(0), // percentage
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// AI plan analysis
export const aiPlanAnalysis = pgTable("ai_plan_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  fileType: text("file_type"), // dwg, ifc, pdf
  status: text("status").notNull(), // processing, completed, failed
  progress: integer("progress").default(0),
  aiConfidence: decimal("ai_confidence"),
  extractedData: json("extracted_data"), // quantities, elements detected
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// IoT equipment tracking
export const iotEquipment = pgTable("iot_equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // crane, excavator, compactor
  projectId: varchar("project_id").references(() => projects.id),
  status: text("status").notNull(), // active, maintenance, offline
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  utilization: integer("utilization").default(0), // percentage
  batteryLevel: integer("battery_level"),
  lastUpdate: timestamp("last_update").default(sql`CURRENT_TIMESTAMP`),
  sensorData: json("sensor_data"), // temperature, vibration, etc.
});

// Quality control checks
export const qualityChecks = pgTable("quality_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id),
  checkType: text("check_type").notNull(), // concrete, steel, visual
  location: text("location"),
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  status: text("status").notNull(), // passed, failed, pending
  aiScore: decimal("ai_score"), // AI confidence score
  imageUrl: text("image_url"),
  notes: text("notes"),
  inspector: text("inspector"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Mobile sync queue for offline operations
export const mobileSyncQueue = pgTable("mobile_sync_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: text("device_id").notNull(),
  action: text("action").notNull(), // create, update, delete
  entityType: text("entity_type").notNull(),
  entityData: json("entity_data"),
  synced: boolean("synced").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Odoo integration logs
export const odooSync = pgTable("odoo_sync", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  syncType: text("sync_type").notNull(), // import, export
  status: text("status").notNull(), // success, failed, pending
  errorMessage: text("error_message"),
  lastSync: timestamp("last_sync").default(sql`CURRENT_TIMESTAMP`),
});

// Predictive analytics
export const predictions = pgTable("predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id),
  predictionType: text("prediction_type").notNull(), // delay, cost, risk
  confidence: decimal("confidence"),
  prediction: json("prediction"), // predicted values, recommendations
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  email: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  status: true,
  location: true,
  latitude: true,
  longitude: true,
  startDate: true,
  endDate: true,
  budget: true,
});

export const insertAiPlanAnalysisSchema = createInsertSchema(aiPlanAnalysis).pick({
  projectId: true,
  fileName: true,
  fileSize: true,
  fileType: true,
});

export const insertIotEquipmentSchema = createInsertSchema(iotEquipment).pick({
  name: true,
  type: true,
  projectId: true,
  latitude: true,
  longitude: true,
});

export const insertQualityCheckSchema = createInsertSchema(qualityChecks).pick({
  projectId: true,
  checkType: true,
  location: true,
  latitude: true,
  longitude: true,
  imageUrl: true,
  notes: true,
  inspector: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertAiPlanAnalysis = z.infer<typeof insertAiPlanAnalysisSchema>;
export type AiPlanAnalysis = typeof aiPlanAnalysis.$inferSelect;
export type InsertIotEquipment = z.infer<typeof insertIotEquipmentSchema>;
export type IoTEquipment = typeof iotEquipment.$inferSelect;
export type InsertQualityCheck = z.infer<typeof insertQualityCheckSchema>;
export type QualityCheck = typeof qualityChecks.$inferSelect;
export type MobileSyncQueue = typeof mobileSyncQueue.$inferSelect;
export type OdooSync = typeof odooSync.$inferSelect;
export type Prediction = typeof predictions.$inferSelect;
