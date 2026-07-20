// app/api/pdf-viewer/route.ts
// Extracts text from the PDF using PDF.js and renders it as styled notes.
// No toolbar, no canvas pages, no page breaks, no zoom buttons.

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
  <title>Notes</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1f2937;
      font-size: 15px;
      line-height: 1.75;
    }

    #notes {
      width: 100%;
      max-width: 100%;
    }

    /* Headings — detected by large font size */
    .h1 { font-size: 1.6rem; font-weight: 700; color: #111827; margin: 1.4rem 0 0.5rem; }
    .h2 { font-size: 1.2rem; font-weight: 700; color: #111827; margin: 1.2rem 0 0.4rem; }
    .h3 { font-size: 1rem;   font-weight: 700; color: #374151; margin: 1rem 0 0.3rem; }

    /* Paragraphs */
    p {
      margin-bottom: 0.75rem;
      color: #374151;
      word-wrap: break-word;
    }

    /* Bullet lines */
    .bullet {
      padding-left: 1.2rem;
      position: relative;
      margin-bottom: 0.4rem;
      color: #374151;
    }
    .bullet::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #FF6F00;
      font-weight: 700;
    }

    /* Loading */
    #loading {
      padding: 48px 0;
      text-align: center;
      color: #9ca3af;
      font-size: 14px;
    }
    .spinner {
      width: 32px; height: 32px;
      border: 3px solid #e5e7eb;
      border-top-color: #FF6F00;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin: 0 auto 12px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    #error { display: none; padding: 40px; color: #ef4444; font-size: 14px; }
  </style>
</head>
<body>

<div id="loading"><div class="spinner"></div>Loading…</div>
<div id="error">Failed to load PDF content.</div>
<div id="notes" style="display:none"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
const PDF_URL = ${JSON.stringify(url)};
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Detect if a text run looks like a heading candidate
function looksLikeHeading(text, fontSize, avgFontSize) {
  if (!text.trim()) return false;
  const big = fontSize >= avgFontSize * 1.25;
  const short = text.trim().length < 120;
  const noEndPunct = !/[.,;:!?]$/.test(text.trim());
  return big && short && noEndPunct;
}

// Strip lone page numbers or decorative artifacts
function isJunk(text) {
  const t = text.trim();
  if (!t) return true;
  if (/^\\d{1,4}$/.test(t)) return true;          // bare page numbers
  if (/^Page \\d+( of \\d+)?$/i.test(t)) return true;
  if (t.length < 2) return true;
  return false;
}

async function extractAndRender() {
  const notesDiv = document.getElementById('notes');
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('error');

  try {
    const pdf = await pdfjsLib.getDocument(PDF_URL).promise;

    // First pass: collect all items with font sizes to compute average
    const allItems = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const tc = await page.getTextContent({ normalizeWhitespace: true });
      for (const item of tc.items) {
        if (item.str) {
          allItems.push({ str: item.str, fontSize: item.transform ? Math.abs(item.transform[0]) : 12, y: item.transform ? item.transform[5] : 0 });
        }
      }
    }

    if (allItems.length === 0) {
      notesDiv.innerHTML = '<p style="color:#9ca3af;padding:24px 0">No text content found in this PDF.</p>';
      loadingDiv.style.display = 'none';
      notesDiv.style.display = 'block';
      signalHeight();
      return;
    }

    const sizes = allItems.map(i => i.fontSize).filter(s => s > 0);
    const avgFontSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;

    // Second pass: rebuild the PDF page-by-page, grouping items into lines then paragraphs
    const html = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const tc = await page.getTextContent({ normalizeWhitespace: true });
      if (!tc.items.length) continue;

      // Group items into lines by their y-coordinate (within 2pt tolerance)
      const lines = [];
      let currentLine = null;
      for (const item of tc.items) {
        if (!item.str) continue;
        const y = item.transform ? Math.round(item.transform[5]) : 0;
        const fontSize = item.transform ? Math.abs(item.transform[0]) : 12;
        if (!currentLine || Math.abs(currentLine.y - y) > 2) {
          currentLine = { y, text: '', maxFontSize: fontSize };
          lines.push(currentLine);
        }
        currentLine.text += item.str;
        if (fontSize > currentLine.maxFontSize) currentLine.maxFontSize = fontSize;
      }

      // Sort lines by descending y (PDF y-axis is bottom-up)
      lines.sort((a, b) => b.y - a.y);

      // Merge short adjacent lines into paragraphs, detect headings & bullets
      let paragraphText = '';
      let paragraphFontSize = avgFontSize;

      const flush = () => {
        const t = paragraphText.trim();
        if (!t || isJunk(t)) { paragraphText = ''; return; }

        const big = paragraphFontSize >= avgFontSize * 1.35;
        const medium = paragraphFontSize >= avgFontSize * 1.15;

        // Bullet detection
        if (/^[•·○●–\\-\\*]\\s/.test(t)) {
          const content = escapeHtml(t.slice(t.indexOf(' ') + 1).trim());
          html.push('<div class="bullet">' + content + '</div>');
        } else if (big && t.length < 100) {
          html.push('<div class="h1">' + escapeHtml(t) + '</div>');
        } else if (medium && t.length < 120 && !/[.,;]$/.test(t)) {
          html.push('<div class="h2">' + escapeHtml(t) + '</div>');
        } else if (looksLikeHeading(t, paragraphFontSize, avgFontSize) && t.length < 120) {
          html.push('<div class="h3">' + escapeHtml(t) + '</div>');
        } else {
          html.push('<p>' + escapeHtml(t) + '</p>');
        }
        paragraphText = '';
        paragraphFontSize = avgFontSize;
      };

      for (const line of lines) {
        const t = line.text.trim();
        if (!t) { flush(); continue; }

        const isHeadingLine = looksLikeHeading(t, line.maxFontSize, avgFontSize);
        const isBullet = /^[•·○●–\\-\\*]\\s/.test(t);

        if (isHeadingLine || isBullet) {
          flush();
          paragraphText = t;
          paragraphFontSize = line.maxFontSize;
          flush();
        } else {
          // Accumulate into paragraph
          if (paragraphText) paragraphText += ' ';
          paragraphText += t;
          if (line.maxFontSize > paragraphFontSize) paragraphFontSize = line.maxFontSize;
          // Flush if line ends a sentence
          if (/[.!?]$/.test(t)) flush();
        }
      }
      flush();
    }

    loadingDiv.style.display = 'none';
    notesDiv.innerHTML = html.join('\\n');
    notesDiv.style.display = 'block';
    signalHeight();

  } catch(err) {
    console.error(err);
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
  }
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function signalHeight() {
  setTimeout(() => {
    const h = document.body.scrollHeight + 8;
    window.parent.postMessage({ type: 'pdf-height', height: h }, '*');
  }, 100);
}

extractAndRender();
</script>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
