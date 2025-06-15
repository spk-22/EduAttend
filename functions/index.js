const functions = require("firebase-functions");
const admin = require("firebase-admin");
const PDFDocument = require("pdfkit");
const fs = require("fs");

admin.initializeApp();
const db = admin.firestore();
const bucket = admin.storage().bucket();

exports.generateFormPDF = functions.https.onRequest(async (req, res) => {
  const { classroomId, examDate } = req.query;

  if (!classroomId || !examDate) {
    return res.status(400).send("Missing classroomId or examDate");
  }

  const snapshot = await db.collection("absentees")
    .where("classroomId", "==", classroomId)
    .where("examDate", "==", examDate)
    .get();

  const courseGroups = {};

  snapshot.forEach(doc => {
    const { usn } = doc.data();
    const course = usn.slice(6, 8); // Extract course code from USN

    if (!courseGroups[course]) courseGroups[course] = [];
    courseGroups[course].push(usn);
  });

  for (const course in courseGroups) {
    const doc = new PDFDocument();
    const filename = `FormA-${classroomId}-${course}.pdf`;
    const filePath = `/tmp/${filename}`;
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(14).text("R.V College of Engineering", { align: "center" });
    doc.text(`Consolidated Attendance Report - ${course}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text("Absent Students:");
    doc.text(courseGroups[course].join(", "));

    doc.end();

    await bucket.upload(filePath, {
      destination: `pdfs/${filename}`,
    });
  }

  return res.send("PDFs generated and uploaded.");
});
