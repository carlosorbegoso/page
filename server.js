#!/usr/bin/env bun

import { serve } from "bun";
import { readFile } from "fs/promises";
import { join, extname } from "path";

const PORT = process.env.PORT || 3000;

// MIME types para diferentes extensiones
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Función para obtener el MIME type
function getMimeType(path) {
  const ext = extname(path).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

// Función para leer archivos
async function readFileContent(path) {
  try {
    return await readFile(path);
  } catch (error) {
    return null;
  }
}

console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
console.log(`📁 Sirviendo archivos desde: ${process.cwd()}`);

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;
    
    // Si es la raíz, servir index.html
    if (path === '/') {
      path = '/index.html';
    }
    
    // Construir la ruta del archivo
    const filePath = join(process.cwd(), path);
    
    try {
      const content = await readFileContent(filePath);
      
      if (content) {
        const mimeType = getMimeType(filePath);
        
        // Log para debugging
        console.log(`📁 Sirviendo: ${path} (${mimeType})`);
        
        return new Response(content, {
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } else {
        // Si no se encuentra el archivo
        if (path.endsWith('.js') || path.endsWith('.mjs')) {
          // Para archivos JavaScript, devolver 404 en lugar de index.html
          console.log(`❌ Archivo JavaScript no encontrado: ${path}`);
          return new Response('Archivo JavaScript no encontrado', { 
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
          });
        }
        
        if (path.endsWith('.html')) {
          return new Response('Archivo HTML no encontrado', { 
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
          });
        }
        
        // Para rutas de SPA (solo HTML), servir index.html
        const indexContent = await readFileContent(join(process.cwd(), 'index.html'));
        if (indexContent) {
          console.log(`🔄 SPA fallback para: ${path}`);
          return new Response(indexContent, {
            headers: {
              'Content-Type': 'text/html',
              'Cache-Control': 'no-cache'
            }
          });
        }
        
        return new Response('Archivo no encontrado', { 
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    } catch (error) {
      console.error('Error sirviendo archivo:', error);
      return new Response('Error interno del servidor', { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
});
