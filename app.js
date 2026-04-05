// === PDF.js Worker Setup ===
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// === State ===
const state = {
  pdfDoc:    null,
  currentPage: 1,
  totalPages:  0,
  mode:      'normal',
  fontSize:  16,
  readTheme: 'dark',
  scale:     1.6,
};

// === DOM References ===
const uploadScreen    = document.getElementById('upload-screen');
const viewerScreen    = document.getElementById('viewer-screen');
const fileInput       = document.getElementById('file-input');
const dropZone        = document.getElementById('drop-zone');
const btnBack         = document.getElementById('btn-back');
const btnNormal       = document.getElementById('btn-normal');
const btnRead         = document.getElementById('btn-read');
const readingCtrls    = document.getElementById('reading-controls');
const btnFontUp       = document.getElementById('btn-font-up');
const btnFontDown     = document.getElementById('btn-font-down');
const fontDisplay     = document.getElementById('font-size-display');
const btnPrev         = document.getElementById('btn-prev');
const btnNext         = document.getElementById('btn-next');
const currentPageEl   = document.getElementById('current-page');
const totalPagesEl    = document.getElementById('total-pages');
const canvasContainer = document.getElementById('canvas-container');
const readContent     = document.getElementById('read-content');
const readView        = document.getElementById('read-view');
const normalView      = document.getElementById('normal-view');
const pageNav         = document.getElementById('page-nav');
const loadingOverlay  = document.getElementById('loading-overlay');
const progressBar     = document.getElementById('progress-bar');
const fileNameDisplay = document.getElementById('file-name-display');
const btnThemeLight   = document.getElementById('btn-theme-light');
const btnThemeSepia   = document.getElementById('btn-theme-sepia');
const btnThemeDark    = document.getElementById('btn-theme-dark');

// === Internal tracking ===
let canvasWrappers   = [];  // div.page-wrapper elements for normal mode
let readPageAnchors  = [];  // anchor div elements per page in read mode
let normalObserver   = null;
let readObserver     = null;

// === Helpers ===
function setProgress(pct) { progressBar.style.width = pct + '%'; }
function showLoading()     { loadingOverlay.classList.remove('hidden'); }
function hideLoading()     { loadingOverlay.classList.add('hidden'); }

// === File Handling ===
fileInput.addEventListener('change', e => {
  if (e.target.files[0]) loadPDF(e.target.files[0]);
});

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') loadPDF(file);
});
dropZone.addEventListener('click', () => fileInput.click());

// === Load PDF ===
async function loadPDF(file) {
  fileNameDisplay.textContent = file.name;
  uploadScreen.classList.remove('active');
  viewerScreen.classList.add('active');
  showLoading();
  setProgress(10);

  // Using FileReader is highly resilient on Safari/iOS compared to file.arrayBuffer() or createObjectURL
  const arrayBuffer = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
  setProgress(30);

  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  loadingTask.onProgress = ({ loaded, total }) => {
    if (total) setProgress(30 + Math.round((loaded / total) * 20));
  };

  try {
    state.pdfDoc       = await loadingTask.promise;
    state.totalPages   = state.pdfDoc.numPages;
    state.currentPage  = 1;
    totalPagesEl.textContent = state.totalPages;

    prepareNormalPages();
    prepareReadPages();

    setProgress(100);
    setTimeout(() => setProgress(0), 600);
    hideLoading();

    pageNav.classList.remove('hidden');
    updatePageIndicator();
  } catch (err) {
    console.error('Error loading PDF:', err);
    hideLoading();
    alert('Error al cargar el PDF. El archivo puede estar protegido o dañado.');
  }
}

// === Prepare Normal Mode (Lazy) ===
function prepareNormalPages() {
  canvasContainer.innerHTML = '';
  canvasWrappers = [];
  if (normalObserver) normalObserver.disconnect();

  normalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const wrapper = entry.target;
        if (wrapper.dataset.rendered === 'false') {
          renderSinglePage(wrapper);
        }
      }
    });
  }, { root: normalView, rootMargin: '800px 0px' });

  const containerW = canvasContainer.clientWidth - 32 || 300;
  const estimatedH = containerW * 1.414; // A4 ratio

  for (let i = 1; i <= state.totalPages; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'page-wrapper';
    wrapper.dataset.page = String(i);
    wrapper.dataset.rendered = 'false';
    wrapper.style.width = containerW + 'px';
    wrapper.style.height = estimatedH + 'px';
    wrapper.style.marginBottom = '1.5rem';
    
    canvasContainer.appendChild(wrapper);
    canvasWrappers.push(wrapper);
    normalObserver.observe(wrapper);
  }

  normalView.addEventListener('scroll', onNormalScroll, { passive: true });
}

