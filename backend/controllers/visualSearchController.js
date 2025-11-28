import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/visual-search";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, `visual-search-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});

// Simple Visual Search Engine
class VisualSearchEngine {
  constructor() {
    this.productFeatures = new Map();
    this.initializeProductFeatures();
  }

  // Initialize product visual features from existing products
  async initializeProductFeatures() {
    try {
      const products = await Product.find({});
      for (const product of products) {
        if (product.image) {
          // Simple feature extraction based on product metadata
          const features = this.extractSimpleFeatures(product);
          this.productFeatures.set(product._id.toString(), {
            productId: product._id,
            features: features,
            metadata: {
              name: product.name,
              brand: product.brand,
              category: product.category,
              price: product.price
            }
          });
        }
      }
      console.log(`Visual search engine initialized with ${products.length} products`);
    } catch (error) {
      console.error("Error initializing visual search engine:", error);
    }
  }

  // Extract simple features from product metadata
  extractSimpleFeatures(product) {
    return {
      name: product.name.toLowerCase(),
      brand: product.brand.toLowerCase(),
      category: product.category?.name?.toLowerCase() || '',
      price: product.price,
      description: product.description.toLowerCase(),
      keywords: this.generateKeywords(product)
    };
  }

  // Generate search keywords for products
  generateKeywords(product) {
    const keywords = [
      product.name.toLowerCase(),
      product.brand.toLowerCase(),
      product.category?.name?.toLowerCase(),
      ...product.description.toLowerCase().split(' ').filter(word => word.length > 3)
    ].filter(Boolean);
    
    return [...new Set(keywords)];
  }

  // Calculate similarity between two feature sets
  calculateSimilarity(features1, features2) {
    if (!features1 || !features2) return 0;
    
    let score = 0;
    let totalChecks = 0;
    
    // Brand similarity (weight: 0.3)
    if (features1.brand && features2.brand) {
      const brandSimilarity = features1.brand === features2.brand ? 1 : 0;
      score += brandSimilarity * 0.3;
      totalChecks += 0.3;
    }
    
    // Category similarity (weight: 0.4)
    if (features1.category && features2.category) {
      const categorySimilarity = features1.category === features2.category ? 1 : 0;
      score += categorySimilarity * 0.4;
      totalChecks += 0.4;
    }
    
    // Price similarity (weight: 0.2)
    if (features1.price && features2.price) {
      const priceDiff = Math.abs(features1.price - features2.price);
      const maxPrice = Math.max(features1.price, features2.price);
      const priceSimilarity = maxPrice > 0 ? 1 - (priceDiff / maxPrice) : 0;
      score += priceSimilarity * 0.2;
      totalChecks += 0.2;
    }
    
    // Keyword similarity (weight: 0.1)
    if (features1.keywords && features2.keywords) {
      const commonKeywords = features1.keywords.filter(keyword => 
        features2.keywords.includes(keyword)
      );
      const keywordSimilarity = features1.keywords.length > 0 ? 
        commonKeywords.length / features1.keywords.length : 0;
      score += keywordSimilarity * 0.1;
      totalChecks += 0.1;
    }
    
    return totalChecks > 0 ? score / totalChecks : 0;
  }

  // Extract basic image features (simplified)
  async extractImageFeatures(imagePath) {
    try {
      const stats = fs.statSync(imagePath);
      const imageSize = stats.size;
      const fileExtension = path.extname(imagePath).toLowerCase();
      
      // Analyze image characteristics for better matching
      const imageAnalysis = await this.analyzeImageCharacteristics(imagePath);
      
      return {
        size: imageSize,
        type: fileExtension,
        timestamp: Date.now(),
        analysis: imageAnalysis
      };
    } catch (error) {
      console.error("Error extracting image features:", error);
      return null;
    }
  }

