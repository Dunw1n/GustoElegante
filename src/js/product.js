export function initProductGallery() {
    const thumbnails = document.querySelectorAll('.product-gallery__thumbnail');
    const mainImage = document.querySelector('.product-gallery__main-image');
    
    if (!thumbnails.length || !mainImage) return;
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            thumbnails.forEach(thumb => {
                thumb.classList.remove('product-gallery__thumbnail--active');
            });
            
            this.classList.add('product-gallery__thumbnail--active');
            
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 300);
        });
    });
}

export function initProductOrder() {
    const orderButton = document.querySelector('.product-info__action-button');
    
    if (!orderButton) return;
    
    orderButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const productName = document.querySelector('.product-info__title').textContent;
        
        alert(`Спасибо за ваш выбор! Блюдо "${productName}" будет приготовлено для вас сразу после вашего визита в ресторан. Ждем вас!`);

        this.innerHTML = '<i class="fas fa-check"></i><span>Заказано!</span>';
        this.style.backgroundColor = 'var(--color-success)';
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-utensils"></i><span>Заказать в ресторане</span>';
            this.style.backgroundColor = '';
        }, 2000);
    });
}