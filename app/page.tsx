"use client";
import React, { useState } from "react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  price?: number;
  priceSmall?: number;
  priceLarge?: number;
  tags?: string[];
}

const menuItems: MenuItem[] = [
  // 1. Specials — Neu
  { id: "spec-mango-matcha", name: "Mango Matcha Latte", category: "Specials — Neu", description: "Mango, Matcha & Milch", price: 6.50, tags: ["Neu", "Matcha"] },
  { id: "spec-mango-coconut-matcha", name: "Mango Coconut Matcha", category: "Specials — Neu", description: "Mango, Matcha & Kokoswasser", price: 6.50, tags: ["Neu", "Matcha"] },
  { id: "spec-ube-matcha", name: "Ube Matcha Latte", category: "Specials — Neu", description: "Ube, Matcha & Milch", price: 6.50, tags: ["Neu", "Matcha"] },
  { id: "spec-dalgona", name: "Dalgona Coffee", category: "Specials — Neu", description: "Aufgeschlagener Kaffee & Milch", price: 5.40, tags: ["Neu", "Coffee"] },
  { id: "spec-biscoff-latte", name: "Biscoff Latte", category: "Specials — Neu", description: "Lotus Biscoff, Milch & Espresso", price: 5.70, tags: ["Neu", "Trending"] },
  { id: "spec-spanish-latte", name: "Spanish Latte", category: "Specials — Neu", description: "Kondensmilch, Espresso, Milch, Salz", price: 5.40, tags: ["Neu", "Coffee"] },
  { id: "spec-raspberry-cheesecake", name: "Raspberry Cheesecake Latte", category: "Specials — Neu", description: "Frischkäse, Himbeere, Milch & Espresso", price: 5.90, tags: ["Neu", "Sweet"] },
  { id: "spec-dirty-matcha", name: "Dirty Matcha Latte", category: "Specials — Neu", description: "Milch, Matcha & Espresso", price: 5.90, tags: ["Neu", "Matcha"] },
  { id: "spec-lavender-lemonade", name: "Lavender Lemonade", category: "Specials — Neu", description: "Lavendel, Zitrone & Zuckersirup", price: 5.90, tags: ["Neu", "Refreshing"] },
  { id: "spec-lavender-strawberry", name: "Lavender Strawberry Lemonade", category: "Specials — Neu", description: "Erdbeere, Lavendel, Zitrone & Zuckersirup", price: 5.90, tags: ["Neu", "Refreshing"] },
  { id: "spec-protein-iced-coffee", name: "Protein Iced Coffee", category: "Specials — Neu", description: "Kaffee, Milch & Protein", price: 5.90, tags: ["Neu", "Fitness"] },

  // 2. Crêpes (Süß, Herzhafte Klassiker, Premium)
  { id: "cr-basis", name: "Basis-Crêpe (ohne Belag)", category: "Crêpes", description: "Frisch gebackener warmer Crêpe", price: 3.50, tags: ["Classic"] },
  { id: "cr-zucker", name: "Zucker / Zimtzucker", category: "Crêpes", description: "Klassiker mit Zucker oder Zimt", price: 3.90, tags: ["Classic"] },
  { id: "cr-apfelmus", name: "Apfelmus", category: "Crêpes", description: "Hausgemachtes Apfelmus", price: 4.50, tags: ["Sweet"] },
  { id: "cr-konfiture", name: "Konfitüre nach Wahl", category: "Crêpes", description: "Fruchtige Konfitüre", price: 4.50, tags: ["Sweet"] },
  { id: "cr-butter-zucker", name: "Butter & Zucker", category: "Crêpes", description: "Schmelzende Butter & feiner Zucker", price: 4.50, tags: ["Sweet"] },
  { id: "cr-nutella", name: "Nutella Crêpe", category: "Crêpes", description: "Cremige Nutella", price: 4.50, tags: ["Bestseller", "Sweet"] },
  { id: "cr-banane-nutella", name: "Banane & Nutella", category: "Crêpes", description: "Frische Bananen & Nutella", price: 5.50, tags: ["Sweet"] },
  { id: "cr-erdbeere-nutella", name: "Erdbeere & Nutella", category: "Crêpes", description: "Frische Erdbeeren & Nutella", price: 6.50, tags: ["Sweet"] },
  { id: "cr-bueno-oreo", name: "Nutella & Keks / Bueno / Oreo", category: "Crêpes", description: "Mit knackigen Toppings", price: 6.50, tags: ["Sweet"] },
  { id: "cr-biscoff-prem", name: "Biscoff Crêpe", category: "Crêpes", description: "Lotus Biscoff Premium Crêpe", price: 5.50, tags: ["Premium"] },
  { id: "cr-mandel-nutella", name: "Nutella & Mandel", category: "Crêpes", description: "Nutella mit Mandelstückchen", price: 5.50, tags: ["Premium"] },
  
  // Herzhafte Crêpes
  { id: "sav-emmentaler", name: "Emmentaler Käse", category: "Crêpes", description: "Geschmolzener Emmentaler Käse (Vegetarisch)", price: 5.00, tags: ["Herzhaft"] },
  { id: "sav-schinken-kaese", name: "Schinken und Käse", category: "Crêpes", description: "Klassischer Schinken & Käse", price: 5.80, tags: ["Bestseller", "Herzhaft"] },
  { id: "sav-putenschinken", name: "Putenschinken und Käse", category: "Crêpes", description: "Putenschinken & geschmolzener Käse", price: 5.80, tags: ["Bestseller", "Herzhaft"] },
  { id: "sav-mozzarella", name: "Mozzarella, Rucola, Tomaten", category: "Crêpes", description: "Frisch & vegetarisch", price: 6.50, tags: ["Herzhaft"] },
  { id: "sav-frischkaese-deluxe", name: "Frischkäse, Emmentaler, Tomaten & Mozzarella", category: "Crêpes", description: "Am beliebtesten!", price: 7.50, tags: ["Popular", "Herzhaft"] },
  { id: "sav-spinat", name: "Blattspinat, Schafskäse & Grüner Pesto", category: "Crêpes", description: "Vegetarischer Favorit", price: 7.50, tags: ["Vegetarisch", "Herzhaft"] },

  // 3. Heißgetränke / Kaffee (Klein / Groß)
  { id: "hot-espresso", name: "Espresso", category: "Heißgetränke", priceSmall: 2.60, priceLarge: 3.20, tags: ["Coffee"] },
  { id: "hot-espresso-macch", name: "Espresso Macchiato", category: "Heißgetränke", priceSmall: 2.80, priceLarge: 3.40, tags: ["Coffee"] },
  { id: "hot-cafe-creme", name: "Café Crème", category: "Heißgetränke", priceSmall: 2.90, priceLarge: 3.90, tags: ["Coffee"] },
  { id: "hot-milchkaffee", name: "Milchkaffee", category: "Heißgetränke", priceSmall: 3.50, priceLarge: 4.50, tags: ["Coffee"] },
  { id: "hot-americano", name: "Americano", category: "Heißgetränke", priceSmall: 3.50, priceLarge: 4.50, tags: ["Coffee"] },
  { id: "hot-cappuccino", name: "Cappuccino", category: "Heißgetränke", priceSmall: 3.60, priceLarge: 4.60, tags: ["Coffee"] },
  { id: "hot-latte-macch", name: "Latte Macchiato", category: "Heißgetränke", priceSmall: 3.60, priceLarge: 4.60, tags: ["Coffee"] },
  { id: "hot-moccaccino", name: "Moccaccino", category: "Heißgetränke", priceSmall: 3.80, priceLarge: 4.80, tags: ["Coffee"] },
  { id: "hot-flat-white", name: "Flat White", category: "Heißgetränke", priceLarge: 4.00, tags: ["Coffee"] },
  { id: "hot-schoko", name: "Schoko (Schwarz / Weiß)", category: "Heißgetränke", priceSmall: 3.90, priceLarge: 4.90, tags: ["Chocolate"] },
  { id: "hot-chai-latte", name: "Chai Latte", category: "Heißgetränke", priceSmall: 3.90, priceLarge: 4.90, tags: ["Tea"] },
  { id: "hot-matcha-latte", name: "Matcha Latte", category: "Heißgetränke", priceSmall: 4.90, priceLarge: 5.90, tags: ["Matcha"] },
  { id: "hot-masala-chai", name: "Masala Chai", category: "Heißgetränke", priceSmall: 3.50, tags: ["Tea"] },

  // 4. Iced Drinks
  { id: "iced-coffee", name: "Iced Coffee", category: "Iced Drinks", priceSmall: 3.90, priceLarge: 4.90, tags: ["Cold"] },
  { id: "iced-latte", name: "Iced Latte (Karamell / Hazelnut / Vanille)", category: "Iced Drinks", priceSmall: 4.50, priceLarge: 5.50, tags: ["Cold"] },
  { id: "iced-mochaccino", name: "Iced Mochaccino", category: "Iced Drinks", priceSmall: 4.70, priceLarge: 5.90, tags: ["Cold"] },
  { id: "iced-chai", name: "Iced Chai", category: "Iced Drinks", priceSmall: 4.70, priceLarge: 5.90, tags: ["Cold"] },
  { id: "iced-schoko", name: "Iced Schoko (S/W)", category: "Iced Drinks", priceSmall: 4.70, priceLarge: 5.90, tags: ["Cold"] },
  { id: "iced-matcha", name: "Iced Matcha (mit Erdbeere / Himbeere / Blaubeere)", category: "Iced Drinks", priceSmall: 5.50, priceLarge: 6.90, tags: ["Matcha"] },

  // 5. Shakes
  { id: "shk-vanille", name: "Vanille Shake", category: "Shakes", priceSmall: 4.90, priceLarge: 5.90, tags: ["Shake"] },
  { id: "shk-schoko", name: "Schoko Shake", category: "Shakes", priceSmall: 4.90, priceLarge: 5.90, tags: ["Shake"] },
  { id: "shk-cappuccino", name: "Cappuccino Shake", category: "Shakes", priceSmall: 4.90, priceLarge: 5.90, tags: ["Shake"] },
  { id: "shk-joghurt", name: "Joghurt Shake", category: "Shakes", priceSmall: 4.90, priceLarge: 5.90, tags: ["Shake"] },
  { id: "shk-banane", name: "Banane Shake", category: "Shakes", priceSmall: 5.40, priceLarge: 6.40, tags: ["Shake"] },
  { id: "shk-schoko-banane", name: "Schoko-Banane Shake", category: "Shakes", priceSmall: 5.90, priceLarge: 6.90, tags: ["Shake"] },
  { id: "shk-oreo", name: "Oreo Shake", category: "Shakes", priceSmall: 5.90, priceLarge: 6.90, tags: ["Shake"] },
  { id: "shk-berry", name: "Berry Shake", category: "Shakes", priceSmall: 5.90, priceLarge: 6.90, tags: ["Shake"] },
  { id: "shk-erdbeere", name: "Erdbeere Shake", category: "Shakes", priceSmall: 5.90, priceLarge: 6.90, tags: ["Shake"] },
  { id: "shk-orange", name: "Orange Shake", category: "Shakes", priceSmall: 5.90, priceLarge: 6.90, tags: ["Shake"] },
  { id: "shk-almond", name: "Almond Shake", category: "Shakes", priceSmall: 5.90, priceLarge: 6.90, tags: ["Shake"] },

  // 6. Frisch & Fruchtig (Lemonades & Juice)
  { id: "fr-orange", name: "Orangensaft frisch gepresst", category: "Frisch & Fruchtig", priceSmall: 5.50, priceLarge: 6.50, tags: ["Fresh"] },
  { id: "fr-limo-haus", name: "Zitronenlimo hausgemacht", category: "Frisch & Fruchtig", priceSmall: 4.90, priceLarge: 5.90, tags: ["Refreshing"] },
  { id: "fr-limo-ingwer", name: "Zitronenlimo - Ingwer", category: "Frisch & Fruchtig", priceSmall: 5.50, priceLarge: 6.50, tags: ["Refreshing"] },
  { id: "fr-limo-erdbeere", name: "Zitronenlimo - Erdbeere", category: "Frisch & Fruchtig", priceSmall: 5.90, priceLarge: 6.90, tags: ["Refreshing"] },
  { id: "fr-limo-himbeere", name: "Zitronenlimo - Himbeere", category: "Frisch & Fruchtig", priceSmall: 5.90, priceLarge: 6.90, tags: ["Refreshing"] }
];

