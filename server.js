import express from 'express';
import cors from 'cors';
import { exec } from 'yt-dlp-exec';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
  const { urls, format, quality, start } = req.body;

  res.json({ message: "Procesando descargas... Revisa tu carpeta de descargas." });

  for (const url of urls) {
    try {
      let options = {
        output: '%(title)s.%(ext)s',
        noWarnings: true,
      };

      if (format === 'mp3') {
        options = {
          ...options,
          extractAudio: true,
          audioFormat: 'mp3',
          audioQuality: 0
        };
      } else {
        if (quality !== 'best') options.format = `bestvideo[height<=${quality}]+bestaudio`;
      }

      if (parseInt(start) > 0) {
        options.downloadSections = `*${start}-`;
      }

      await exec(url, options);
      console.log(`✅ Descargado: ${url}`);
    } catch (error) {
      console.error(`❌ Error con ${url}:`, error);
    }
  }
});

app.listen(3000, () => {
  console.log('🚀 GrabTube Backend corriendo en http://localhost:3000');
});