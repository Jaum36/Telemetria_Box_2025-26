const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Remover todos os middlewares CORS customizados e usar apenas o cors()
app.use(cors({
  origin: true, // Permite qualquer origem durante desenvolvimento
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(express.json());

// Middleware para debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

app.post('/api/spotify/token', async (req, res) => {
  const { code } = req.body;
  
  console.log('🎵 Recebendo código do Spotify:', code ? 'RECEBIDO' : 'VAZIO');
  
  if (!code) {
    return res.status(400).json({ error: 'Código não fornecido' });
  }
  
  try {
    console.log('📡 Enviando requisição para Spotify...');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://127.0.0.1:3000/callback'
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('❌ Erro do Spotify:', data);
      return res.status(400).json(data);
    }
    
    console.log('✅ Token obtido com sucesso!');
    res.json(data);
    
  } catch (error) {
    console.error('💥 Erro interno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString(),
    env: {
      hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
      hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
      clientIdLength: process.env.SPOTIFY_CLIENT_ID?.length || 0
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://127.0.0.1:${PORT}`);
  console.log(`🔑 Client ID configurado: ${process.env.SPOTIFY_CLIENT_ID ? 'SIM' : 'NÃO'}`);
  console.log(`🔐 Client Secret configurado: ${process.env.SPOTIFY_CLIENT_SECRET ? 'SIM' : 'NÃO'}`);
});