import { v4 as uuidv4 } from "uuid";
import path from "path";

// Test UUID filename generation
console.log("Testing UUID filename generation...");

for (let i = 0; i < 5; i++) {
  const originalFilename = "test-document.docx";
  const fileExtension = path.extname(originalFilename);
  const uniqueId = uuidv4();
  const filename = `${uniqueId}${fileExtension}`;

  console.log(`Original: ${originalFilename} -> UUID: ${filename}`);
}

console.log("UUID generation test completed!");
