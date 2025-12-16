// src/controllers/tests/getTestResultPDF.js
import PDFDocument from "pdfkit";
import TestResult from "../../models/TestResults.js";
import TestSession from "../../models/TestSessions.js";
import User from "../../models/User.js";

/**
 * GENERATE TEST RESULT PDF
 * GET /api/test/result/:testSessionId/pdf
 */
export const getTestResultPDF = async (req, res) => {
  try {
    const { testSessionId } = req.params;
    const userId = req.user.id;

    // Fetch data
    const testSession = await TestSession.findOne({ _id: testSessionId, userId });
    const testResult = await TestResult.findOne({ testSessionId, userId });
    const user = await User.findById(userId);

    if (!testSession || !testResult || !user) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    // Headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="AspireLens_Result_${testSessionId}.pdf"`
    );

    doc.pipe(res);

    // Header
    doc
      .fillColor("#4F46E5")
      .fontSize(24)
      .text("AspireLens", 50, 50)
      .fillColor("#6B7280")
      .fontSize(12)
      .text("Career Assessment Result", 50, 80);

    doc
      .moveTo(50, 100)
      .lineTo(550, 100)
      .strokeColor("#E5E7EB")
      .lineWidth(1)
      .stroke();

    // Candidate Info
    doc.fillColor("#111827").fontSize(16).text("Candidate Information", 50, 120);

    const fullName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A";

    doc
      .fillColor("#374151")
      .fontSize(10)
      .text(`Name: ${fullName}`, 50, 150)
      .text(`Email: ${user.email || "N/A"}`, 50, 165)
      .text(
        `Education: ${user.profile?.educationLevel || "N/A"} ${
          user.profile?.educationStage
            ? `(${user.profile.educationStage})`
            : ""
        }`,
        50,
        180
      )
      .text(
        `Interests: ${
          user.profile?.interests?.length
            ? user.profile.interests.join(", ")
            : "N/A"
        }`,
        50,
        195
      );

    // Test Info
    doc.fillColor("#111827").fontSize(16).text("Test Information", 50, 230);

    doc
      .fillColor("#374151")
      .fontSize(10)
      .text(`Test Session ID: ${testSessionId}`, 50, 260)
      .text(`Level: ${testSession.level || 1}`, 50, 275)
      .text(
        `Submitted: ${
          testSession.submittedAt
            ? new Date(testSession.submittedAt).toLocaleDateString()
            : "N/A"
        }`,
        50,
        290
      )
      .text(
        `Evaluated: ${
          testResult.evaluatedAt
            ? new Date(testResult.evaluatedAt).toLocaleDateString()
            : "Pending"
        }`,
        50,
        305
      );

    // Score Summary
    doc.fillColor("#111827").fontSize(16).text("Score Summary", 50, 340);

    const accuracy =
      testResult.attemptedQuestions > 0
        ? Math.round(
            (testResult.correctAnswers / testResult.attemptedQuestions) * 100
          )
        : 0;

    const scores = [
      ["Total Questions", testResult.totalQuestions],
      ["Attempted", testResult.attemptedQuestions],
      ["Correct Answers", testResult.correctAnswers],
      ["Wrong Answers", testResult.wrongAnswers],
      [
        "Unattempted",
        testResult.totalQuestions - testResult.attemptedQuestions
      ],
      ["Score Percentage", `${testResult.scorePercentage}%`],
      ["Accuracy", `${accuracy}%`]
    ];

    let yPos = 370;
    scores.forEach(([label, value]) => {
      doc
        .fillColor("#374151")
        .fontSize(10)
        .text(label, 50, yPos)
        .text(String(value), 300, yPos);
      yPos += 20;
    });

    // Footer
    doc
      .fillColor("#6B7280")
      .fontSize(8)
      .text("© AspireLens - AI Powered Career Assessment", 50, 750)
      .text(
        "This is an AI-generated report. For detailed counselling, book a session.",
        50,
        765
      );

    doc.end();

  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};
