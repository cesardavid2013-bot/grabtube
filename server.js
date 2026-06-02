import express from 'express';
import cors from 'cors';
import { exec } from 'yt-dlp-exec';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
  const { urls, format, quality, start, end } = req.body;

  if (!urls || urls.length === 0) {
    return res.status(400).json({ error: "No hay enlaces" });
  }

  res.json({ success: true, message: `✅ Procesando ${urls.length} enlaces...` });

  for (const url of urls) {
    try {
      const options = { 
        output: '%(title)s.%(ext)s',
        noWarnings: true 
      };

      // Formato
      if (format === 'mp3') {
        options.extractAudio = true;
        options.audioFormat = 'mp3';
      } else if (quality !== 'best') {
        options.format = `bestvideo[height<=${quality}]+bestaudio/best`;
      }

      // Recortar video/audio (Inicio y Fin)
      if (parseInt(start) > 0 || parseInt(end) > 0) {
        const startSec = parseInt(start) || 0;
        const endSec = parseInt(end) || null;
        
        if (endSec) {
          options.downloadSections = `*${startSec}-${endSec}`;
        } else {
          options.downloadSections = `*${startSec}-`;
        }
      }

      await exec(url, options);
      console.log(`✅ Descargado: ${url}`);
    } catch (error) {
      console.error(`❌ Error con ${url}:`, error.message);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 GrabTube corriendo en puerto ${PORT}`));
