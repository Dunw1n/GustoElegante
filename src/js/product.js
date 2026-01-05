// Логика для страницы товара

export function initProductGallery() {
    const thumbnails = document.querySelectorAll('.product-gallery__thumbnail');
    const mainImage = document.querySelector('.product-gallery__main-image');
    
    if (!thumbnails.length || !mainImage) return;
    
    // Обработка кликов по миниатюрам
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Убираем активный класс у всех миниатюр
            thumbnails.forEach(thumb => {
                thumb.classList.remove('product-gallery__thumbnail--active');
            });
            
            // Добавляем активный класс текущей миниатюре
            this.classList.add('product-gallery__thumbnail--active');
            
            // Анимация смены изображения
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 300);
        });
    });
}

// Заказ блюда в ресторане
export function initProductOrder() {
    const orderButton = document.querySelector('.product-info__action-button');
    
    if (!orderButton) return;
    
    orderButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Получаем название блюда
        const productName = document.querySelector('.product-info__title').textContent;
        
        // Показываем сообщение
        alert(`Спасибо за ваш выбор! Блюдо "${productName}" будет приготовлено для вас сразу после вашего визита в ресторан. Ждем вас!`);
        
        // Анимация кнопки
        this.innerHTML = '<i class="fas fa-check"></i><span>Заказано!</span>';
        this.style.backgroundColor = 'var(--color-success)';
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-utensils"></i><span>Заказать в ресторане</span>';
            this.style.backgroundColor = '';
        }, 2000);
    });
}