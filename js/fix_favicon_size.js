const sharp = require('sharp');
const fs = require('fs');

async function fixFavicon() {
  try {
    const inputPath = 'images/favicon.webp';
    
    // Step 1: Read the original image into buffer
    const buffer = fs.readFileSync(inputPath);
    
    // Step 2: Trim all transparent padding so the logo touches the edges
    const trimmedBuffer = await sharp(buffer)
      .trim()
      .toBuffer();

    // Step 3: Get metadata of the trimmed image
    const trimmedImage = sharp(trimmedBuffer);
    const metadata = await trimmedImage.metadata();

    // Step 4: Crop a square from the left side (assuming the icon is on the left)
    const size = Math.min(metadata.width, metadata.height);
    const finalBuffer = await trimmedImage
      .extract({ left: 0, top: 0, width: size, height: size })
      .webp()
      .toBuffer();

    // Overwrite the original file
    fs.writeFileSync(inputPath, finalBuffer);
    
    console.log("Favicon size fixed successfully!");
  } catch (error) {
    console.error("Error fixing favicon:", error);
  }
}

fixFavicon();
