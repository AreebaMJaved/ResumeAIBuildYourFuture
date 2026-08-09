const PDFParser = require("pdf2json");       
const { generateInterviewReport, generateInterviewReportPdf } = require("../services/ai.services");
const interviewReportModel = require("../models/interviewReport.model");

function parsePdfBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const text = pdfParser.getRawTextContent();
      resolve(text);
    });

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(err);
    });

    pdfParser.parseBuffer(buffer);
  });
}

async function generateInterViewReportController(req, res) {
  try {
    const { selfDescription, jobDescription } = req.body;

    let resumeContent = "";

    if (req.file) {
      resumeContent = await parsePdfBuffer(req.file.buffer); // ✅ clean
    }

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
    });

    res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });

  } catch (error) {
    console.error("generateInterViewReportController error:", error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    const pdfBuffer = await generateInterviewReportPdf(
      interviewReport.toObject()
    );

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=interview_report_${interviewReportId}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("generateInterviewReportPdfController error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }