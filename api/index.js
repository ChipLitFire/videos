export default function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const videoId = url.searchParams.get('v') || '';
  const isValidId = /^[a-z0-9]+$/i.test(videoId);
  const embedUrl = isValidId ? `https://streamable.com/e/${videoId}` : '';

  if (videoId && !isValidId) {
    return res.status(400).send('Invalid video ID');
  }

  const html = `
  <!DOCTYPE html>
  <html prefix="og: https://ogp.me/ns#">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${videoId ? `Video ${videoId}` : 'Streamable Embed'}</title>
    
    <meta property="og:title" content="Streamable Video">
    <meta property="og:description" content="Click to watch">
    <meta property="og:type" content="video.other">
    <meta property="og:site_name" content="Streamable">
    <meta property="og:url" content="${url.href}">
    <meta property="theme-color" content="#ff0000">
    <meta property="og:image" content="https://i.imgur.com/KJJxVi4.png">
    <meta name="twitter:card" content="player">
    <meta name="twitter:title" content="Streamable Video">
    <meta name="twitter:description" content="Click to watch">
    <meta name="twitter:image" content="https://i.imgur.com/KJJxVi4.png">
    
    ${embedUrl ? `
    <meta property="og:video" content="${embedUrl}">
    <meta property="og:video:url" content="${embedUrl}">
    <meta property="og:video:secure_url" content="${embedUrl}">
    <meta property="og:video:type" content="text/html">
    <meta property="og:video:width" content="1280">
    <meta property="og:video:height" content="720">
    <meta name="twitter:player" content="${embedUrl}">
    <meta name="twitter:player:width" content="1280">
    <meta name="twitter:player:height" content="720">
    
    <script>
      window.onload = function() {
        fetch('${embedUrl}')
          .then(response => response.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const videoData = doc.querySelector('[data-video-json]');
            if (videoData) {
              const data = JSON.parse(videoData.getAttribute('data-video-json'));
              const videoUrl = data.files.mp4.url;
              const video = document.createElement('video');
              video.src = videoUrl;
              video.controls = true;
              video.autoplay = false;
              video.style.width = '100%';
              video.style.maxWidth = '800px';
              document.getElementById('player').appendChild(video);
              document.getElementById('status').innerHTML = 'Video loaded successfully';
            }
          })
          .catch(() => {
            document.getElementById('status').innerHTML = 'Could not load video';
          });
      }
    </script>
    ` : ''}
    
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        background: #000;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .container {
        width: 100%;
        max-width: 800px;
        text-align: center;
      }
      h1 {
        font-size: 2.8em;
        margin-bottom: 20px;
        background: linear-gradient(90deg, #ff0000, #ff6666);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-weight: 900;
      }
      .input-group {
        display: flex;
        gap: 10px;
        margin: 30px auto;
        max-width: 500px;
      }
      input {
        flex: 1;
        padding: 15px;
        border: 2px solid #333;
        border-radius: 10px;
        background: #111;
        color: #fff;
        font-size: 16px;
        transition: border 0.3s;
      }
      input:focus {
        outline: none;
        border-color: #ff0000;
      }
      button {
        padding: 15px 30px;
        background: #ff0000;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s, background 0.3s;
      }
      button:hover {
        background: #cc0000;
        transform: translateY(-2px);
      }
      .video-container {
        width: 100%;
        background: #111;
        border-radius: 15px;
        padding: 20px;
        margin: 30px 0;
        min-height: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .link-box {
        background: #111;
        border-radius: 10px;
        padding: 15px;
        margin: 20px auto;
        max-width: 600px;
        word-break: break-all;
        font-family: 'Courier New', monospace;
        border: 1px solid #333;
      }
      .instructions {
        background: rgba(255, 0, 0, 0.1);
        border-radius: 10px;
        padding: 20px;
        margin: 20px 0;
        text-align: left;
      }
      .status {
        margin: 15px 0;
        font-size: 14px;
        color: #aaa;
      }
      .preview {
        color: #888;
        margin-top: 10px;
        font-size: 14px;
      }
      .watermark {
        margin-top: 40px;
        color: #666;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🎬 Streamable Player</h1>
      
      ${videoId ? `
        <div class="video-container">
          <div id="player"></div>
          <div id="status" class="status">Loading video...</div>
        </div>
        <div class="link-box">
          ${url.href}
        </div>
        <p class="preview">This link embeds in Discord automatically</p>
      ` : `
        <p>Enter Streamable video ID (from streamable.com/abc123)</p>
        <div class="input-group">
          <input id="vid" placeholder="abc123" autofocus>
          <button onclick="go()">Embed Video</button>
        </div>
        <div class="instructions">
          <p>1. Find video ID from Streamable URL</p>
          <p>2. Enter ID above and click "Embed Video"</p>
          <p>3. Copy the generated link and paste in Discord</p>
          <p>4. Video will play directly in Discord embed</p>
        </div>
        <script>
          function go() {
            const id = document.getElementById('vid').value.trim();
            if(id) window.location = '/?v=' + id;
          }
          document.getElementById('vid').addEventListener('keypress', (e) => {
            if(e.key === 'Enter') go();
          });
        </script>
      `}
      
      <div class="watermark">
        Streamable Discord Embed Fix • Works instantly
      </div>
    </div>
  </body>
  </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.end(html);
}
