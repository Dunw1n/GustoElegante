export function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle__button');
    const themeIcon = document.querySelector('.theme-toggle__icon');
    
    if (!themeToggle || !themeIcon) return;
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.body.classList.toggle('theme-dark', savedTheme === 'dark');
    } else if (systemPrefersDark) {
        document.body.classList.add('theme-dark');
    }
    
    updateThemeIcon();

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('theme-dark');
        
        const isDark = document.body.classList.contains('theme-dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        updateThemeIcon();

        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
    
    function updateThemeIcon() {
        const isDark = document.body.classList.contains('theme-dark');
        
        if (isDark) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}