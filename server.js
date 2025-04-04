const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Environment variables
const BRAVE_API_KEY = process.env.BRAVE_API_KEY || "BSA237zJk_H-4q4N4DiS7aluc5tgSJ6";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyB736r2Xjm6d8k_P39WFPwevaap8yfSNdY";

// Search products using Brave Search API
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
      params: {
        q: query
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Brave Search API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

// Compare products using Gemini AI
// In server.js, find the compare endpoint and update the prompt
app.post('/api/compare', async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products) || products.length < 2) {
      return res.status(400).json({ error: 'At least two products are required for comparison' });
    }

    const prompt = `
      Create a detailed comparison between ${products.join(' and ')} with the following information:
      1. Key specifications (display, processor, RAM, storage, camera, battery)
      2. Key features comparison
      3. Performance benchmarks
      4. Camera capabilities
      5. Battery life
      6. Pricing information
      7. Pros and cons of each product
      8. Expert reviews

      Please format the response as a JSON object with the following structure:
      {
        "products": [
          {
            "name": "Product Name",
            "image": "image-placeholder",
            "price": "$XXX",
            "releaseDate": "Month Year",
            "rating": X.X,
            "reviewCount": XXX,
            "storage": ["128GB", "256GB", "512GB"],
            "description": "Short description",
            "specs": {
              "display": "Display specs",
              "processor": "Processor specs",
              "ram": "RAM amount",
              "rearCamera": "Camera specs",
              "frontCamera": "Front camera specs",
              "battery": "Battery specs",
              "charging": "Charging specs",
              "os": "Operating system",
              "dimensions": "Dimensions",
              "weight": "Weight",
              "waterResistance": "Water resistance",
              "biometrics": "Biometrics",
              "colors": "Available colors"
            }
          }
        ],
        "features": [
          {
            "category": "Display",
            "comparison": [
              {"product": "Product1", "details": "Feature details"},
              {"product": "Product2", "details": "Feature details"}
            ],
            "winner": "Product with better feature"
          },
          {
            "category": "Performance",
            "comparison": [
              {"product": "Product1", "details": "Feature details"},
              {"product": "Product2", "details": "Feature details"}
            ],
            "winner": "Product with better feature"
          },
          {
            "category": "Camera",
            "comparison": [
              {"product": "Product1", "details": "Feature details"},
              {"product": "Product2", "details": "Feature details"}
            ],
            "winner": "Product with better feature"
          },
          {
            "category": "Battery",
            "comparison": [
              {"product": "Product1", "details": "Feature details"},
              {"product": "Product2", "details": "Feature details"}
            ],
            "winner": "Product with better feature"
          },
          {
            "category": "Software",
            "comparison": [
              {"product": "Product1", "details": "Feature details"},
              {"product": "Product2", "details": "Feature details"}
            ],
            "winner": "Product with better feature"
          },
          {
            "category": "Ecosystem",
            "comparison": [
              {"product": "Product1", "details": "Feature details"},
              {"product": "Product2", "details": "Feature details"}
            ],
            "winner": "Product with better feature"
          }
        ],
        "performance": {
          "benchmarks": {
            "labels": ["Single-Core", "Multi-Core", "GPU", "AnTuTu", "Geekbench"],
            "datasets": [
              {"label": "Product1", "data": [1700, 4800, 14000, 950000, 6200]},
              {"label": "Product2", "data": [1500, 5200, 12500, 1100000, 5800]}
            ]
          },
          "batteryLife": {
            "labels": ["Web Browsing", "Video Playback", "Gaming"],
            "datasets": [
              {"label": "Product1", "data": [12, 18, 6]},
              {"label": "Product2", "data": [11, 20, 5]}
            ]
          },
          "displayQuality": {
            "labels": ["Brightness", "Color Accuracy", "Refresh Rate", "Resolution", "HDR Quality"],
            "datasets": [
              {"label": "Product1", "data": [90, 95, 85, 88, 92]},
              {"label": "Product2", "data": [95, 88, 90, 86, 94]}
            ]
          },
          "realWorld": {
            "labels": ["App Loading", "Photo Processing", "Video Export", "Web Browsing"],
            "datasets": [
              {"label": "Product1", "data": [0.8, 3.2, 15, 0.9]},
              {"label": "Product2", "data": [1.0, 2.9, 13, 1.1]}
            ]
          },
          "descriptions": [
            "Benchmark score comparison explains the differences in raw processing power.",
            "Battery life comparison in different usage scenarios.",
            "Display quality metrics comparing brightness, color accuracy, and other visual aspects.",
            "Real-world task completion times showing practical performance differences."
          ],
          "analysis": {
            "general": "Overall performance comparison between the two products.",
            "product1Strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4", "Strength 5"],
            "product2Strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4", "Strength 5"],
            "conclusion": "Final assessment of which product performs better for different use cases."
          }
        },
        "cameras": {
          "specs": [
            {"feature": "Main Camera", "product1": "Main camera specs", "product2": "Main camera specs"},
            {"feature": "Ultra-wide", "product1": "Ultra-wide specs", "product2": "Ultra-wide specs"},
            {"feature": "Telephoto", "product1": "Telephoto specs", "product2": "Telephoto specs"},
            {"feature": "Selfie Camera", "product1": "Selfie camera specs", "product2": "Selfie camera specs"},
            {"feature": "Video Recording", "product1": "Video recording specs", "product2": "Video recording specs"},
            {"feature": "Special Features", "product1": "Special camera features", "product2": "Special camera features"}
          ],
          "scores": {
            "product1": 92,
            "product2": 90
          },
          "samples": [
            {"scenario": "Daylight", "product1_desc": "Daylight photo description", "product2_desc": "Daylight photo description"},
            {"scenario": "Night", "product1_desc": "Night photo description", "product2_desc": "Night photo description"}
          ],
          "analysis": {
            "product1": ["Camera strength 1", "Camera strength 2", "Camera strength 3", "Camera strength 4", "Camera strength 5"],
            "product2": ["Camera strength 1", "Camera strength 2", "Camera strength 3", "Camera strength 4", "Camera strength 5"],
            "recommendation": "Camera recommendation based on use case."
          }
        },
        "pricing": {
          "product1": {
            "variants": [
              {"storage": "128GB", "price": "$XXX"},
              {"storage": "256GB", "price": "$XXX"}
            ],
            "deals": [
              {"retailer": "Amazon", "price": "$XXX", "savings": "$XX"},
              {"retailer": "Best Buy", "price": "$XXX", "savings": "$XX"}
            ]
          },
          "product2": {
            "variants": [
              {"storage": "128GB", "price": "$XXX"},
              {"storage": "256GB", "price": "$XXX"}
            ],
            "deals": [
              {"retailer": "Amazon", "price": "$XXX", "savings": "$XX"},
              {"retailer": "Best Buy", "price": "$XXX", "savings": "$XX"}
            ]
          }
        },
        "reviews": {
          "product1": [
            {"source": "Tech Review Site", "rating": 4.5, "comment": "Expert review comment"},
            {"source": "Tech Blogger", "rating": 4.2, "comment": "Expert review comment"}
          ],
          "product2": [
            {"source": "Tech Review Site", "rating": 4.3, "comment": "Expert review comment"},
            {"source": "Tech Blogger", "rating": 4.0, "comment": "Expert review comment"}
          ]
        }
,
        "aiRecommendation": {
          "mainText": "Detailed AI recommendation comparing the two products and providing a final verdict on which one is better for different types of users.",
          "perfectFor": [
            "You prioritize camera quality",
            "You want the best performance",
            "You prefer the iOS/Android ecosystem",
            "You need the longest battery life",
            "You want the best display"
          ],
          "alternatives": [
            "Budget is your main concern",
            "You need specific features not available",
            "You prefer a different ecosystem",
            "You need longer software support",
            "You want more customization options"
          ]
        }
      }
      
      Make sure all objects have the required fields properly filled out with realistic values for the specific products being compared. Be accurate with the specifications and features.
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract the JSON data from the response
    const generatedText = response.data.candidates[0].content.parts[0].text;
    const jsonStartIndex = generatedText.indexOf('{');
    const jsonEndIndex = generatedText.lastIndexOf('}') + 1;
    const jsonData = generatedText.substring(jsonStartIndex, jsonEndIndex);
    
    try {
      const parsedData = JSON.parse(jsonData);
      res.json(parsedData);
    } catch (parseError) {
      console.error('Error parsing JSON from Gemini response:', parseError);
      res.status(500).json({
        error: 'Failed to parse comparison data',
        rawResponse: generatedText
      });
    }
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate comparison' });
  }
});

// Popular products endpoint
app.get('/api/popular-products', async (req, res) => {
  try {
    const categories = ['smartphones', 'laptops', 'wearables'];
    const category = req.query.category || 'smartphones';
    
    if (!categories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    // Use Brave Search to get popular products
    const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
      params: {
        q: `best ${category} ${new Date().getFullYear()}`
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    });
    
    // Extract product names from search results
    const searchResults = response.data.web?.results || [];
    let popularProducts = [];
    
    // Extract product names from titles
    searchResults.forEach(result => {
      const title = result.title;
      if (title.includes('vs') || title.includes('best') || title.includes('top')) {
        const words = title.split(' ');
        for (let i = 0; i < words.length; i++) {
          if (['iPhone', 'Samsung', 'Galaxy', 'Pixel', 'MacBook', 'Dell', 'HP', 'Apple', 'Watch', 'Fitbit'].some(
            brand => words[i].includes(brand)
          )) {
            if (i + 1 < words.length) {
              const product = `${words[i]} ${words[i+1]}`.replace(/[.,;:]/g, '');
              if (!popularProducts.some(p => p.name === product)) {
                popularProducts.push({ 
                  name: product, 
                  category: category,
                  url: result.url,
                  description: result.description
                });
              }
            }
          }
        }
      }
    });
    
    // Limit to top 6 products
    popularProducts = popularProducts.slice(0, 6);
    
    res.json(popularProducts);
  } catch (error) {
    console.error('Error fetching popular products:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch popular products' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});