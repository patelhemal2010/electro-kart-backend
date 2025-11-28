import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// AI-powered chatbot controller with ML algorithms
class ChatbotController {
  constructor() {
    this.conversationHistory = new Map(); // Store user conversation history
    this.productKnowledge = new Map(); // Store product knowledge base
    this.initializeKnowledgeBase();
  }

  // Initialize product knowledge base for AI
  async initializeKnowledgeBase() {
    try {
      const products = await Product.find({}).populate('category');
      const categories = await Category.find({});
      
      // Build knowledge base
      products.forEach(product => {
        this.productKnowledge.set(product._id.toString(), {
          name: product.name,
          brand: product.brand,
          price: product.price,
          description: product.description,
          category: product.category?.name,
          features: this.extractFeatures(product),
          keywords: this.generateKeywords(product)
        });
      });

      console.log(`Chatbot knowledge base initialized with ${products.length} products`);
    } catch (error) {
      console.error('Error initializing chatbot knowledge base:', error);
    }
  }

  // Extract product features using NLP
  extractFeatures(product) {
    const features = [];
    const description = product.description.toLowerCase();
    
    // Extract technical features
    if (description.includes('wireless') || description.includes('bluetooth')) {
      features.push('wireless');
    }
    if (description.includes('waterproof') || description.includes('water resistant')) {
      features.push('waterproof');
    }
    if (description.includes('battery') || description.includes('rechargeable')) {
      features.push('rechargeable');
    }
    if (description.includes('gaming') || description.includes('gamer')) {
      features.push('gaming');
    }
    if (description.includes('professional') || description.includes('pro')) {
      features.push('professional');
    }
    if (description.includes('budget') || description.includes('affordable')) {
      features.push('budget-friendly');
    }
    
    return features;
  }

  // Generate search keywords for products
  generateKeywords(product) {
    const keywords = [
      product.name.toLowerCase(),
      product.brand.toLowerCase(),
      product.category?.name?.toLowerCase(),
      ...this.extractFeatures(product)
    ].filter(Boolean);
    
    return [...new Set(keywords)];
  }

  // Natural Language Processing for query understanding
  processQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    // Intent classification using keyword matching
    const intents = {
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      product_search: ['find', 'search', 'looking for', 'need', 'want', 'show me', 'recommend'],
      price_inquiry: ['price', 'cost', 'how much', 'expensive', 'cheap', 'budget'],
      product_info: ['what is', 'tell me about', 'information', 'details', 'specifications'],
      comparison: ['compare', 'difference', 'better', 'vs', 'versus', 'which is better'],
      category_browse: ['category', 'type', 'kind', 'laptops', 'phones', 'headphones'],
      help: ['help', 'support', 'assistance', 'how to', 'guide']
    };

    // Classify intent
    let detectedIntent = 'general';
    let confidence = 0;

    for (const [intent, keywords] of Object.entries(intents)) {
      const matches = keywords.filter(keyword => lowerQuery.includes(keyword));
      if (matches.length > 0) {
        detectedIntent = intent;
        confidence = matches.length / keywords.length;
        break;
      }
    }

    // Extract entities (product names, categories, features)
    const entities = this.extractEntities(lowerQuery);
    
