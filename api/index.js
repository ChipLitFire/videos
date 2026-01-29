export default function handler(req, res) {
  // Get video ID from URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const videoId = url.searchParams.get('v') || '';
  
  // Create embed URL if we have an ID
  const embedUrl = videoId ? `https://streamable.com/e/${videoId}` : '';
  
  // HTML with dynamic metadata
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${videoId ? 'Streamable Video' : 'Streamable Fix'}</title>
    
    <!-- Discord Embed Metadata - CRITICAL -->
    <meta property="og:title" content="${videoId ? `Video: ${videoId}` : 'Streamable Fix'}">
    <meta property="og:description" content="Watch Streamable in Discord">
    <meta property="og:type" content="video.other">
    <meta property="og:video:width" content="1280">
    <meta property="og:video:height" content="720">
    
    ${embedUrl ? `
    <!-- THESE TAGS MAKE DISCORD SHOW THE VIDEO -->
    <meta property="og:video" content="${embedUrl}">
    <meta property="og:video:url" content="${embedUrl}">
    <meta property="og:video:secure_url" content="${embedUrl}">
    ` : ''}
    
    <style>
      body {
        background: #1a1a1a;
        color: white;
        font-family: sans-serif;
        padding: 40px;
        text-align: center;
      }
      input, button {
        padding: 10px;
        margin: 10px;
        font-size: 16px;
      }
    </style>
  </head>
  <body>
    <h1>🎬 Streamable Discord Fix</h1>
    
    ${videoId ? `
      <p><strong>Video ID:</strong> ${videoId}</p>
      <p>✅ This link should embed in Discord:</p>
      <code style="background:#333;padding:10px;display:block;margin:20px">
        ${url.href}
      </code>
    ` : `
      <p>Enter a Streamable video ID:</p>
      <input id="vid" placeholder="e.g., abc123">
      <button onclick="go()">Create Link</button>
      <script>
        function go() {
          const id = document.getElementById('vid').value;
          if(id) window.location = '/?v=' + id;
        }
      </script>
    `}
  </body>
  </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.end(html);
}