async function renderSinglePage(wrapper) {
  wrapper.dataset.rendered = 'pending';
  const pageNum = parseInt(wrapper.dataset.page);
  try {
    const page = await state.pdfDoc.getPage(pageNum);
    const containerW = canvasContainer.clientWidth - 32 || 300;
    
    const viewport0 = page.getViewport({ scale: 1 });
    let renderScale = Math.min(state.scale, containerW / viewport0.width);
    
    // Protect iOS limits
    const DPR = window.devicePixelRatio || 1;
    if (viewport0.width * renderScale * DPR > 2400) {
      renderScale = 2400 / (viewport0.width * DPR);
    }
    
    const viewport = page.getViewport({ scale: renderScale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width * DPR;
    canvas.height = viewport.height * DPR;
    canvas.style.width = viewport.width + 'px';
    canvas.style.height = viewport.height + 'px';
    
    // Apply styling from previous css
    canvas.style.borderRadius = '8px';
    canvas.style.boxShadow = '0 8px 40px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.05)';
    canvas.style.display = 'block';
    canvas.style.animation = 'fadeup .3s ease';
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';

    const ctx = canvas.getContext('2d');
    const transform = DPR !== 1 ? [DPR, 0, 0, DPR, 0, 0] : null;

    wrapper.style.height = 'auto';
    wrapper.appendChild(canvas);

    await page.render({ canvasContext: ctx, transform, viewport }).promise;
    wrapper.dataset.rendered = 'true';
  } catch(e) {
    console.error('Error render page', pageNum, e);
    wrapper.dataset.rendered = 'error';
  }
}

// === Extract text for reading mode (Lazy) ===
function prepareReadPages() {
  readContent.innerHTML = '';
  readPageAnchors = [];
  if (readObserver) readObserver.disconnect();

  readObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const anchor = entry.target;
        if (anchor.dataset.extracted === 'false') {
          extractSinglePageText(anchor);
        }
      }
    });
  }, { root: readView, rootMargin: '800px 0px' });

  for (let i = 1; i <= state.totalPages; i++) {
    const anchor = document.createElement('div');
    anchor.className = 'read-page-anchor';
    anchor.dataset.page = String(i);
    anchor.dataset.extracted = 'false';
    anchor.style.minHeight = '150px';
    anchor.style.visibility = 'visible'; // Overriding previous CSS trick to allow intersection
    anchor.style.height = 'auto';
    anchor.style.position = 'relative';

    const label = document.createElement('div');
    label.className = 'read-page-label';
    label.textContent = `Página ${i}`;
    anchor.appendChild(label);

    const txtContainer = document.createElement('div');
    txtContainer.className = 'read-txt-box';
    anchor.appendChild(txtContainer);

    readContent.appendChild(anchor);
    readPageAnchors.push(anchor);
    readObserver.observe(anchor);
  }

  readView.addEventListener('scroll', onReadScroll, { passive: true });
}

async function extractSinglePageText(anchor) {
  anchor.dataset.extracted = 'pending';
  const pageNum = parseInt(anchor.dataset.page);
  const tb = anchor.querySelector('.read-txt-box');

  try {
    const page = await state.pdfDoc.getPage(pageNum);
    const content = await page.getTextContent();
    
    let pageText = '';
    let lastY = null;
    content.items.forEach(item => {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
        pageText += '\n';
      }
      pageText += item.str;
      lastY = item.transform[5];
    });

    const para = document.createElement('p');
    para.textContent = pageText.trim() || '(Página sin texto)';
    tb.appendChild(para);
    anchor.dataset.extracted = 'true';
  } catch (e) {
    console.error('Error text page', pageNum, e);
    tb.innerHTML = '<p>(Error al procesar texto)</p>';
    anchor.dataset.extracted = 'error';
  }
}

// Detect current page by scroll position in read mode
function onReadScroll() {
  const viewTop = readView.scrollTop;
  for (let i = readPageAnchors.length - 1; i >= 0; i--) {
    if (readPageAnchors[i].offsetTop <= viewTop + 80) {
      const p = parseInt(readPageAnchors[i].dataset.page);
      if (p !== state.currentPage) {
        state.currentPage = p;
        updatePageIndicator();
      }
      break;
    }
  }
}

