import React, { useState } from "react";
import {
  Search,
  ShoppingBag,
  Sparkles,
  X,
  Loader2,
  Star,
  Filter,
} from "lucide-react";

// --- IMAGE UTILITY FUNCTION ---
// Generate reliable images using multiple fallback sources
const generateProductImage = (productName, categoryId) => {
  // Use robohash.org as primary source - it generates unique robot/avatar images
  // Each productName will generate a consistent unique image
  const sanitizedName = productName.replace(/\s+/g, "-").toLowerCase();
  
  // Robohash API - very reliable and generates consistent unique images
  return `https://robohash.org/${sanitizedName}?size=400x300&set=set3`;
};

// --- 1. MOCK DATA ---
// This acts as our "database" of products.
const PRODUCT_CATALOG = [
  {
    id: 1,
    name: "Pixel 8 Pro",
    category: "Phone",
    price: 999,
    rating: 4.8,
    description:
      "High-end Google phone with amazing AI camera capabilities.",
    image: generateProductImage("Pixel 8 Pro", 1),
  },
  {
    id: 2,
    name: "Galaxy A54",
    category: "Phone",
    price: 449,
    rating: 4.5,
    description:
      "Great mid-range phone with long battery life and solid screen.",
    image: generateProductImage("Galaxy A54", 2),
  },
  {
    id: 3,
    name: "iPhone SE",
    category: "Phone",
    price: 429,
    rating: 4.3,
    description:
      "Compact and powerful, perfect for budget-conscious Apple fans.",
    image: generateProductImage("iPhone SE", 3),
  },
  {
    id: 4,
    name: "iPhone 15 Pro",
    category: "Phone",
    price: 1199,
    rating: 4.9,
    description:
      "Latest flagship with titanium design and advanced camera system.",
    image: generateProductImage("iPhone 15 Pro", 4),
  },
  {
    id: 5,
    name: "Samsung Galaxy S24",
    category: "Phone",
    price: 899,
    rating: 4.7,
    description:
      "Premium Android phone with excellent display and performance.",
    image: generateProductImage("Samsung Galaxy S24", 5),
  },
  {
    id: 6,
    name: "OnePlus 12",
    category: "Phone",
    price: 799,
    rating: 4.6,
    description:
      "Fast and smooth with great value for the price.",
    image: generateProductImage("OnePlus 12", 6),
  },
  {
    id: 7,
    name: "MacBook Air M2",
    category: "Laptop",
    price: 1099,
    rating: 4.9,
    description:
      "Thin, light, and incredibly fast. Best for students and pros.",
    image: generateProductImage("MacBook Air M2", 7),
  },
  {
    id: 8,
    name: "MacBook Pro M3",
    category: "Laptop",
    price: 1999,
    rating: 4.9,
    description:
      "Professional-grade laptop for creative and development work.",
    image: generateProductImage("MacBook Pro M3", 8),
  },
  {
    id: 9,
    name: "Dell XPS 13",
    category: "Laptop",
    price: 999,
    rating: 4.6,
    description:
      "Premium Windows ultrabook with a stunning infinity display.",
    image: generateProductImage("Dell XPS 13", 9),
  },
  {
    id: 10,
    name: "Lenovo ThinkPad X1",
    category: "Laptop",
    price: 1299,
    rating: 4.7,
    description:
      "Business laptop with legendary durability and keyboard.",
    image: generateProductImage("Lenovo ThinkPad X1", 10),
  },
  {
    id: 11,
    name: "ASUS VivoBook 15",
    category: "Laptop",
    price: 599,
    rating: 4.3,
    description:
      "Affordable everyday laptop with solid performance.",
    image: generateProductImage("ASUS VivoBook 15", 11),
  },
  {
    id: 12,
    name: "Chromebook Flex",
    category: "Laptop",
    price: 299,
    rating: 4.0,
    description:
      "Simple, secure, and very affordable. Good for basic browsing.",
    image: generateProductImage("Chromebook Flex", 12),
  },
  {
    id: 13,
    name: "HP Pavilion 16",
    category: "Laptop",
    price: 699,
    rating: 4.2,
    description:
      "Great for entertainment and everyday computing.",
    image: generateProductImage("HP Pavilion 16", 13),
  },
  {
    id: 14,
    name: "Sony WH-1000XM5",
    category: "Audio",
    price: 398,
    rating: 4.8,
    description:
      "Industry-leading noise canceling headphones. Super comfortable.",
    image: generateProductImage("Sony WH-1000XM5", 14),
  },
  {
    id: 15,
    name: "AirPods Pro",
    category: "Audio",
    price: 249,
    rating: 4.7,
    description:
      "Wireless earbuds with excellent transparency mode and ANC.",
    image: generateProductImage("AirPods Pro", 15),
  },
  {
    id: 16,
    name: "Bose QuietComfort 45",
    category: "Audio",
    price: 379,
    rating: 4.6,
    description:
      "Excellent noise cancellation and comfort for long listening.",
    image: generateProductImage("Bose QuietComfort 45", 16),
  },
  {
    id: 17,
    name: "Samsung Galaxy Buds",
    category: "Audio",
    price: 129,
    rating: 4.4,
    description:
      "Great value wireless earbuds with solid sound quality.",
    image: generateProductImage("Samsung Galaxy Buds", 17),
  },
  {
    id: 18,
    name: "Beats Studio Pro",
    category: "Audio",
    price: 399,
    rating: 4.5,
    description:
      "Premium sound with stylish design and great battery life.",
    image: generateProductImage("Beats Studio Pro", 18),
  },
  {
    id: 19,
    name: "JBL Flip 6",
    category: "Audio",
    price: 139,
    rating: 4.3,
    description:
      "Portable waterproof speaker with excellent bass.",
    image: generateProductImage("JBL Flip 6", 19),
  },
  {
    id: 20,
    name: "Logitech MX Master 3",
    category: "Accessories",
    price: 99,
    rating: 4.9,
    description:
      "The ultimate productivity mouse for coding and design.",
    image: generateProductImage("Logitech MX Master 3", 20),
  },
  {
    id: 21,
    name: "Keychron K2",
    category: "Accessories",
    price: 79,
    rating: 4.6,
    description:
      "Mechanical keyboard with a great tactile feel and Mac layout.",
    image: generateProductImage("Keychron K2", 21),
  },
  {
    id: 22,
    name: "Apple Magic Mouse",
    category: "Accessories",
    price: 79,
    rating: 4.2,
    description:
      "Wireless mouse with Multi-Touch surface for Apple devices.",
    image: generateProductImage("Apple Magic Mouse", 22),
  },
  {
    id: 23,
    name: "USB-C Hub Pro",
    category: "Accessories",
    price: 49,
    rating: 4.4,
    description:
      "Multi-port hub for connecting multiple devices easily.",
    image: generateProductImage("USB-C Hub Pro", 23),
  },
  {
    id: 24,
    name: "Webcam 4K Ultra",
    category: "Accessories",
    price: 129,
    rating: 4.5,
    description:
      "Professional 4K webcam for streaming and video calls.",
    image: generateProductImage("Webcam 4K Ultra", 24),
  },
  {
    id: 25,
    name: "Laptop Stand",
    category: "Accessories",
    price: 39,
    rating: 4.3,
    description:
      "Ergonomic aluminum stand for better workspace setup.",
    image: generateProductImage("Laptop Stand", 25),
  },
  {
    id: 26,
    name: "Gaming PC RTX 4070",
    category: "Desktop",
    price: 1899,
    rating: 4.8,
    description:
      "High-end gaming rig for demanding games at 1440p.",
    image: generateProductImage("Gaming PC RTX 4070", 26),
  },
  {
    id: 27,
    name: "Budget Gaming PC",
    category: "Desktop",
    price: 800,
    rating: 4.4,
    description:
      "Entry-level gaming rig capable of running modern games at 1080p.",
    image: generateProductImage("Budget Gaming PC", 27),
  },
  {
    id: 28,
    name: "iMac 24 inch",
    category: "Desktop",
    price: 1499,
    rating: 4.7,
    description:
      "All-in-one computer with beautiful design and M3 chip.",
    image: generateProductImage("iMac 24 inch", 28),
  },
  {
    id: 29,
    name: "Dell Precision Workstation",
    category: "Desktop",
    price: 2499,
    rating: 4.9,
    description:
      "Professional workstation for 3D rendering and CAD.",
    image: generateProductImage("Dell Precision Workstation", 29),
  },
  {
    id: 30,
    name: "Microsoft Surface Laptop Studio",
    category: "Laptop",
    price: 1999,
    rating: 4.8,
    description:
      "Powerful creative laptop with dynamic graphics switching.",
    image: generateProductImage("Microsoft Surface Laptop Studio", 30),
  },
  {
    id: 31,
    name: "iPad Pro 12.9",
    category: "Tablet",
    price: 1199,
    rating: 4.9,
    description:
      "Powerful tablet for creative professionals and productivity.",
    image: generateProductImage("iPad Pro 12.9", 31),
  },
  {
    id: 32,
    name: "Samsung Galaxy Tab S9",
    category: "Tablet",
    price: 799,
    rating: 4.6,
    description:
      "Premium Android tablet with gorgeous display.",
    image: generateProductImage("Samsung Galaxy Tab S9", 32),
  },
  {
    id: 33,
    name: "iPad Air",
    category: "Tablet",
    price: 599,
    rating: 4.5,
    description:
      "Versatile mid-range tablet for everyday use.",
    image: generateProductImage("iPad Air", 33),
  },
  {
    id: 34,
    name: "Google Pixel Watch",
    category: "Wearables",
    price: 299,
    rating: 4.4,
    description:
      "Smartwatch with great fitness tracking and Google services.",
    image: generateProductImage("Google Pixel Watch", 34),
  },
  {
    id: 35,
    name: "Apple Watch Ultra",
    category: "Wearables",
    price: 799,
    rating: 4.8,
    description:
      "Rugged smartwatch for outdoor adventures and sports.",
    image: generateProductImage("Apple Watch Ultra", 35),
  },
];

