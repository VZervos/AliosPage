const fs = require('fs');
const path = require('path');

// Configuration
const mediaBasePath = './media';
const folders = ['home', 'about', 'join', 'collaborate'];

// Image and video extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];

function renameFilesInFolder(folderName) {
    const folderPath = path.join(mediaBasePath, folderName);
    
    if (!fs.existsSync(folderPath)) {
        console.log(`⚠️  Folder ${folderName} does not exist, skipping...`);
        return;
    }

    const files = fs.readdirSync(folderPath);
    const images = [];
    const videos = [];

    // Separate images and videos
    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        const fullPath = path.join(folderPath, file);
        
        // Skip if it's already a numbered file
        const baseName = path.basename(file, ext);
        if (/^\d+$/.test(baseName)) {
            console.log(`⏭️  Skipping already numbered file: ${file}`);
            return;
        }

        if (imageExtensions.includes(ext)) {
            images.push({ oldName: file, ext: ext, fullPath: fullPath });
        } else if (videoExtensions.includes(ext)) {
            videos.push({ oldName: file, ext: ext, fullPath: fullPath });
        }
    });

    // Sort by filename for consistent ordering
    images.sort((a, b) => a.oldName.localeCompare(b.oldName));
    videos.sort((a, b) => a.oldName.localeCompare(b.oldName));

    // Rename images
    images.forEach((img, index) => {
        const newName = `${index + 1}${img.ext}`;
        const newPath = path.join(folderPath, newName);
        
        // Check if target file already exists
        if (fs.existsSync(newPath) && newPath !== img.fullPath) {
            console.log(`⚠️  ${newName} already exists, skipping rename of ${img.oldName}`);
            return;
        }

        try {
            fs.renameSync(img.fullPath, newPath);
            console.log(`✅ Renamed: ${img.oldName} → ${newName}`);
        } catch (error) {
            console.error(`❌ Error renaming ${img.oldName}:`, error.message);
        }
    });

    // Rename videos
    videos.forEach((vid, index) => {
        const newName = `video-${index + 1}${vid.ext}`;
        const newPath = path.join(folderPath, newName);
        
        // Check if target file already exists
        if (fs.existsSync(newPath) && newPath !== vid.fullPath) {
            console.log(`⚠️  ${newName} already exists, skipping rename of ${vid.oldName}`);
            return;
        }

        try {
            fs.renameSync(vid.fullPath, newPath);
            console.log(`✅ Renamed: ${vid.oldName} → ${newName}`);
        } catch (error) {
            console.error(`❌ Error renaming ${vid.oldName}:`, error.message);
        }
    });

    console.log(`\n📊 ${folderName}: ${images.length} images, ${videos.length} videos processed\n`);
}

// Process all folders
console.log('🔄 Starting file renaming process...\n');

folders.forEach(folder => {
    console.log(`📁 Processing folder: ${folder}`);
    renameFilesInFolder(folder);
});

console.log('✅ File renaming complete!');


