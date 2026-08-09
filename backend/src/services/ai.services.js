const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// ==========================
// INTERVIEW REPORT SCHEMA
// ==========================

const interviewReportSchema = z.object({
  title: z.string(),
  matchScore: z.number().min(0).max(100),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
});

// ==========================
// SAFE JSON EXTRACTOR
// ==========================

function extractJson(text) {
  // Strip markdown code fences if present
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();

  // Find first { and last } to extract raw JSON
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);

  return text.trim();
}

// ==========================
// NORMALIZE AI RESPONSE
// Fixes string arrays → object arrays
// ==========================

function normalizeReport(data) {
  // Fix technicalQuestions & behavioralQuestions
  for (const key of ["technicalQuestions", "behavioralQuestions"]) {
    if (Array.isArray(data[key])) {
      data[key] = data[key].map((item) => {
        if (typeof item === "string") {
          // AI returned a plain string — wrap it into the expected shape
          return { question: item, intention: "", answer: "" };
        }
        return item;
      });
    } else {
      data[key] = [];
    }
  }

  // Fix skillGaps
  if (Array.isArray(data.skillGaps)) {
    data.skillGaps = data.skillGaps.map((item) => {
      if (typeof item === "string") {
        return { skill: item, severity: "medium" };
      }
      // Ensure severity is valid
      if (!["low", "medium", "high"].includes(item.severity)) {
        item.severity = "medium";
      }
      return item;
    });
  } else {
    data.skillGaps = [];
  }

  // Fix preparationPlan
  if (Array.isArray(data.preparationPlan)) {
    data.preparationPlan = data.preparationPlan.map((item, index) => {
      if (typeof item === "string") {
        return { day: index + 1, focus: item, tasks: [] };
      }
      // Ensure tasks is array of strings
      if (!Array.isArray(item.tasks)) {
        item.tasks = [];
      } else {
        item.tasks = item.tasks.map((t) =>
          typeof t === "string" ? t : String(t)
        );
      }
      return item;
    });
  } else {
    data.preparationPlan = [];
  }

  return data;
}

