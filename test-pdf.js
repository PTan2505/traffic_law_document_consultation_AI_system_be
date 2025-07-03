const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");

async function testPdf() {
  console.log("Script started");
  try {
    console.log("Testing PDF file...");
    const uploadsDir = path.join(__dirname, "src", "uploads", "documents");
    console.log("Upload directory:", uploadsDir);

    // Check if directory exists
    if (!fs.existsSync(uploadsDir)) {
      console.error("Upload directory does not exist");
      return;
    }

    // List files in directory
    const files = fs.readdirSync(uploadsDir);
    console.log("Files in directory:", files);

    // Find the PDF file that starts with the timestamp
    const pdfFile = files.find(
      (file) => file.startsWith("1751546105386_") && file.endsWith(".pdf")
    );
    if (!pdfFile) {
      console.error("PDF file not found");
      return;
    }

    const pdfPath = path.join(uploadsDir, pdfFile);
    console.log("Found PDF file:", pdfFile);
    console.log("Full path:", pdfPath);

    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      console.error("File does not exist:", pdfPath);
      return;
    }

    console.log("File exists, reading buffer...");
    const buffer = fs.readFileSync(pdfPath);
    console.log("Buffer size:", buffer.length, "bytes");

    console.log("Attempting to parse PDF with different options...");

    // Try with different pdf-parse options
    const options1 = {
      // Basic parsing
    };

    try {
      const data1 = await pdf(buffer, options1);
      console.log("=== Basic parsing ===");
      console.log("Number of pages:", data1.numpages);
      console.log("Text length:", data1.text.length);
      console.log("First 200 characters:");
      console.log(JSON.stringify(data1.text.substring(0, 200)));
      console.log("Actual text:");
      console.log(data1.text.substring(0, 200));
    } catch (err) {
      console.error("Basic parsing failed:", err.message);
    }

    // Try with normalization
    const options2 = {
      normalizeWhitespace: true,
      disableCombineTextItems: false,
    };

    try {
      const data2 = await pdf(buffer, options2);
      console.log("=== With normalization ===");
      console.log("Text length:", data2.text.length);
      console.log("First 200 characters:");
      console.log(JSON.stringify(data2.text.substring(0, 200)));
    } catch (err) {
      console.error("Normalized parsing failed:", err.message);
    }
  } catch (error) {
    console.error("Error parsing PDF:", error.message);
  } finally {
    console.log("Script completed");
  }
}

async function testImprovedExtraction() {
  console.log("Testing improved PDF extraction...");
  try {
    const uploadsDir = path.join(__dirname, "src", "uploads", "documents");
    const files = fs.readdirSync(uploadsDir);
    const pdfFile = files.find(
      (file) => file.startsWith("1751546105386_") && file.endsWith(".pdf")
    );

    if (!pdfFile) {
      console.error("PDF file not found");
      return;
    }

    const pdfPath = path.join(uploadsDir, pdfFile);
    const buffer = fs.readFileSync(pdfPath);

    console.log("=== Testing New Extraction Logic ===");
    const data = await pdf(buffer);
    const cleanText = data.text.replace(/\s+/g, " ").trim();

    console.log("PDF Info:", data.info);
    console.log("Number of pages:", data.numpages);
    console.log("Raw text length:", data.text.length);
    console.log("Clean text length:", cleanText.length);

    if (cleanText.length < 50) {
      console.log("=== IMAGE-BASED OR CORRUPTED PDF DETECTED ===");
      const result =
        `[PDF Document - ${data.numpages} pages]\n` +
        `Note: This PDF appears to be image-based, corrupted, or contains minimal searchable text.\n` +
        `Only ${cleanText.length} characters could be extracted.\n` +
        `Original filename: ${data.info?.Title || "Unknown"}\n` +
        `For full content access, consider using a PDF with searchable text or OCR processing.\n` +
        `Extracted text: "${cleanText.substring(0, 200)}${
          cleanText.length > 200 ? "..." : ""
        }"`;

      console.log("Generated result:");
      console.log(result);
    } else {
      console.log("PDF contains sufficient text content");
      console.log("First 300 characters:", cleanText.substring(0, 300));
    }
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testImprovedExtraction();
