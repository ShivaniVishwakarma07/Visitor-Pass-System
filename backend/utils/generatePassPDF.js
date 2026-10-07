const PDFDocument = require("pdfkit");

const generatePassPDF = (pass, res) => {
  const doc = new PDFDocument({
    size: "A5",
    margin: 40,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${pass.passNumber}.pdf"`,
  );

  doc.pipe(res);

  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("VISITOR PASS", { align: "center" });

  doc.moveDown();

  doc.fontSize(12).font("Helvetica").text(`Pass Number: ${pass.passNumber}`);

  doc.moveDown(0.5);

  doc.text(`Visitor: ${pass.visitor.name}`);
  doc.text(`Email: ${pass.visitor.email}`);
  doc.text(`Phone: ${pass.visitor.phone}`);

  if (pass.visitor.company) {
    doc.text(`Company: ${pass.visitor.company}`);
  }

  doc.text(`Purpose: ${pass.visitor.purpose}`);

  doc.moveDown();

  doc.text(`Valid From: ${new Date(pass.validFrom).toLocaleString()}`);
  doc.text(`Valid Until: ${new Date(pass.validUntil).toLocaleString()}`);

  doc.moveDown();

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Scan QR Code for Verification", { align: "center" });

  doc.moveDown();

  if (pass.qrCode) {
    const qrImage = Buffer.from(
      pass.qrCode.replace(/^data:image\/png;base64,/, ""),
      "base64",
    );

    doc.image(qrImage, {
      fit: [180, 180],
      align: "center",
    });
  }

  doc.moveDown();

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Please present this pass at the security/frontdesk.", {
      align: "center",
    });

  doc.end();
};

module.exports = generatePassPDF;
