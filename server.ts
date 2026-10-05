import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Support base64 PDFs and large texts
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Gemini SDK initialization
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Helper to call Gemini with retry and fallback models
async function generateWithFallback(ai: GoogleGenAI, params: any) {
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        ...params,
        model,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed, trying next fallback if available:`, err?.message || err);
      // Wait 1 second before fallback
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw lastError;
}

// Generate Study Pack endpoint
app.post('/api/study/generate', async (req, res) => {
  try {
    const { type, content, title } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required.' });
    }

    const ai = getAiClient();

    let parts: any[] = [];
    const instructionPrompt = `You are "Study Buddy", an expert academic tutor and educator.
Analyze this study document thoroughly.
Create a high-impact, comprehensive study pack that includes:
1. "title": A descriptive, engaging title for this topic (if provided name was generic).
2. "summary": Exactly 5 clear, comprehensive bullet points capturing the core insights and takeaways. Each bullet should be 1-2 detailed sentences with key takeaways.
3. "keyTerms": 4 to 6 important terminology or vocabulary items with brief definitions.
4. "flashcards": Exactly 8 high-yield flashcards.
   - "id": 1 to 8
   - "question": Concept, problem, or term definition query.
   - "answer": Clear, informative explanation.
   - "category": Short topic/concept tag.
5. "quiz": Exactly 5 multiple-choice questions testing comprehension across the material.
   - "id": 1 to 5
   - "question": Clear, challenging question.
   - "options": Exactly 4 distinct answers as strings.
   - "correctAnswer": 0-based integer index (0, 1, 2, or 3) indicating which option is correct.
   - "explanation": Exactly one concise sentence explaining why the answer is correct and clarifying key concepts.

Output must strictly conform to the provided JSON schema.`;

    if (type === 'pdf') {
      // Clean base64 string
      const cleanBase64 = content.replace(/^data:[^;]+;base64,/, '');
      parts = [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: cleanBase64,
          },
        },
        {
          text: instructionPrompt + (title ? `\nDocument name: ${title}` : ''),
        },
      ];
    } else {
      // Text
      parts = [
        {
          text: `Study Material:\n"""\n${content}\n"""\n\n${instructionPrompt}`,
        },
      ];
    }

    const response = await generateWithFallback(ai, {
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Exactly 5 comprehensive key bullet points',
            },
            keyTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
                required: ['term', 'definition'],
              },
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ['id', 'question', 'answer', 'category'],
              },
              description: 'Exactly 8 flashcards',
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Array of 4 options',
                  },
                  correctAnswer: {
                    type: Type.INTEGER,
                    description: '0-based index (0, 1, 2, or 3) of correct option',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'One-line explanation',
                  },
                },
                required: ['id', 'question', 'options', 'correctAnswer', 'explanation'],
              },
              description: 'Exactly 5 multiple-choice questions',
            },
          },
          required: ['title', 'summary', 'flashcards', 'quiz'],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Gemini returned an empty response.');
    }

    const data = JSON.parse(textOutput);
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error generating study pack:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate study materials with Gemini.',
    });
  }
});

// Chat endpoint: ask questions about the document
app.post('/api/study/chat', async (req, res) => {
  try {
    const { documentContext, messages = [], question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const ai = getAiClient();

    let parts: any[] = [];

    // Include document content
    if (documentContext?.type === 'pdf' && documentContext?.content) {
      const cleanBase64 = documentContext.content.replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: cleanBase64,
        },
      });
    } else if (documentContext?.content) {
      parts.push({
        text: `Primary Study Material:\n"""\n${documentContext.content.slice(0, 50000)}\n"""`,
      });
    }

    // Include summary context if available
    if (documentContext?.summary && Array.isArray(documentContext.summary)) {
      parts.push({
        text: `Summary of key points:\n${documentContext.summary.map((b: string, i: number) => `${i + 1}. ${b}`).join('\n')}`,
      });
    }

    // Format previous conversation context
    const conversationHistory = (messages || [])
      .slice(-8)
      .map((m: any) => `${m.role === 'user' ? 'Student' : 'Study Buddy'}: ${m.text}`)
      .join('\n\n');

    const promptText = `You are "Study Buddy", an approachable, patient, and knowledgeable academic tutor.
Answer the student's question directly based on the provided study document.
${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ''}
Student's Question: "${question}"

Guidelines:
- Explain clearly with intuitive analogies or practical examples where helpful.
- Reference facts and concepts from the document.
- If the question cannot be answered from the document, acknowledge that politely and provide the best educational guidance while noting it was not directly in the notes.
- Use markdown formatting with bold text, bullet points, and code snippets where appropriate for readability.
- Maintain a warm, encouraging study buddy tone.`;

    parts.push({ text: promptText });

    const response = await generateWithFallback(ai, {
      contents: { parts },
      config: {
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'm sorry, I couldn't formulate a response. Could you rephrase your question?";
    return res.json({ success: true, reply });
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process chat message.',
    });
  }
});

// Start Express server and connect Vite middleware or static assets
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Study Buddy server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
