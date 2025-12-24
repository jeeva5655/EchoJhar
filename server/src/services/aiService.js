const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI Service - Gemini Integration for Smart Features
 * 
 * Business Value:
 * - Personalized recommendations (increase bookings)
 * - Automated trip planning (premium feature)
 * - Customer support automation (reduce costs)
 * - Content generation for marketing
 */
class AIService {
    constructor() {
        this.genAI = null;
        this.model = null;

        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            this.model = this.genAI.getGenerativeModel({
                model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp'
            });
            console.log('✅ Gemini AI initialized');
        } else {
            console.warn('⚠️  Gemini API key not configured - using fallback mode');
        }
    }

    /**
     * BUSINESS LOGIC: Generate trip itinerary
     * Premium feature - AI-powered trip planning
     */
    async generateItinerary({ destination, duration, budget, interests, travelStyle }) {
        try {
            if (!this.model) {
                return this.fallbackItinerary(destination, duration);
            }

            const prompt = `Create a detailed ${duration}-day itinerary for ${destination}, Jharkhand, India.

Budget: ₹${budget}
Travel Style: ${travelStyle}
Interests: ${interests.join(', ')}

Provide:
1. Day-wise schedule with timings
2. Recommended attractions, restaurants, and activities
3. Estimated costs for each activity
4. Local tips and cultural insights
5. Best photo spots
6. Transportation recommendations

Format as JSON with structure:
{
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "time": "09:00 AM",
          "type": "attraction",
          "name": "Place name",
          "description": "Details",
          "estimatedCost": 500,
          "duration": "2 hours"
        }
      ]
    }
  ],
  "totalEstimatedCost": 15000,
  "tips": ["tip1", "tip2"]
}`;

            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Parse JSON response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const itinerary = JSON.parse(jsonMatch[0]);
                console.log(`🧠 AI itinerary generated for ${destination}`);
                return itinerary;
            }

            return this.fallbackItinerary(destination, duration);
        } catch (error) {
            console.error('AI itinerary generation error:', error.message);
            return this.fallbackItinerary(destination, duration);
        }
    }

    /**   * BUSINESS LOGIC: Chat with tourism AI
     * Customer support automation
     */
    async chat(message, context = {}) {
        try {
            if (!this.model) {
                return this.fallbackChat(message);
            }

            const systemPrompt = `You are EchoJhar AI, a helpful tourism assistant for Jharkhand, India. 
You help tourists with:
- Destination recommendations
- Travel planning
- Cultural information
- Safety tips
- Local cuisine and shopping
- Emergency assistance

User context:
${context.location ? `Current location: ${context.location}` : ''}
${context.interests ? `Interests: ${context.interests.join(', ')}` : ''}
${context.budget ? `Budget: ₹${context.budget}` : ''}

Be concise, friendly, and helpful. Provide specific recommendations with practical details.`;

            const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;

            const result = await this.model.generateContent(prompt);
            const response = result.response.text();

            console.log(`💬 AI chat response generated`);
            return {
                response,
                suggestions: this.generateSuggestions(message)
            };
        } catch (error) {
            console.error('AI chat error:', error.message);
            return this.fallbackChat(message);
        }
    }

    /**
     * BUSINESS LOGIC: Generate content for marketing
     */
    async generateProductDescription(product) {
        try {
            if (!this.model) {
                return this.fallbackDescription(product);
            }

            const prompt = `Write a compelling product description for:
      
Product: ${product.name}
Category: ${product.category}
Artisan: ${product.artisan}
Village: ${product.village}
Material: ${product.material || 'traditional materials'}
Price: ₹${product.price}

Create a 2-3 paragraph description that:
1. Highlights the craftsmanship and cultural significance
2. Mentions authenticity and blockchain verification
3. Appeals to tourists and heritage enthusiasts
4. Is SEO-friendly and engaging

Keep it under 150 words.`;

            const result = await this.model.generateContent(prompt);
            const description = result.response.text();

            console.log(`📝 Product description generated for ${product.name}`);
            return description.trim();
        } catch (error) {
            console.error('Description generation error:', error.message);
            return this.fallbackDescription(product);
        }
    }

    /**
     * BUSINESS LOGIC: Personalized recommendations
     * Increase conversion rates
     */
    async getRecommendations(userProfile) {
        try {
            const { interests, previousBookings, budget, location } = userProfile;

            if (!this.model) {
                return this.fallbackRecommendations(interests);
            }

            const prompt = `Recommend 5 tourism experiences in Jharkhand for a user with:

Interests: ${interests.join(', ')}
Budget: ₹${budget}
${location ? `Current location: ${location}` : ''}
${previousBookings ? `Previous visits: ${previousBookings.join(', ')}` : ''}

Provide personalized recommendations considering:
1. User's interests and preferences
2. Budget constraints
3. Seasonal factors
4. Proximity to current location
5. Unique, less touristy options

Format as JSON array:
[
  {
    "name": "Experience name",
    "type": "attraction/activity/tour",
    "description": "Brief description",
    "estimatedCost": 1000,
    "duration": "2-3 hours",
    "bestTime": "October-March",
    "why": "Personalized reason"
  }
]`;

            const result = await this.model.generateContent(prompt);
            const text = result.response.text();

            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const recommendations = JSON.parse(jsonMatch[0]);
                console.log(`🎯 Personalized recommendations generated`);
                return recommendations;
            }

            return this.fallbackRecommendations(interests);
        } catch (error) {
            console.error('Recommendations error:', error.message);
            return this.fallbackRecommendations(interests);
        }
    }

    // Fallback methods for when Gemini is unavailable
    fallbackItinerary(destination, duration) {
        return {
            days: [{
                day: 1,
                title: `Explore ${destination}`,
                activities: [{
                    time: "09:00 AM",
                    type: "attraction",
                    name: "Main Attraction",
                    description: "Visit the highlights of " + destination,
                    estimatedCost: 500,
                    duration: "3 hours"
                }]
            }],
            totalEstimatedCost: duration * 2000,
            tips: ["Use fallback mode - Configure Gemini API for AI-powered planning"]
        };
    }

    fallbackChat(message) {
        return {
            response: "I'm currently in demo mode. For full AI assistance, please configure the Gemini API key. How can I help you with your Jharkhand trip?",
            suggestions: this.generateSuggestions(message)
        };
    }

    fallbackDescription(product) {
        return `Authentic ${product.name} handcrafted by skilled artisans in ${product.village}. This beautiful piece represents the rich cultural heritage of Jharkhand. Verified for authenticity on blockchain. Perfect for collectors and gift enthusiasts.`;
    }

    fallbackRecommendations(interests) {
        return [
            {
                name: "Hundru Falls",
                type: "attraction",
                description: "Stunning 98m waterfall",
                estimatedCost: 500,
                duration: "3-4 hours",
                bestTime: "July-October",
                why: "Great for nature lovers"
            }
        ];
    }

    generateSuggestions(message) {
        const suggestions = [
            "What are the best waterfalls to visit?",
            "Recommend a 3-day itinerary",
            "Where can I buy authentic handicrafts?",
            "What's the best time to visit?"
        ];
        return suggestions;
    }
}

module.exports = new AIService();
