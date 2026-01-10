export function initCatalogFilter() {
    const categoryButtons = document.querySelectorAll('.catalog__category');
    const catalogItems = document.querySelectorAll('.catalog-item');
    
    if (!categoryButtons.length || !catalogItems.length) return;

        categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => {
                btn.classList.remove('catalog__category--active');
            });

            this.classList.add('catalog__category--active');
            
            const selectedCategory = this.getAttribute('data-category');

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