    return {
      intent: detectedIntent,
      confidence,
      entities,
      originalQuery: query
    };
  }

  // Extract entities from user query
  extractEntities(query) {
    const entities = {
      products: [],
      categories: [],
      features: [],
      priceRange: null
    };

    // Extract product names and brands
    for (const [productId, productData] of this.productKnowledge) {
      if (query.includes(productData.name.toLowerCase()) || 
          query.includes(productData.brand.toLowerCase())) {
        entities.products.push(productId);
      }
    }

    // Extract categories
    const categoryKeywords = ['laptop', 'phone', 'headphone', 'tablet', 'camera', 'watch', 'speaker', 'tv', 'monitor'];
    categoryKeywords.forEach(category => {
      if (query.includes(category)) {
        entities.categories.push(category);
      }
    });

    // Extract price range
    const pricePatterns = [
      { pattern: /under (\d+)/, type: 'max' },
      { pattern: /above (\d+)/, type: 'min' },
      { pattern: /between (\d+) and (\d+)/, type: 'range' },
      { pattern: /around (\d+)/, type: 'approximate' }
    ];

    pricePatterns.forEach(({ pattern, type }) => {
      const match = query.match(pattern);
      if (match) {
        entities.priceRange = { type, values: match.slice(1).map(Number) };
      }
    });

    return entities;
  }

  // AI-powered product recommendation
  async getRecommendations(query, userId) {
    const processedQuery = this.processQuery(query);
    let recommendations = [];

    try {
      switch (processedQuery.intent) {
        case 'product_search':
          recommendations = await this.searchProducts(processedQuery);
          break;
        case 'price_inquiry':
          recommendations = await this.getProductsByPrice(processedQuery);
          break;
        case 'category_browse':
          recommendations = await this.getProductsByCategory(processedQuery);
          break;
        case 'comparison':
          recommendations = await this.getProductsForComparison(processedQuery);
          break;
        default:
          recommendations = await this.getGeneralRecommendations(processedQuery);
      }

      // Apply ML-based ranking
      recommendations = this.rankRecommendations(recommendations, processedQuery, userId);
      
      return {
        success: true,
        recommendations: recommendations.slice(0, 5), // Return top 5
        intent: processedQuery.intent,
        confidence: processedQuery.confidence
      };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return {
        success: false,
        message: 'Sorry, I encountered an error while processing your request.',
        recommendations: []
      };
    }
  }

  // Search products based on query
  async searchProducts(processedQuery) {
    const { entities } = processedQuery;
    let products = [];

    if (entities.products.length > 0) {
      // Direct product search
      products = await Product.find({
        _id: { $in: entities.products }
      }).populate('category');
    } else {
      // Keyword-based search
      const searchTerms = [
        ...entities.categories,
        ...entities.features
      ];

      if (searchTerms.length > 0) {
        const searchPatterns = searchTerms.map(term => ({
          $or: [
            { name: { $regex: term, $options: 'i' } },
            { brand: { $regex: term, $options: 'i' } },
            { description: { $regex: term, $options: 'i' } }
          ]
        }));

        products = await Product.find({ $or: searchPatterns }).populate('category');
      }
    }

    return products;
  }

  // Get products by price range
  async getProductsByPrice(processedQuery) {
    const { entities } = processedQuery;
    let query = {};

    if (entities.priceRange) {
      const { type, values } = entities.priceRange;
      switch (type) {
        case 'max':
          query.price = { $lte: values[0] };
          break;
        case 'min':
          query.price = { $gte: values[0] };
          break;
        case 'range':
          query.price = { $gte: values[0], $lte: values[1] };
          break;
        case 'approximate':
          const tolerance = values[0] * 0.2; // 20% tolerance
          query.price = { 
            $gte: values[0] - tolerance, 
            $lte: values[0] + tolerance 
          };
          break;
      }
    }

    return await Product.find(query).populate('category');
  }

  // Get products by category
  async getProductsByCategory(processedQuery) {
    const { entities } = processedQuery;
    
    if (entities.categories.length > 0) {
      const categoryQuery = entities.categories.map(cat => ({
        $or: [
          { name: { $regex: cat, $options: 'i' } },
          { 'category.name': { $regex: cat, $options: 'i' } }
        ]
      }));

      return await Product.find({ $or: categoryQuery }).populate('category');
    }

    return [];
  }

  // Get products for comparison
  async getProductsForComparison(processedQuery) {
    // This would typically involve comparing specific products
    // For now, return products from the same category
    return await this.getProductsByCategory(processedQuery);
  }

  // Get general recommendations
  async getGeneralRecommendations(processedQuery) {
    // Return popular/featured products
    return await Product.find({})
      .populate('category')
      .sort({ rating: -1, numReviews: -1 })
      .limit(10);
  }

  // ML-based ranking algorithm
  rankRecommendations(products, processedQuery, userId) {
    return products.map(product => {
      let score = 0;
      
      // Base score from product rating
      score += (product.rating || 0) * 20;
      
      // Popularity score
      score += Math.log(product.numReviews + 1) * 10;
      
      // Price relevance (if price range specified)
      if (processedQuery.entities.priceRange) {
        const { type, values } = processedQuery.entities.priceRange;
        const price = product.price;
        
        switch (type) {
          case 'max':
            if (price <= values[0]) score += 30;
            break;
          case 'min':
            if (price >= values[0]) score += 30;
            break;
          case 'range':
            if (price >= values[0] && price <= values[1]) score += 30;
            break;
        }
      }
      
      // Feature matching
      const queryLower = processedQuery.originalQuery.toLowerCase();
      const productText = `${product.name} ${product.brand} ${product.description}`.toLowerCase();
      
      const queryWords = queryLower.split(' ').filter(word => word.length > 2);
      const matches = queryWords.filter(word => productText.includes(word));
      score += matches.length * 15;
      
      return { ...product.toObject(), relevanceScore: score };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  // Generate contextual response
  generateResponse(processedQuery, recommendations) {
    const { intent, confidence, originalQuery } = processedQuery;
    
    let response = '';
    
    switch (intent) {
      case 'greeting':
        response = "Hello! I'm your AI shopping assistant. How can I help you find the perfect products today?";
        break;
        
      case 'product_search':
        if (recommendations.length > 0) {
          response = `I found ${recommendations.length} products that match your search for "${originalQuery}". Here are my top recommendations:`;
        } else {
          response = `I couldn't find products matching "${originalQuery}". Could you try different keywords or be more specific?`;
        }
        break;
        
      case 'price_inquiry':
        if (recommendations.length > 0) {
          response = `Here are products in your price range:`;
        } else {
          response = `I couldn't find products in that price range. Would you like to see products in a different price range?`;
        }
        break;
        
      case 'category_browse':
        response = `Here are some great products in the ${processedQuery.entities.categories.join(', ')} category:`;
        break;
        
      case 'comparison':
        response = `Here are products you can compare:`;
        break;
        
      case 'help':
        response = `I can help you with:
        • Finding products by name, brand, or category
        • Searching by price range
        • Comparing products
        • Getting product recommendations
        • Answering questions about products
        
        What would you like to do?`;
        break;
        
      default:
        response = `I understand you're looking for "${originalQuery}". Let me help you find the best products!`;
    }
    
    return response;
  }
}

// Create chatbot instance
const chatbot = new ChatbotController();

// Chat endpoint
export const chatWithBot = asyncHandler(async (req, res) => {
  const { message, userId } = req.body;
  
  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Message is required'
    });
  }

  try {
    // Get AI recommendations
    const recommendations = await chatbot.getRecommendations(message, userId);
    
    // Generate response
    const response = chatbot.generateResponse(
      chatbot.processQuery(message),
      recommendations.recommendations
    );

    // Store conversation history
    if (userId) {
      const userHistory = chatbot.conversationHistory.get(userId) || [];
      userHistory.push({
        user: message,
        bot: response,
        timestamp: new Date(),
        recommendations: recommendations.recommendations
      });
      chatbot.conversationHistory.set(userId, userHistory);
    }

    res.json({
      success: true,
      response,
      recommendations: recommendations.recommendations,
      intent: recommendations.intent,
      confidence: recommendations.confidence
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, I encountered an error. Please try again.',
      response: 'I apologize, but I\'m having trouble processing your request right now. Could you please try rephrasing your question?'
    });
  }
});

// Get conversation history
export const getChatHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }

  const history = chatbot.conversationHistory.get(userId) || [];
  
  res.json({
    success: true,
    history: history.slice(-10) // Return last 10 messages
  });
});

// Clear conversation history
export const clearChatHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  if (userId) {
    chatbot.conversationHistory.delete(userId);
  } else {
    chatbot.conversationHistory.clear();
  }
  
  res.json({
    success: true,
    message: 'Chat history cleared'
  });
});

// Get chatbot suggestions
export const getChatbotSuggestions = asyncHandler(async (req, res) => {
  const suggestions = [
    "Show me laptops under ₹50,000",
    "What are the best headphones?",
    "Find gaming products",
    "Compare smartphones",
    "Show me products in electronics category",
    "What's trending?",
    "Help me find a gift",
    "Show me deals and offers"
  ];
  
  res.json({
    success: true,
    suggestions
  });
});

export default chatbot;
