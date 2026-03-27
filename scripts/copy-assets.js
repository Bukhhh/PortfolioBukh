const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'projects images');
const destDir = path.join(__dirname, 'public', 'upload');

// Folders to create
const folders = [
  'projects/BankaiBotMY',
  'projects/CLARITY',
  'projects/KerjayaTechMY',
  'projects/RentVerse',
  'certificates',
  'profile'
];

folders.forEach(folder => {
  fs.mkdirSync(path.join(destDir, folder), { recursive: true });
});

function copyFiles(src, dest, prefix = '') {
  if (fs.existsSync(src)) {
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcFile = path.join(src, file);
      const destFile = path.join(dest, prefix + file);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`Copied ${file} to ${dest}`);
      }
    });
  }
}

// Copy Projects
copyFiles(path.join(srcDir, 'BankaiBotMY'), path.join(destDir, 'projects/BankaiBotMY'));
copyFiles(path.join(srcDir, 'CLARITY'), path.join(destDir, 'projects/CLARITY'));
copyFiles(path.join(srcDir, 'KerjayaTechMY'), path.join(destDir, 'projects/KerjayaTechMY'));
copyFiles(path.join(srcDir, 'RentVerse'), path.join(destDir, 'projects/RentVerse'));

// Copy Certificates
copyFiles(path.join(srcDir, 'CLARITY'), path.join(destDir, 'certificates'), 'clarity_');
copyFiles(path.join(srcDir, 'Online Certificate'), path.join(destDir, 'certificates'));

// Copy Profile & Logo
copyFiles(path.join(srcDir, 'Myself'), path.join(destDir, 'profile'));
copyFiles(path.join(srcDir, 'Logo'), path.join(destDir, 'profile'));
copyFiles(path.join(srcDir, 'Resume'), path.join(destDir, 'profile'));

console.log('All files copied successfully!');
