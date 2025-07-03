console.log("Testing basic PDF parsing...");

try {
  const pdf = require("pdf-parse");
  console.log("pdf-parse module loaded successfully");
} catch (error) {
  console.error("Error loading pdf-parse:", error);
}

console.log("Script completed");
