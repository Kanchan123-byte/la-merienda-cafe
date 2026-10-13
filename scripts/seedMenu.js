import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const fullMenu = [
  // Bestsellers & Specials
  { id: "bs-erdbeere-banane-nutella", name: "Erdbeere, Banane, Nutella Crêpe", category: "Bestsellers", description: "Warm, golden crêpe loaded with fresh strawberries, bananas, and rich Nutella.", price: 7.50, tags: ["Bestseller", "Sweet"], available: true },
  { id: "spec-la-merienda-special", name: "La Merienda Special Crêpe", category: "La Merienda Special", description: "Classic choice of sugar or cinnamon sugar.", price: 3.90, tags: ["Special", "Classic"], available: true },
  { id: "spec-nutella-special", name: "Nutella Crêpe", category: "La Merienda Special", description: "Simple, warm crêpe filled with smooth, creamy Nutella.", price: 4.50, tags: ["Special", "Sweet"], available: true },
  { id: "spec-banana-nutella", name: "Banane & Nutella Crêpe", category: "La Merienda Special", description: "Fresh banana slices paired with rich Nutella inside a warm crêpe.", price: 5.50, tags: ["Special", "Sweet"], available: true },
  { id: "bs-nutella-bueno", name: "Nutella Bueno Crêpe", category: "Bestsellers", description: "Decadent crêpe filled with Nutella and crunchy Kinder Bueno pieces.", price: 6.50, tags: ["Bestseller", "Sweet"], available: true },

  // Classic Crêpes
  { id: "classic-zucker", name: "Zucker / Zimtzucker Crêpe", category: "Classic Crêpes", description: "Traditional sweet crêpe dusted with sugar or cinnamon sugar.", price: 3.90, tags: ["Classic", "Sweet"], available: true },
  { id: "classic-butter-zucker", name: "Butter & Zucker Crêpe", category: "Classic Crêpes", description: "Melting butter and fine sugar dusted over a warm golden crêpe.", price: 4.50, tags: ["Classic", "Sweet"], available: true },
  { id: "classic-apfelmus", name: "Apfelmus Crêpe", category: "Classic Crêpes", description: "Sweet and comforting homemade apple sauce filling.", price: 4.50, tags: ["Classic", "Fruit"], available: true },
  { id: "classic-konfiniture", name: "Konfitüre Nach Wahl (Erdbeer/Himbeer/Aprikose)", category: "Classic Crêpes", description: "Choice of strawberry, raspberry, or apricot fruit jam.", price: 4.50, tags: ["Classic", "Fruit"], available: true },

  // Nutella Crêpes
  { id: "nutella-pure", name: "Nutella Crêpe", category: "Nutella Crêpes", description: "Warm crêpe filled generously with classic Nutella.", price: 4.50, tags: ["Nutella", "Sweet"], available: true },
  { id: "nutella-banane", name: "Banane & Nutella Crêpe", category: "Nutella Crêpes", description: "Fresh sliced banana paired with creamy Nutella.", price: 5.50, tags: ["Nutella", "Fruit"], available: true },
  { id: "nutella-erdbeere", name: "Erdbeere & Nutella Crêpe", category: "Nutella Crêpes", description: "Fresh strawberries paired with creamy Nutella.", price: 7.00, tags: ["Nutella", "Fruit"], available: true },
  { id: "nutella-bueno", name: "Nutella Bueno Crêpe", category: "Nutella Crêpes", description: "Nutella combined with crunchy Kinder Bueno chunks.", price: 6.50, tags: ["Nutella", "Sweet"], available: true },
  { id: "nutella-oreo", name: "Nutella Oreo Crêpe", category: "Nutella Crêpes", description: "Nutella layered with crushed Oreo cookie crumbles.", price: 6.50, tags: ["Nutella", "Sweet"], available: true },

  // Fruchtige Crêpes
  { id: "fruit-banane", name: "Banane Crêpe", category: "Fruchtige Crêpes", description: "Simple and fresh sliced banana crêpe.", price: 4.50, tags: ["Fruit", "Fresh"], available: true },
  { id: "fruit-banane-apfelmus", name: "Banane & Apfelmus Crêpe", category: "Fruchtige Crêpes", description: "Banana slices blended with sweet apple sauce.", price: 5.50, tags: ["Fruit", "Sweet"], available: true },
  { id: "fruit-apfelmus-nuesse", name: "Apfelmus & Nüsse Crêpe", category: "Fruchtige Crêpes", description: "Apple sauce combined with crunchy nuts.", price: 5.50, tags: ["Fruit", "Nuts"], available: true },

  // Herzhaft (Savory)
  { id: "savory-mozzarella", name: "Mozzarella, Rucola, Tomaten Crêpe", category: "Herzhaft", description: "Fresh mozzarella, peppery arugula, and ripe tomatoes.", price: 6.50, tags: ["Herzhaft", "Vegetarian"], available: true },
  { id: "savory-deluxe", name: "Frischkäse, Emmentaler, Tomaten, Mozzarella", category: "Herzhaft", description: "Am beliebtesten! Cream cheese, Emmentaler, tomatoes, and mozzarella.", price: 7.50, tags: ["Herzhaft", "Popular"], available: true },
  { id: "savory-spinat", name: "Blattspinat, Schafskäse, Grüner Pesto", category: "Herzhaft", description: "Vegetarisch. Leaf spinach, feta cheese, and green pesto.", price: 7.50, tags: ["Herzhaft", "Vegetarian"], available: true },
  { id: "savory-emmentaler", name: "Emmentaler Käse Crêpe", category: "Herzhaft", description: "Vegetarisch. Melted Emmentaler cheese.", price: 5.00, tags: ["Herzhaft", "Vegetarian"], available: true },
  { id: "savory-schinken", name: "Schinken Und Käse Crêpe", category: "Herzhaft", description: "Classic savory ham and melted cheese.", price: 5.80, tags: ["Herzhaft", "Classic"], available: true },
  { id: "savory-putenschinken", name: "Putenschinken Und Käse Crêpe", category: "Herzhaft", description: "Turkey ham and melted cheese.", price: 5.80, tags: ["Herzhaft", "Classic"], available: true },

  // Kaffee & Crêpe Combos
  { id: "combo-coffee-crepe", name: "Jeder Kaffee + Crêpe Combo", category: "Kaffee & Crêpe", description: "Any coffee paired with your choice of classic crêpe.", price: 6.90, tags: ["Combo", "Popular"], available: true },

  // Heissgetränke (Hot Drinks)
  { id: "hot-cafe-creme", name: "Café Crème", category: "Heissgetränke", description: "Smooth classic café crème.", price: 2.90, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-milchkaffee", name: "Milchkaffee", category: "Heissgetränke", description: "Classic European milk coffee.", price: 3.50, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-americano", name: "Americano", category: "Heissgetränke", description: "Rich espresso with hot water.", price: 3.50, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-cappuccino", name: "Cappuccino", category: "Heissgetränke", description: "Espresso with velvety frothed milk foam.", price: 3.60, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-latte-macchiato", name: "Latte Macchiato", category: "Heissgetränke", description: "Layered steamed milk and espresso.", price: 3.80, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-moccaccino", name: "Moccaccino", category: "Heissgetränke", description: "Espresso combined with rich chocolate and steamed milk.", price: 4.30, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-flat-white", name: "Flat White", category: "Heissgetränke", description: "Double shot of espresso with microfoam milk.", price: 4.00, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-espresso", name: "Espresso", category: "Heissgetränke", description: "Strong, pure Italian espresso shot.", price: 2.60, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-chai-latte", name: "Chai Latte", category: "Tee & Milch", description: "Spiced black tea with steamed milk.", price: 4.20, tags: ["Hot", "Tea"], available: true },
  { id: "hot-matcha-latte", name: "Matcha Latte", category: "Tee & Milch", description: "Authentic green tea matcha with velvety milk.", price: 4.90, tags: ["Hot", "Matcha"], available: true },
  { id: "hot-bio-tee", name: "Bio Tee", category: "Tee & Milch", description: "Selection of organic fine teas.", price: 2.80, tags: ["Hot", "Tea"], available: true },

  // Iced Drinks
  { id: "iced-coffee", name: "Iced Coffee", category: "Iced", description: "Chilled refreshing coffee over ice.", price: 4.90, tags: ["Iced", "Cold"], available: true },
  { id: "iced-latte", name: "Iced Latte", category: "Iced", description: "Smooth espresso and cold milk over ice.", price: 4.90, tags: ["Iced", "Cold"], available: true },
  { id: "iced-mocca", name: "Iced Mocca", category: "Iced", description: "Chilled espresso, chocolate, and milk over ice.", price: 4.90, tags: ["Iced", "Cold"], available: true },
  { id: "iced-schoko", name: "Iced Schoko (Schwarz/Weiss)", category: "Iced", description: "Chilled chocolate drink.", price: 4.90, tags: ["Iced", "Cold"], available: true },
  { id: "iced-matcha", name: "Iced Matcha", category: "Iced", description: "Vibrant green tea matcha served over ice.", price: 5.90, tags: ["Iced", "Matcha"], available: true },
  { id: "iced-berry-matcha-erdbeere", name: "Iced Berry Matcha - Erdbeere", category: "Iced", description: "Neu! Iced matcha layered with fresh strawberry puree.", price: 7.40, tags: ["Iced", "Neu", "Matcha"], available: true },
  { id: "iced-berry-matcha-himbeere", name: "Iced Berry Matcha - Himbeere", category: "Iced", description: "Neu! Iced matcha layered with fresh raspberry puree.", price: 7.40, tags: ["Iced", "Neu", "Matcha"], available: true },
  { id: "iced-berry-matcha-blaubeere", name: "Iced Berry Matcha - Blaubeere", category: "Iced", description: "Neu! Iced matcha layered with fresh blueberry puree.", price: 7.40, tags: ["Iced", "Neu", "Matcha"], available: true },

  // Shakes
  { id: "shake-vanille", name: "Vanille Shake", category: "Shakes", description: "Creamy classic vanilla milkshake.", price: 5.00, tags: ["Shake", "Sweet"], available: true },
  { id: "shake-schoko", name: "Schoko Shake", category: "Shakes", description: "Rich chocolate milkshake.", price: 5.00, tags: ["Shake", "Sweet"], available: true },
  { id: "shake-cappuccino", name: "Cappuccino Shake", category: "Shakes", description: "Coffee-infused creamy milkshake.", price: 5.00, tags: ["Shake", "Coffee"], available: true },
  { id: "shake-joghurt", name: "Joghurt Shake", category: "Shakes", description: "Refreshing yogurt-based creamy shake.", price: 5.00, tags: ["Shake", "Fresh"], available: true },
  { id: "shake-mocca", name: "Mocca Shake", category: "Shakes", description: "Espresso and chocolate blended shake.", price: 5.00, tags: ["Shake", "Coffee"], available: true },
  { id: "shake-berry", name: "Berry Shake", category: "Shakes", description: "Blended mixed berry milkshake.", price: 6.50, tags: ["Shake", "Fruit"], available: true },
  { id: "shake-erdbeere", name: "Erdbeere Shake", category: "Shakes", description: "Fresh strawberry blended milkshake.", price: 6.50, tags: ["Shake", "Fruit"], available: true },
  { id: "shake-banane", name: "Banane Shake", category: "Shakes", description: "Creamy fresh banana milkshake.", price: 6.00, tags: ["Shake", "Fruit"], available: true },
  { id: "shake-orange", name: "Orange Shake", category: "Shakes", description: "Citrusy orange blended shake.", price: 6.00, tags: ["Shake", "Fruit"], available: true },
  { id: "shake-oreo", name: "Oreo Shake", category: "Shakes", description: "Oreo cookie crumbles blended into a thick shake.", price: 6.00, tags: ["Shake", "Sweet"], available: true },
  { id: "shake-matcha", name: "Matcha Shake", category: "Shakes", description: "Smooth matcha green tea milkshake.", price: 6.00, tags: ["Shake", "Matcha"], available: true },
  { id: "shake-almond", name: "Almond Shake", category: "Shakes", description: "Nutty almond blended milkshake.", price: 6.00, tags: ["Shake", "Nuts"], available: true },
  { id: "shake-schoko-banane", name: "Schoko-Banane Shake", category: "Shakes", description: "Chocolate and fresh banana combination shake.", price: 6.00, tags: ["Shake", "Sweet"], available: true },
  { id: "shake-zitrone", name: "Zitrone Shake", category: "Shakes", description: "Refreshing creamy lemon shake.", price: 6.00, tags: ["Shake", "Fresh"], available: true },

  // Frisch & Fruchtig (Fresh & Fruity Drinks)
  { id: "fresh-orangensaft", name: "Orangensaft Frisch Gepresst", category: "Frisch & Fruchtig", description: "100% freshly squeezed orange juice.", price: 6.00, tags: ["Fresh", "Vitamin"], available: true },
  { id: "fresh-zitronenlimo", name: "Zitronenlimo Hausgemacht", category: "Frisch & Fruchtig", description: "Handcrafted house lemonade.", price: 5.00, tags: ["Refreshing", "Cold"], available: true },
  { id: "lemonade-erdbeere", name: "Hausgemachte Limonade - Erdbeere", category: "Frisch & Fruchtig", description: "House lemonade infused with fresh strawberry.", price: 6.00, tags: ["Refreshing", "Fruit"], available: true },
  { id: "lemonade-himbeere", name: "Hausgemachte Limonade - Himbeere", category: "Frisch & Fruchtig", description: "House lemonade infused with fresh raspberry.", price: 6.00, tags: ["Refreshing", "Fruit"], available: true },
  { id: "lemonade-ingwer", name: "Hausgemachte Limonade - Ingwer", category: "Frisch & Fruchtig", description: "House lemonade infused with spicy ginger.", price: 6.00, tags: ["Refreshing", "Ginger"], available: true }
];

async function seedData() {
  console.log("🚀 Uploading full La Merienda menu to Firestore...");
  try {
    for (const item of fullMenu) {
      await setDoc(doc(db, "menu", item.id), item);
      console.log(`✅ Added: ${item.name}`);
    }
    console.log("🎉 All menu items uploaded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding menu:", error);
    process.exit(1);
  }
}

seedData();