// --- 2. AI INTEGRATION ---
// NOTE: The original implementation attempted to call Google's Gemini
// generative API directly from the browser. That approach commonly
// fails due to CORS restrictions, API model/version mismatches, or
// the need to keep API keys secret. To avoid runtime errors and to
// make the demo reliably usable locally, we use a safe local
// heuristic-based recommender. If you want to re-enable remote
// calls, implement a server-side proxy that calls the API securely.

const getAIRecommendations = async (userQuery, products) => {
  // Simple heuristic recommender (runs entirely in the browser).
  // It understands price constraints ("under 1000"), category
  // keywords (phone, laptop, audio, desktop, accessories), and
  // matches keywords against product names and descriptions.

  const q = (userQuery || "").toLowerCase();
  const result = { recommendedIds: [], reason: "" };

  if (!q.trim()) {
    result.reason = "Please enter what you're looking for.";
    return result;
  }

  // Extract budget: look for "under 1000" or "under $1000" or "below 1000"
  let budget = null;
  const budgetMatch = q.match(/(?:under|below)\s*\$?\s*(\d{2,6})/i);
  if (budgetMatch) {
    budget = Number(budgetMatch[1]);
  }

  // Category detection - expanded with more keywords
  const categoryMap = {
    phone: ["phone", "iphone", "pixel", "galaxy", "oneplus", "mobile", "smartphone"],
    laptop: ["laptop", "macbook", "chromebook", "xps", "thinkpad", "vivobook", "pavilion", "surface"],
    audio: ["audio", "headphone", "headphones", "airpods", "sony", "bose", "beats", "jbl", "earbuds", "speaker"],
    accessories: ["accessory", "accessories", "keyboard", "mouse", "keychron", "logitech", "hub", "webcam", "stand"],
    desktop: ["desktop", "pc", "gaming pc", "gaming", "workstation", "imac"],
    tablet: ["tablet", "ipad", "galaxy tab"],
    wearables: ["watch", "smartwatch", "wearable"],
  };

  let detectedCategory = null;
  for (const [cat, keywords] of Object.entries(categoryMap)) {
    if (keywords.some((kw) => q.includes(kw))) {
      detectedCategory = cat.charAt(0).toUpperCase() + cat.slice(1);
      break;
    }
  }

  // Step 1: Filter products based on detected category and budget FIRST
  let filteredProducts = products;
  
  // If a category is detected, only consider products in that category
  if (detectedCategory) {
    filteredProducts = products.filter((p) => p.category.toLowerCase() === detectedCategory.toLowerCase());
  }
  
  // Apply budget filter if specified
  if (budget != null) {
    filteredProducts = filteredProducts.filter((p) => p.price <= budget);
  }

  // Step 2: If we have filtered results, score and sort them
  if (filteredProducts.length > 0) {
    const candidates = filteredProducts.map((p) => {
      let score = 0;
      const combined = (p.name + " " + p.description + " " + p.category).toLowerCase();

      // keyword matches from query
      q.split(/\s+/).forEach((tok) => {
        if (tok.length < 3) return;
        if (combined.includes(tok)) score += 2;
      });

      // rating weight
      score += Math.round(p.rating || 0) * 2;

      // Price range preference logic - prefer items in the middle/upper range of budget
      if (budget != null && p.price <= budget && p.price > budget * 0.7) {
        score += 3;
      }

      return { product: p, score };
    });

    const sorted = candidates
      .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating || a.product.price - b.product.price);

    const ids = sorted.slice(0, 12).map((s) => s.product.id);
    result.recommendedIds = ids;
    
    if (detectedCategory && budget != null) {
      result.reason = `Found ${filteredProducts.length} ${detectedCategory.toLowerCase()}s under $${budget}. Showing the top ${ids.length} matches.`;
    } else if (detectedCategory) {
      result.reason = `Found ${filteredProducts.length} ${detectedCategory.toLowerCase()}s. Showing the top ${ids.length} matches.`;
    } else if (budget != null) {
      result.reason = `Found ${filteredProducts.length} items under $${budget}. Showing the top ${ids.length} matches.`;
    }
    
    return result;
  }

  // Step 3: If no exact matches, provide helpful message
  if (detectedCategory && budget != null) {
    result.reason = `No ${detectedCategory.toLowerCase()}s found under $${budget} in our catalog. Try a higher budget or different category.`;
  } else if (detectedCategory) {
    result.reason = `No ${detectedCategory.toLowerCase()}s found in our catalog.`;
  } else if (budget != null) {
    result.reason = `No products found under $${budget} in our catalog.`;
  } else {
    result.reason = "I couldn't find any products in our catalog that match your specific request.";
  }
  
  result.recommendedIds = [];
  return result;
};