  // Analyze image characteristics for better product matching
  async analyzeImageCharacteristics(imagePath) {
    try {
      // This is a simplified analysis - in production, you'd use computer vision
      const stats = fs.statSync(imagePath);
      const fileSize = stats.size;
      
      // Extract filename to detect brand/product from name
      const filename = path.basename(imagePath).toLowerCase();
      
      // Try to detect brand from filename (expanded and improved matching)
      const brands = [
        'apple', 'samsung', 'sony', 'nike', 'adidas', 'microsoft', 'dell', 'hp', 'hewlett', 'lenovo', 
        'asus', 'xiaomi', 'oneplus', 'oppo', 'vivo', 'realme', 'motorola', 'lg', 'huawei', 
        'acer', 'msi', 'razer', 'alienware', 'macbook', 'iphone', 'ipad'
      ];
      let detectedBrand = null;
      for (const brand of brands) {
        if (filename.includes(brand)) {
          // Normalize brand name (hp, hp-pavilion, etc. all become 'hp')
          detectedBrand = brand;
          if (brand === 'macbook' || brand === 'iphone' || brand === 'ipad') {
            detectedBrand = 'apple';
            // If iPhone detected, default category to Smartphones
            if (brand === 'iphone' && !likelyCategory) {
              likelyCategory = 'Smartphones';
              confidence = 0.95;
            }
          } else if (brand === 'hewlett') {
            detectedBrand = 'hp';
          }
          break;
        }
      }
      
      // CRITICAL: If Apple brand detected and no category set, check if it's likely iPhone
      // Apple products in database will help us determine category
      if (detectedBrand === 'apple' && !likelyCategory) {
        // Default to Smartphones for Apple (most common)
        likelyCategory = 'Smartphones';
        confidence = 0.9;
      }
      
      // Determine likely product type based on file characteristics
      let likelyProductType = 'general';
      let confidence = 0.5;
      
      // Large files might be high-quality product photos
      if (fileSize > 1000000) { // > 1MB
        likelyProductType = 'electronics';
        confidence = 0.7;
      } else if (fileSize > 500000) { // > 500KB
        likelyProductType = 'accessories';
        confidence = 0.6;
      }
      
      // File extension hints
      const ext = path.extname(imagePath).toLowerCase();
      if (ext === '.png') {
        likelyProductType = 'electronics'; // PNG often used for tech products
        confidence += 0.1;
      } else if (ext === '.jpg' || ext === '.jpeg') {
        likelyProductType = 'clothing'; // JPG often used for fashion
        confidence += 0.1;
      }
      
      // Detect category from filename keywords (expanded list)
      let likelyCategory = null;
      const categoryKeywords = {
        // Smartphones
        'smartphone': 'Smartphones',
        'phone': 'Smartphones',
        'mobile': 'Smartphones',
        'iphone': 'Smartphones',
        // Laptops
        'laptop': 'Laptops',
        'notebook': 'Laptops',
        'pc': 'Laptops',
        'computer': 'Laptops',
        'macbook': 'Laptops',
        // Accessories (high priority - must be detected accurately)
        'mouse': 'Accessories',
        'keyboard': 'Accessories',
        'mousepad': 'Accessories',
        'mouse pad': 'Accessories',
        'gaming mouse': 'Accessories',
        'gaming keyboard': 'Accessories',
        'headphone': 'Accessories',
        'earbud': 'Accessories',
        'earphone': 'Accessories',
        'watch': 'Accessories',
        'smartwatch': 'Accessories',
        'speaker': 'Accessories',
        'charger': 'Accessories',
        'cable': 'Accessories',
        'monitor': 'Accessories',
        'webcam': 'Accessories',
        'microphone': 'Accessories',
        'usb': 'Accessories',
        'hub': 'Accessories',
        // Electronics
        'camera': 'Electronics',
        'tablet': 'Electronics',
        'ipad': 'Electronics'
      };
      
      for (const [keyword, category] of Object.entries(categoryKeywords)) {
        if (filename.includes(keyword)) {
          likelyCategory = category;
          likelyProductType = 'electronics';
          confidence = 0.8;
          break;
        }
      }
      
      // Also check for HP brand specifically and default to Laptops if detected
      if (detectedBrand && detectedBrand.toLowerCase() === 'hp' && !likelyCategory) {
        likelyCategory = 'Laptops';
        confidence = 0.85;
      }
      
      // Additional category hints from file characteristics
      // If file is small-medium and PNG, might be accessories like mouse/keyboard
      if (!likelyCategory && fileSize > 100000 && fileSize < 800000 && ext === '.png') {
        // Could be accessory product photo - but don't assume, let inference handle it
        likelyProductType = 'accessories';
      }
      
      return {
        likelyProductType,
        likelyBrand: detectedBrand,
        likelyCategory: likelyCategory || this.getCategoryFromAnalysis(likelyProductType),
        confidence: Math.min(confidence, 1.0),
        fileSize,
        filename: filename, // Include filename for additional analysis
        characteristics: {
          isHighQuality: fileSize > 1000000,
          isProductPhoto: fileSize > 200000,
        }
      };
    } catch (error) {
      console.error("Error analyzing image characteristics:", error);
      return {
        likelyProductType: 'general',
        confidence: 0.5,
        characteristics: {}
      };
    }
  }

  // Get category from analysis
  getCategoryFromAnalysis(productType) {
    const categoryMapping = {
      'electronics': 'Electronics',
      'accessories': 'Accessories', 
      'clothing': 'Clothing',
      'general': 'General'
    };
    
    return categoryMapping[productType] || 'General';
  }

