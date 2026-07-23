import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI lazily or safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Fallback rule-based weather intelligence generator
function generateFallbackIntelligence(body: any) {
  const { city, currentTemp, unit, condition, humidity, windSpeed, uvIndex, maxTemp, minTemp, rainProb, userScenario } = body;
  const tempUnit = unit === "fahrenheit" ? "°F" : "°C";

  let outfit = "Wear comfortable casual clothing.";
  if (currentTemp < (unit === "fahrenheit" ? 50 : 10)) {
    outfit = "Wear a warm thermal jacket, scarf, and insulated footwear.";
  } else if (currentTemp < (unit === "fahrenheit" ? 68 : 20)) {
    outfit = "Layer with a sweater or light fleece jacket.";
  } else if (currentTemp > (unit === "fahrenheit" ? 82 : 28)) {
    outfit = "Wear light, breathable cotton/linen fabric, shorts, and stay hydrated.";
  } else {
    outfit = "Comfortable jeans and t-shirt, bring a light outer layer for late evening.";
  }

  if (rainProb > 40 || (condition && condition.toLowerCase().includes("rain"))) {
    outfit += " Carry a sturdy umbrella or waterproof raincoat.";
  }
  if (uvIndex >= 6) {
    outfit += " Wear UV-blocking sunglasses and applying SPF 30+ sunscreen.";
  }

  const activities = [
    {
      activity: "Outdoor Running & Jogging",
      score: rainProb > 50 ? 35 : tempUnit === "°C" && currentTemp > 30 ? 45 : 88,
      status: rainProb > 50 ? "Caution" : "Ideal",
      reason: rainProb > 50 ? "Possibility of wet surfaces and slippery tracks." : "Favorable ambient temperatures for cardio."
    },
    {
      activity: "Outdoor Dining & Cafe",
      score: rainProb > 30 ? 40 : 85,
      status: rainProb > 30 ? "Caution" : "Great",
      reason: rainProb > 30 ? "Patio seating might get damp; seek covered area." : "Pleasant breeze and comfortable outdoor ambiance."
    },
    {
      activity: "Cycling & Commuting",
      score: windSpeed > 25 ? 40 : 82,
      status: windSpeed > 25 ? "Caution" : "Great",
      reason: windSpeed > 25 ? "Crosswinds can hinder stability." : "Clear sightlines and moderate road conditions."
    },
    {
      activity: "Photography & Sightseeing",
      score: 90,
      status: "Ideal",
      reason: "Atmospheric sky dynamic provides great lighting contrast."
    }
  ];

  const hourlyTips = [
    { timeFrame: "Morning (6 AM - 12 PM)", tip: `Best window for physical activities around ${Math.round(minTemp)}${tempUnit}.` },
    { timeFrame: "Afternoon (12 PM - 5 PM)", tip: `Peak day temperature around ${Math.round(maxTemp)}${tempUnit}. UV max estimated at ${uvIndex}.` },
    { timeFrame: "Evening (5 PM - 10 PM)", tip: `Temperatures easing to ${Math.round(currentTemp)}${tempUnit}. Good time for relaxing.` }
  ];

  let customFeedback = "";
  if (userScenario) {
    customFeedback = `Regarding your plan ("${userScenario}"): Conditions in ${city} currently feature ${condition} at ${currentTemp}${tempUnit}. ${rainProb > 30 ? "Keep an indoor backup plan ready due to precipitation risk." : "Conditions are generally favorable; proceed as planned with appropriate clothing layers."}`;
  } else {
    customFeedback = `Overall steady conditions in ${city} today. Monitor evening wind speed changes.`;
  }

  return {
    summary: `${city} is currently experiencing ${condition} at ${currentTemp}${tempUnit} with humidity at ${humidity}% and rain chance around ${rainProb}%.`,
    outfitAdvice: outfit,
    activityRecommendations: activities,
    hourlyTips,
    customPlanFeedback: customFeedback,
    travelPackingEssentials: [
      rainProb > 30 ? "Compact travel umbrella" : "Sunglasses",
      "Reusable water bottle",
      "Comfortable walking shoes",
      currentTemp < 15 ? "Windbreaker or Jacket" : "Sunscreen SPF 50"
    ]
  };
}

// API Route for AI Weather Intelligence
app.post("/api/weather-ai", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const weatherData = req.body;

    if (!ai) {
      // Fallback if no API key is set
      const fallback = generateFallbackIntelligence(weatherData);
      return res.json({ success: true, source: "fallback", data: fallback });
    }

    const prompt = `
You are an expert Weather Intelligence AI. Analyze the following weather data for ${weatherData.city}:
- Current Weather: ${weatherData.currentTemp}°${weatherData.unit === 'fahrenheit' ? 'F' : 'C'}, ${weatherData.condition}
- Humidity: ${weatherData.humidity}%
- Wind Speed: ${weatherData.windSpeed} km/h
- UV Index: ${weatherData.uvIndex}
- Day High / Low: ${weatherData.maxTemp}° / ${weatherData.minTemp}°
- Chance of Rain: ${weatherData.rainProb}%
- 7-Day Context: ${JSON.stringify(weatherData.forecast7DaySummary || [])}
${weatherData.userScenario ? `- User Planned Scenario/Activity: "${weatherData.userScenario}"` : ""}

Provide hyper-actionable, highly practical weather recommendations and intelligence. Return valid JSON following the required schema.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Clear 2-sentence executive weather summary" },
            outfitAdvice: { type: Type.STRING, description: "Detailed outfit, footwear and accessory advice" },
            activityRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  activity: { type: Type.STRING },
                  score: { type: Type.NUMBER, description: "0 to 100 rating" },
                  status: { type: Type.STRING, description: "Ideal, Great, Caution, or Avoid" },
                  reason: { type: Type.STRING }
                },
                required: ["activity", "score", "status", "reason"]
              }
            },
            hourlyTips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeFrame: { type: Type.STRING },
                  tip: { type: Type.STRING }
                },
                required: ["timeFrame", "tip"]
              }
            },
            customPlanFeedback: { type: Type.STRING, description: "Actionable advice for the user's scenario or general daily recommendation" },
            travelPackingEssentials: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "outfitAdvice", "activityRecommendations", "hourlyTips", "customPlanFeedback", "travelPackingEssentials"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text.trim());
      return res.json({ success: true, source: "gemini", data });
    } else {
      throw new Error("No response text returned from Gemini");
    }
  } catch (err: any) {
    console.error("Gemini Weather AI error:", err?.message || err);
    // Graceful fallback on error
    const fallback = generateFallbackIntelligence(req.body);
    return res.json({ success: true, source: "fallback-on-error", data: fallback });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
