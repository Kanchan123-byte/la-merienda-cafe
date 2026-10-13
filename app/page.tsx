"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase/config";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  tags: string[];
  available: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface SuccessOrder {
  id: string;
  name: string;
  pickupTime: string;
  total: number;
}

const fallbackMenu: MenuItem[] = [
  // Specials & New Drinks
  { id: "spec-mango-matcha", name: "Mango Matcha Latte", category: "Specials & New", description: "Mango, matcha & milk.", price: 6.50, tags: ["Neu", "Matcha"], available: true },
  { id: "spec-mango-coconut-matcha", name: "Mango Coconut Matcha", category: "Specials & New", description: "Mango, matcha & coconut water.", price: 6.50, tags: ["Neu", "Matcha"], available: true },
  { id: "spec-ube-matcha", name: "Ube Matcha Latte", category: "Specials & New", description: "Ube, matcha & milk.", price: 6.50, tags: ["Neu", "Matcha"], available: true },
  { id: "spec-dalgona", name: "Dalgona Coffee", category: "Specials & New", description: "Whipped coffee & milk.", price: 5.40, tags: ["Neu", "Coffee"], available: true },
  { id: "spec-biscoff-latte", name: "Biscoff Latte", category: "Specials & New", description: "Lotus Biscoff, milk & espresso.", price: 5.50, tags: ["Neu", "Trending"], available: true },
  { id: "spec-spanish-latte", name: "Spanish Latte", category: "Specials & New", description: "Condensed milk, espresso, milk & salt.", price: 5.40, tags: ["Neu", "Coffee"], available: true },
  { id: "spec-raspberry-cheesecake", name: "Raspberry Cheesecake Latte", category: "Specials & New", description: "Cream cheese, raspberry, milk & espresso.", price: 5.90, tags: ["Neu", "Sweet"], available: true },
  { id: "spec-dirty-matcha", name: "Dirty Matcha Latte", category: "Specials & New", description: "Mango, matcha & milk with espresso shot.", price: 5.90, tags: ["Neu", "Matcha"], available: true },
  { id: "spec-lavender-lemonade", name: "Lavender Lemonade", category: "Specials & New", description: "Lavender, lemon & sugar syrup.", price: 5.50, tags: ["Neu", "Refreshing"], available: true },
  { id: "spec-lavender-strawberry", name: "Lavender Strawberry Lemonade", category: "Specials & New", description: "Strawberry, lavender, lemon & syrup.", price: 5.90, tags: ["Neu", "Refreshing"], available: true },
  { id: "spec-protein-iced-coffee", name: "Protein Iced Coffee", category: "Specials & New", description: "Coffee, milk & protein.", price: 6.50, tags: ["Neu", "Fitness"], available: true },

  // Crêpes
  { id: "bs-erdbeere-banane-nutella", name: "Erdbeere, Banane, Nutella Crêpe", category: "Crêpes", description: "Warm, golden crêpe loaded with fresh strawberries, bananas, and rich Nutella.", price: 7.50, tags: ["Bestseller", "Sweet"], available: true },
  { id: "spec-la-merienda-special", name: "La Merienda Special (Zucker / Zimtzucker)", category: "Crêpes", description: "Classic choice of sugar or cinnamon sugar.", price: 3.90, tags: ["Special", "Classic"], available: true },
  { id: "spec-nutella-special", name: "Nutella Crêpe", category: "Crêpes", description: "Simple, warm crêpe filled with smooth, creamy Nutella.", price: 4.50, tags: ["Special", "Sweet"], available: true },
  { id: "spec-banana-nutella", name: "Banane & Nutella Crêpe", category: "Crêpes", description: "Fresh banana slices paired with rich Nutella inside a warm crêpe.", price: 5.50, tags: ["Special", "Sweet"], available: true },
  { id: "bs-nutella-bueno", name: "Nutella Bueno Crêpe", category: "Crêpes", description: "Decadent crêpe filled with Nutella and crunchy Kinder Bueno pieces.", price: 6.50, tags: ["Bestseller", "Sweet"], available: true },
  { id: "classic-basis", name: "Basis-Crêpe (ohne Belag)", category: "Crêpes", description: "Plain freshly baked warm crêpe.", price: 3.50, tags: ["Classic"], available: true },
  { id: "classic-butter-zucker", name: "Butter & Zucker Crêpe", category: "Crêpes", description: "Melting butter and fine sugar.", price: 4.50, tags: ["Classic", "Sweet"], available: true },
  { id: "classic-apfelmus", name: "Apfelmus Crêpe", category: "Crêpes", description: "Sweet and comforting homemade apple sauce filling.", price: 4.50, tags: ["Classic", "Fruit"], available: true },
  { id: "classic-konfiniture", name: "Konfitüre nach Wahl", category: "Crêpes", description: "Choice of strawberry, raspberry, or apricot fruit jam.", price: 4.50, tags: ["Classic", "Fruit"], available: true },
  { id: "nutella-mandel", name: "Nutella & Mandel Crêpe", category: "Crêpes", description: "Nutella with sliced almonds.", price: 5.50, tags: ["Nutella", "Nuts"], available: true },
  { id: "nutella-oreo", name: "Nutella Oreo Crêpe", category: "Crêpes", description: "Nutella layered with crushed Oreo cookie crumbles.", price: 6.50, tags: ["Nutella", "Sweet"], available: true },
  { id: "fruit-banane-apfelmus", name: "Banane & Apfelmus Crêpe", category: "Crêpes", description: "Banana slices blended with sweet apple sauce.", price: 5.50, tags: ["Fruit", "Sweet"], available: true },
  { id: "fruit-apfelmus-nuesse", name: "Apfelmus & Nüsse Crêpe", category: "Crêpes", description: "Apple sauce combined with crunchy nuts.", price: 5.50, tags: ["Fruit", "Nuts"], available: true },
  { id: "rohrzucker-butter-mandeln", name: "Rohrzucker, Butter & Mandeln", category: "Crêpes", description: "Raw cane sugar, melting butter, and crunchy almonds.", price: 5.90, tags: ["Sweet", "Special"], available: true },
  { id: "savory-mozzarella", name: "Mozzarella, Rucola, Tomaten Crêpe", category: "Crêpes", description: "Fresh mozzarella, peppery arugula, and ripe tomatoes.", price: 6.50, tags: ["Herzhaft", "Vegetarian"], available: true },
  { id: "savory-deluxe", name: "Frischkäse, Emmentaler, Tomaten, Mozzarella", category: "Crêpes", description: "Am beliebtesten! Cream cheese, Emmentaler, tomatoes, and mozzarella.", price: 7.50, tags: ["Herzhaft", "Popular"], available: true },
  { id: "savory-spinat", name: "Blattspinat, Schafskäse, Grüner Pesto", category: "Crêpes", description: "Vegetarisch. Leaf spinach, feta cheese, and green pesto.", price: 7.50, tags: ["Herzhaft", "Vegetarian"], available: true },
  { id: "savory-emmentaler", name: "Emmentaler Käse Crêpe", category: "Crêpes", description: "Vegetarisch. Melted Emmentaler cheese.", price: 5.00, tags: ["Herzhaft", "Vegetarian"], available: true },
  { id: "savory-schinken", name: "Schinken und Käse Crêpe", category: "Crêpes", description: "Classic savory ham and melted cheese.", price: 5.80, tags: ["Herzhaft", "Classic"], available: true },
  { id: "savory-putenschinken", name: "Putenschinken und Käse Crêpe", category: "Crêpes", description: "Turkey ham and melted cheese.", price: 5.80, tags: ["Herzhaft", "Classic"], available: true },

  // Coffee & Hot Drinks
  { id: "combo-coffee-crepe", name: "Jeder Kaffee + Crêpe Combo", category: "Coffee & Hot Drinks", description: "Any coffee paired with your choice of classic crêpe.", price: 6.90, tags: ["Combo", "Popular"], available: true },
  { id: "hot-espresso", name: "Espresso", category: "Coffee & Hot Drinks", description: "Strong, pure Italian espresso shot.", price: 2.60, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-espresso-macchiato", name: "Espresso Macchiato", category: "Coffee & Hot Drinks", description: "Espresso with a dash of milk foam.", price: 2.80, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-cafe-creme", name: "Café Crème", category: "Coffee & Hot Drinks", description: "Smooth classic café crème.", price: 2.90, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-milchkaffee", name: "Milchkaffee", category: "Coffee & Hot Drinks", description: "Classic European milk coffee.", price: 3.50, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-americano", name: "Americano", category: "Coffee & Hot Drinks", description: "Rich espresso with hot water.", price: 3.50, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-cappuccino", name: "Cappuccino", category: "Coffee & Hot Drinks", description: "Espresso with velvety frothed milk foam.", price: 3.60, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-latte-macchiato", name: "Latte Macchiato", category: "Coffee & Hot Drinks", description: "Layered steamed milk and espresso.", price: 3.80, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-moccaccino", name: "Moccaccino", category: "Coffee & Hot Drinks", description: "Espresso combined with rich chocolate and steamed milk.", price: 3.80, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-flat-white", name: "Flat White", category: "Coffee & Hot Drinks", description: "Double shot of espresso with microfoam milk.", price: 4.00, tags: ["Hot", "Coffee"], available: true },
  { id: "hot-schoko", name: "Schoko (Schwarz / Weiß)", category: "Coffee & Hot Drinks", description: "Rich hot chocolate (dark or white).", price: 3.90, tags: ["Hot", "Chocolate"], available: true },
  { id: "hot-chai-latte", name: "Chai Latte", category: "Coffee & Hot Drinks", description: "Spiced black tea with steamed milk.", price: 3.90, tags: ["Hot", "Tea"], available: true },
  { id: "hot-matcha-latte", name: "Matcha Latte", category: "Coffee & Hot Drinks", description: "Authentic green tea matcha with velvety milk.", price: 4.90, tags: ["Hot", "Matcha"], available: true },
  { id: "hot-masala-chai", name: "Masala Chai", category: "Coffee & Hot Drinks", description: "Traditional aromatic spiced chai tea.", price: 3.50, tags: ["Hot", "Tea"], available: true },

  // Iced Drinks & Matchas
  { id: "iced-coffee", name: "Iced Coffee", category: "Iced Drinks & Matchas", description: "Chilled refreshing coffee over ice.", price: 4.90, tags: ["Iced", "Cold"], available: true },
  { id: "iced-latte", name: "Iced Latte (Karamell / Hazelnut / Vanille)", category: "Iced Drinks & Matchas", description: "Smooth espresso and cold milk over ice with choice of syrup flavoring.", price: 4.50, tags: ["Iced", "Cold"], available: true },
  { id: "iced-mochaccino", name: "Iced Mochaccino", category: "Iced Drinks & Matchas", description: "Chilled espresso, chocolate, and milk over ice.", price: 4.70, tags: ["Iced", "Cold"], available: true },
  { id: "iced-chai", name: "Iced Chai", category: "Iced Drinks & Matchas", description: "Chilled spiced chai tea over ice.", price: 4.70, tags: ["Iced", "Cold"], available: true },
  { id: "iced-schoko", name: "Iced Schoko (S/W)", category: "Iced Drinks & Matchas", description: "Chilled dark or white chocolate over ice.", price: 4.70, tags: ["Iced", "Cold"], available: true },
  { id: "iced-matcha", name: "Iced Matcha", category: "Iced Drinks & Matchas", description: "Vibrant green tea matcha served over ice.", price: 5.50, tags: ["Iced", "Matcha"], available: true },
  { id: "iced-berry-matcha-erdbeere", name: "Iced Matcha - Erdbeere", category: "Iced Drinks & Matchas", description: "Iced matcha layered with fresh strawberry puree.", price: 6.50, tags: ["Iced", "Matcha"], available: true },
  { id: "iced-berry-matcha-himbeere", name: "Iced Matcha - Himbeere", category: "Iced Drinks & Matchas", description: "Iced matcha layered with fresh raspberry puree.", price: 6.50, tags: ["Iced", "Matcha"], available: true },
  { id: "iced-berry-matcha-blaubeere", name: "Iced Matcha - Blaubeere", category: "Iced Drinks & Matchas", description: "Iced matcha layered with fresh blueberry puree.", price: 6.50, tags: ["Iced", "Matcha"], available: true },

  // Shakes
  { id: "shake-vanille", name: "Vanille Shake", category: "Shakes", description: "Creamy classic vanilla milkshake.", price: 4.90, tags: ["Shake", "Sweet"], available: true },
  { id: "shake-schoko", name: "Schoko Shake", category: "Shakes", description: "Rich chocolate milkshake.", price: 4.90, tags: ["Shake", "Sweet"], available: true },
  { id: "shake-cappuccino", name: "Cappuccino Shake", category: "Shakes", description: "Coffee-infused creamy milkshake.", price: 4.90, tags: ["Shake", "Coffee"], available: true },
  { id: "shake-joghurt", name: "Joghurt Shake", category: "Shakes", description: "Refreshing yogurt-based creamy shake.", price: 4.90, tags: ["Shake", "Fresh"], available: true },
  { id: "shake-banane", name: "Banane Shake", category: "Shakes", description: "Creamy fresh banana milkshake.", price: 5.40, tags: ["Shake", "Fruit"], available: true },
  { id: "shake-schoko-banane", name: "Schoko-Banane Shake", category: "Shakes", description: "Chocolate and fresh banana combination shake.", price: 5.90, tags: ["Shake", "Sweet"], available: true },
  { id: "shake-oreo", name: "Oreo Shake", category: "Shakes", description: "Oreo cookie crumbles blended into a thick shake.", price: 5.90, tags: ["Shake", "Sweet"], available: true },
  { id: "shake-berry", name: "Berry Shake", category: "Shakes", description: "Blended mixed berry milkshake.", price: 5.90, tags: ["Shake", "Fruit"], available: true },
  { id: "shake-erdbeere", name: "Erdbeere Shake", category: "Shakes", description: "Fresh strawberry blended milkshake.", price: 5.90, tags: ["Shake", "Fruit"], available: true },
  { id: "shake-orange", name: "Orange Shake", category: "Shakes", description: "Citrusy orange blended shake.", price: 5.90, tags: ["Shake", "Fruit"], available: true },
  { id: "shake-almond", name: "Almond Shake", category: "Shakes", description: "Nutty almond blended milkshake.", price: 5.90, tags: ["Shake", "Nuts"], available: true },

  // Fresh & Fruity Drinks
  { id: "fresh-orangensaft", name: "Orangensaft frisch gepresst", category: "Fresh & Fruity Drinks", description: "100% freshly squeezed orange juice.", price: 5.50, tags: ["Fresh", "Vitamin"], available: true },
  { id: "fresh-zitronenlimo", name: "Zitronenlimo hausgemacht", category: "Fresh & Fruity Drinks", description: "Handcrafted house lemonade.", price: 4.90, tags: ["Refreshing", "Cold"], available: true },
  { id: "lemonade-ingwer", name: "Zitronenlimo - Ingwer", category: "Fresh & Fruity Drinks", description: "House lemonade infused with spicy ginger.", price: 5.50, tags: ["Refreshing", "Ginger"], available: true },
  { id: "lemonade-erdbeere", name: "Zitronenlimo - Erdbeere", category: "Fresh & Fruity Drinks", description: "House lemonade infused with fresh strawberry.", price: 5.90, tags: ["Refreshing", "Fruit"], available: true },
  { id: "lemonade-himbeere", name: "Zitronenlimo - Himbeere", category: "Fresh & Fruity Drinks", description: "House lemonade infused with fresh raspberry.", price: 5.90, tags: ["Refreshing", "Fruit"], available: true }
];

