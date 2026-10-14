"use client";
import React, { useState } from "react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  tags: string[];
}

const menuItems: MenuItem[] = [
  // Specials & New Drinks
  { id: "spec-mango-matcha", name: "Mango Matcha Latte", category: "Specials & New", description: "Mango, matcha & milk.", price: 7.20, tags: ["Neu", "Matcha"] },
  { id: "spec-ube-matcha", name: "Ube Matcha Latte", category: "Specials & New", description: "Ube, matcha & milk.", price: 7.20, tags: ["Neu", "Matcha"] },
  { id: "spec-dalgona", name: "Dalgona Coffee", category: "Specials & New", description: "Whipped coffee & milk.", price: 6.10, tags: ["Neu", "Coffee"] },
  { id: "spec-biscoff-latte", name: "Biscoff Latte", category: "Specials & New", description: "Lotus Biscoff, milk & espresso.", price: 6.20, tags: ["Neu", "Trending"] },
  { id: "spec-spanish-latte", name: "Spanish Latte", category: "Specials & New", description: "Condensed milk, espresso, milk & salt.", price: 6.10, tags: ["Neu", "Coffee"] },

  // Crêpes
  { id: "bs-erdbeere-banane-nutella", name: "Erdbeere, Banane, Nutella Crêpe", category: "Crêpes", description: "Warm, golden crêpe loaded with fresh strawberries, bananas, and rich Nutella.", price: 8.20, tags: ["Bestseller", "Sweet"] },
  { id: "spec-nutella-special", name: "Nutella Crêpe", category: "Crêpes", description: "Simple, warm crêpe filled with smooth, creamy Nutella.", price: 5.20, tags: ["Sweet"] },
  { id: "bs-nutella-bueno", name: "Nutella Bueno Crêpe", category: "Crêpes", description: "Decadent crêpe filled with Nutella and crunchy Kinder Bueno pieces.", price: 7.20, tags: ["Bestseller", "Sweet"] },
  { id: "savory-deluxe", name: "Frischkäse, Emmentaler, Tomaten, Mozzarella", category: "Crêpes", description: "Cream cheese, Emmentaler, tomatoes, and mozzarella.", price: 8.20, tags: ["Herzhaft", "Popular"] },
  { id: "savory-spinat", name: "Blattspinat, Schafskäse, Grüner Pesto", category: "Crêpes", description: "Leaf spinach, feta cheese, and green pesto.", price: 8.20, tags: ["Herzhaft", "Vegetarian"] },

  // Coffee & Hot Drinks
  { id: "hot-cappuccino", name: "Cappuccino", category: "Coffee & Hot Drinks", description: "Espresso with velvety frothed milk foam.", price: 4.30, tags: ["Hot", "Coffee"] },
  { id: "hot-latte-macchiato", name: "Latte Macchiato", category: "Coffee & Hot Drinks", description: "Layered steamed milk and espresso.", price: 4.50, tags: ["Hot", "Coffee"] },
  { id: "hot-matcha-latte", name: "Matcha Latte", category: "Coffee & Hot Drinks", description: "Authentic green tea matcha with velvety milk.", price: 5.60, tags: ["Hot", "Matcha"] },

  // Shakes & Iced Drinks
  { id: "shake-oreo", name: "Oreo Shake", category: "Shakes", description: "Oreo cookie crumbles blended into a thick shake.", price: 6.60, tags: ["Shake", "Sweet"] },
  { id: "iced-latte", name: "Iced Latte (Karamell / Vanille)", category: "Iced Drinks", description: "Smooth espresso and cold milk over ice with syrup choice.", price: 5.20, tags: ["Iced", "Cold"] },
  { id: "fresh-orangensaft", name: "Orangensaft frisch gepresst", category: "Fresh Drinks", description: "100% freshly squeezed orange juice.", price: 6.20, tags: ["Fresh", "Vitamin"] }
];

