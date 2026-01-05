// Основной файл - точка входа для Vite
import { initTheme } from './theme.js';
import { initAnimations } from './animation.js';
import { initBurgerMenu, initModal, initSmoothScroll, initScrollHeader } from './ui.js';
import { initCatalogFilter } from './catalog.js';
import { initProductGallery, initProductOrder } from './product.js';

// Инициализация AOS
// import AOS from 'aos';
// import 'aos/dist/aos.css';

// Функция инициализации всего приложения
function initApp() {
    // Инициализация AOS
    // AOS.init({
    //     duration: 800,
    //     once: true,
    //     offset: 100
    // });
    
    // Инициализация основных модулей
    initTheme();
    initBurgerMenu();
    initModal();
    initSmoothScroll();
    initScrollHeader();
    initAnimations();
    
    // Инициализация специфичных для страниц модулей
    initPageSpecificModules();
}

// Определяем, на какой странице находимся и инициализируем соответствующие модули
function initPageSpecificModules() {
    const path = window.location.pathname;
    
    if (path.includes('catalog.html')) {
        initCatalogFilter();
    }
    
    if (path.includes('item.html')) {
        initProductGallery();
        initProductOrder();
    }
    
    // Для других страниц можно добавить дополнительные проверки
}

// Запускаем приложение когда DOM загружен
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Экспортируем функции для возможного использования в других местах
export {
    initApp,
    initPageSpecificModules
};