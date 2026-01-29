export default function handler(req, res) {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const videoId = searchParams.get('v') || '';
  
  const embedUrl = videoId ? `https://streamable.com/e/${videoId}` : '';
  const pageUrl = req.url;
  const imageUrl = videoId ? `https://cdn-cf-east.streamable.com/image/${videoId}.jpg` : '';
  
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${videoId ? `Streamable: ${videoId}` : 'Streamable Discord Fix'}</title>
    
    <!-- Discord Embed Metadata -->
    <meta property="og:title" content="${videoId ? `Streamable: ${videoId}` : 'Streamable Discord Fix'}">
    <meta property="og:description" content="Watch Streamable videos in Discord">
    <meta property="og:type" content="video.other">
    <meta property="og:video:type" content="text/html">
    <meta property="og:video:width" content="1280">
    <meta property="og:video:height" content="720">
    ${embedUrl ? `
    <meta property="og:video" content="${embedUrl}">
    <meta property="og:video:url" content="${embedUrl}">
    <meta property="og:video:secure_url" content="${embedUrl}">
    <meta property="og:image" content="${imageUrl}">
    ` : ''}
    <meta property="og:url" content="${pageUrl}">
    
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        background: #1a1a1a; 
        color: white; 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        display: flex; 
        justify-content: center; 
        align-items: center; 
        min-height: 100vh; 
        padding: 20px;
      }
      .container { 
        max-width: 800px; 
        width: 100%; 
        text-align: center; 
      }
      iframe { 
        width: 100%; 
        height: 450px; 
        border: none; 
        border-radius: 10px;
        margin: 20px 0;
      }
      .input-group { 
        margin: 20px 0; 
        display: flex; 
        gap: 10px;
      }
      input { 
        flex: 1; 
        padding: 12px; 
        border: 2px solid #333; 
        border-radius: 5px; 
        background: #2a2a2a; 
        color: white;
      }
      button { 
        padding: 12px 24px; 
        background: #0070f3; 
        color: white; 
        border: none; 
        border-radius: 5px; 
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Streamable Discord Fix</h1>
      <p>Watch Streamable videos directly in Discord embeds</p>
      
      <div class="input-group">
        <input type="text" id="videoInput" placeholder="Enter Streamable ID (e.g., abc123)">
        <button onclick="loadVideo()">Load Video</button>
      </div>
      
      ${videoId ? `
        <iframe src="${embedUrl}" allowfullscreen></iframe>
        <p>Share this link in Discord: <br><code>${pageUrl}</code></p>
      ` : '<p>Enter a Streamable ID above to watch and share</p>'}
    </div>
    
    <script>
      function loadVideo() {
        const videoId = document.getElementById('videoInput').value.trim();
        if(videoId) {
          window.location.href = '/?v=' + videoId;
        }
      }
      
      // Auto-focus input
      document.getElementById('videoInput')?.focus();
    </script>
  </body>
  </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}