const categories = ["Specials & New", "Crêpes", "Coffee & Hot Drinks", "Iced Drinks & Matchas", "Shakes", "Fresh & Fruity Drinks"];

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(fallbackMenu);
  const [activeCategory, setActiveCategory] = useState<string>("Specials & New");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart"); 
  
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [pickupTime, setPickupTime] = useState<string>("ASAP (~10 mins)");
  const [successOrder, setSuccessOrder] = useState<SuccessOrder | null>(null);

  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(true);
  const [legalModal, setLegalModal] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const querySnapshot = await getDocs(collection(db, "menu"));
        if (!querySnapshot.empty) {
          const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MenuItem[];
          setMenuItems(items);
        }
      } catch (err) {
        console.warn("Using local fallback menu:", err);
      }
    }
    fetchMenu();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev: CartItem[]) => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev: CartItem[]) => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        customerName: name,
        phone: phone,
        items: cart,
        totalAmount: subtotal,
        pickupTime: pickupTime,
        paymentMethod: "Pay on Collection (In-store Cash/Card/NFC)",
        status: "Received",
        createdAt: serverTimestamp(),
      });
      setSuccessOrder({ id: orderRef.id, name, pickupTime, total: subtotal });
      setCart([]);
      setStep("success");
    } catch (err) {
      const fakeOrderId = "LM-" + Math.floor(1000 + Math.random() * 9000);
      setSuccessOrder({ id: fakeOrderId, name, pickupTime, total: subtotal });
      setCart([]);
      setStep("success");
    }
  };

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#F9F6F0] text-[#1A1A1A] flex flex-col justify-between">
      <div>
        {/* Red Header with La Merienda Branding on the Top Left */}
        <header className="bg-[#9E0038] shadow-md sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-white font-black text-lg tracking-wider">LA MERIENDA</h1>
            <span className="text-white/60 text-xs hidden md:inline">| Thomas-Dehler-Straße 10, München (PEP Mall)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="https://www.ubereats.com/de/store/la-merienda/S2fk516BWqCgS9XeyHb6Nw?srsltid=AU7gw4W0-1HEkjHBtzf66pM020AZ1m54te-g_sQPCg8C6n7zQVV0po9i" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-green-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-sm"
            >
              <span>🛵 Order on Uber Eats</span>
            </a>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-white text-[#9E0038] px-4 py-2 rounded-xl font-extrabold flex items-center gap-2 shadow-md hover:bg-opacity-95 transition-all cursor-pointer"
            >
              <span>🛒 Cart</span>
              <span className="bg-[#9E0038] text-white text-xs px-2 py-0.5 rounded-full font-extrabold">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </button>
          </div>
        </header>

        {/* Hero Section with Centered Logo */}
        <section className="bg-[#9E0038] text-white py-12 px-6 text-center border-t border-white/10">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <img src="/logo.png" alt="La Merienda Logo" className="h-32 w-auto object-contain mb-4 drop-shadow-md bg-white p-3 rounded-2xl" />
            <p className="text-sm opacity-95 max-w-xl mx-auto font-medium">
              Order warm crêpes, specialty coffees, and trending drinks online for quick counter pickup at PEP Mall Neuperlach!
            </p>
          </div>
        </section>

        {/* Expanded About Section */}
        <section className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-black text-[#3D2314] mb-4">Welcome to La Merienda! ☕</h3>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
              Situated inside the vibrant PEP Einkaufszentrum (PEP Mall Neuperlach), <strong>La Merienda</strong> brings a modern, fast-casual twist to the traditional Spanish afternoon snack break (<em>la merienda</em>). Whether you are taking a well-deserved shopping break, commuting, or meeting friends and family, we are here to provide quick, high-quality indulgences designed to brighten your day.
            </p>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              From freshly prepared sweet crêpes with rich Nutella and fresh strawberries to savory artisanal options like our popular mozzarella, arugula, and tomato wraps, everything is made fresh to order. Pair your treat with our authentic Costa Coffee specialty lattes, vibrant Ube and Biscoff lattes, signature matcha drinks, or handcrafted house lemonades. Built around the ethos <span className="font-bold text-[#9E0038]">“Fresh. Fast. Feel-good”</span>, we combine high-efficiency service with elevated presentation to transform your day.
            </p>
          </div>
        </section>

        {/* Menu Catalog with Category Tabs */}
        <section className="max-w-6xl mx-auto px-6 py-6">
          <h3 className="text-2xl font-extrabold mb-6 text-[#3D2314]">Our Menu Catalog</h3>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#9E0038] text-white shadow-md"
                    : "bg-white text-gray-700 border hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-[#1A1A1A]">{item.name}</h4>
                    <span className="text-[#9E0038] font-black text-base">€{item.price?.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags?.map(t => (
                      <span key={t} className="text-xs bg-[#F9F6F0] text-[#3D2314] px-2.5 py-1 rounded-md font-medium">✨ {t}</span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => addToCart(item)}
                  className="w-full bg-[#1A1A1A] text-white py-2.5 rounded-xl font-bold hover:bg-[#9E0038] transition-colors cursor-pointer"
                >
                  Add to Cart 🛒
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>


{/* Events & Catering Section */}
<section className="py-16 px-4 bg-white border-t border-gray-100" id="events">
  <div className="max-w-3xl mx-auto text-center">
    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
      Events, Catering & Private Bookings
    </h2>
    <p className="text-gray-600 mb-8">
      Planning a party, office gathering, or special event? Let La Merienda bring the sweet break with fresh crêpes, specialty coffees, and custom drink bars! Send us your inquiry below.
    </p>
    
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
        const details = (form.elements.namedItem('details') as HTMLTextAreaElement).value;

        const subject = encodeURIComponent(`New Event Inquiry from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nPhone/WhatsApp: ${phone}\n\nDetails:\n${details}`);
        
        window.location.href = `mailto:jhakanchan3001@gmail.com?subject=${subject}&body=${body}`;
      }}
      className="space-y-4 text-left bg-gray-50 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input name="name" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9E0038] focus:outline-none" placeholder="Maria Schmidt" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp</label>
          <input name="phone" type="tel" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9E0038] focus:outline-none" placeholder="+49 176 ..." />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Event Type & Details</label>
        <textarea name="details" rows={4} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9E0038] focus:outline-none" placeholder="Tell us about your date, guest count, and what you'd like to serve..."></textarea>
      </div>

      <button type="submit" className="w-full bg-[#9E0038] text-white font-semibold py-3 rounded-lg hover:bg-[#80002d] transition-colors">
        Send Event Inquiry via Email
      </button>
    </form>
  </div>