  // Infer category and brand from product names in database
  // This analyzes top-scoring products to determine likely category/brand
  inferCategoryFromProductNames(allProducts, topProducts = null) {
    // If top products provided, analyze those first (they're the initial matches)
    const productsToAnalyze = topProducts || allProducts.slice(0, 10);
    
    // Analyze product names to detect common patterns
    const productNameKeywords = {
      'Smartphones': ['iphone', 'samsung galaxy', 'oneplus', 'xiaomi', 'phone', 'mobile', 'smartphone', 'oppo', 'vivo', 'realme', 'pixel'],
      'Laptops': ['laptop', 'macbook', 'notebook', 'dell', 'hp pavilion', 'lenovo thinkpad', 'asus rog', 'acer', 'msi', 'gaming laptop'],
      'Accessories': ['mouse', 'keyboard', 'headphone', 'earbud', 'earphone', 'charger', 'speaker', 'webcam', 'microphone', 'monitor', 'gaming mouse', 'wireless mouse'],
      'Electronics': ['camera', 'tablet', 'ipad', 'tv', 'television', 'watch', 'smartwatch', 'fitness tracker']
    };
    
    // Check for Apple brand specifically in top products - prioritize Smartphones
    const appleProductsInTop = productsToAnalyze.filter(p => 
      p.brand?.toLowerCase().includes('apple') && 
      (p.name?.toLowerCase().includes('iphone') || p.description?.toLowerCase().includes('iphone'))
    );
    
    if (appleProductsInTop.length > 0) {
      console.log(`Found ${appleProductsInTop.length} Apple iPhone products in top matches`);
      return { brand: 'apple', category: 'Smartphones' };
    }
    
    // Analyze top products to find category hints
    const categoryHints = {};
    
    for (const product of productsToAnalyze) {
      const nameLower = (product.name || '').toLowerCase();
      const descLower = (product.description || '').toLowerCase();
      const combined = nameLower + ' ' + descLower;
      
      // Check which category keywords appear in this product
      for (const [category, keywords] of Object.entries(productNameKeywords)) {
        for (const keyword of keywords) {
          if (combined.includes(keyword)) {
            categoryHints[category] = (categoryHints[category] || 0) + 1;
            break; // Count each product only once per category
          }
        }
      }
    }
    
    // Find category with most hints
    const sortedCategoryHints = Object.entries(categoryHints)
      .sort((a, b) => b[1] - a[1]);
    
    if (sortedCategoryHints.length > 0 && sortedCategoryHints[0][1] > 0) {
      const inferredCategory = sortedCategoryHints[0][0];
      console.log(`Inferred category from product analysis: ${inferredCategory} (${sortedCategoryHints[0][1]} hints)`);
      
      // Try to infer brand from most common brand in that category from top products
      const productsInCategory = productsToAnalyze.filter(p => {
        const category = p.category?.name || p.category?.toString();
        return category === inferredCategory;
      });
      
      if (productsInCategory.length > 0) {
        const brandCounts = {};
        productsInCategory.forEach(p => {
          const brand = p.brand?.toLowerCase().trim();
          if (brand) {
            brandCounts[brand] = (brandCounts[brand] || 0) + 1;
          }
        });
        
        const inferredBrand = Object.keys(brandCounts).reduce((a, b) => 
          brandCounts[a] > brandCounts[b] ? a : b, null);
        
        return { brand: inferredBrand, category: inferredCategory };
      }
    }
    
    return { brand: null, category: null };
  }

