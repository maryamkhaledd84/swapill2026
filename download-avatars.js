import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Create avatars directory if it doesn't exist
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const avatarsDir = path.join(__dirname, 'public', 'avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Function to download a file
function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(avatarsDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Download 15 human avatars (avatars 1-15)
const humanPromises = [];
for (let i = 1; i <= 15; i++) {
  const url = `https://api.dicebear.com/8.x/avataaars/svg?seed=human${i}&eyes=happy,wink&mouth=smile,tongue`;
  humanPromises.push(downloadFile(url, `avatar_${i}.svg`));
}

// Download 10 animal avatars (avatars 16-25)
const animalStyles = ['bottts', 'lorelei', 'notionists', 'personas'];
const animalPromises = [];
for (let i = 16; i <= 25; i++) {
  const styleIndex = (i - 16) % animalStyles.length;
  const style = animalStyles[styleIndex];
  const url = `https://api.dicebear.com/8.x/${style}/svg?seed=animal${i}`;
  animalPromises.push(downloadFile(url, `avatar_${i}.svg`));
}

// Download all avatars
Promise.all([...humanPromises, ...animalPromises])
  .then(() => {
    console.log('All avatars downloaded successfully!');
  })
  .catch((err) => {
    console.error('Error downloading avatars:', err);
  });
