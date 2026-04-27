import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

// Mock Database/Data Models
interface Category {
  id: string;
  name: string;
  description: string;
}

interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

// In-memory mock database
const db = {
  categories: [
    { id: "c1", name: "Premium Bouquets", description: "Our artisan collection of handcrafted bouquets." },
    { id: "c2", name: "Wedding & Events", description: "Spectacular arrangements for life's biggest celebrations." }
  ] as Category[],
  products: [
    {
      id: "p1",
      categoryId: "c1",
      name: "Valentine Bouquet",
      description: "A delicate balance of romantic blooms, crafted perfectly for your loved one.",
      price: "500",
      imageUrl: "/123.src.png"
    },
    {
      id: "p2",
      categoryId: "c1",
      name: "Customized Bouquet",
      description: "Personally curated arrangement depending on the blooms of your choice.",
      price: "Custom",
      imageUrl: "/1.src.png"
    },
    {
      id: "p3",
      categoryId: "c1",
      name: "Polaroid Bouquets",
      description: "A beautiful bouquet paired with polaroid memories to make it special.",
      price: "800",
      imageUrl: "/2.src.png"
    },
    {
      id: "p4",
      categoryId: "c1",
      name: "Birthday Customized Box",
      description: "A delightful surprise curated carefully to make birthdays unforgettable.",
      price: "Custom",
      imageUrl: "/4.src.png"
    },
    {
      id: "p5",
      categoryId: "c1",
      name: "Anniversary Customized Platter",
      description: "Celebrate milestones with our beautifully arranged custom platters.",
      price: "1300",
      imageUrl: "/5.src.png"
    },
    {
      id: "p6",
      categoryId: "c1",
      name: "Chocolate Bouquet",
      description: "An irresistible arrangement of decadent chocolates for the sweet tooth.",
      price: "100+",
      imageUrl: "/6.src.png"
    },
    {
      id: "p7",
      categoryId: "c1",
      name: "Stationery Bouquet",
      description: "A creative and fun arrangement combining beautiful blooms and elegant stationery.",
      price: "1000",
      imageUrl: "/7.src.png"
    },
    {
      id: "p8",
      categoryId: "c1",
      name: "Candy Bouquet",
      description: "A playful, vibrant assortment of your favorite candies arranged elegantly.",
      price: "1500",
      imageUrl: "/snack-bouquet.jpg.png"
    }
  ] as Product[]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoints - Cloud Native Architecture Design
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  app.get("/api/categories", (req, res) => {
    res.json(db.categories);
  });

  app.get("/api/products", (req, res) => {
    const categoryId = req.query.category as string;
    if (categoryId) {
      res.json(db.products.filter(p => p.categoryId === categoryId));
    } else {
      res.json(db.products);
    }
  });

  // Mock endpoint for WhatsApp order initialization tracking
  app.post("/api/orders/initiate", (req, res) => {
    const { productId, userPhone } = req.body;
    console.log(`[API] Order initiated for Product: ${productId}, Phone: ${userPhone}`);
    // In a real app, this might publish to a message queue (Pub/Sub, SQS)
    res.status(202).json({ success: true, message: "Order tracking initiated. Redirecting to WhatsApp."});
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[Server Error]", err.stack);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
