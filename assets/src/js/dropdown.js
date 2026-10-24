export function initDropdown(el, dropdownClass) {
  // Get items
  const navItems = Array.from(el.querySelectorAll('li'));
  const subItems = Array.from(el.querySelectorAll('.is-subitem'));
  
  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();
  
  // Remove '-' signs
  subItems.forEach(item => {
    const itemName = item.querySelector('a span');
    itemName.textContent = itemName.textContent.trim().slice(1);
  });

  // Add subitems in place - cleaner logic
  let currentSubMenu = null;
  let currentMainItem = null;
  
  navItems.forEach((item, index) => {
    const isSubItem = item.classList.contains('is-subitem');
    if (item.classList.contains('is-subitem')) {
      item.setAttribute('role', 'menuitem');
    }
    
    if (isSubItem) {
      if (!currentSubMenu) {
        currentSubMenu = document.createElement('ul');
        currentSubMenu.setAttribute('data-submenu', '');
        currentSubMenu.setAttribute('id', currentMainItem.getAttribute('data-slug'));
        currentSubMenu.classList = dropdownClass;
        currentMainItem.appendChild(currentSubMenu);
      }
      currentSubMenu.appendChild(item);
    } else {
      currentMainItem = item;
      currentSubMenu = null;
      
      // Check if next item is subitem to set up main item
      if (navItems[index + 1]?.classList.contains('is-subitem')) {
        item.classList.add('is-mainitem');
        item.setAttribute('x-on:click.outside', 'closeDropdowns(event)');
      }
    }
  });

  const dropdownMenus = el.querySelectorAll('.is-mainitem')
  const toggle = document.querySelector('[data-toggle-template]');

  dropdownMenus.forEach(menu => {
    const toggleBtn = toggle.content.firstElementChild.cloneNode(true);
    const menuId = menu.getAttribute('data-slug');
    const submenu = menu.querySelector('ul');
    
    // Enhanced accessibility attributes
    toggleBtn.setAttribute('aria-controls', menuId);
    toggleBtn.setAttribute('aria-label', 'Toggle submenu');
    toggleBtn.setAttribute('aria-haspopup', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    
    menu.setAttribute('aria-haspopup', 'true');
    submenu.setAttribute('role', 'menu');
    submenu.setAttribute('aria-labelledby', menuId);
    
    menu.insertBefore(toggleBtn, menu.children[1]);
  });

  // Clean up at the end
  el.appendChild(fragment);
  currentSubMenu = null;
  currentMainItem = null;
}

/* -----------------------------------------------------------------------------
* toggleDropdown
----------------------------------------------------------------------------- */
export function toggleDropdown(e) {
  e.preventDefault();
  
  const parentElement = e.currentTarget.parentNode;
  const subMenu = parentElement.querySelector('[data-submenu]');
  const toggle = parentElement.querySelector('button');
  
  if (!subMenu || !toggle) return;
  
  const isExpanded = parentElement.hasAttribute('data-dropdown-open');
  
  // Update parent state
  parentElement.toggleAttribute('data-dropdown-open');
  
  // Update toggle button state & submenu classes
  toggle.classList.toggle('rotate-180');
  toggle.setAttribute('aria-expanded', !isExpanded);
  const classes = ['opacity-0', 'invisible', 'translate-y-1'];
  classes.forEach(cls => subMenu.classList.toggle(cls));
}

/* -----------------------------------------------------------------------------
* closeDropdowns
----------------------------------------------------------------------------- */
export function closeDropdowns(e) {
  const currentMenu = e.target.closest('li.is-mainitem[data-slug]');
  const selector = currentMenu 
    ? `[data-dropdown-open]:not([data-slug="${currentMenu.getAttribute('data-slug')}"])`
    : '[data-dropdown-open]';
    
  document.querySelectorAll(selector).forEach(menu => {
    const subMenu = menu.querySelector('[data-submenu]');
    const toggle = menu.querySelector('button');
    
    if (!subMenu || !toggle) return;
    
    // Remove dropdown open state
    menu.removeAttribute('data-dropdown-open');
    
    // Reset toggle button state
    toggle.classList.remove('rotate-180');
    toggle.setAttribute('aria-expanded', 'false');
    
    // Hide submenu with transition classes
    const hideClasses = ['opacity-0', 'invisible', 'translate-y-1'];
    subMenu.classList.add(...hideClasses);
  });
}