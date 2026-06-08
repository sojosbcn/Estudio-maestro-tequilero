import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Expert endpoint
  app.post("/api/consult", async (req, res) => {
    try {
      const { message, stage = "General", history = [] } = req.body;

      // Map client history to Gemini content format
      const contents = history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.role === 'user' ? h.text : JSON.stringify(h.experts || h.text) }]
      }));

      // Add the new message
      contents.push({
        role: 'user',
        parts: [{ text: `Consulta sobre Tequila en la etapa de: ${stage}\nUsuario: ${message}` }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: `Eres el "Sistema Experto de la Guía Maestra del Tequila", la autoridad máxima en ciencia, tradición y procesos industriales del tequila. 
          Tu objetivo es proporcionar asesoría técnica ultra-premium, integrando tanto la normativa NOM-006-SCFI como los conocimientos ancestrales.

          Si el usuario se refiere a mensajes anteriores, usa el historial proporcionado para dar continuidad.

          Debes responder siempre en formato JSON con la siguiente estructura:
          {
            "experts": {
              "agro": "Respuesta técnica/ancestral del Agrónomo.",
              "tech": "Respuesta técnica/ancestral del Técnico.",
              "lab": "Respuesta técnica/ancestral del Químico.",
              "master": "Respuesta técnica/ancestral del Maestro Tequilero."
            },
            "protocol": [
              "Paso 1 del protocolo físico/analítico...",
              "..."
            ]
          }
          Mantén un tono de alta sofisticación, precisión científica y respeto por la tradición.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              experts: {
                type: Type.OBJECT,
                properties: {
                  agro: { type: Type.STRING },
                  tech: { type: Type.STRING },
                  lab: { type: Type.STRING },
                  master: { type: Type.STRING }
                },
                required: ["agro", "tech", "lab", "master"]
              },
              protocol: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["experts", "protocol"]
          }
        },
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Error procesando la consulta técnica." });
    }
  });

  // API endpoint for R&D Ideation & Critique
  app.post("/api/rd/generate", async (req, res) => {
    try {
      const { userIdea, category = "Edición Limitada" } = req.body;
      
      let prompt = "";
      if (userIdea) {
        prompt = `El usuario ha propuesto una idea para evaluar su viabilidad: "${userIdea}".\n`;
      } else {
        prompt = `Genera una idea totalmente nueva e innovadora en la categoría de "${category}".\n`;
      }
      
      prompt += `Por favor, evalúa de manera sumamente creativa y entusiasta, con un tono brillante pero honesto, esta idea de tequila a través de nuestro equipo de mentes inquietas de I+D:
      1. Xavier "El Alquimista": especialista técnico disruptivo (sabores, infusiones, botánicos, levaduras, maduración atípica).
      2. Sofía "La Conceptual": experta en mercadotecnia, conceptualización de botellas limitadas, storytelling de marca y ventas.
      3. Mateo "El Visionario": experto en sustentabilidad agraria, procesos modernos de Jima y optimización de destilería.

      Proporciona un título elegante, un resumen del concepto, la crítica de cada especialista y una estimación de viabilidad técnica (%), viabilidad comercial (%), costo de producción (Bajo, Medio o Alto), e idealmente un veredicto colectivo de si la idea es realizable o necesita maduración.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `Eres el moderador del Comité de I+D Creativo de la Guía Maestra del Tequila. Tu misión es canalizar las opiniones de tres especialistas con mentes sumamente inquietas frente a una propuesta experimental de tequila. El tono es ultra-premium, inspirador, apasionado por la innovación y la tradición tequilera.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ideaTitle: { type: Type.STRING },
              concept: { type: Type.STRING },
              category: { type: Type.STRING },
              specialists: {
                type: Type.OBJECT,
                properties: {
                  alchemist: { type: Type.STRING },
                  conceptual: { type: Type.STRING },
                  visionary: { type: Type.STRING }
                },
                required: ["alchemist", "conceptual", "visionary"]
              },
              feasibilityScore: {
                type: Type.OBJECT,
                properties: {
                  technical: { type: Type.INTEGER },
                  commercial: { type: Type.INTEGER },
                  cost: { type: Type.STRING }
                },
                required: ["technical", "commercial", "cost"]
              },
              verdict: { type: Type.STRING }
            },
            required: ["ideaTitle", "concept", "category", "specialists", "feasibilityScore", "verdict"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error: any) {
      console.error("R&D API Error:", error);
      res.status(500).json({ error: "No se pudo procesar la idea de I+D." });
    }
  });

  // API endpoint for Report/Dossier Generation
  app.post("/api/reports/generate", async (req, res) => {
    try {
      const { ideaTitle, concept, category, specialists, feasibilityScore, verdict } = req.body;
      
      const prompt = `Queremos redactar un documento/informe técnico y comercial completo y profesional de la siguiente idea nacida del comité de I+D:
      Título de la Idea: ${ideaTitle}
      Concepto: ${concept}
      Categoría: ${category}
      Veredicto de Especialistas: ${verdict}
      Información de Especialistas:
      - Alquimista: ${specialists?.alchemist || ''}
      - Conceptual: ${specialists?.conceptual || ''}
      - Visionario: ${specialists?.visionary || ''}
      Viabilidades: Técnica: ${feasibilityScore?.technical || 0}%, Comercial: ${feasibilityScore?.commercial || 0}%, Costos: ${feasibilityScore?.cost || ''}

      Por favor, genera un informe sumamente profesional, con un tono corporativo experto, maduro y técnico de consultoría premium internacional.
      Debe estructurarse en 4 secciones específicas:
      1. Justificación y Propuesta de Valor
      2. Proceso de Producción e Innovación Técnica (detalla grados Brix de agave, tatemado, levaduras, perfil analítico, etc.)
      3. Identidad de Marca y Concepto de Venta (sugerencia de nombre, diseño de botella o limitación de botellas)
      4. Viabilidad Técnica, Análisis de Costos y Cumplimiento NOM (NOM-006-SCFI)
      
      Incluye también una serie de 3 a 5 recomendaciones estratégicas concretas para el inversionista o director general de la marca.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `Eres el Director del Departamento de Informes Técnicos de la Alianza Tequilera. Redactas informes de nivel directivo y consultoría ejecutiva, con un rigor técnico intachable alineado con la NOM-006-SCFI y un análisis de negocio estratégico premium.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              dossierCode: { type: Type.STRING },
              date: { type: Type.STRING },
              executiveSummary: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    heading: { type: Type.STRING },
                    content: { type: Type.STRING }
                  },
                  required: ["heading", "content"]
                }
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "dossierCode", "date", "executiveSummary", "sections", "recommendations"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error: any) {
      console.error("Reports API Error:", error);
      res.status(500).json({ error: "No se pudo generar el informe profesional." });
    }
  });

  // API endpoint for Slide Deck generation (NotebookLM oriented)
  app.post("/api/presentation/generate", async (req, res) => {
    try {
      const { ideaTitle, concept, report } = req.body;
      
      let prompt = `Genera una presentación ejecutiva de 5 diapositivas (slides) basada en la siguiente idea de tequila:
      Idea: ${ideaTitle}
      Concepto: ${concept}
      `;
      if (report) {
        prompt += `\nDetalles del Informe Técnico:\n${JSON.stringify(report)}`;
      }
      
      prompt += `\nQueremos un deck de 5 diapositivas organizadas como:
      Slide 1: Introducción & Título
      Slide 2: La Innovación del Alquimista
      Slide 3: Concepto de Venta & Packaging (Sofía)
      Slide 4: Análisis de Viabilidad, NOM y Procesos (Mateo)
      Slide 5: Recomendaciones Ejecutivas y Primeros Pasos
      
      Para cada diapositiva proporciona: un título directo, un subtítulo contextual, 3 viñetas concisas con datos de alto impacto, y un consejo visual (visualTip) sobre qué tipo de gráfico, animación o imagen sugerida colocar en esa pantalla para mayor elegancia.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `Eres un diseñador de discursos ejecutivos y consultor estratégico. Creas presentaciones limpias, de alto impacto, donde cada frase contiene datos precisos y valor estratégico sin palabrería vacía.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              deckTitle: { type: Type.STRING },
              slides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    slideNum: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    bullets: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    visualTip: { type: Type.STRING }
                  },
                  required: ["slideNum", "title", "subtitle", "bullets", "visualTip"]
                }
              }
            },
            required: ["deckTitle", "slides"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error: any) {
      console.error("Presentation API Error:", error);
      res.status(500).json({ error: "No se pudo generar el deck de diapositivas." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