const categories = ["Specials — Neu", "Crêpes", "Heißgetränke", "Iced Drinks", "Shakes", "Frisch & Fruchtig"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("Specials — Neu");
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
          <div className="absolute inset-0 z-0">
            <img 
              src="/kiosk-bg.jpg" 
              alt="La Merienda Kiosk at PEP Mall" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
          </div>

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
          <h2 className="text-3xl font-extrabold mb-2 text-[#3D2314] text-center">Our Menu</h2>
          <p className="text-center text-xs text-gray-500 mb-6">Make every shake a protein shake (+1,50€ extra) • Soy, Oat, Almond milk available</p>
          
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
                    {item.price !== undefined ? (
                      <span className="text-[#9E0038] font-black text-base">€{item.price.toFixed(2)}</span>
                    ) : (
                      <div className="text-right text-xs">
                        {item.priceSmall && <span className="text-gray-500 mr-2">Klein: €{item.priceSmall.toFixed(2)}</span>}
                        {item.priceLarge && <span className="text-[#9E0038] font-black">Groß: €{item.priceLarge.toFixed(2)}</span>}
                      </div>
                    )}
                  </div>
                  {item.description && <p className="text-gray-600 text-xs sm:text-sm mb-4">{item.description}</p>}
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map(t => (
                      <span key={t} className="text-[10px] bg-[#F9F6F0] text-[#3D2314] px-2 py-0.5 rounded-md font-medium">✨ {t}</span>
                    ))}
                  </div>
                )}
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