  // Find similar products based on uploaded image
  // Algorithm:
  // 1. First tries to find exact product matches (same image file)
  // 2. If no exact match, detects brand/category from filename or infers from top matches
  // 3. Returns products matching the same brand AND category
  // 4. Falls back to general similarity if brand/category cannot be determined
  async findSimilarProducts(uploadedImagePath, limit = 10) {
    try {
      // Extract features from uploaded image
      const uploadedFeatures = await this.extractImageFeatures(uploadedImagePath);
      
      // Get all products with their features
      const allProducts = await Product.find({})
        .populate('category')
        .sort({ rating: -1, numReviews: -1 });
      
      if (allProducts.length === 0) {
        return [];
      }
      
      // Step 1: Try to find exact matches first (high similarity score > 0.7)
      const EXACT_MATCH_THRESHOLD = 0.7;
      
      // Extract detected brand and category for matching
      const detectedBrand = uploadedFeatures?.analysis?.likelyBrand;
      const detectedCategory = uploadedFeatures?.analysis?.likelyCategory;
      
      console.log(`Visual Search Analysis - Detected Brand: ${detectedBrand || 'None'}, Detected Category: ${detectedCategory || 'None'}`);
      
      // Calculate similarity for each product with improved algorithm
      const productsWithSimilarity = allProducts.map(product => {
        const productFeatures = this.extractSimpleFeatures(product);
        const productBrand = product.brand?.toLowerCase().trim();
        const productCategory = product.category?.name || product.category?.toString();
        
        // Calculate similarity based on multiple factors with better weights
        let similarity = 0;
        let factors = 0;
        
        // CRITICAL: Category match MUST come first and be strict (60% weight)
        // If category is detected and doesn't match, product should be heavily penalized
        let categoryMatch = 0;
        if (detectedCategory && productCategory) {
          // Exact category match - CRITICAL
          if (productCategory === detectedCategory) {
            categoryMatch = 1.0;
          } 
          // Partial category match
          else if (productCategory.toLowerCase().includes(detectedCategory.toLowerCase()) ||
                   detectedCategory.toLowerCase().includes(productCategory.toLowerCase())) {
            categoryMatch = 0.8;
          } else {
            // Category detected but product doesn't match - HEAVY PENALTY
            // This prevents showing MacBook when mouse is uploaded
            categoryMatch = -0.5; // Negative penalty for wrong category
          }
        } else if (!detectedCategory) {
          // If no category detected, give small weight to popular categories
          categoryMatch = product.category ? this.getCategoryWeight(product.category.name) * 0.2 : 0;
        } else {
          categoryMatch = -0.3; // Category detected but product doesn't match - penalty
        }
        similarity += categoryMatch * 0.6; // Category is MOST IMPORTANT
        factors += 0.6;
        
        // Factor 2: Brand match - 30% weight (less important than category)
        let brandMatch = 0;
        if (detectedBrand && productBrand) {
          // Exact match
          if (productBrand === detectedBrand.toLowerCase().trim()) {
            brandMatch = 1.0;
          } 
          // Partial match (e.g., "hp-pavilion" matches "hp")
          else if (productBrand.includes(detectedBrand.toLowerCase().trim()) || 
                   detectedBrand.toLowerCase().trim().includes(productBrand)) {
            brandMatch = 0.9;
          } else {
            brandMatch = 0; // No match if brand detected but doesn't match
          }
        } else if (!detectedBrand) {
          // If no brand detected, give small weight to popular brands
          brandMatch = this.calculateBrandSimilarity(product.brand) * 0.2;
        } else {
          brandMatch = 0; // Brand detected but product doesn't match
        }
        similarity += brandMatch * 0.3;
        factors += 0.3;
        
        // Factor 3: Image filename/URL similarity (check if same product) - 15% weight
        const filenameMatch = this.calculateFilenameSimilarity(uploadedImagePath, product);
        similarity += filenameMatch * 0.15;
        factors += 0.15;
        
        // Factor 4: Image analysis match (category/type) - 5% weight
        if (uploadedFeatures && uploadedFeatures.analysis) {
          const imageMatch = this.calculateImageMatch(uploadedFeatures.analysis, product);
          similarity += imageMatch * 0.05;
          factors += 0.05;
        }
        
        // Normalize similarity score (but ensure category mismatches are penalized)
        let finalSimilarity = factors > 0 ? similarity / factors : 0.5;
        
        // Apply additional penalty if category was detected but doesn't match
        if (detectedCategory && productCategory && productCategory !== detectedCategory) {
          finalSimilarity = Math.max(0.05, finalSimilarity * 0.3); // Heavy penalty - reduce to 30% of score
        }
        
        // Determine match type - prioritize category matches
        let matchType = 'similar';
        
        // Category mismatch - mark as incompatible
        if (detectedCategory && productCategory && productCategory !== detectedCategory) {
          matchType = 'wrong_category'; // This will be filtered out
        }
        // Exact match (high similarity)
        else if (finalSimilarity >= EXACT_MATCH_THRESHOLD) {
          matchType = 'exact';
        } 
        // Exact brand and category match
        else if (detectedBrand && productBrand === detectedBrand.toLowerCase().trim() && 
                   detectedCategory && productCategory === detectedCategory) {
          matchType = 'exact_brand_category';
        } 
        // Same category (most important when category is detected)
        else if (detectedCategory && productCategory === detectedCategory) {
          matchType = 'same_category';
        }
        // Same brand
        else if (detectedBrand && productBrand === detectedBrand.toLowerCase().trim()) {
          matchType = 'same_brand';
        } 
        // Same brand and category
        else if (brandMatch > 0.8 && categoryMatch > 0.5) {
          matchType = 'same_brand_category';
        }
        
        return {
          ...product.toObject(),
          similarity: Math.min(Math.max(finalSimilarity, 0.1), 1.0),
          confidence: Math.round(Math.min(Math.max(finalSimilarity, 0.1), 1.0) * 100),
          matchType: matchType,
          brandMatch: brandMatch,
          categoryMatch: categoryMatch
        };
      });
      
      // CRITICAL FIX: If category was detected, ONLY show products from that category
      let validProducts;
      if (detectedCategory) {
        // If category detected, STRICTLY filter to ONLY products from that category
        validProducts = productsWithSimilarity.filter(p => {
          const pCategory = p.category?.name || p.category?.toString();
          return pCategory === detectedCategory;
        });
        console.log(`Category detected: ${detectedCategory}. Showing ONLY products from this category. Filtered out ${productsWithSimilarity.length - validProducts.length} wrong-category products`);
        
        // If no products found in detected category, try to find products anyway (fallback)
        if (validProducts.length === 0) {
          console.log(`WARNING: No products found in detected category ${detectedCategory}. Using all products as fallback.`);
          validProducts = productsWithSimilarity.filter(p => p.matchType !== 'wrong_category');
        }
      } else {
        // If no category detected, filter out wrong_category matches
        validProducts = productsWithSimilarity.filter(p => p.matchType !== 'wrong_category');
      }
      
      const sortedProducts = validProducts
        .sort((a, b) => {
          // Priority order: exact > exact_brand_category > same_category > same_brand_category > same_brand > similar
          // NOTE: same_category is now higher priority than same_brand
          const priorityOrder = {
            'exact': 6,
            'exact_brand_category': 5,
            'same_category': 4, // Category match is more important than brand
            'same_brand_category': 3,
            'same_brand': 2,
            'similar': 1,
            'wrong_category': -1 // Should be filtered, but just in case
          };
          
          const aPriority = priorityOrder[a.matchType] || 0;
          const bPriority = priorityOrder[b.matchType] || 0;
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority; // Higher priority first
          }
          
          // If same priority, sort by similarity score
          return b.similarity - a.similarity;
        });
      
      // Check if we have exact matches
      const exactMatches = sortedProducts.filter(p => p.matchType === 'exact');
      
      if (exactMatches.length > 0) {
        // Return exact matches first
        console.log(`Found ${exactMatches.length} exact matches`);
        return exactMatches.slice(0, limit);
      }
      
      // Step 2: No exact matches - find products with same brand and category
      // CRITICAL: If brand is detected, show ONLY same brand products
      if (detectedBrand) {
        console.log(`Brand detected: ${detectedBrand}. Showing ONLY products from this brand.`);
        
        // Filter products by brand ONLY
        const sameBrandProducts = allProducts
          .filter(product => {
            const productBrand = product.brand?.toLowerCase().trim();
            return productBrand === detectedBrand.toLowerCase().trim();
          })
          .map(product => {
            const productCategory = product.category?.name || product.category?.toString();
            let matchScore = 0.9;
            let matchType = 'same_brand';
            
            // Higher score if category also matches (if category was detected)
            if (detectedCategory && productCategory === detectedCategory) {
              matchScore = 0.95;
              matchType = 'exact_brand_category';
            }
            
            return {
              ...product.toObject(),
              similarity: matchScore,
              confidence: Math.round(matchScore * 100),
              matchType: matchType
            };
          })
          .sort((a, b) => {
            // Prioritize products with matching category if category was detected
            if (detectedCategory) {
              const aCategory = a.category?.name || a.category?.toString();
              const bCategory = b.category?.name || b.category?.toString();
              if (aCategory === detectedCategory && bCategory !== detectedCategory) return -1;
              if (bCategory === detectedCategory && aCategory !== detectedCategory) return 1;
            }
            return b.similarity - a.similarity;
          });
        
        if (sameBrandProducts.length > 0) {
          console.log(`Found ${sameBrandProducts.length} products from brand: ${detectedBrand}`);
          return sameBrandProducts.slice(0, limit);
        } else {
          console.log(`No products found for brand: ${detectedBrand}. Falling back to category-only search.`);
        }
      }
      
      // Strategy A: Use detected brand/category from filename analysis (if brand-only didn't work)
      if (detectedBrand || detectedCategory) {
        console.log(`Using detected brand/category: Brand=${detectedBrand || 'N/A'}, Category=${detectedCategory || 'N/A'}`);
        // Find products matching detected brand and/or category
        const sameBrandCategory = allProducts
          .filter(product => {
            const productBrand = product.brand?.toLowerCase().trim();
            const productCategory = product.category?.name || product.category?.toString();
            
            let brandMatch = false;
            let categoryMatch = false;
            
            if (detectedBrand) {
              brandMatch = productBrand === detectedBrand.toLowerCase().trim();
            }
            
            if (detectedCategory) {
              categoryMatch = productCategory === detectedCategory || 
                             (productCategory && productCategory.toLowerCase().includes(detectedCategory.toLowerCase()));
            }
            
            // CRITICAL: If category is detected, MUST match category (don't show wrong category)
            // Return products that match category first, then brand
            if (detectedCategory) {
              return categoryMatch; // Must match category if detected
            }
            // If only brand detected, return brand matches
            if (detectedBrand && !detectedCategory) {
              return brandMatch;
            }
            // Both detected - prefer both match, but category is required
            return (brandMatch && categoryMatch) || categoryMatch;
          })
          .map(product => {
            const productBrand = product.brand?.toLowerCase();
            const productCategory = product.category?.name || product.category?.toString();
            
            let matchScore = 0.75;
            let matchType = 'same_brand_category';
            
            // Higher score if both brand and category match
            if (detectedBrand && productBrand === detectedBrand.toLowerCase() &&
                detectedCategory && productCategory === detectedCategory) {
              matchScore = 0.9;
              matchType = 'exact_brand_category';
            } else if (detectedBrand && productBrand === detectedBrand.toLowerCase()) {
              matchScore = 0.8;
              matchType = 'same_brand';
            } else if (detectedCategory && productCategory === detectedCategory) {
              matchScore = 0.75;
              matchType = 'same_category';
            }
            
            return {
              ...product.toObject(),
              similarity: matchScore,
              confidence: Math.round(matchScore * 100),
              matchType: matchType
            };
          })
          .sort((a, b) => {
            // Prioritize exact brand+category matches
            if (a.matchType === 'exact_brand_category' && b.matchType !== 'exact_brand_category') return -1;
            if (b.matchType === 'exact_brand_category' && a.matchType !== 'exact_brand_category') return 1;
            // Then same brand
            if (a.matchType === 'same_brand' && b.matchType !== 'same_brand') return -1;
            if (b.matchType === 'same_brand' && a.matchType !== 'same_brand') return 1;
            // Finally by similarity
            return b.similarity - a.similarity;
          });
        
        if (sameBrandCategory.length > 0) {
          console.log(`No exact match found. Showing ${sameBrandCategory.length} products with same brand/category (Brand: ${detectedBrand || 'N/A'}, Category: ${detectedCategory || 'N/A'})`);
          return sameBrandCategory.slice(0, limit);
        }
      }
      
      // Strategy B: If no brand/category detected from filename, analyze product database
      // CRITICAL: Check database for brand-specific category mapping FIRST
      if (detectedBrand && !detectedCategory) {
        // Brand-specific category defaults
        const brandCategoryMap = {
          'apple': 'Smartphones', // Apple is most commonly smartphones
          'samsung': 'Smartphones',
          'xiaomi': 'Smartphones',
          'oneplus': 'Smartphones',
          'oppo': 'Smartphones',
          'vivo': 'Smartphones',
          'hp': 'Laptops',
          'dell': 'Laptops',
          'lenovo': 'Laptops',
          'asus': 'Laptops',
          'acer': 'Laptops',
          'razer': 'Accessories',
          'logitech': 'Accessories'
        };
        
        const defaultCategory = brandCategoryMap[detectedBrand.toLowerCase()];
        if (defaultCategory) {
          console.log(`Detected brand ${detectedBrand}, defaulting to category: ${defaultCategory}`);
          detectedCategory = defaultCategory;
          
          // Use this detected category to filter products
          const sameCategoryProducts = allProducts
            .filter(product => {
              const productCategory = product.category?.name || product.category?.toString();
              return productCategory === defaultCategory;
            })
            .map(product => {
              const productBrand = product.brand?.toLowerCase().trim();
              let matchScore = 0.85;
              let matchType = 'same_category';
              
              // Higher score if brand also matches
              if (productBrand === detectedBrand.toLowerCase().trim()) {
                matchScore = 0.95;
                matchType = 'exact_brand_category';
              }
              
              return {
                ...product.toObject(),
                similarity: matchScore,
                confidence: Math.round(matchScore * 100),
                matchType: matchType
              };
            })
            .sort((a, b) => {
              if (a.matchType === 'exact_brand_category' && b.matchType !== 'exact_brand_category') return -1;
              if (b.matchType === 'exact_brand_category' && a.matchType !== 'exact_brand_category') return 1;
              return b.similarity - a.similarity;
            });
          
          if (sameCategoryProducts.length > 0) {
            console.log(`Using brand-category mapping. Showing ${sameCategoryProducts.length} products from ${defaultCategory} category`);
            return sameCategoryProducts.slice(0, limit);
          }
        }
      }
      
      // Strategy B1: Analyze top matches for category hints
      const topProductsForAnalysis = sortedProducts.slice(0, 10);
      let inferredFromProductNames = this.inferCategoryFromProductNames(allProducts, topProductsForAnalysis);
      
      // Strategy B2: Use product name analysis if available
      if (inferredFromProductNames.category) {
        console.log(`Inferred category from product database analysis: ${inferredFromProductNames.category}`);
        const inferredCategory = inferredFromProductNames.category;
        const inferredBrand = inferredFromProductNames.brand || detectedBrand;
        
        // CRITICAL: Check if inferred category makes sense
        // If Apple brand detected, prioritize Smartphones
        let finalInferredCategory = inferredCategory;
        if (detectedBrand && detectedBrand.toLowerCase() === 'apple' && inferredCategory !== 'Smartphones') {
          console.log(`Apple brand detected but inferred category is ${inferredCategory}. Overriding to Smartphones.`);
          finalInferredCategory = 'Smartphones';
        }
        
        const sameCategoryProducts = allProducts
          .filter(product => {
            const productCategory = product.category?.name || product.category?.toString();
            return productCategory === finalInferredCategory;
          })
          .map(product => {
            const productBrand = product.brand?.toLowerCase().trim();
            let matchScore = 0.8;
            let matchType = 'same_category';
            
            // Higher score if brand also matches
            if (inferredBrand && productBrand === inferredBrand.toLowerCase().trim()) {
              matchScore = 0.95;
              matchType = 'exact_brand_category';
            }
            
            return {
              ...product.toObject(),
              similarity: matchScore,
              confidence: Math.round(matchScore * 100),
              matchType: matchType
            };
          })
          .sort((a, b) => {
            if (a.matchType === 'exact_brand_category' && b.matchType !== 'exact_brand_category') return -1;
            if (b.matchType === 'exact_brand_category' && a.matchType !== 'exact_brand_category') return 1;
            return b.similarity - a.similarity;
          });
        
        if (sameCategoryProducts.length > 0) {
          console.log(`Using product name analysis. Showing ${sameCategoryProducts.length} products from ${finalInferredCategory} category`);
          return sameCategoryProducts.slice(0, limit);
        }
      }
      
      // Strategy B2: If product name analysis didn't work, infer from top matches
      // But be smarter - only use if matches are consistent
      const topMatches = sortedProducts.slice(0, 5);
      
      if (topMatches.length > 0) {
        // Count brand and category occurrences in top matches
        const brandCounts = {};
        const categoryCounts = {};
        
        topMatches.forEach(product => {
          const brand = product.brand?.toLowerCase().trim();
          const category = product.category?.name || product.category?.toString();
          
          if (brand) {
            brandCounts[brand] = (brandCounts[brand] || 0) + 1;
          }
          if (category) {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          }
        });
        
        // Get most common brand and category
        const inferredBrand = Object.keys(brandCounts).reduce((a, b) => 
          brandCounts[a] > brandCounts[b] ? a : b, Object.keys(brandCounts)[0]) || null;
        const inferredCategory = Object.keys(categoryCounts).reduce((a, b) => 
          categoryCounts[a] > categoryCounts[b] ? a : b, Object.keys(categoryCounts)[0]) || null;
        
        // Only trust inference if at least 3 out of 5 matches have same category (consistency check)
        const categoryThreshold = Math.ceil(topMatches.length * 0.6); // 60% threshold
        const categoryCount = categoryCounts[inferredCategory] || 0;
        
        console.log(`Inferred from top matches - Brand: ${inferredBrand || 'N/A'}, Category: ${inferredCategory || 'N/A'} (appears ${categoryCount} times)`);
        
        // Only use inferred category if it's consistent (appears in majority of top matches)
        if (inferredCategory && categoryCount >= categoryThreshold && (inferredBrand || inferredCategory)) {
          // Find products matching inferred brand and/or category
          const sameBrandCategory = allProducts
            .filter(product => {
              const productBrand = product.brand?.toLowerCase().trim();
              const productCategory = product.category?.name || product.category?.toString();
              
              let brandMatch = false;
              let categoryMatch = false;
              
              if (inferredBrand) {
                brandMatch = productBrand === inferredBrand;
              }
              
              if (inferredCategory) {
                categoryMatch = productCategory === inferredCategory;
              }
              
              // CRITICAL: Category must match if detected - no exceptions
              // Return products that match category first
              if (inferredCategory) {
                return categoryMatch; // Must match category
              }
              // If only brand inferred, return brand matches
              if (inferredBrand && !inferredCategory) {
                return brandMatch;
              }
              // Both inferred - prefer both match, but category is required
              return (brandMatch && categoryMatch) || categoryMatch;
            })
            .map(product => {
              const productBrand = product.brand?.toLowerCase().trim();
              const productCategory = product.category?.name || product.category?.toString();
              
              let matchScore = 0.75;
              let matchType = 'same_brand_category';
              
              // Higher score if both brand and category match
              if (inferredBrand && productBrand === inferredBrand &&
                  inferredCategory && productCategory === inferredCategory) {
                matchScore = 0.9;
                matchType = 'exact_brand_category';
              } else if (inferredBrand && productBrand === inferredBrand) {
                matchScore = 0.8;
                matchType = 'same_brand';
              } else if (inferredCategory && productCategory === inferredCategory) {
                matchScore = 0.75;
                matchType = 'same_category';
              }
              
              return {
                ...product.toObject(),
                similarity: matchScore,
                confidence: Math.round(matchScore * 100),
                matchType: matchType
              };
            })
            .sort((a, b) => {
              // Prioritize exact brand+category matches
              if (a.matchType === 'exact_brand_category' && b.matchType !== 'exact_brand_category') return -1;
              if (b.matchType === 'exact_brand_category' && a.matchType !== 'exact_brand_category') return 1;
              // Then same brand
              if (a.matchType === 'same_brand' && b.matchType !== 'same_brand') return -1;
              if (b.matchType === 'same_brand' && a.matchType !== 'same_brand') return 1;
              // Finally by similarity
              return b.similarity - a.similarity;
            });
          
          if (sameBrandCategory.length > 0) {
            console.log(`Using inferred brand/category. Showing ${sameBrandCategory.length} products`);
            return sameBrandCategory.slice(0, limit);
          }
        }
        
        // Strategy C: Use top match's brand and category as fallback (only if category is consistent)
        const topMatch = topMatches[0];
        if (topMatch && topMatch.brand && topMatch.category) {
          const matchBrand = topMatch.brand?.toLowerCase().trim();
          const matchCategory = topMatch.category?.name || topMatch.category?.toString();
          
          // Verify that this category appears in at least 2 of top 3 matches
          const top3Matches = topMatches.slice(0, 3);
          const matchingCategoryCount = top3Matches.filter(p => {
            const pCategory = p.category?.name || p.category?.toString();
            return pCategory === matchCategory;
          }).length;
          
          if (matchingCategoryCount >= 2) {
            const sameBrandCategory = allProducts
              .filter(product => {
                const productBrand = product.brand?.toLowerCase().trim();
                const productCategory = product.category?.name || product.category?.toString();
                
                return productBrand === matchBrand && 
                       productCategory === matchCategory &&
                       product._id.toString() !== topMatch._id.toString();
              })
              .map(product => ({
                ...product.toObject(),
                similarity: 0.85,
                confidence: 85,
                matchType: 'same_brand_category'
              }));
            
            // Combine top match with same brand/category products
            const combinedResults = [topMatch, ...sameBrandCategory];
            
            // Remove duplicates and limit results
            const uniqueResults = combinedResults.filter((product, index, self) =>
              index === self.findIndex(p => p._id.toString() === product._id.toString())
            );
            
            console.log(`Using top match's brand/category. Showing ${uniqueResults.length} products (Brand: ${matchBrand}, Category: ${matchCategory})`);
            return uniqueResults.slice(0, limit);
          } else {
            console.log(`Category ${matchCategory} not consistent in top matches, skipping Strategy C`);
          }
        }
      }
      
      // Step 3: Fallback to general similarity
      return sortedProducts.slice(0, limit);
      
    } catch (error) {
      console.error("Error finding similar products:", error);
      throw error;
    }
  }
  
  // Calculate filename similarity (check if same product)
  calculateFilenameSimilarity(uploadedPath, product) {
    try {
      // Extract filename from paths
      const uploadedFilename = path.basename(uploadedPath).toLowerCase();
      const productImageUrl = product.image || '';
      const productFilename = productImageUrl.split('/').pop().toLowerCase();
      
      // Check for exact filename match
      if (uploadedFilename === productFilename) {
        return 1.0;
      }
      
      // Check for similar filenames (remove timestamps/hashes)
      const uploadedBase = uploadedFilename.replace(/[_-]\d+|[_-][a-f0-9]+/gi, '').replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
      const productBase = productFilename.replace(/[_-]\d+|[_-][a-f0-9]+/gi, '').replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
      
      if (uploadedBase === productBase || uploadedBase.includes(productBase) || productBase.includes(uploadedBase)) {
        return 0.9;
      }
      
      // Check if product image URL matches uploaded path pattern
      if (productImageUrl.includes(uploadedFilename.split('.')[0]) || 
          uploadedFilename.includes(productFilename.split('.')[0])) {
        return 0.8;
      }
      
      return 0.1; // Low similarity if no filename match
    } catch (error) {
      return 0.1;
    }
  }
  
  // Calculate brand similarity
  calculateBrandSimilarity(brand) {
    if (!brand) return 0.3;
    const normalizedBrand = brand.toLowerCase().trim();
    // Popular brands get higher weight
    const popularBrands = ['apple', 'samsung', 'sony', 'nike', 'adidas', 'microsoft', 'dell', 'hp', 'lenovo', 'asus'];
    if (popularBrands.includes(normalizedBrand)) {
      return 0.8;
    }
    return 0.5;
  }

  // Get category weight based on popularity
  getCategoryWeight(categoryName) {
    const categoryWeights = {
      'electronics': 0.9,
      'smartphones': 0.95,
      'laptops': 0.9,
      'accessories': 0.8,
      'clothing': 0.7,
      'shoes': 0.7,
      'books': 0.6,
      'home': 0.8,
      'sports': 0.7,
      'beauty': 0.8
    };
    
    return categoryWeights[categoryName?.toLowerCase()] || 0.5;
  }

  // Calculate price similarity (prefer mid-range products)
  calculatePriceSimilarity(price) {
    // Prefer products in the 1000-50000 range (good quality, not too cheap/expensive)
    if (price >= 1000 && price <= 50000) {
      return 0.9;
    } else if (price >= 500 && price <= 100000) {
      return 0.7;
    } else {
      return 0.4;
    }
  }

  // Get brand weight based on brand recognition
  getBrandWeight(brand) {
    const brandWeights = {
      'apple': 0.95,
      'samsung': 0.9,
      'sony': 0.9,
      'nike': 0.9,
      'adidas': 0.9,
      'microsoft': 0.85,
      'dell': 0.8,
      'hp': 0.8,
      'lenovo': 0.8,
      'asus': 0.8
    };
    
    return brandWeights[brand?.toLowerCase()] || 0.6;
  }

  // Calculate keyword similarity in product names
  calculateKeywordSimilarity(productName) {
    const commonKeywords = ['pro', 'max', 'ultra', 'premium', 'advanced', 'smart', 'wireless', 'bluetooth'];
    const nameWords = productName.toLowerCase().split(' ');
    
    const matchingKeywords = commonKeywords.filter(keyword => 
      nameWords.some(word => word.includes(keyword))
    );
    
    return Math.min(matchingKeywords.length / 3, 1); // Max 1.0
  }

  // Calculate image match based on analysis
  calculateImageMatch(imageAnalysis, product) {
    let matchScore = 0;
    
    // Match based on likely product type
    if (imageAnalysis.likelyProductType === 'electronics' && 
        product.category && 
        ['Electronics', 'Smartphones', 'Laptops'].includes(product.category.name)) {
      matchScore += 0.4;
    } else if (imageAnalysis.likelyProductType === 'clothing' && 
               product.category && 
               ['Clothing', 'Shoes'].includes(product.category.name)) {
      matchScore += 0.4;
    } else if (imageAnalysis.likelyProductType === 'accessories' && 
               product.category && 
               ['Accessories', 'Electronics'].includes(product.category.name)) {
      matchScore += 0.4;
    }
    
    // Match based on image quality and product quality
    if (imageAnalysis.characteristics.isHighQuality && product.rating > 4) {
      matchScore += 0.3;
    }
    
    // Match based on confidence level
    matchScore += imageAnalysis.confidence * 0.3;
    
    return Math.min(matchScore, 1.0);
  }
}