const categories = ["Specials & New", "Crêpes", "Coffee & Hot Drinks", "Shakes", "Iced Drinks", "Fresh Drinks"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("Specials & New");
  const [legalModal, setLegalModal] = useState<string | null>(null);

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#F9F6F0] text-[#1A1A1A] flex flex-col justify-between">
      <div>
       {/* Navigation Bar with Official Logo only */}
<header className="bg-[#9E0038] shadow-md sticky top-0 z-40 px-6 py-3 flex justify-between items-center">
  <div className="flex items-center">
    <img src="/Logo La Merienda.png" alt="La Merienda Logo" className="h-10 w-auto bg-white p-1 rounded-lg shadow-sm" />
  </div>
  <a 
    href="https://www.ubereats.com/de/store/la-merienda/S2fk516BWqCgS9XeyHb6Nw?srsltid=AU7gw4W0-1HEkjHBtzf66pM020AZ1m54te-g_sQPCg8C6n7zQVV0po9i" 
    target="_blank" 
    rel="noopener noreferrer"
    className="bg-white text-green-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-sm cursor-pointer"
  >
    <span>🛵 Order on Uber Eats</span>
  </a>
</header>

        {/* Hero Section with Kiosk Background Image */}
        <section className="relative text-white py-24 sm:py-32 px-6 text-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/kiosk-bg.jpg" 
              alt="La Merienda Kiosk at PEP Mall" 
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="bg-[#9E0038] text-white text-xs font-extrabold uppercase px-4 py-1.5 rounded-full tracking-widest mb-4 shadow-lg border border-white/20">
              PEP Mall München (Neuperlach)
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 drop-shadow-md">
              Fresh. Fast. Feel-good.
            </h2>
            <p className="text-sm sm:text-base text-gray-200 max-w-xl mx-auto font-medium leading-relaxed drop-shadow">
              Your favorite spot for warm golden crêpes, specialty coffees, and refreshing bubble teas & shakes during your shopping break.
            </p>
          </div>
        </section>

        {/* Info Cards (Address, Hours, Instagram, Contact) */}
        <section className="max-w-5xl mx-auto px-6 -mt-10 relative z-20 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
              <p className="font-extrabold text-[#3D2314] mb-1 text-sm">📍 Address</p>
              <p className="text-xs text-gray-600">Thomas-Dehler-Straße 10<br />81737 München (PEP Mall)</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
              <p className="font-extrabold text-[#3D2314] mb-1 text-sm">⏰ Opening Hours</p>
              <p className="text-xs text-gray-600">Mon – Sat: 10:00 – 20:00<br />Sundays: Closed</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between">
              <div>
                <p className="font-extrabold text-[#3D2314] mb-1 text-sm">📸 Instagram</p>
                <p className="text-xs text-gray-600">Follow our fresh creations!</p>
              </div>
              <a 
                href="https://www.instagram.com/la.merienda_cafe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 text-xs text-[#9E0038] font-bold hover:underline inline-block"
              >
                @la.merienda_cafe ➔
              </a>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between">
              <div>
                <p className="font-extrabold text-[#3D2314] mb-1 text-sm">✉️ Contact</p>
                <p className="text-xs text-gray-600">Get in touch with us</p>
              </div>
              <a 
                href="mailto:info@la-merienda-cafe.com" 
                className="mt-2 text-xs text-[#9E0038] font-bold hover:underline inline-block"
              >
                info@la-merienda-cafe.com
              </a>
            </div>
          </div>
        </section>

        {/* Menu Catalog Section */}
        <section className="max-w-6xl mx-auto px-6 py-6">
          <h2 className="text-3xl font-extrabold mb-6 text-[#3D2314] text-center">Our Menu</h2>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 border-b pb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#9E0038] text-white shadow-md"
                    : "bg-white text-gray-700 border hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-base text-[#1A1A1A]">{item.name}</h3>
                    <span className="text-[#9E0038] font-black text-base">€{item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4">{item.description}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map(t => (
                    <span key={t} className="text-[10px] bg-[#F9F6F0] text-[#3D2314] px-2 py-0.5 rounded-md font-medium">✨ {t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer & Legal Links */}
      <footer className="bg-white border-t border-gray-200 mt-20 py-8 px-6 text-center text-xs text-gray-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 La Merienda Café · PEP Mall Munich (Thomas-Dehler-Straße 10, 81737 München)</p>
          <div className="flex gap-4 font-semibold text-gray-700">
            <button onClick={() => setLegalModal("impressum")} className="hover:text-[#9E0038] cursor-pointer">Impressum</button>
            <button onClick={() => setLegalModal("datenschutz")} className="hover:text-[#9E0038] cursor-pointer">Datenschutzerklärung</button>
          </div>
        </div>
      </footer>

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
                <p><strong>Kontakt:</strong><br />E-Mail: info@la-merienda-cafe.com<br />Web: <a href="https://www.la-merienda-cafe.com/" target="_blank" rel="noopener noreferrer" className="text-[#9E0038] underline">https://www.la-merienda-cafe.com/</a></p>
                <p><strong>Umsatzsteuer-ID:</strong><br />DE457471838</p>
              </div>
            ) : (
              <div className="text-xs text-gray-700 space-y-3 leading-relaxed">
                <p className="font-bold text-sm">Datenschutzerklärung</p>
                <p>1. Datenschutz auf einen Blick: Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen.</p>
                <p>2. Kontakt: Bei Fragen zum Datenschutz erreichen Sie uns unter info@la-merienda-cafe.com.</p>
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
    </main>
  );
}