// ==========================
// GENERATE INTERVIEW REPORT
// ==========================

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `
You are a JSON API. Return ONLY raw JSON with NO markdown, NO explanation, NO code fences.

Analyze the resume and job description below and return this EXACT JSON structure:

{
  "title": "string (e.g. Frontend Developer Interview Report)",
  "matchScore": number between 0 and 100,
  "technicalQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "skillGaps": [
    {
      "skill": "string",
      "severity": "low" or "medium" or "high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "string",
      "tasks": ["string", "string"]
    }
  ]
}

RULES:
- technicalQuestions: exactly 10 objects with question/intention/answer keys
- behavioralQuestions: exactly 10 objects with question/intention/answer keys
- skillGaps: 5-8 objects with skill and severity keys
- preparationPlan: 7 objects (one per day) with day/focus/tasks keys
- severity must be exactly "low", "medium", or "high"
- tasks must be an array of strings
- Return NOTHING except the JSON object

Resume:
${resume || "Not provided"}

Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    // ❌ REMOVED responseSchema — it was causing Gemini to return string arrays
    config: {
      responseMimeType: "application/json",
    },
  });

  const rawText =
    response.candidates?.[0]?.content?.parts?.[0]?.text ||
    response.text ||
    "";

  console.log("Raw AI response (first 300 chars):", rawText.slice(0, 300));

  let parsed;
  try {
    const cleanJson = extractJson(rawText);
    parsed = JSON.parse(cleanJson);
  } catch (err) {
    throw new Error(`Failed to parse AI JSON response: ${err.message}\nRaw: ${rawText.slice(0, 500)}`);
  }

  // Normalize before Zod validation
  const normalized = normalizeReport(parsed);

  // Zod validation — will throw ZodError if still wrong
  const validated = interviewReportSchema.parse(normalized);

  console.log("✅ Interview report generated:", validated.title);
  return validated;
}

// ==========================
// PDF GENERATOR
// ==========================

async function generatePdfFromHtml(htmlContent) {
  const { default: puppeteer } = await import("puppeteer-core");
  const { default: chromium } = await import("@sparticuz/chromium");

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

// ==========================
// RESUME PDF
// ==========================

// ==========================
// INTERVIEW REPORT PDF
// ==========================

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateQuestionHtml(question, index) {
  return `
    <div class="question-card">
      <div class="question-header">
        <span class="question-number">Q${index + 1}</span>
        <h3>${escapeHtml(question.question)}</h3>
      </div>

      <div class="question-section">
        <div class="label intention-label">Intention</div>
        <p>${escapeHtml(question.intention)}</p>
      </div>

      <div class="question-section">
        <div class="label answer-label">Model Answer</div>
        <p>${escapeHtml(question.answer)}</p>
      </div>
    </div>
  `;
}

async function generateInterviewReportPdf(report) {
  const {
    title,
    matchScore,
    technicalQuestions = [],
    behavioralQuestions = [],
    skillGaps = [],
    preparationPlan = [],
  } = report;

  const scoreClass =
    matchScore >= 80
      ? "high"
      : matchScore >= 60
      ? "medium"
      : "low";

  const technicalHtml = technicalQuestions
    .map((question, index) =>
      generateQuestionHtml(question, index)
    )
    .join("");

  const behavioralHtml = behavioralQuestions
    .map((question, index) =>
      generateQuestionHtml(question, index)
    )
    .join("");

  const skillGapsHtml = skillGaps
    .map(
      (gap) => `
        <span class="skill-tag skill-${escapeHtml(gap.severity)}">
          ${escapeHtml(gap.skill)}
        </span>
      `
    )
    .join("");

  const preparationHtml = preparationPlan
    .map(
      (day) => `
        <div class="roadmap-day">
          <div class="day-number">
            Day ${escapeHtml(day.day)}
          </div>

          <div class="day-content">
            <h3>${escapeHtml(day.focus)}</h3>

            <ul>
              ${(day.tasks || [])
                .map(
                  (task) =>
                    `<li>${escapeHtml(task)}</li>`
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #1f2937;
            margin: 0;
            background: #ffffff;
            line-height: 1.6;
          }

          .container {
            width: 100%;
          }

          .header {
            background: #111827;
            color: white;
            padding: 32px;
            border-radius: 12px;
            margin-bottom: 24px;
          }

          .header h1 {
            margin: 0 0 8px;
            font-size: 28px;
          }

          .header p {
            margin: 0;
            color: #d1d5db;
          }

          .score-card {
            margin-top: 20px;
            background: #ffffff;
            color: #111827;
            border-radius: 10px;
            padding: 16px;
            display: inline-block;
            min-width: 150px;
          }

          .score-label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
          }

          .score {
            font-size: 30px;
            font-weight: bold;
          }

          .score.high {
            color: #16a34a;
          }

          .score.medium {
            color: #d97706;
          }

          .score.low {
            color: #dc2626;
          }

          .section {
            margin-top: 32px;
          }

          .section-title {
            font-size: 21px;
            color: #111827;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 18px;
          }

          .question-card {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 18px;
            margin-bottom: 16px;
            page-break-inside: avoid;
          }

          .question-header {
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }

          .question-number {
            background: #111827;
            color: white;
            min-width: 32px;
            height: 32px;
            border-radius: 6px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 13px;
          }

          .question-header h3 {
            margin: 2px 0 0;
            font-size: 16px;
            color: #111827;
          }

          .question-section {
            margin-top: 15px;
            padding-left: 44px;
          }

          .label {
            display: inline-block;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }

          .intention-label {
            color: #0891b2;
          }

          .answer-label {
            color: #db2777;
          }

          .question-section p {
            margin: 0;
            font-size: 13px;
            color: #4b5563;
          }

          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .skill-tag {
            display: inline-block;
            padding: 7px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }

          .skill-low {
            background: #dcfce7;
            color: #166534;
          }

          .skill-medium {
            background: #fef3c7;
            color: #92400e;
          }

          .skill-high {
            background: #fee2e2;
            color: #991b1b;
          }

          .roadmap-day {
            display: flex;
            gap: 18px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 18px;
            margin-bottom: 14px;
            page-break-inside: avoid;
          }

          .day-number {
            min-width: 65px;
            height: 65px;
            border-radius: 10px;
            background: #111827;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
          }

          .day-content {
            flex: 1;
          }

          .day-content h3 {
            margin: 0 0 8px;
            font-size: 16px;
          }

          .day-content ul {
            margin: 0;
            padding-left: 20px;
          }

          .day-content li {
            font-size: 13px;
            color: #4b5563;
            margin-bottom: 4px;
          }

          .footer {
            margin-top: 35px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 11px;
          }
        </style>
      </head>

      <body>
        <div class="container">

          <div class="header">
            <h1>${escapeHtml(title || "Interview Report")}</h1>

            <p>
              Personalized interview preparation strategy
            </p>

            <div class="score-card">
              <div class="score-label">
                Match Score
              </div>

              <div class="score ${scoreClass}">
                ${escapeHtml(matchScore)}%
              </div>
            </div>
          </div>

          <!-- TECHNICAL QUESTIONS -->
          <section class="section">
            <h2 class="section-title">
              Technical Questions
            </h2>

            ${technicalHtml}
          </section>

          <!-- BEHAVIORAL QUESTIONS -->
          <section class="section">
            <h2 class="section-title">
              Behavioral Questions
            </h2>

            ${behavioralHtml}
          </section>

          <!-- SKILL GAPS -->
          <section class="section">
            <h2 class="section-title">
              Skill Gaps
            </h2>

            <div class="skills">
              ${skillGapsHtml}
            </div>
          </section>

          <!-- PREPARATION ROADMAP -->
          <section class="section">
            <h2 class="section-title">
              Preparation Road Map
            </h2>

            ${preparationHtml}
          </section>

          <div class="footer">
            Generated by ResumeAI
          </div>

        </div>
      </body>
    </html>
  `;

  return generatePdfFromHtml(html);
}

module.exports = {
  generateInterviewReport,
    generateInterviewReportPdf,
};