/*
  If you later want to re-enable remote AI calls, implement a server-side proxy
  (Node/Express, Cloud Function, etc.) that performs authenticated requests to the
  Generative Language API. Calling that from the browser (directly) commonly leads
  to CORS/model/version errors and exposes API keys.

  Example (server-side): POST /api/ai-recommendations -> server calls Google API securely.
*/

// --- 3. UI COMPONENTS ---

// Generate SVG placeholder with gradient
const generateSVGPlaceholder = (productName) => {
  const colors = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#06B6D4", "#6366F1"];
  const hash = productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bgColor = colors[hash % colors.length];
  const textColor = "#ffffff";
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${adjustBrightness(bgColor, -30)};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#grad)"/>
    <text x="50%" y="50%" font-size="24" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif">
      ${productName.substring(0, 3).toUpperCase()}
    </text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Helper to adjust brightness
const adjustBrightness = (color, percent) => {
  const num = parseInt(color.replace("#",""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return "#" + (0x1000000 + R*0x10000 + G*0x100 + B).toString(16).slice(1);
};

const ProductCard = ({ product, isRecommended }) => {
  const [imageError, setImageError] = React.useState(false);
  
  // Use SVG fallback if image fails
  const imageSource = imageError ? generateSVGPlaceholder(product.name) : product.image;
  
  return (
    <div
      className={`
      relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300
      ${isRecommended ? "ring-2 ring-blue-500 transform scale-[1.02]" : "border border-gray-100"}
    `}
    >
      {isRecommended && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm z-10">
          <Sparkles size={12} className="mr-1" />
          Top Pick
        </div>
      )}
      <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 relative group flex items-center justify-center">
        <img
          src={imageSource}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            if (!imageError) {
              setImageError(true);
            }
          }}
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 leading-tight">
            {product.name}
          </h3>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-md">
            ${product.price}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {product.category}
          </span>
          <div className="flex items-center text-yellow-500 text-sm font-medium">
            <Star size={14} className="fill-current mr-1" />
            {product.rating}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [query, setQuery] = useState("");
  const [displayedProducts, setDisplayedProducts] =
    useState(PRODUCT_CATALOG);
  const [loading, setLoading] = useState(false);
  const [aiReason, setAiReason] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      resetSearch();
      return;
    }

    setLoading(true);
    setError(null);
    setAiReason(null);

    try {
      const result = await getAIRecommendations(query, PRODUCT_CATALOG);

      const recommendedIds = result.recommendedIds || [];
      const filtered = PRODUCT_CATALOG.filter((p) =>
        recommendedIds.includes(p.id)
      );

      if (filtered.length > 0) {
        setDisplayedProducts(filtered);
        setAiReason(result.reason);
      } else {
        setDisplayedProducts([]);
        setAiReason(
          "I couldn't find any products in our catalog that match your specific request."
        );
      }
    } catch (err) {
      console.error("handleSearch error:", err);
      setError("Something went wrong asking the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setQuery("");
    setDisplayedProducts(PRODUCT_CATALOG);
    setAiReason(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <ShoppingBag size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ShopAI</h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Powered by Gemini
          </div>
        </div>
      </header>

      {/* Hero / Search Section */}
      <div className="bg-white border-b border-gray-200 pb-8">
        <div className="max-w-3xl mx-auto px-4 pt-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Find the perfect tech for you.
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Tell us what you're looking for, and our AI will recommend the
            best matches.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {loading ? (
                  <Loader2
                    className="animate-spin text-blue-500"
                    size={20}
                  />
                ) : (
                  <Sparkles
                    className="text-blue-500 group-focus-within:text-blue-600"
                    size={20}
                  />
                )}
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: I want a cheap phone with good battery..."
                className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm text-lg"
                disabled={loading}
              />
              {query && (
                <button
                  type="button"
                  onClick={resetSearch}
                  className="absolute inset-y-0 right-2 px-2 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="mt-4 flex gap-2 justify-center">
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Analyzing..." : "Get Recommendations"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuery("Best laptop under $1000");
                }}
                className="hidden sm:block text-sm text-gray-500 hover:text-blue-600 py-2 px-3 border border-transparent hover:border-blue-100 hover:bg-blue-50 rounded-lg transition-all"
              >
                "Best laptop under $1000"
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {aiReason ? "Recommended for You" : "All Products"}
            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {displayedProducts.length}
            </span>
          </h3>

          {!aiReason && (
            <div className="flex items-center text-sm text-gray-500">
              <Filter size={16} className="mr-2" />
              Showing full catalog
            </div>
          )}
        </div>

        {/* AI Reasoning Display */}
        {aiReason && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Sparkles className="text-blue-600" size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 text-sm uppercase tracking-wide mb-1">
                AI Insight
              </h4>
              <p className="text-blue-800 leading-relaxed">{aiReason}</p>
            </div>
            <button
              onClick={resetSearch}
              className="ml-auto text-blue-400 hover:text-blue-600 p-1"
              title="Clear filter"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">!</div>
            {error}
          </div>
        )}

        {/* Product Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isRecommended={!!aiReason}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No products found
            </h3>
            <p className="text-gray-500 mt-1">
              Try adjusting your search terms or price range.
            </p>
            <button
              onClick={resetSearch}
              className="mt-4 text-blue-600 font-medium hover:underline"
            >
              View all products
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
