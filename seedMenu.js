const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAiXPbX9s4mJv97R5y6PZNJLeq-Jl9rYEw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "la-merienda-a5f6f.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "la-merienda-a5f6f",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "la-merienda-a5f6f.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "850128832770",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:850128832770:web:3be89d3950c814eb2a1a1b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const menuItems = [
  // Specials & New
  { name: "Mango Matcha Latte", category: "Specials & New", description: "Mango, matcha & milk.", price: 6.50, tags: ["Neu", "Matcha"], available: true },
  { name: "Mango Coconut Matcha", category: "Specials & New", description: "Mango, matcha & coconut water.", price: 6.50, tags: ["Neu", "Matcha"], available: true },
  { name: "Ube Matcha Latte", category: "Specials & New", description: "Ube, matcha & milk.", price: 6.50, tags: ["Neu", "Matcha"], available: true },
  { name: "Dalgona Coffee", category: "Specials & New", description: "Whipped coffee & milk.", price: 5.40, tags: ["Neu", "Coffee"], available: true },
  { name: "Biscoff Latte", category: "Specials & New", description: "Lotus Biscoff, milk & espresso.", price: 5.50, tags: ["Neu", "Trending"], available: true },
  { name: "Spanish Latte", category: "Specials & New", description: "Condensed milk, espresso, milk & salt.", price: 5.40, tags: ["Neu", "Coffee"], available: true },
  { name: "Raspberry Cheesecake Latte", category: "Specials & New", description: "Cream cheese, raspberry, milk & espresso.", price: 5.90, tags: ["Neu", "Sweet"], available: true },
  { name: "Dirty Matcha Latte", category: "Specials & New", description: "Mango, matcha & milk with espresso shot.", price: 5.90, tags: ["Neu", "Matcha"], available: true },
  { name: "Lavender Lemonade", category: "Specials & New", description: "Lavender, lemon & sugar syrup.", price: 5.50, tags: ["Neu", "Refreshing"], available: true },
  { name: "Lavender Strawberry Lemonade", category: "Specials & New", description: "Strawberry, lavender, lemon & syrup.", price: 5.90, tags: ["Neu", "Refreshing"], available: true },
  { name: "Protein Iced Coffee", category: "Specials & New", description: "Coffee, milk & protein.", price: 6.50, tags: ["Neu", "Fitness"], available: true },

  // Crêpes
  { name: "Erdbeere, Banane, Nutella Crêpe", category: "Crêpes", description: "Warm, golden crêpe loaded with fresh strawberries, bananas, and rich Nutella.", price: 7.50, tags: ["Bestseller", "Sweet"], available: true },
  { name: "La Merienda Special (Zucker / Zimtzucker)", category: "Crêpes", description: "Classic choice of sugar or cinnamon sugar.", price: 3.90, tags: ["Special", "Classic"], available: true },
  { name: "Nutella Crêpe", category: "Crêpes", description: "Simple, warm crêpe filled with smooth, creamy Nutella.", price: 4.50, tags: ["Special", "Sweet"], available: true },
  { name: "Banane & Nutella Crêpe", category: "Crêpes", description: "Fresh banana slices paired with rich Nutella inside a warm crêpe.", price: 5.50, tags: ["Special", "Sweet"], available: true },
  { name: "Nutella Bueno Crêpe", category: "Crêpes", description: "Decadent crêpe filled with Nutella and crunchy Kinder Bueno pieces.", price: 6.50, tags: ["Bestseller", "Sweet"], available: true },
  { name: "Basis-Crêpe (ohne Belag)", category: "Crêpes", description: "Plain freshly baked warm crêpe.", price: 3.50, tags: ["Classic"], available: true },
  { name: "Butter & Zucker Crêpe", category: "Crêpes", description: "Melting butter and fine sugar.", price: 4.50, tags: ["Classic", "Sweet"], available: true },
  { name: "Apfelmus Crêpe", category: "Crêpes", description: "Sweet and comforting homemade apple sauce filling.", price: 4.50, tags: ["Classic", "Fruit"], available: true },
  { name: "Konfitüre nach Wahl", category: "Crêpes", description: "Choice of strawberry, raspberry, or apricot fruit jam.", price: 4.50, tags: ["Classic", "Fruit"], available: true },
  { name: "Nutella & Mandel Crêpe", category: "Crêpes", description: "Nutella with sliced almonds.", price: 5.50, tags: ["Nutella", "Nuts"], available: true },
  { name: "Nutella Oreo Crêpe", category: "Crêpes", description: "Nutella layered with crushed Oreo cookie crumbles.", price: 6.50, tags: ["Nutella", "Sweet"], available: true },
  { name: "Mozzarella, Rucola, Tomaten Crêpe", category: "Crêpes", description: "Fresh mozzarella, peppery arugula, and ripe tomatoes.", price: 6.50, tags: ["Herzhaft", "Vegetarian"], available: true },
  { name: "Frischkäse, Emmentaler, Tomaten, Mozzarella", category: "Crêpes", description: "Am beliebtesten! Cream cheese, Emmentaler, tomatoes, and mozzarella.", price: 7.50, tags: ["Herzhaft", "Popular"], available: true },
  { name: "Blattspinat, Schafskäse, Grüner Pesto", category: "Crêpes", description: "Vegetarisch. Leaf spinach, feta cheese, and green pesto.", price: 7.50, tags: ["Herzhaft", "Vegetarian"], available: true },
  { name: "Emmentaler Käse Crêpe", category: "Crêpes", description: "Vegetarisch. Melted Emmentaler cheese.", price: 5.00, tags: ["Herzhaft", "Vegetarian"], available: true },
  { name: "Schinken und Käse Crêpe", category: "Crêpes", description: "Classic savory ham and melted cheese.", price: 5.80, tags: ["Herzhaft", "Classic"], available: true },
  { name: "Putenschinken und Käse Crêpe", category: "Crêpes", description: "Turkey ham and melted cheese.", price: 5.80, tags: ["Herzhaft", "Classic"], available: true },

  // Coffee & Hot Drinks
  { name: "Jeder Kaffee + Crêpe Combo", category: "Coffee & Hot Drinks", description: "Any coffee paired with your choice of classic crêpe.", price: 6.90, tags: ["Combo", "Popular"], available: true },
  { name: "Espresso", category: "Coffee & Hot Drinks", description: "Strong, pure Italian espresso shot.", price: 2.60, tags: ["Hot", "Coffee"], available: true },
  { name: "Espresso Macchiato", category: "Coffee & Hot Drinks", description: "Espresso with a dash of milk foam.", price: 2.80, tags: ["Hot", "Coffee"], available: true },
  { name: "Café Crème", category: "Coffee & Hot Drinks", description: "Smooth classic café crème.", price: 2.90, tags: ["Hot", "Coffee"], available: true },
  { name: "Milchkaffee", category: "Coffee & Hot Drinks", description: "Classic European milk coffee.", price: 3.50, tags: ["Hot", "Coffee"], available: true },
  { name: "Americano", category: "Coffee & Hot Drinks", description: "Rich espresso with hot water.", price: 3.50, tags: ["Hot", "Coffee"], available: true },
  { name: "Cappuccino", category: "Coffee & Hot Drinks", description: "Espresso with velvety frothed milk foam.", price: 3.60, tags: ["Hot", "Coffee"], available: true },
  { name: "Latte Macchiato", category: "Coffee & Hot Drinks", description: "Layered steamed milk and espresso.", price: 3.80, tags: ["Hot", "Coffee"], available: true },
  { name: "Moccaccino", category: "Coffee & Hot Drinks", description: "Espresso combined with rich chocolate and steamed milk.", price: 3.80, tags: ["Hot", "Coffee"], available: true },
  { name: "Flat White", category: "Coffee & Hot Drinks", description: "Double shot of espresso with microfoam milk.", price: 4.00, tags: ["Hot", "Coffee"], available: true },
  { name: "Schoko (Schwarz / Weiß)", category: "Coffee & Hot Drinks", description: "Rich hot chocolate (dark or white).", price: 3.90, tags: ["Hot", "Chocolate"], available: true },
  { name: "Chai Latte", category: "Coffee & Hot Drinks", description: "Spiced black tea with steamed milk.", price: 3.90, tags: ["Hot", "Tea"], available: true },
  { name: "Matcha Latte", category: "Coffee & Hot Drinks", description: "Authentic green tea matcha with velvety milk.", price: 4.90, tags: ["Hot", "Matcha"], available: true },
  { name: "Masala Chai", category: "Coffee & Hot Drinks", description: "Traditional aromatic spiced chai tea.", price: 3.50, tags: ["Hot", "Tea"], available: true },

  // Iced Drinks & Matchas
  { name: "Iced Coffee", category: "Iced Drinks & Matchas", description: "Chilled refreshing coffee over ice.", price: 4.90, tags: ["Iced", "Cold"], available: true },
  { name: "Iced Latte (Karamell / Hazelnut / Vanille)", category: "Iced Drinks & Matchas", description: "Smooth espresso and cold milk over ice with choice of syrup flavoring.", price: 4.50, tags: ["Iced", "Cold"], available: true },
  { name: "Iced Mochaccino", category: "Iced Drinks & Matchas", description: "Chilled espresso, chocolate, and milk over ice.", price: 4.70, tags: ["Iced", "Cold"], available: true },
  { name: "Iced Chai", category: "Iced Drinks & Matchas", description: "Chilled spiced chai tea over ice.", price: 4.70, tags: ["Iced", "Cold"], available: true },
  { name: "Iced Schoko (S/W)", category: "Iced Drinks & Matchas", description: "Chilled dark or white chocolate over ice.", price: 4.70, tags: ["Iced", "Cold"], available: true },
  { name: "Iced Matcha", category: "Iced Drinks & Matchas", description: "Vibrant green tea matcha served over ice.", price: 5.50, tags: ["Iced", "Matcha"], available: true },
  { name: "Iced Matcha - Erdbeere", category: "Iced Drinks & Matchas", description: "Iced matcha layered with fresh strawberry puree.", price: 6.50, tags: ["Iced", "Matcha"], available: true },
  { name: "Iced Matcha - Himbeere", category: "Iced Drinks & Matchas", description: "Iced matcha layered with fresh raspberry puree.", price: 6.50, tags: ["Iced", "Matcha"], available: true },
  { name: "Iced Matcha - Blaubeere", category: "Iced Drinks & Matchas", description: "Iced matcha layered with fresh blueberry puree.", price: 6.50, tags: ["Iced", "Matcha"], available: true },

  // Shakes
  { name: "Vanille Shake", category: "Shakes", description: "Creamy classic vanilla milkshake.", price: 4.90, tags: ["Shake", "Sweet"], available: true },
  { name: "Schoko Shake", category: "Shakes", description: "Rich chocolate milkshake.", price: 4.90, tags: ["Shake", "Sweet"], available: true },
  { name: "Cappuccino Shake", category: "Shakes", description: "Coffee-infused creamy milkshake.", price: 4.90, tags: ["Shake", "Coffee"], available: true },
  { name: "Joghurt Shake", category: "Shakes", description: "Refreshing yogurt-based creamy shake.", price: 4.90, tags: ["Shake", "Fresh"], available: true },
  { name: "Banane Shake", category: "Shakes", description: "Creamy fresh banana milkshake.", price: 5.40, tags: ["Shake", "Fruit"], available: true },
  { name: "Schoko-Banane Shake", category: "Shakes", description: "Chocolate and fresh banana combination shake.", price: 5.90, tags: ["Shake", "Sweet"], available: true },
  { name: "Oreo Shake", category: "Shakes", description: "Oreo cookie crumbles blended into a thick shake.", price: 5.90, tags: ["Shake", "Sweet"], available: true },
  { name: "Berry Shake", category: "Shakes", description: "Blended mixed berry milkshake.", price: 5.90, tags: ["Shake", "Fruit"], available: true },
  { name: "Erdbeere Shake", category: "Shakes", description: "Fresh strawberry blended milkshake.", price: 5.90, tags: ["Shake", "Fruit"], available: true },
  { name: "Orange Shake", category: "Shakes", description: "Citrusy orange blended shake.", price: 5.90, tags: ["Shake", "Fruit"], available: true },
  { name: "Almond Shake", category: "Shakes", description: "Nutty almond blended milkshake.", price: 5.90, tags: ["Shake", "Nuts"], available: true },

  // Fresh & Fruity Drinks
  { name: "Orangensaft frisch gepresst", category: "Fresh & Fruity Drinks", description: "100% freshly squeezed orange juice.", price: 5.50, tags: ["Fresh", "Vitamin"], available: true },
  { name: "Zitronenlimo hausgemacht", category: "Fresh & Fruity Drinks", description: "Handcrafted house lemonade.", price: 4.90, tags: ["Refreshing", "Cold"], available: true },
  { name: "Zitronenlimo - Ingwer", category: "Fresh & Fruity Drinks", description: "House lemonade infused with spicy ginger.", price: 5.50, tags: ["Refreshing", "Ginger"], available: true },
  { name: "Zitronenlimo - Erdbeere", category: "Fresh & Fruity Drinks", description: "House lemonade infused with fresh strawberry.", price: 5.90, tags: ["Refreshing", "Fruit"], available: true },
  { name: "Zitronenlimo - Himbeere", category: "Fresh & Fruity Drinks", description: "House lemonade infused with fresh raspberry.", price: 5.90, tags: ["Refreshing", "Fruit"], available: true }
];

async function seedDatabase() {
  try {
    console.log("Starting full menu database seeding...");
    for (const item of menuItems) {
      await addDoc(collection(db, "menu"), item);
      console.log(`Added to Firestore: ${item.name}`);
    }
    console.log("Full menu database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();