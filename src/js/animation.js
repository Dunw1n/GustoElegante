// Дополнительные анимации

export function initAnimations() {
    // Анимация карточек при наведении
    const cards = document.querySelectorAll('.dish-card, .feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });
    
    // Плавное появление элементов при скролле (дополнительно к AOS)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами, которые не анимируются через AOS
    const elementsToAnimate = document.querySelectorAll('.footer__column, .dish-card__description, .feature-card__description');
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    // Анимация для индикатора скролла
    const scrollIndicator = document.querySelector('.hero__scroll-indicator');
    if (scrollIndicator) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop) {
                // Скроллим вниз
                scrollIndicator.style.opacity = '0';
            } else {
                // Скроллим вверх
                scrollIndicator.style.opacity = '1';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }
}   