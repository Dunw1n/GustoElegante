import { initTheme } from './theme.js';
import { initAnimations } from './animation.js';
import { initBurgerMenu, initModal, initSmoothScroll, initScrollHeader } from './ui.js';
import { initCatalogFilter } from './catalog.js';
import { initProductGallery, initProductOrder } from './product.js';
import { initReservationForm, initPhoneMasks } from './validation.js';

function initApp() {
    initTheme();
    initBurgerMenu();
    initModal();
    initSmoothScroll();
    initScrollHeader();
    initAnimations();
    initReservationForm();
    initPhoneMasks();
    initPageSpecificModules();
}

function initPageSpecificModules() {
    const path = window.location.pathname;
    
    if (path.includes('catalog.html')) {
        initCatalogFilter();
    }
    
    if (path.includes('item.html')) {
        initProductGallery();
        initProductOrder();
    }
    
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

export {
    initApp,
    initPageSpecificModules,
    initReservationForm 
};