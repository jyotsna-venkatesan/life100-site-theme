/* -----------------------------------------------------------------------------
CSS imports & Polyfill
----------------------------------------------------------------------------- */
import '../css/main.css';
import '../css/ghost.css';
import '../css/theme.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

import 'vite/modulepreload-polyfill'

/* -----------------------------------------------------------------------------
Alpine Js
----------------------------------------------------------------------------- */
import Alpine from 'alpinejs'
window.Alpine = Alpine
Alpine.start()

/* -----------------------------------------------------------------------------
Theme functions
----------------------------------------------------------------------------- */
import { 
  initColorScheme, 
  toggleColorScheme,
  copyURL,
  getScrollPercent,
  getContrastColor,
  setBrandContrast,
} from './utils';

window.initColorScheme = initColorScheme
window.toggleColorScheme = toggleColorScheme
window.copyURL = copyURL
window.getScrollPercent = getScrollPercent
window.getContrastColor = getContrastColor
window.setBrandContrast = setBrandContrast

/* -----------------------------------------------------------------------------
Newsletters
----------------------------------------------------------------------------- */
import { getPosts, getMemberNewsletters, updateMemberNewsletters } from './ghost';
window.getPosts = getPosts
window.getMemberNewsletters = getMemberNewsletters
window.updateMemberNewsletters = updateMemberNewsletters

/* -----------------------------------------------------------------------------
Set brand contrast
----------------------------------------------------------------------------- */
setBrandContrast()

/* -----------------------------------------------------------------------------
Dropdown
----------------------------------------------------------------------------- */
import { 
  initDropdown, 
  toggleDropdown, 
  closeDropdowns 
} from './dropdown';
window.initDropdown = initDropdown
window.toggleDropdown = toggleDropdown
window.closeDropdowns = closeDropdowns

/* -----------------------------------------------------------------------------
Reframe
----------------------------------------------------------------------------- */
import reframe from './reframe';
window.Reframe = reframe
const embedSources = [
  '.ghost-content iframe[src*="youtube.com"]',
  '.ghost-content iframe[src*="youtube-nocookie.com"]',
  '.ghost-content iframe[src*="player.vimeo.com"]',
  '.ghost-content iframe[src*="kickstarter.com"][src*="video.html"]',
  '.ghost-content object',
  '.ghost-content embed',
];
Reframe(document.querySelectorAll(embedSources.join(',')));

/* -----------------------------------------------------------------------------
Meta
----------------------------------------------------------------------------- */
import { getMetaInfo } from './meta';
window.getMetaInfo = getMetaInfo;

/* -----------------------------------------------------------------------------
Zoom
----------------------------------------------------------------------------- */
import { imageZoom } from './zoom';
const imageSources = [
  '.ghost-content .kg-image-card img',
  '.ghost-content .kg-gallery-card img',
] 
if (THEME_CONFIG.ENABLE_IMAGE_ZOOM) {
  const zoomImages = document.querySelectorAll(imageSources.join(','));
  zoomImages.forEach(image => {
    image.setAttribute('data-action', 'zoom');
  });
  imageZoom().init({ 
    selector: imageSources.join(','), 
    offset: 0 
  });
}

/* -----------------------------------------------------------------------------
Membership
----------------------------------------------------------------------------- */
import { 
  toggleMembershipPlan, 
  calculateDiscounts } 
from './membership';
window.toggleMembershipPlan = toggleMembershipPlan
window.calculateDiscounts = calculateDiscounts