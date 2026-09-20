import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  background: string;
  source: string;
  submittedAt: string;
}

import { getMongoDb } from "./mongodb";

// In-memory runtime cache
let memoryLeads: Lead[] = [];

async function getMongoCollection() {
  try {
    const db = await getMongoDb();
    if (!db) return null;
    return db.collection<Lead>("leads");
  } catch (err) {
    console.warn("[MongoDB Collection Notice]:", err);
    return null;
  }
}

function getStoragePath(): string {
  const localDir = path.join(process.cwd(), "data");
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, "leads.json");
  } catch {
    const tmpDir = "/tmp";
    return path.join(tmpDir, "treqo_leads.json");
  }
}

function loadLeadsFromFile(): Lead[] {
  try {
    const filePath = getStoragePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data) || [];
    }
  } catch (err) {
    console.error("[DB Read Error]:", err);
  }
  return [];
}

function saveLeadsToFile(leads: Lead[]) {
  try {
    const filePath = getStoragePath();
    fs.writeFileSync(filePath, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.error("[DB Write Error]:", err);
  }
}

// Initialize memory from file
try {
  memoryLeads = loadLeadsFromFile();
} catch {
  memoryLeads = [];
}

export async function addLead(leadData: Omit<Lead, "id" | "submittedAt">): Promise<Lead> {
  const newLead: Lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: leadData.name.trim(),
    email: leadData.email.trim().toLowerCase(),
    phone: leadData.phone.trim(),
    course: leadData.course.trim() || "New Age Digital Marketing",
    background: leadData.background?.trim() || "General Inquiry",
    source: leadData.source?.trim() || "Website Form",
    submittedAt: new Date().toISOString(),
  };

  // Try MongoDB first if configured
  const collection = await getMongoCollection();
  if (collection) {
    try {
      await collection.insertOne({ ...newLead });
      console.log("[MongoDB] Lead inserted into collection successfully");
    } catch (err) {
      console.error("[MongoDB Insert Error]:", err);
    }
  }

  // Also save to memory/file store
  memoryLeads.unshift(newLead);
  saveLeadsToFile(memoryLeads);

  return newLead;
}

export async function getLeads(): Promise<Lead[]> {
  const collection = await getMongoCollection();
  if (collection) {
    try {
      const docs = await collection.find({}).sort({ submittedAt: -1 }).toArray();
      if (docs && docs.length > 0) {
        return docs.map((d) => ({
          id: d.id || String(d._id),
          name: d.name,
          email: d.email,
          phone: d.phone,
          course: d.course,
          background: d.background,
          source: d.source,
          submittedAt: d.submittedAt,
        }));
      }
    } catch (err) {
      console.error("[MongoDB Fetch Error]:", err);
    }
  }

  // Fallback to file storage
  const fileLeads = loadLeadsFromFile();
  memoryLeads = fileLeads;
  return memoryLeads;
}

export async function deleteLead(id: string): Promise<boolean> {
  const collection = await getMongoCollection();
  if (collection) {
    try {
      await collection.deleteOne({ id });
    } catch (err) {
      console.error("[MongoDB Delete Error]:", err);
    }
  }

  memoryLeads = memoryLeads.filter((l) => l.id !== id);
  saveLeadsToFile(memoryLeads);
  return true;
}