// === Page Indicator ===
function updatePageIndicator() {
  currentPageEl.textContent = state.currentPage;
  btnPrev.disabled = state.currentPage <= 1;
  btnNext.disabled = state.currentPage >= state.totalPages;
}

// === Navigation (scroll to page) ===
function scrollToPage(pageNum) {
  if (state.mode === 'normal') {
    const wrapper = canvasWrappers[pageNum - 1];
    if (wrapper) {
      normalView.scrollTo({ top: wrapper.offsetTop - 12, behavior: 'smooth' });
    }
  } else {
    const anchor = readPageAnchors[pageNum - 1];
    if (anchor) {
      readView.scrollTo({ top: anchor.offsetTop - 8, behavior: 'smooth' });
    }
  }
}

btnPrev.addEventListener('click', () => {
  if (state.currentPage > 1) scrollToPage(state.currentPage - 1);
});
btnNext.addEventListener('click', () => {
  if (state.currentPage < state.totalPages) scrollToPage(state.currentPage + 1);
});

// Keyboard arrow navigation
document.addEventListener('keydown', e => {
  if (!state.pdfDoc) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (state.currentPage < state.totalPages) scrollToPage(state.currentPage + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (state.currentPage > 1) scrollToPage(state.currentPage - 1);
  }
});

// === Mode Toggle ===
btnNormal.addEventListener('click', () => switchMode('normal'));
btnRead.addEventListener('click',   () => switchMode('read'));

function switchMode(mode) {
  state.mode = mode;
  if (mode === 'normal') {
    btnNormal.classList.add('active');
    btnRead.classList.remove('active');
    normalView.classList.remove('hidden');
    readView.classList.add('hidden');
    readingCtrls.classList.remove('visible');
    // Sync page indicator to normal view
    setTimeout(onNormalScroll, 50);
  } else {
    btnRead.classList.add('active');
    btnNormal.classList.remove('active');
    readView.classList.remove('hidden');
    normalView.classList.add('hidden');
    readingCtrls.classList.add('visible');
    // Scroll read view to match current page
    setTimeout(() => {
      const anchor = readPageAnchors[state.currentPage - 1];
      if (anchor) readView.scrollTo({ top: anchor.offsetTop - 8, behavior: 'instant' });
      onReadScroll();
    }, 50);
  }
}

// === Font Size ===
const MIN_FONT = 11, MAX_FONT = 36;

function applyFontSize() {
  document.documentElement.style.setProperty('--font-read', state.fontSize + 'px');
  fontDisplay.textContent = state.fontSize + 'px';
}

btnFontUp.addEventListener('click', () => {
  if (state.fontSize < MAX_FONT) { state.fontSize++; applyFontSize(); }
});
btnFontDown.addEventListener('click', () => {
  if (state.fontSize > MIN_FONT) { state.fontSize--; applyFontSize(); }
});

// === Reading Themes ===
function applyTheme(theme) {
  state.readTheme = theme;
  readView.className = 'view-container';
  if (theme !== 'dark') readView.classList.add(theme);

  [btnThemeLight, btnThemeSepia, btnThemeDark].forEach(b => b.style.outline = '');
  const map = { light: btnThemeLight, sepia: btnThemeSepia, dark: btnThemeDark };
  if (map[theme]) map[theme].style.outline = '2px solid #7c3aed';
}

btnThemeLight.addEventListener('click', () => applyTheme('light'));
btnThemeSepia.addEventListener('click', () => applyTheme('sepia'));
btnThemeDark.addEventListener('click',  () => applyTheme('dark'));
btnThemeDark.style.outline = '2px solid #7c3aed'; // default

// === Text-to-Speech with syllable highlighting ===
const ttsSupported = 'speechSynthesis' in window;
let activeTtsCleanup = null; // cancel previous TTS on new click

// --- Caret position at (x,y) → {node, offset} ---
function caretAt(x, y) {
  if (document.caretRangeFromPoint) {
    const r = document.caretRangeFromPoint(x, y);
    return r ? { node: r.startContainer, offset: r.startOffset } : null;
  }
  if (document.caretPositionFromPoint) {
    const p = document.caretPositionFromPoint(x, y);
    return p ? { node: p.offsetNode, offset: p.offset } : null;
  }
  return null;
}