</section>


      {/* Footer & Legal Information */}
      <footer className="bg-white border-t border-gray-200 mt-20 py-8 px-6 text-center text-xs text-gray-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 La Merienda Café · PEP Mall Munich (Thomas-Dehler-Straße 10, 81737 München)</p>
          <div className="flex gap-4 font-semibold text-gray-700">
            <button onClick={() => setLegalModal("impressum")} className="hover:text-[#9E0038] cursor-pointer">Impressum</button>
            <button onClick={() => setLegalModal("datenschutz")} className="hover:text-[#9E0038] cursor-pointer">Datenschutzerklärung</button>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] text-white p-4 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-4 px-8">
          <p className="text-xs max-w-2xl">
            🍪 We use cookies and local storage to ensure basic cart functionality and deliver a smooth user experience. Read our Datenschutzerklärung for details.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowCookieBanner(false)}
              className="bg-[#9E0038] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-opacity-90 cursor-pointer"
            >
              Accept All
            </button>
          </div>
        </div>
      )}

      {/* Legal Modals */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-[#9E0038]">
                {legalModal === "impressum" ? "Impressum" : "Datenschutzerklärung"}
              </h3>
              <button onClick={() => setLegalModal(null)} className="text-gray-400 hover:text-black font-bold text-lg cursor-pointer">✕</button>
            </div>
            
            {legalModal === "impressum" ? (
              <div className="text-xs text-gray-700 space-y-3 leading-relaxed">
                <p className="font-bold text-sm">Angaben gemäß § 5 TMG:</p>
                <p><strong>La Merienda Café</strong><br />Inhaberin: Kanchan Jha<br />Rechnungsanschrift: Ollenhauerstraße 6<br />81737 München</p>
                <p><strong>Standort / Café:</strong><br />Thomas-Dehler-Straße 10<br />81737 München (PEP Einkaufszentrum)</p>
                <p><strong>Kontakt:</strong><br />E-Mail: info@lamerienda-cafe.de<br />Web: www.lamerienda-cafe.de</p>
                <p><strong>Umsatzsteuer-ID:</strong><br />Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz wird bei Vorliegen ergänzt.</p>
              </div>
            ) : (
              <div className="text-xs text-gray-700 space-y-3 leading-relaxed">
                <p className="font-bold text-sm">Datenschutzerklärung</p>
                <p>1. Datenschutz auf einen Blick: Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Ihre Bestelldaten (Name, Telefonnummer, ausgewählte Artikel) werden ausschließlich zur Abwicklung Ihrer Online-Bestellung und Direktabholung im Café am PEP-Einkaufszentrum verwendet.</p>
                <p>2. Speicherung der Daten: Bestelldaten werden in unserem gesicherten Firebase Firestore Cloud-Speicher verarbeitet und nach Abschluss des Abholvorgangs gemäß den gesetzlichen Aufbewahrungsfristen verwaltet.</p>
                <p>3. Cookies: Unsere Website verwendet essenzielle Cookies und lokalen Speicher zur Bereitstellung der Warenkorbfunktion.</p>
              </div>
            )}
            
            <button 
              onClick={() => setLegalModal(null)}
              className="mt-6 w-full bg-[#1A1A1A] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#9E0038] cursor-pointer"
            >
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* Cart & Checkout Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-extrabold text-[#1A1A1A]">
                {step === "cart" && "🛍️ Your Order & Collect Cart"}
                {step === "checkout" && "📍 In-Store Pickup Details"}
                {step === "success" && "🎉 Order Confirmed!"}
              </h2>
              <button onClick={() => { setIsCartOpen(false); setStep("cart"); }} className="text-gray-400 hover:text-black font-bold text-lg cursor-pointer">✕</button>
            </div>

            {step === "cart" && (
              <div className="flex-1 py-4 flex flex-col justify-between">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <p className="text-4xl mb-2">🛒</p>
                    <p>Your cart is empty. Add a fresh crêpe or specialty latte!</p>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto max-h-[50vh]">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                        <div>
                          <h4 className="font-bold text-sm text-[#1A1A1A]">{item.name}</h4>
                          <p className="text-xs text-[#9E0038] font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 bg-white border rounded-lg font-bold shadow-sm cursor-pointer">-</button>
                          <span className="text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 bg-white border rounded-lg font-bold shadow-sm cursor-pointer">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cart.length > 0 && (
                  <div className="mt-auto pt-4 border-t">
                    <div className="flex justify-between text-lg font-extrabold text-[#1A1A1A] mb-4">
                      <span>Total:</span>
                      <span className="text-[#9E0038]">€{subtotal.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => setStep("checkout")}
                      className="w-full bg-[#9E0038] text-white py-3 rounded-xl font-bold hover:bg-opacity-90 shadow-md transition-all cursor-pointer"
                    >
                      Proceed to Checkout ➔
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === "checkout" && (
              <form onSubmit={handleCheckout} className="flex-1 py-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-xs text-gray-500 bg-[#F9F6F0] p-3 rounded-xl">
                    📍 <strong>Pickup Location:</strong> PEP Mall Munich (Thomas-Dehler-Straße 10)
                  </p>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Anna Schmidt"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9E0038]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+49 151 23456789"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9E0038]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Pickup Time Slot</label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9E0038] bg-white"
                    >
                      <option value="ASAP (~10 mins)">⚡ ASAP (~10 mins)</option>
                      <option value="Today in 20 mins">Today in 20 mins</option>
                      <option value="Today in 30 mins">Today in 30 mins</option>
                    </select>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Payment Method</span>
                    <p className="text-sm font-semibold text-[#1A1A1A]">💳 Pay on Collection in Store</p>
                    <p className="text-xs text-gray-500">Cash, Mobile NFC, Debit & Credit Cards accepted.</p>
                  </div>
                </div>

                <div className="pt-4 border-t flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="w-1/3 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-[#9E0038] text-white py-3 rounded-xl font-bold hover:bg-opacity-90 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Place Order 🚀
                  </button>
                </div>
              </form>
            )}

            {step === "success" && successOrder && (
              <div className="flex-1 py-4 flex flex-col items-center text-center justify-between">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-[#9E0038]/10 text-[#9E0038] rounded-full flex items-center justify-center text-3xl mx-auto">
                    🎉
                  </div>
                  <h3 className="text-xl font-bold">Order Received!</h3>
                  <div className="bg-gray-50 p-3 rounded-xl border font-mono text-sm text-[#9E0038] font-bold">
                    Order ID: {successOrder.id}
                  </div>
                  <div className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${successOrder.id}`}
                      alt="Pickup QR Code"
                      className="w-32 h-32 mb-2 rounded-lg"
                    />
                    <span className="text-xs text-gray-500">Show this QR code at PEP Mall counter</span>
                  </div>
                </div>
                <button
                  onClick={() => { setIsCartOpen(false); setStep("cart"); setSuccessOrder(null); }}
                  className="w-full bg-[#1A1A1A] text-white py-3 rounded-xl font-bold hover:bg-[#9E0038] transition-colors cursor-pointer"
                >
                  Close & Back to Menu 🏠
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}