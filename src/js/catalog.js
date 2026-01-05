// Фильтрация каталога

export function initCatalogFilter() {
    const categoryButtons = document.querySelectorAll('.catalog__category');
    const catalogItems = document.querySelectorAll('.catalog-item');
    
    if (!categoryButtons.length || !catalogItems.length) return;
    
    // Обработка кликов по кнопкам категорий
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            categoryButtons.forEach(btn => {
                btn.classList.remove('catalog__category--active');
            });
            
            // Добавляем активный класс нажатой кнопке
            this.classList.add('catalog__category--active');
            
            // Получаем выбранную категорию
            const selectedCategory = this.getAttribute('data-category');
            
            // Показываем/скрываем элементы каталога
            catalogItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}