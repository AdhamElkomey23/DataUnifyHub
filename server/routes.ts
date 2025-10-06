import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPriceSchema, insertPriceHistorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {

  app.get("/api/prices", async (req, res) => {
    try {
      const { search, city, serviceType, category } = req.query;
      const prices = await storage.getPrices({
        search: search as string,
        city: city as string,
        serviceType: serviceType as string,
        category: category as string,
      });
      res.json(prices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prices" });
    }
  });

  app.get("/api/prices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const price = await storage.getPriceById(id);
      if (!price) {
        return res.status(404).json({ error: "Price not found" });
      }
      res.json(price);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch price" });
    }
  });

  app.post("/api/prices", async (req, res) => {
    try {
      const validated = insertPriceSchema.parse(req.body);
      const price = await storage.createPrice(validated);
      res.status(201).json(price);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create price" });
    }
  });

  app.patch("/api/prices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existing = await storage.getPriceById(id);

      if (!existing) {
        return res.status(404).json({ error: "Price not found" });
      }

      const updates = req.body;
      const updatedPrice = await storage.updatePrice(id, updates);

      for (const [field, newValue] of Object.entries(updates)) {
        const oldValue = existing[field as keyof typeof existing];
        if (oldValue !== newValue && field !== 'updatedBy' && field !== 'updatedAt') {
          await storage.createPriceHistory({
            priceId: id,
            field,
            oldValue: String(oldValue),
            newValue: String(newValue),
            changedBy: updates.updatedBy || "Unknown",
          });
        }
      }

      res.json(updatedPrice);
    } catch (error) {
      res.status(500).json({ error: "Failed to update price" });
    }
  });

  app.delete("/api/prices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePrice(id);
      if (!deleted) {
        return res.status(404).json({ error: "Price not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete price" });
    }
  });

  app.get("/api/prices/:id/history", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const history = await storage.getPriceHistory(id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch price history" });
    }
  });

  // Add contacts API routes
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await storage.getContactById(id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contact = await storage.createContact(req.body);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create contact" });
    }
  });

  app.patch("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existing = await storage.getContactById(id);

      if (!existing) {
        return res.status(404).json({ error: "Contact not found" });
      }

      const updates = req.body;
      const updatedContact = await storage.updateContact(id, updates);

      res.json(updatedContact);
    } catch (error) {
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContact(id);
      if (!deleted) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}