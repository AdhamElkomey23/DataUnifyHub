import { 
  type User, 
  type InsertUser,
  type Price,
  type InsertPrice,
  type PriceHistory,
  type InsertPriceHistory,
  type Contact,
  type InsertContact,
  type KnowledgeArticle,
  type InsertKnowledgeArticle,
  type Task,
  type InsertTask,
  prices,
  priceHistory,
  contacts,
  knowledgeArticles,
  tasks
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getPrices(filters?: {
    search?: string;
    city?: string;
    serviceType?: string;
    category?: string;
  }): Promise<Price[]>;
  getPriceById(id: number): Promise<Price | undefined>;
  createPrice(price: InsertPrice): Promise<Price>;
  updatePrice(id: number, price: Partial<InsertPrice>): Promise<Price | undefined>;
  deletePrice(id: number): Promise<boolean>;

  getPriceHistory(priceId: number): Promise<PriceHistory[]>;
  createPriceHistory(history: InsertPriceHistory): Promise<PriceHistory>;

  getContacts(): Promise<Contact[]>;
  getContactById(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;

  getArticles(): Promise<KnowledgeArticle[]>;
  getArticle(id: number): Promise<KnowledgeArticle | undefined>;
  createArticle(article: InsertKnowledgeArticle): Promise<KnowledgeArticle>;
  updateArticle(id: number, article: Partial<InsertKnowledgeArticle>): Promise<KnowledgeArticle | undefined>;
  deleteArticle(id: number): Promise<boolean>;

  getTasks(filters?: { search?: string; status?: string; priority?: string }): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private prices: Map<number, Price>;
  private priceHistory: Map<number, PriceHistory>;
  private contacts: Map<number, Contact>;
  private priceIdCounter: number;
  private historyIdCounter: number;
  private contactIdCounter: number;

  constructor() {
    this.users = new Map();
    this.prices = new Map();
    this.priceHistory = new Map();
    this.contacts = new Map();
    this.priceIdCounter = 1;
    this.historyIdCounter = 1;
    this.contactIdCounter = 1;

    this.seedInitialData();
  }

  private seedInitialData() {
    const now = new Date();
    const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const initialPrices: Omit<Price, 'id'>[] = [
      {
        serviceName: "Luxury Hotel - 5 Star",
        serviceType: "Hotel",
        city: "Dubai",
        category: "Luxury",
        costPrice: "400.00",
        currency: "USD",
        notes: "Includes breakfast and airport transfer",
        updatedBy: "Sarah Chen",
        updatedAt: daysAgo(2),
        createdAt: daysAgo(10),
      },
      {
        serviceName: "Private Tour Guide - Full Day",
        serviceType: "Guide",
        city: "Cairo",
        category: "Standard",
        costPrice: "100.00",
        currency: "USD",
        notes: "English speaking, licensed guide",
        updatedBy: "Mike Ross",
        updatedAt: daysAgo(1),
        createdAt: daysAgo(5),
      },
      {
        serviceName: "Luxury Vehicle Rental - Toyota Hiace",
        serviceType: "Vehicle",
        city: "Dubai",
        category: "Deluxe",
        costPrice: "250.00",
        currency: "USD",
        notes: "Includes driver and fuel, 8 hours",
        updatedBy: "Alex Kim",
        updatedAt: daysAgo(3),
        createdAt: daysAgo(8),
      },
      {
        serviceName: "Philae Temple Entrance Ticket",
        serviceType: "Ticket",
        city: "Aswan",
        category: "Standard",
        costPrice: "40.00",
        currency: "USD",
        notes: "Price may change seasonally",
        updatedBy: "Sarah Chen",
        updatedAt: daysAgo(95),
        createdAt: daysAgo(100),
      },
      {
        serviceName: "Nile Cruise - 3 Nights Luxor to Aswan",
        serviceType: "Cruise",
        city: "Luxor",
        category: "Luxury",
        costPrice: "650.00",
        currency: "USD",
        notes: "Full board, guided excursions included",
        updatedBy: "Mike Ross",
        updatedAt: daysAgo(4),
        createdAt: daysAgo(15),
      },
    ];

    initialPrices.forEach((price) => {
      const id = this.priceIdCounter++;
      this.prices.set(id, { ...price, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, role: "sales" };
    this.users.set(id, user);
    return user;
  }

  async getPrices(filters?: {
    search?: string;
    city?: string;
    serviceType?: string;
    category?: string;
  }): Promise<Price[]> {
    let prices = Array.from(this.prices.values());

    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        prices = prices.filter(
          (p) =>
            p.serviceName.toLowerCase().includes(search) ||
            p.city.toLowerCase().includes(search)
        );
      }

      if (filters.city && filters.city !== "all") {
        prices = prices.filter((p) => p.city.toLowerCase() === filters.city!.toLowerCase());
      }

      if (filters.serviceType && filters.serviceType !== "all") {
        prices = prices.filter((p) => p.serviceType.toLowerCase() === filters.serviceType!.toLowerCase());
      }

      if (filters.category && filters.category !== "all") {
        prices = prices.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
      }
    }

    return prices.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getPriceById(id: number): Promise<Price | undefined> {
    return this.prices.get(id);
  }

  async createPrice(insertPrice: InsertPrice): Promise<Price> {
    const id = this.priceIdCounter++;
    const now = new Date();

    const price: Price = {
      id,
      serviceName: insertPrice.serviceName!,
      serviceType: insertPrice.serviceType!,
      city: insertPrice.city!,
      category: insertPrice.category!,
      costPrice: insertPrice.costPrice!,
      currency: insertPrice.currency || "USD",
      notes: insertPrice.notes || null,
      updatedBy: insertPrice.updatedBy!,
      updatedAt: now,
      createdAt: now,
    };
    this.prices.set(id, price);
    return price;
  }

  async updatePrice(id: number, updates: Partial<InsertPrice>): Promise<Price | undefined> {
    const existing = this.prices.get(id);
    if (!existing) return undefined;

    const updated: Price = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    };
    this.prices.set(id, updated);
    return updated;
  }

  async deletePrice(id: number): Promise<boolean> {
    return this.prices.delete(id);
  }

  async getPriceHistory(priceId: number): Promise<PriceHistory[]> {
    return Array.from(this.priceHistory.values())
      .filter((h) => h.priceId === priceId)
      .sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());
  }

  async createPriceHistory(insertHistory: InsertPriceHistory): Promise<PriceHistory> {
    const id = this.historyIdCounter++;
    const history: PriceHistory = {
      id,
      priceId: insertHistory.priceId,
      field: insertHistory.field,
      oldValue: insertHistory.oldValue,
      newValue: insertHistory.newValue,
      changedBy: insertHistory.changedBy,
      changedAt: new Date(),
    };
    this.priceHistory.set(id, history);
    return history;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getContactById(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactIdCounter++;
    const now = new Date();

    const contact: Contact = {
      id,
      name: insertContact.name,
      role: insertContact.role,
      company: insertContact.company,
      category: insertContact.category,
      whatsapp: insertContact.whatsapp || null,
      email: insertContact.email || null,
      tags: insertContact.tags || null,
      notes: insertContact.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContact(id: number, updates: Partial<InsertContact>): Promise<Contact | undefined> {
    const existing = this.contacts.get(id);
    if (!existing) return undefined;

    const updated: Contact = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    };
    this.contacts.set(id, updated);
    return updated;
  }

  async deleteContact(id: number): Promise<boolean> {
    await db.delete(contacts).where(eq(contacts.id, id));
    return true;
  }

  async getArticles(): Promise<KnowledgeArticle[]> {
    return await db.select().from(knowledgeArticles).orderBy(knowledgeArticles.updatedAt);
  }

  async getArticle(id: number): Promise<KnowledgeArticle | undefined> {
    const result = await db.select().from(knowledgeArticles).where(eq(knowledgeArticles.id, id));
    return result[0];
  }

  async createArticle(article: InsertKnowledgeArticle): Promise<KnowledgeArticle> {
    const result = await db.insert(knowledgeArticles).values(article).returning();
    return result[0];
  }

  async updateArticle(id: number, article: Partial<InsertKnowledgeArticle>): Promise<KnowledgeArticle | undefined> {
    const result = await db.update(knowledgeArticles)
      .set({ ...article, updatedAt: new Date() })
      .where(eq(knowledgeArticles.id, id))
      .returning();
    return result[0];
  }

  async deleteArticle(id: number): Promise<boolean> {
    await db.delete(knowledgeArticles).where(eq(knowledgeArticles.id, id));
    return true;
  }

  async getTasks(filters?: { search?: string; status?: string; priority?: string }): Promise<Task[]> {
    let query = db.select().from(tasks);
    const result = await query;
    
    let filteredTasks = result;
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (t) => t.title.toLowerCase().includes(search) || t.assignee.toLowerCase().includes(search)
      );
    }
    
    if (filters?.status && filters.status !== "all") {
      filteredTasks = filteredTasks.filter((t) => t.status === filters.status);
    }
    
    if (filters?.priority && filters.priority !== "all") {
      filteredTasks = filteredTasks.filter((t) => t.priority === filters.priority);
    }
    
    return filteredTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTask(id: number): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0];
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(task).returning();
    return result[0];
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const result = await db.update(tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return result[0];
  }

  async deleteTask(id: number): Promise<boolean> {
    await db.delete(tasks).where(eq(tasks.id, id));
    return true;
  }
}

export const storage = new MemStorage();