const express = require('express');
const app = express();
const PORT = 5173;

// Serve the redirect page for payment results
app.get('/pago/resultado', (req, res) => {
  const queryString = req.url.split('?')[1] || '';
  const redirectUrl = `http://localhost:5174/pago/resultado${queryString ? '?' + queryString : ''}`;

  console.log(`💳 Payment result redirect: ${req.url} -> ${redirectUrl}`);

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Procesando pago...</title>
        <style>
            body {
                font-family: system-ui, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: #f8fafc;
                color: #334155;
            }
            .container {
                text-align: center;
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .spinner {
                width: 32px;
                height: 32px;
                border: 3px solid #e2e8f0;
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="spinner"></div>
            <h2>Procesando resultado del pago</h2>
            <p>Redirigiendo a la aplicación...</p>
        </div>
        <script>
            setTimeout(() => {
                window.location.replace('${redirectUrl}');
            }, 1500);
        </script>
    </body>
    </html>
  `);
});

// Handle any other routes
app.use((req, res) => {
  const redirectUrl = `http://localhost:5174${req.originalUrl}`;
  console.log(`🔄 General redirect: ${req.originalUrl} -> ${redirectUrl}`);
  res.redirect(302, redirectUrl);
});

app.listen(PORT, () => {
  console.log(`🔄 Payment redirect server running on http://localhost:${PORT}`);
  console.log(`📡 Redirecting to main app on http://localhost:5174`);
  console.log(`💳 Payment results: localhost:5173/pago/resultado -> localhost:5174/pago/resultado`);
});

module.exports = app;