// --- Find word range at a click point ---
function getWordRangeAtPoint(x, y) {
  const caret = caretAt(x, y);
  if (!caret || !caret.node || caret.node.nodeType !== Node.TEXT_NODE) return null;

  const text        = caret.node.textContent;
  const isWordChar  = ch => /[\wÀ-ÿ'-]/.test(ch);
  let start = caret.offset;
  let end   = caret.offset;

  while (start > 0 && isWordChar(text[start - 1])) start--;
  while (end < text.length && isWordChar(text[end]))  end++;
  if (start === end) return null;

  const range = document.createRange();
  range.setStart(caret.node, start);
  range.setEnd(caret.node,   end);
  return range;
}

// --- Split a word into syllables (Enhanced English heuristic) ---
function syllabify(word) {
  if (word.length <= 2) return [word];
  const w = word.toLowerCase();

  // 1. Silent 'E' drop at word end (except 'le' preceded by consonant)
  let base = w;
  let silentESuffix = "";
  if (w.endsWith('e') && !w.endsWith('le')) {
    base = w.slice(0, -1);
    silentESuffix = "e";
  } else if (w.endsWith('es') && w.length > 3) {
    base = w.slice(0, -2);
    silentESuffix = "es";
  } else if (w.endsWith('ed') && w.length > 3 && !['t','d'].includes(w[w.length-3])) {
    base = w.slice(0, -2);
    silentESuffix = "ed";
  }

  // 2. Vowel digraphs/trigraphs (longest first)
  const DIGRAPHS = [
    'ough','augh','eau','igh',
    'ai','ay','ea','ee','ei','eu','ew','ey',
    'ie','oa','oe','oi','oo','ou','ow','oy',
    'au','aw','ue','ui','uy'
  ].sort((a, b) => b.length - a.length);

  // 3. Legal syllable onsets (for splitting consonant clusters)
  const ONSETS = new Set([
    'bl','br','ch','cl','cr','dr','dw','fl','fr','gl','gr',
    'kl','kn','kw','ph','pl','pr','qu','sc','sh','sk','sl',
    'sm','sn','sp','sq','st','sw','th','tr','tw','wh','wr',
    'scr','spl','spr','str','shr','thr','sch'
  ]);

  const isVowel = (c, pos) => 'aeiou'.includes(c) || (c === 'y' && pos > 0);

  // Find vowel nuclei limits in base word
  const nuclei = [];
  let i = 0;
  while (i < base.length) {
    let hit = false;
    for (const dg of DIGRAPHS) {
      if (base.startsWith(dg, i)) {
        nuclei.push({ start: i, end: i + dg.length });
        i += dg.length; hit = true; break;
      }
    }
    if (!hit) {
      if (isVowel(base[i], i)) {
        let j = i;
        while (j < base.length && isVowel(base[j], j)) j++;
        nuclei.push({ start: i, end: j }); i = j;
      } else { i++; }
    }
  }

  // If 0 or 1 nucleus, it's a single syllable word
  if (nuclei.length <= 1) {
    return [word];
  }

  // Find split indices
  const splits = [0];
  for (let n = 0; n < nuclei.length - 1; n++) {
    const cStart = nuclei[n].end;
    const cEnd   = nuclei[n + 1].start;
    const cons   = base.slice(cStart, cEnd);
    
    let splitAt = cStart; // default: V-CV (after vowel)
    
    if (cons.length === 1) {
      // V-CV: usually split before single consonant (ra-ven)
      splitAt = cStart;
    } else if (cons.length >= 2) {
      // V-CCV / V-CCCV: onset maximization
      for (let s = Math.min(cons.length, 3); s >= 1; s--) {
        const onset = cons.slice(cons.length - s);
        if (ONSETS.has(onset) || (s === 1 && !isVowel(onset, 1))) {
          // Found a valid onset or single consonant
          splitAt = cEnd - s;
          break;
        }
      }
    }
    splits.push(splitAt);
  }
  
  // Use the silent suffix to attach to the last piece
  const finalCut = base.length;
  splits.push(finalCut);

  // Extract syllables using original casing
  const result = [];
  for (let k = 0; k < splits.length - 1; k++) {
    let s = word.slice(splits[k], splits[k + 1]);
    if (k === splits.length - 2) {
      // Last syllable gets the dropped silent suffixes appended back
      s += silentESuffix;
    }
    if (s) result.push(s);
  }

  return result.length > 1 ? result : [word];
}

// --- Inject syllable <span>s into the DOM for just the clicked word ---
// Returns a cleanup() that fully restores the original text node.
function injectSyllableSpans(wordRange, syllables) {
  const textNode   = wordRange.startContainer;
  const startOff   = wordRange.startOffset;
  const endOff     = wordRange.endOffset;
  const parent     = textNode.parentNode;
  if (!parent) return null;

  const fullText  = textNode.textContent;
  const before    = fullText.slice(0, startOff);
  const after     = fullText.slice(endOff);

  // Build wrapper with one <span> per syllable
  const wrapper = document.createElement('span');
  wrapper.className = 'tts-word';
  syllables.forEach(syl => {
    const s = document.createElement('span');
    s.className  = 'tts-syllable';
    s.textContent = syl;
    wrapper.appendChild(s);
  });

  // Replace the text node with: beforeText + wrapper + afterText
  const beforeNode = before ? document.createTextNode(before) : null;
  const afterNode  = after  ? document.createTextNode(after)  : null;
  if (beforeNode) parent.insertBefore(beforeNode, textNode);
  parent.insertBefore(wrapper, textNode);
  if (afterNode)  parent.insertBefore(afterNode,  textNode);
  parent.removeChild(textNode);

  let cleaned = false;
  return {
    wrapper,
    cleanup() {
      if (cleaned) return;
      cleaned = true;
      const restored = document.createTextNode(fullText);
      if (wrapper.parentNode) {
        wrapper.parentNode.insertBefore(restored, wrapper);
        wrapper.parentNode.removeChild(wrapper);
      }
      if (beforeNode?.parentNode) beforeNode.parentNode.removeChild(beforeNode);
      if (afterNode?.parentNode)  afterNode.parentNode.removeChild(afterNode);
    }
  };
}

// --- Animate syllables: active (bright) → done (soft) over totalMs ---
function animateSyllables(wrapper, count, totalMs) {
  const spans    = wrapper.querySelectorAll('.tts-syllable');
  const msPerSyl = Math.max(60, totalMs / count);
  const timers   = [];

  for (let i = 0; i < count; i++) {
    timers.push(setTimeout(() => {
      if (i > 0) {
        spans[i - 1].classList.remove('tts-active');
        spans[i - 1].classList.add('tts-done');
      }
      spans[i].classList.add('tts-active');
    }, i * msPerSyl));
  }

  return () => timers.forEach(clearTimeout);
}

// --- Click a word → inject syllable spans + speak ---
readContent.addEventListener('click', e => {
  if (state.mode !== 'read') return;

  // Clear any native text selection to prevent UI glitches on mobile
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  }

  // Cancel any running TTS
  if (activeTtsCleanup) { activeTtsCleanup(); activeTtsCleanup = null; }
  if (ttsSupported) window.speechSynthesis.cancel();

  const wordRange = getWordRangeAtPoint(e.clientX, e.clientY);
  if (!wordRange) return;

  const word = wordRange.toString().trim();
  if (!word) return;

  const syllables  = syllabify(word);
  const domResult  = injectSyllableSpans(wordRange, syllables);
  if (!domResult) return;

  // Estimate total duration: ~210 ms per syllable at rate 0.95
  const estimatedMs = syllables.length * 210;
  let stopAnim = null;

  const utt   = new SpeechSynthesisUtterance(word);
  utt.lang    = 'en-US';
  utt.rate    = 0.95;
  utt.pitch   = 1;

  utt.onstart = () => {
    stopAnim = animateSyllables(domResult.wrapper, syllables.length, estimatedMs);
  };

  const cleanup = () => {
    if (stopAnim) stopAnim();
    domResult.cleanup();
    activeTtsCleanup = null;
  };

  utt.onend   = cleanup;
  utt.onerror = cleanup;
  activeTtsCleanup = cleanup;

  window.speechSynthesis.speak(utt);
});

// ESC stops speech
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && ttsSupported) window.speechSynthesis.cancel();
});

// === Back button ===
btnBack.addEventListener('click', () => {
  if (ttsSupported) window.speechSynthesis.cancel();
  viewerScreen.classList.remove('active');
  uploadScreen.classList.add('active');
  state.pdfDoc = null;
  canvasContainer.innerHTML  = '';
  readContent.innerHTML      = '';
  canvasWrappers  = [];
  readPageAnchors = [];
  fileInput.value = '';
  pageNav.classList.add('hidden');
  switchMode('normal');
  applyTheme('dark');
  normalView.removeEventListener('scroll', onNormalScroll);
  readView.removeEventListener('scroll', onReadScroll);
});

// === Resize (re-render normal pages) ===
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (state.pdfDoc && canvasWrappers.length) {
      prepareNormalPages();
    }
  }, 350);
});
