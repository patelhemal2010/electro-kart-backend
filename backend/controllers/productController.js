import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );

    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    let keyword = {};
    if (req.query.keyword) {
      // Search in product name, brand, and description
      keyword = {
        $or: [
          { name: { $regex: req.query.keyword, $options: "i" } },
          { brand: { $regex: req.query.keyword, $options: "i" } },
          { description: { $regex: req.query.keyword, $options: "i" } }
        ]
      };
    }

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .populate("category")
      .limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .sort({ createdAt: -1 }); // newest first

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const searchProducts = asyncHandler(async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.json({ products: [] });
    }

    const Category = (await import("../models/categoryModel.js")).default;
    
    // Debug: Log all available categories
    const allCategories = await Category.find({});
    console.log('Available categories in database:', allCategories.map(cat => cat.name));
    
    // Create a mapping from frontend category names to database category names and product filters
    const categoryMapping = {
      'Smartphones': {
        categories: ['Mobiles', 'mobiles', 'Mobile', 'mobile', 'Smartphones', 'smartphones', 'Smartphone', 'smartphone', 'Phone', 'phone'],
        productFilters: ['phone', 'mobile', 'smartphone', 'iphone', 'samsung', 'oneplus', 'xiaomi', 'huawei']
      },
      'Laptops': {
        categories: ['Laptops', 'laptops', 'Laptop', 'laptop', 'Computer', 'computer', 'Notebook', 'notebook'],
        productFilters: ['laptop', 'macbook', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'computer', 'notebook']
      },
      'Headphones': {
        categories: ['Electronics', 'electronics'],
        productFilters: ['headphone', 'earphone', 'earbud', 'airpod', 'headset', 'wh-1000xm', 'wireless headphone', 'noise cancelling']
      },
      'Cameras': {
        categories: ['Electronics', 'electronics'],
        productFilters: ['camera', 'dslr', 'mirrorless', 'photography', 'lens', 'zoom', 'digital camera', 'photo']
      },
      'Gaming': {
        categories: ['Electronics', 'electronics'],
        productFilters: ['gaming', 'game', 'console', 'playstation', 'xbox', 'nintendo', 'controller', 'gaming laptop']
      },
      'Accessories': {
        categories: ['Accessories', 'accessories', 'Accessory', 'accessory'],
        productFilters: ['accessory', 'gadget', 'peripheral', 'mouse', 'keyboard', 'monitor', 'speaker', 'charger']
      }
    };

    let products = [];
    let foundCategory = null;

    // First, try to find exact category matches using the mapping
    for (const [frontendName, mapping] of Object.entries(categoryMapping)) {
      if (keyword === frontendName) {
        // Find categories that match any of the possible names
        const matchingCategories = await Category.find({
          name: { $in: mapping.categories }
        });
        
        if (matchingCategories.length > 0) {
          foundCategory = matchingCategories[0];
          const categoryIds = matchingCategories.map(cat => cat._id);
          
          // For Electronics category, we need to filter by product name/description as well
          if (mapping.categories.includes('Electronics')) {
            // Create more precise regex patterns for product filtering
            const productFilters = mapping.productFilters.map(filter => ({
              $or: [
                { name: { $regex: filter, $options: "i" } },
                { description: { $regex: filter, $options: "i" } }
              ]
            }));
            
            products = await Product.find({
              category: { $in: categoryIds },
              $or: productFilters
            })
            .populate('category')
            .sort({ createdAt: -1 });
          } else {
            // For specific categories like Laptops, Mobiles, Accessories
            products = await Product.find({
              category: { $in: categoryIds }
            })
            .populate('category')
            .sort({ createdAt: -1 });
          }
          
          console.log(`Category-based search for "${keyword}": Found ${products.length} products in category "${foundCategory.name}"`);
          break;
        }
      }
    }

    // If no category found, try direct category name search
    if (products.length === 0) {
      const matchingCategories = await Category.find({
        name: { $regex: keyword, $options: "i" }
      });

      if (matchingCategories.length > 0) {
        const categoryIds = matchingCategories.map(cat => cat._id);
        products = await Product.find({
          category: { $in: categoryIds }
        })
        .populate('category')
        .sort({ createdAt: -1 });
        
        console.log(`Direct category search for "${keyword}": Found ${products.length} products in ${matchingCategories.length} categories`);
      }
    }

    // If still no products found, fallback to keyword search
    if (products.length === 0) {
      const keywordMapping = {
        'phone': ['smartphones', 'mobile', 'mobile phone', 'cell phone'],
        'laptop': ['laptops', 'computer', 'notebook', 'pc'],
        'headphone': ['headphones', 'earphones', 'earbuds', 'airpods'],
        'tablet': ['tablets', 'ipad', 'android tablet'],
        'camera': ['cameras', 'dslr', 'mirrorless', 'digital camera'],
        'watch': ['watches', 'smartwatch', 'apple watch', 'samsung watch'],
        'speaker': ['speakers', 'bluetooth speaker', 'wireless speaker'],
        'gaming': ['gaming laptop', 'gaming pc', 'gaming console', 'playstation', 'xbox'],
        'tv': ['television', 'smart tv', 'led tv', 'oled tv'],
        'monitor': ['monitors', 'display', 'screen', 'computer monitor'],
        'accessory': ['accessories', 'gadgets', 'peripherals']
      };

      // Create search terms array
      let searchTerms = [keyword.toLowerCase()];
      
      // Add mapped keywords if found
      for (const [key, synonyms] of Object.entries(keywordMapping)) {
        if (keyword.toLowerCase().includes(key)) {
          searchTerms = [...searchTerms, ...synonyms];
        }
      }

      // Remove duplicates
      searchTerms = [...new Set(searchTerms)];
      console.log(`Keyword-based search for "${keyword}" -> Search terms:`, searchTerms);

      // Create regex patterns for all search terms
      const searchPatterns = searchTerms.map(term => ({
        $or: [
          { name: { $regex: term, $options: "i" } },
          { brand: { $regex: term, $options: "i" } },
          { description: { $regex: term, $options: "i" } }
        ]
      }));

      // Search in product fields with expanded terms
      products = await Product.find({
        $or: searchPatterns
      })
      .populate('category')
      .sort({ createdAt: -1 });

      console.log(`Keyword search for "${keyword}": Found ${products.length} products`);
    }

    // Format the response
    const productsWithCategories = products.map((product) => {
      return {
        ...product.toObject(),
        category: product.category ? { 
          _id: product.category._id, 
          name: product.category.name 
        } : null
      };
    });

    res.json({ products: productsWithCategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  searchProducts,
};

// Recommendations: collaborative + content-based (via query params)
export const getRecommendations = asyncHandler(async (req, res) => {
  const { productId, userId } = req.query;
  const limit = Number(req.query.limit) || 8;

  // 1) Content-based by category of provided productId
  let contentCandidates = [];
  if (productId) {
    const base = await Product.findById(productId);
    if (base) {
      contentCandidates = await Product.find({
        _id: { $ne: base._id },
        category: base.category,
      })
        .sort({ rating: -1 })
        .limit(limit * 2);
    }
  }

  // 2) Collaborative: orders that include user's purchased products
  let collaborativeCandidates = [];
  if (userId) {
    const myOrders = await Order.find({ user: userId }).select(
      "orderItems.product"
    );
    const myProductIds = new Set(
      myOrders
        .flatMap((o) => o.orderItems.map((i) => i.product?.toString()))
        .filter(Boolean)
    );

    if (myProductIds.size > 0) {
      const alsoBoughtOrders = await Order.find({
        "orderItems.product": { $in: Array.from(myProductIds) },
      }).select("orderItems.product");

      const counts = new Map();
      for (const order of alsoBoughtOrders) {
        for (const item of order.orderItems) {
          const pid = item.product?.toString();
          if (!pid || myProductIds.has(pid)) continue;
          counts.set(pid, (counts.get(pid) || 0) + 1);
        }
      }

      const sortedIds = Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit * 2)
        .map(([pid]) => pid);

      if (sortedIds.length) {
        collaborativeCandidates = await Product.find({ _id: { $in: sortedIds } });
      }
    }
  }

  // Merge, de-duplicate, and limit
  const byId = new Map();
  for (const p of [...collaborativeCandidates, ...contentCandidates]) {
    byId.set(p._id.toString(), p);
  }
  let finalList = Array.from(byId.values()).slice(0, limit);

  // Fallback to top-rated if not enough
  if (finalList.length < limit) {
    const need = limit - finalList.length;
    const top = await Product.find({})
      .sort({ rating: -1 })
      .limit(need);
    const have = new Set(finalList.map((p) => p._id.toString()));
    finalList = [...finalList, ...top.filter((p) => !have.has(p._id.toString()))];
  }

  res.json(finalList);
});
