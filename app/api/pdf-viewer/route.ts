// app/api/pdf-viewer/route.ts
// Route Handler — returns a full HTML page using PDF.js (CDN)
// No browser PDF chrome or black borders.

export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return new Response('<p style="padding:40px;font-family:sans-serif;color:#666">No PDF URL provided.</p>', {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PDF Viewer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { background: #f8f8f8; font-family: sans-serif; }

    #toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    #toolbar .nav { display: flex; align-items: center; gap: 8px; }
    #toolbar button {
      padding: 5px 12px;
      border: 1.5px solid #e5e7eb;
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
      font-size: 13px;
      color: #374151;
      transition: all 0.15s;
    }
    #toolbar button:hover:not(:disabled) { border-color: #FF6F00; color: #FF6F00; }
    #toolbar button:disabled { opacity: 0.4; cursor: default; }
    #page-info { font-size: 13px; color: #6b7280; white-space: nowrap; }
    .zoom-group { display: flex; align-items: center; gap: 6px; }
    #zoom-level { font-size: 12px; color: #6b7280; min-width: 38px; text-align: center; }

    #pages {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 20px 16px 40px;
    }

    .page-wrapper {
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      border-radius: 4px;
      overflow: hidden;
      display: inline-block;
    }
    canvas { display: block; }

    #loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 60vh;
      gap: 16px;
      color: #6b7280;
    }
    .spinner {
      width: 36px; height: 36px;
      border: 3px solid #e5e7eb;
      border-top-color: #FF6F00;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    #error { display: none; padding: 40px; text-align: center; color: #ef4444; font-size: 14px; }
  </style>
</head>
<body>

<div id="toolbar">
  <div class="nav">
    <button id="prev" disabled>◀ Prev</button>
    <span id="page-info">— / —</span>
    <button id="next" disabled>Next ▶</button>
  </div>
  <div class="zoom-group">
    <button id="zoom-out">−</button>
    <span id="zoom-level">100%</span>
    <button id="zoom-in">+</button>
    <button id="zoom-fit">Fit</button>
  </div>
</div>

<div id="loading">
  <div class="spinner"></div>
  <span>Loading PDF…</span>
</div>
<div id="error">Failed to load PDF.</div>
<div id="pages" style="display:none"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
  const PDF_URL = ${JSON.stringify(url)};
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  let pdfDoc = null;
  let currentPage = 1;
  let scale = 1.4;
  let totalPages = 0;
  let rendering = false;

  const pagesDiv   = document.getElementById('pages');
  const loadingDiv = document.getElementById('loading');
  const errorDiv   = document.getElementById('error');
  const prevBtn    = document.getElementById('prev');
  const nextBtn    = document.getElementById('next');
  const pageInfo   = document.getElementById('page-info');
  const zoomIn     = document.getElementById('zoom-in');
  const zoomOut    = document.getElementById('zoom-out');
  const zoomFit    = document.getElementById('zoom-fit');
  const zoomLevel  = document.getElementById('zoom-level');

  async function renderAllPages() {
    pagesDiv.innerHTML = '';
    rendering = true;
    for (let i = 1; i <= totalPages; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale });
      const wrapper = document.createElement('div');
      wrapper.className = 'page-wrapper';
      const canvas = document.createElement('canvas');
      canvas.width  = viewport.width;
      canvas.height = viewport.height;
      wrapper.appendChild(canvas);
      pagesDiv.appendChild(wrapper);
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    }
    rendering = false;
    // Tell parent iframe to resize to fit all pages (no internal scrollbar)
    setTimeout(() => {
      const totalHeight = document.body.scrollHeight + 8;
      window.parent.postMessage({ type: 'pdf-height', height: totalHeight }, '*');
    }, 100);
  }

  async function renderPage(num) {
    if (rendering) return;
    currentPage = num;
    pageInfo.textContent = num + ' / ' + totalPages;
    prevBtn.disabled = num <= 1;
    nextBtn.disabled = num >= totalPages;

    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale });
    pagesDiv.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'page-wrapper';
    const canvas = document.createElement('canvas');
    canvas.width  = viewport.width;
    canvas.height = viewport.height;
    wrapper.appendChild(canvas);
    pagesDiv.appendChild(wrapper);
    rendering = true;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    rendering = false;
  }

  function updateZoom() {
    zoomLevel.textContent = Math.round(scale * 100) + '%';
  }

  pdfjsLib.getDocument(PDF_URL).promise.then(pdf => {
    pdfDoc = pdf;
    totalPages = pdf.numPages;
    loadingDiv.style.display = 'none';
    pagesDiv.style.display   = 'flex';

    if (totalPages <= 10) {
      pageInfo.textContent = '1 – ' + totalPages;
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      renderAllPages();
    } else {
      prevBtn.disabled = false;
      nextBtn.disabled = false;
      renderPage(1);
    }
    updateZoom();
  }).catch(err => {
    loadingDiv.style.display = 'none';
    errorDiv.style.display = 'block';
    console.error(err);
  });

  prevBtn.addEventListener('click', () => { if (currentPage > 1) renderPage(currentPage - 1); });
  nextBtn.addEventListener('click', () => { if (currentPage < totalPages) renderPage(currentPage + 1); });

  zoomIn.addEventListener('click', () => {
    if (scale >= 3) return;
    scale = Math.min(3, scale + 0.2);
    updateZoom();
    totalPages <= 10 ? renderAllPages() : renderPage(currentPage);
  });
  zoomOut.addEventListener('click', () => {
    if (scale <= 0.4) return;
    scale = Math.max(0.4, scale - 0.2);
    updateZoom();
    totalPages <= 10 ? renderAllPages() : renderPage(currentPage);
  });
  zoomFit.addEventListener('click', () => {
    const containerW = pagesDiv.clientWidth - 32;
    pdfjsLib.getDocument(PDF_URL).promise.then(pdf => pdf.getPage(1)).then(page => {
      const vp = page.getViewport({ scale: 1 });
      scale = Math.min(3, containerW / vp.width);
      updateZoom();
      totalPages <= 10 ? renderAllPages() : renderPage(currentPage);
    });
  });
</script>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
