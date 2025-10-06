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

  // Delete contact
  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContact(id);
      res.status(204).send();
    } catch (error: any) {
      console.error("Failed to delete contact:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Get all articles
  app.get("/api/articles", async (_req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error: any) {
      console.error("Failed to fetch articles:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Get single article
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticle(id);
      if (!article) {
        res.status(404).send({ error: "Article not found" });
        return;
      }
      res.json(article);
    } catch (error: any) {
      console.error("Failed to fetch article:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Create article
  app.post("/api/articles", async (req, res) => {
    try {
      const article = await storage.createArticle(req.body);
      res.status(201).json(article);
    } catch (error: any) {
      console.error("Failed to create article:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Update article
  app.put("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.updateArticle(id, req.body);
      res.json(article);
    } catch (error: any) {
      console.error("Failed to update article:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Delete article
  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteArticle(id);
      res.status(204).send();
    } catch (error: any) {
      console.error("Failed to delete article:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Get all tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const { search, status, priority } = req.query;
      const tasks = await storage.getTasks({
        search: search as string,
        status: status as string,
        priority: priority as string,
      });
      res.json(tasks);
    } catch (error: any) {
      console.error("Failed to fetch tasks:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Get single task
  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      if (!task) {
        res.status(404).send({ error: "Task not found" });
        return;
      }
      res.json(task);
    } catch (error: any) {
      console.error("Failed to fetch task:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Create task
  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = {
        ...req.body,
        dueDate: new Date(req.body.dueDate),
      };
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error: any) {
      console.error("Failed to create task:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Update task
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = { ...req.body };
      if (updates.dueDate) {
        updates.dueDate = new Date(updates.dueDate);
      }
      const task = await storage.updateTask(id, updates);
      if (!task) {
        res.status(404).send({ error: "Task not found" });
        return;
      }
      res.json(task);
    } catch (error: any) {
      console.error("Failed to update task:", error);
      res.status(500).send({ error: error.message });
    }
  });

  // Delete task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTask(id);
      res.status(204).send();
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      res.status(500).send({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}