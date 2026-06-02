import express from 'express';
import cors from 'cors';
import { exec } from 'yt-dlp-exec';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
  const { urls, format, quality, start } = req.body;

  if (!urls || urls.length === 0) {
    return res.status(400).json({ error: "No hay enlaces" });
  }

  res.json({ 
    success: true, 
    message: `Procesando ${urls.length} descarga(s)...` 
  });

  for (const url of urls) {
    try {
      const options = {
        output: '%(title)s.%(ext)s',
        noWarnings: true,
      };

      if (format === 'mp3') {
        options.extractAudio = true;
        options.audioFormat = 'mp3';
        options.audioQuality = 0;
      } else if (quality !== 'best') {
        options.format = `bestvideo[height<=${quality}]+bestaudio/best`;
      }

      if (parseInt(start) > 0) {
        options.downloadSections = `*${start}-`;
      }

      await exec(url, options);
      console.log(`✅ Descargado: ${url}`);
    } catch (error) {
      console.error(`❌ Error descargando ${url}:`, error.message);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 GrabTube Backend corriendo en puerto ${PORT}`);
});