import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Sparkles, X, Loader2, Star, Filter } from 'lucide-react';

// --- 1. MOCK DATA ---
// This acts as our "database" of products.
const PRODUCT_CATALOG = [
  { id: 1, name: "Pixel 8 Pro", category: "Phone", price: 999, rating: 4.8, description: "High-end Google phone with amazing AI camera capabilities.", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Galaxy A54", category: "Phone", price: 449, rating: 4.5, description: "Great mid-range phone with long battery life and solid screen.", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "iPhone SE", category: "Phone", price: 429, rating: 4.3, description: "Compact and powerful, perfect for budget-conscious Apple fans.", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "MacBook Air M2", category: "Laptop", price: 1099, rating: 4.9, description: "Thin, light, and incredibly fast. Best for students and pros.", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "Dell XPS 13", category: "Laptop", price: 999, rating: 4.6, description: "Premium Windows ultrabook with a stunning infinity display.", image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=400" },
  { id: 6, name: "Chromebook Flex", category: "Laptop", price: 299, rating: 4.0, description: "Simple, secure, and very affordable. Good for basic browsing.", image: "https://images.unsplash.com/photo-1544099858-75feeb57f01e?auto=format&fit=crop&q=80&w=400" },
  { id: 7, name: "Sony WH-1000XM5", category: "Audio", price: 398, rating: 4.8, description: "Industry-leading noise canceling headphones. Super comfortable.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" },
  { id: 8, name: "AirPods Pro", category: "Audio", price: 249, rating: 4.7, description: "Wireless earbuds with excellent transparency mode and ANC.", image: "https://images.unsplash.com/photo-1572569028738-411a19717515?auto=format&fit=crop&q=80&w=400" },
  { id: 9, name: "Logitech MX Master 3", category: "Accessories", price: 99, rating: 4.9, description: "The ultimate productivity mouse for coding and design.", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400" },
  { id: 10, name: "Keychron K2", category: "Accessories", price: 79, rating: 4.6, description: "Mechanical keyboard with a great tactile feel and Mac layout.", image: "https://images.unsplash.com/photo-1587829741301-dc798b91a91e?auto=format&fit=crop&q=80&w=400" },
  { id: 11, name: "Budget Gaming PC", category: "Desktop", price: 800, rating: 4.4, description: "Entry-level gaming rig capable of running modern games at 1080p.", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400" }
];

// --- 2. AI INTEGRATION ---
// This function talks to Google's Gemini API
const getAIRecommendations = async (userQuery, products) => {
  const apiKey = "AIzaSyCIz_PqjrvXA81jSgjGqEFZrVvVsyOCygY"; // System provides this automatically
  
  // We send the list of products to the AI so it knows what we have.
  // We ask it to return JSON to make it easy to parse.
  const prompt = `
    You are an intelligent shopping assistant API.
    
    Here is our current product catalog in JSON format:
    ${JSON.stringify(products)}
    
    User Request: "${userQuery}"
    
    Task:
    1. Analyze the user's request (looking for price constraints, categories, keywords, features).
    2. Select the products from the catalog that best match the request.
    3. Return a JSON object with a single key "recommendedIds" which is an array of the matching product IDs (integers).
    4. If no products match, return an empty array for "recommendedIds".
    5. Also provide a short, friendly "reason" string explaining why you picked these.

    Output format (JSON ONLY):
    {
      "recommendedIds": [1, 2],
      "reason": "I found these phones that are within your budget and have good reviews."
    }
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
             responseMimeType: "application/json" // Forces AI to give us JSON
          }
        }),
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    // Parse the AI's JSON response
    const textResult = data.candidates[0].content.parts[0].text;
    return JSON.parse(textResult);

  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};


// --- 3. UI COMPONENTS ---

const ProductCard = ({ product, isRecommended }) => (
  <div className={`
    relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300
    ${isRecommended ? 'ring-2 ring-blue-500 transform scale-[1.02]' : 'border border-gray-100'}
  `}>
    {isRecommended && (
      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm z-10">
        <Sparkles size={12} className="mr-1" />
        Top Pick
      </div>
    )}
    <div className="h-48 overflow-hidden bg-gray-100 relative group">
       <img 
         src={product.image} 
         alt={product.name} 
         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
         onError={(e) => {
           e.target.onerror = null;
           e.target.src = "https://via.placeholder.com/400x300?text=Product+Image";
         }}
       />
    </div>
    
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-gray-800 leading-tight">{product.name}</h3>
        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-md">
          ${product.price}
        </span>
      </div>
      
      <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-grow">{product.description}</p>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{product.category}</span>
        <div className="flex items-center text-yellow-500 text-sm font-medium">
          <Star size={14} className="fill-current mr-1" />
          {product.rating}
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [query, setQuery] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState(PRODUCT_CATALOG);
  const [loading, setLoading] = useState(false);
  const [aiReason, setAiReason] = useState(null);
  const [error, setError] = useState(null);

  // Function to handle the search
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
      // 1. Call our AI function
      const result = await getAIRecommendations(query, PRODUCT_CATALOG);
      
      // 2. Filter products based on the IDs returned by AI
      const recommendedIds = result.recommendedIds || [];
      const filtered = PRODUCT_CATALOG.filter(p => recommendedIds.includes(p.id));
      
      // 3. Update state
      if (filtered.length > 0) {
        setDisplayedProducts(filtered);
        setAiReason(result.reason);
      } else {
        setDisplayedProducts([]); // No matches found
        setAiReason("I couldn't find any products in our catalog that match your specific request.");
      }

    } catch (err) {
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
            Tell us what you're looking for, and our AI will recommend the best matches.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {loading ? <Loader2 className="animate-spin text-blue-500" size={20} /> : <Sparkles className="text-blue-500 group-focus-within:text-blue-600" size={20} />}
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
                {/* Quick suggestions for users to try */}
                <button 
                    type="button" 
                    onClick={() => { setQuery("Best laptop under $1000"); }}
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
                {aiReason ? 'Recommended for You' : 'All Products'}
                <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {displayedProducts.length}
                </span>
            </h3>
            
            {/* Filter visual indicator */}
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
                    <h4 className="font-semibold text-blue-900 text-sm uppercase tracking-wide mb-1">AI Insight</h4>
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
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search terms or price range.</p>
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