const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, deleteDoc, doc, addDoc } = require("firebase/firestore");

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
  // Specials & New Drinks (Single online price)
  { name: "Mango Matcha Latte", category: "Specials & New", description: "Mango, matcha & milk.", price: 7.20, tags: ["Neu", "Matcha"], available: true },
  { name: "Mango Coconut Matcha", category: "Specials & New", description: "Mango, matcha & coconut water.", price: 7.20, tags: ["Neu", "Matcha"], available: true },
  { name: "Ube Matcha Latte", category: "Specials & New", description: "Ube, matcha & milk.", price: 7.20, tags: ["Neu", "Matcha"], available: true },
  { name: "Dalgona Coffee", category: "Specials & New", description: "Whipped coffee & milk.", price: 6.10, tags: ["Neu", "Coffee"], available: true },
  { name: "Biscoff Latte", category: "Specials & New", description: "Lotus Biscoff, milk & espresso.", price: 6.20, tags: ["Neu", "Trending"], available: true },
  { name: "Spanish Latte", category: "Specials & New", description: "Condensed milk, espresso, milk & salt.", price: 6.10, tags: ["Neu", "Coffee"], available: true },
  { name: "Raspberry Cheesecake Latte", category: "Specials & New", description: "Cream cheese, raspberry, milk & espresso.", price: 6.60, tags: ["Neu", "Sweet"], available: true },
  { name: "Dirty Matcha Latte", category: "Specials & New", description: "Mango, matcha & milk with espresso shot.", price: 6.60, tags: ["Neu", "Matcha"], available: true },
  { name: "Lavender Lemonade", category: "Specials & New", description: "Lavender, lemon & sugar syrup.", price: 6.20, tags: ["Neu", "Refreshing"], available: true },
  { name: "Lavender Strawberry Lemonade", category: "Specials & New", description: "Strawberry, lavender, lemon & syrup.", price: 6.60, tags: ["Neu", "Refreshing"], available: true },
  { name: "Protein Iced Coffee", category: "Specials & New", description: "Coffee, milk & protein.", price: 7.20, tags: ["Neu", "Fitness"], available: true },

  // Crêpes (Single online price)
  { name: "Erdbeere, Banane, Nutella Crêpe", category: "Crêpes", description: "Warm, golden crêpe loaded with fresh strawberries, bananas, and rich Nutella.", price: 8.20, tags: ["Bestseller", "Sweet"], available: true },
  { name: "La Merienda Special (Zucker / Zimtzucker)", category: "Crêpes", description: "Classic choice of sugar or cinnamon sugar.", price: 4.60, tags: ["Special", "Classic"], available: true },
  { name: "Nutella Crêpe", category: "Crêpes", description: "Simple, warm crêpe filled with smooth, creamy Nutella.", price: 5.20, tags: ["Special", "Sweet"], available: true },
  { name: "Banane & Nutella Crêpe", category: "Crêpes", description: "Fresh banana slices paired with rich Nutella inside a warm crêpe.", price: 6.20, tags: ["Special", "Sweet"], available: true },
  { name: "Nutella Bueno Crêpe", category: "Crêpes", description: "Decadent crêpe filled with Nutella and crunchy Kinder Bueno pieces.", price: 7.20, tags: ["Bestseller", "Sweet"], available: true },
  { name: "Basis-Crêpe (ohne Belag)", category: "Crêpes", description: "Plain freshly baked warm crêpe.", price: 4.20, tags: ["Classic"], available: true },
  { name: "Butter & Zucker Crêpe", category: "Crêpes", description: "Melting butter and fine sugar.", price: 5.20, tags: ["Classic", "Sweet"], available: true },
  { name: "Apfelmus Crêpe", category: "Crêpes", description: "Sweet and comforting homemade apple sauce filling.", price: 5.20, tags: ["Classic", "Fruit"], available: true },
  { name: "Konfitüre nach Wahl", category: "Crêpes", description: "Choice of strawberry, raspberry, or apricot fruit jam.", price: 5.20, tags: ["Classic", "Fruit"], available: true },
  { name: "Nutella & Mandel Crêpe", category: "Crêpes", description: "Nutella with sliced almonds.", price: 6.20, tags: ["Nutella", "Nuts"], available: true },
  { name: "Nutella Oreo Crêpe", category: "Crêpes", description: "Nutella layered with crushed Oreo cookie crumbles.", price: 7.20, tags: ["Nutella", "Sweet"], available: true },
  { name: "Mozzarella, Rucola, Tomaten Crêpe", category: "Crêpes", description: "Fresh mozzarella, peppery arugula, and ripe tomatoes.", price: 7.20, tags: ["Herzhaft", "Vegetarian"], available: true },
  { name: "Frischkäse, Emmentaler, Tomaten, Mozzarella", category: "Crêpes", description: "Am beliebtesten! Cream cheese, Emmentaler, tomatoes, and mozzarella.", price: 8.20, tags: ["Herzhaft", "Popular"], available: true },
  { name: "Blattspinat, Schafskäse, Grüner Pesto", category: "Crêpes", description: "Vegetarisch. Leaf spinach, feta cheese, and green pesto.", price: 8.20, tags: ["Herzhaft", "Vegetarian"], available: true },
  { name: "Emmentaler Käse Crêpe", category: "Crêpes", description: "Vegetarisch. Melted Emmentaler cheese.", price: 5.70, tags: ["Herzhaft", "Vegetarian"], available: true },
  { name: "Schinken und Käse Crêpe", category: "Crêpes", description: "Classic savory ham and melted cheese.", price: 6.50, tags: ["Herzhaft", "Classic"], available: true },
  { name: "Putenschinken und Käse Crêpe", category: "Crêpes", description: "Turkey ham and melted cheese.", price: 6.50, tags: ["Herzhaft", "Classic"], available: true },

  // Coffee & Hot Drinks (Single online price)
  { name: "Jeder Kaffee + Crêpe Combo", category: "Coffee & Hot Drinks", description: "Any coffee paired with your choice of classic crêpe.", price: 7.60, tags: ["Combo", "Popular"], available: true },
  { name: "Espresso", category: "Coffee & Hot Drinks", description: "Strong, pure Italian espresso shot.", price: 3.30, tags: ["Hot", "Coffee"], available: true },
  { name: "Espresso Macchiato", category: "Coffee & Hot Drinks", description: "Espresso with a dash of milk foam.", price: 3.50, tags: ["Hot", "Coffee"], available: true },
  { name: "Café Crème", category: "Coffee & Hot Drinks", description: "Smooth classic café crème.", price: 3.60, tags: ["Hot", "Coffee"], available: true },
  { name: "Milchkaffee", category: "Coffee & Hot Drinks", description: "Classic European milk coffee.", price: 4.20, tags: ["Hot", "Coffee"], available: true },
  { name: "Americano", category: "Coffee & Hot Drinks", description: "Rich espresso with hot water.", price: 4.20, tags: ["Hot", "Coffee"], available: true },
  { name: "Cappuccino", category: "Coffee & Hot Drinks", description: "Espresso with velvety frothed milk foam.", price: 4.30, tags: ["Hot", "Coffee"], available: true },
  { name: "Latte Macchiato", category: "Coffee & Hot Drinks", description: "Layered steamed milk and espresso.", price: 4.50, tags: ["Hot", "Coffee"], available: true },
  { name: "Moccaccino", category: "Coffee & Hot Drinks", description: "Espresso combined with rich chocolate and steamed milk.", price: 4.50, tags: ["Hot", "Coffee"], available: true },
  { name: "Flat White", category: "Coffee & Hot Drinks", description: "Double shot of espresso with microfoam milk.", price: 4.70, tags: ["Hot", "Coffee"], available: true },
  { name: "Schoko (Schwarz / Weiß)", category: "Coffee & Hot Drinks", description: "Rich hot chocolate (dark or white).", price: 4.60, tags: ["Hot", "Chocolate"], available: true },
  { name: "Chai Latte", category: "Coffee & Hot Drinks", description: "Spiced black tea with steamed milk.", price: 4.60, tags: ["Hot", "Tea"], available: true },
  { name: "Matcha Latte", category: "Coffee & Hot Drinks", description: "Authentic green tea matcha with velvety milk.", price: 5.60, tags: ["Hot", "Matcha"], available: true },
  { name: "Masala Chai", category: "Coffee & Hot Drinks", description: "Traditional aromatic spiced chai tea.", price: 4.20, tags: ["Hot", "Tea"], available: true },

  // Iced Drinks & Matchas (Single online price)
  { name: "Iced Coffee", category: "Iced Drinks & Matchas", description: "Chilled refreshing coffee over ice.", price: 5.60, tags: ["Iced", "Cold"], available: true },
  { name: "Iced Latte (Karamell / Hazelnut / Vanille)", category: "Iced Drinks & Matchas", description: "Smooth espresso and cold milk over ice with choice of syrup flavoring.", price: 5.20, tags: ["Iced", "Cold"], available: true },
  { name: "Iced Mochaccino", category: "Iced Drinks & Matchas", description: "Chilled espresso, chocolate, and milk over ice.", price: 5.40, tags: ["Iced", "Cold"], available: true },
  { name: "Iced Chai", category: "Iced Drinks & Matchas", description: "Chilled spiced chai tea over ice.", price: 5.40, tags: ["Iced", "Cold"], available: true },
  { name: "Iced Schoko (S/W)", category: "Iced Drinks & Matchas", description: "Chilled dark or white chocolate over ice.", price: 5.40, tags: ["Iced", "Cold"], available: true },
  { name: "Iced Matcha", category: "Iced Drinks & Matchas", description: "Vibrant green tea matcha served over ice.", price: 6.20, tags: ["Iced", "Matcha"], available: true },
  { name: "Iced Matcha - Erdbeere", category: "Iced Drinks & Matchas", description: "Iced matcha layered with fresh strawberry puree.", price: 7.20, tags: ["Iced", "Matcha"], available: true },
  { name: "Iced Matcha - Himbeere", category: "Iced Drinks & Matchas", description: "Iced matcha layered with fresh raspberry puree.", price: 7.20, tags: ["Iced", "Matcha"], available: true },
  { name: "Iced Matcha - Blaubeere", category: "Iced Drinks & Matchas", description: "Iced matcha layered with fresh blueberry puree.", price: 7.20, tags: ["Iced", "Matcha"], available: true },

  // Shakes (Single online price)
  { name: "Vanille Shake", category: "Shakes", description: "Creamy classic vanilla milkshake.", price: 5.60, tags: ["Shake", "Sweet"], available: true },
  { name: "Schoko Shake", category: "Shakes", description: "Rich chocolate milkshake.", price: 5.60, tags: ["Shake", "Sweet"], available: true },
  { name: "Cappuccino Shake", category: "Shakes", description: "Coffee-infused creamy milkshake.", price: 5.60, tags: ["Shake", "Coffee"], available: true },
  { name: "Joghurt Shake", category: "Shakes", description: "Refreshing yogurt-based creamy shake.", price: 5.60, tags: ["Shake", "Fresh"], available: true },
  { name: "Banane Shake", category: "Shakes", description: "Creamy fresh banana milkshake.", price: 6.10, tags: ["Shake", "Fruit"], available: true },
  { name: "Schoko-Banane Shake", category: "Shakes", description: "Chocolate and fresh banana combination shake.", price: 6.60, tags: ["Shake", "Sweet"], available: true },
  { name: "Oreo Shake", category: "Shakes", description: "Oreo cookie crumbles blended into a thick shake.", price: 6.60, tags: ["Shake", "Sweet"], available: true },
  { name: "Berry Shake", category: "Shakes", description: "Blended mixed berry milkshake.", price: 6.60, tags: ["Shake", "Fruit"], available: true },
  { name: "Erdbeere Shake", category: "Shakes", description: "Fresh strawberry blended milkshake.", price: 6.60, tags: ["Shake", "Fruit"], available: true },
  { name: "Orange Shake", category: "Shakes", description: "Citrusy orange blended shake.", price: 6.60, tags: ["Shake", "Fruit"], available: true },
  { name: "Almond Shake", category: "Shakes", description: "Nutty almond blended milkshake.", price: 6.60, tags: ["Shake", "Nuts"], available: true },

  // Fresh & Fruity Drinks (Single online price)
  { name: "Orangensaft frisch gepresst", category: "Fresh & Fruity Drinks", description: "100% freshly squeezed orange juice.", price: 6.20, tags: ["Fresh", "Vitamin"], available: true },
  { name: "Zitronenlimo hausgemacht", category: "Fresh & Fruity Drinks", description: "Handcrafted house lemonade.", price: 5.60, tags: ["Refreshing", "Cold"], available: true },
  { name: "Zitronenlimo - Ingwer", category: "Fresh & Fruity Drinks", description: "House lemonade infused with spicy ginger.", price: 6.20, tags: ["Refreshing", "Ginger"], available: true },
  { name: "Zitronenlimo - Erdbeere", category: "Fresh & Fruity Drinks", description: "House lemonade infused with fresh strawberry.", price: 6.60, tags: ["Refreshing", "Fruit"], available: true },
  { name: "Zitronenlimo - Himbeere", category: "Fresh & Fruity Drinks", description: "House lemonade infused with fresh raspberry.", price: 6.60, tags: ["Refreshing", "Fruit"], available: true }
];

async function cleanAndSeedDatabase() {
  try {
    console.log("Clearing old menu items from Firestore...");
    const querySnapshot = await getDocs(collection(db, "menu"));
    const deletePromises = querySnapshot.docs.map((document) => 
      deleteDoc(doc(db, "menu", document.id))
    );
    await Promise.all(deletePromises);
    console.log("Old menu cleared successfully.");

    console.log("Seeding clean menu catalog with updated single prices...");
    for (const item of menuItems) {
      await addDoc(collection(db, "menu"), item);
      console.log(`Added: ${item.name} -> €${item.price.toFixed(2)}`);
    }
    console.log("Database successfully cleaned and re-seeded!");
    process.exit(0);
  } catch (error) {
    console.error("Error updating database:", error);
    process.exit(1);
  }
}

cleanAndSeedDatabase();