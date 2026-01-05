// Общие UI компоненты

// Бургер-меню
export function initBurgerMenu() {
    const burger = document.querySelector('.navbar__burger');
    const menu = document.querySelector('.navbar__menu');
    
    if (!burger || !menu) return;
    
    burger.addEventListener('click', function() {
        this.classList.toggle('navbar__burger--active');
        menu.classList.toggle('navbar__menu--active');
        document.body.style.overflow = menu.classList.contains('navbar__menu--active') ? 'hidden' : '';
    });
    
    // Закрытие меню при клике на ссылку
    const menuLinks = document.querySelectorAll('.navbar__link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            burger.classList.remove('navbar__burger--active');
            menu.classList.remove('navbar__menu--active');
            document.body.style.overflow = '';
        });
    });
}

// Модальное окно резервации
export function initModal() {
    const reservationButtons = document.querySelectorAll('.navbar__link--reservation, .button--secondary');
    const modal = document.querySelector('.modal--reservation');
    const modalClose = document.querySelector('.modal__close');
    const modalOverlay = document.querySelector('.modal__overlay');
    
    if (!modal || !modalClose || !modalOverlay) return;
    
    // Открытие модального окна
    reservationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('modal--active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Закрытие модального окна
    function closeModal() {
        modal.classList.remove('modal--active');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('modal--active')) {
            closeModal();
        }
    });
    
    // Обработка формы резервации
    const reservationForm = document.querySelector('.reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Здесь будет отправка формы на сервер
            const formData = new FormData(this);
            const name = formData.get('name') || 'не указано';
            
            // Показываем сообщение об успехе
            alert(`Спасибо, ${name}! Ваша заявка на резервацию принята. Мы свяжемся с вами в ближайшее время для подтверждения.`);
            
            closeModal();
            this.reset();
        });
    }
}

// Плавный скролл
export function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем ссылки, которые не ведут на якорь или ведут на другую страницу
            if (href === '#' || href.startsWith('#!') || href.startsWith('http')) return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Изменение header при скролле
export function initScrollHeader() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
}