// Create visual search engine instance
const visualSearchEngine = new VisualSearchEngine();

// Upload middleware
export const uploadImage = upload.single('image');

// Visual search endpoint
export const visualSearch = asyncHandler(async (req, res) => {
  try {
    console.log("Visual search request received");
    console.log("Request file:", req.file);
    console.log("Request body:", req.body);
    
    if (!req.file) {
      console.log("No file provided in request");
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    const imagePath = req.file.path;
    console.log("Image path:", imagePath);
    
    // Find similar products
    const similarProducts = await visualSearchEngine.findSimilarProducts(imagePath, 12);
    console.log("Found similar products:", similarProducts.length);
    
    // Clean up uploaded file
    fs.unlinkSync(imagePath);
    
    res.json({
      success: true,
      message: `Found ${similarProducts.length} similar products`,
      products: similarProducts,
      searchType: "visual"
    });
    
  } catch (error) {
    console.error("Visual search error:", error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: "Error processing image. Please try again.",
      error: error.message
    });
  }
});

// Get visual search suggestions
export const getVisualSearchSuggestions = asyncHandler(async (req, res) => {
  const suggestions = [
    "📱 Upload a smartphone photo to find similar phones",
    "💻 Take a picture of a laptop to find matching laptops", 
    "👕 Snap a clothing item to find similar styles",
    "🎧 Upload headphone images to find matching audio gear",
    "⌚ Take a watch photo to find similar timepieces",
    "📷 Upload camera images to find matching photography gear",
    "🏃‍♂️ Snap sports equipment to find similar athletic gear",
    "🎮 Upload gaming accessories to find matching gaming products"
  ];
  
  res.json({
    success: true,
    suggestions: suggestions
  });
});

// Update product features (for when new products are added)
export const updateProductFeatures = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    const features = visualSearchEngine.extractSimpleFeatures(product);
    visualSearchEngine.productFeatures.set(productId, {
      productId: product._id,
      features: features,
      metadata: {
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price
      }
    });
    
    res.json({
      success: true,
      message: "Product features updated successfully"
    });
    
  } catch (error) {
    console.error("Error updating product features:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product features",
      error: error.message
    });
  }
});