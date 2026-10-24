/* -----------------------------------------------------------------------------
* toggleColorScheme
----------------------------------------------------------------------------- */
export function toggleColorScheme(theme) {
  const currentTheme = document.documentElement.getAttribute('data-color-scheme');  
  
  const newTheme = theme || (currentTheme === 'light' ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-color-scheme', newTheme);
  localStorage.setItem('PREFERRED_COLOR_SCHEME', newTheme);
}

/* -----------------------------------------------------------------------------
* initColorScheme
----------------------------------------------------------------------------- */
export function initColorScheme() {
  let preferredTheme = localStorage.getItem('PREFERRED_COLOR_SCHEME') || 
                       document.documentElement.getAttribute('data-color-scheme');
                       
  if (preferredTheme === 'system' && window.matchMedia) {
    preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  document.documentElement.setAttribute('data-color-scheme', preferredTheme);
}

/* -----------------------------------------------------------------------------
* copyURL
----------------------------------------------------------------------------- */
export function copyURL(src, str) {
  navigator.clipboard.writeText(str);
  src.querySelector('span').innerHTML = src.getAttribute('data-success')
  src.classList.add('text-success', '!border-success')

  src.onmouseleave = function() { 
    setTimeout(function(){
      src.querySelector('span').innerHTML = src.getAttribute('data-label')
      src.classList.remove('text-success', '!border-success')
    }, 1000); 
  }
}

/* -----------------------------------------------------------------------------
* getScrollPercent
----------------------------------------------------------------------------- */
export function getScrollPercent() {
  const h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
  return Math.round((h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100);
}

/* -----------------------------------------------------------------------------
* getContrastColor
----------------------------------------------------------------------------- */
export function getContrastColor(hexColor) {
  if (!hexColor || typeof hexColor !== 'string') {
    throw new Error('A hex color string is required');
  }
  
  const hex = hexColor.replace('#', '');
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      throw new Error('Invalid hex color format');
  }
  
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/* -----------------------------------------------------------------------------
* setBrandContrast
----------------------------------------------------------------------------- */
export function setBrandContrast() {
  const hexColor = getComputedStyle(document.documentElement).getPropertyValue('--ghost-accent-color').trim();
  
  document.documentElement.style.setProperty('--color-brand-contrast', `color-mix(in srgb, var(--color-brand) 5%, ${getContrastColor(hexColor)} 100%)`);
}
