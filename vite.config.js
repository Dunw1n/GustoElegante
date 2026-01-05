import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  // Чтение package.json для получения информации о проекте
  const packageJson = JSON.parse(
    readFileSync(resolve(__dirname, 'package.json'), 'utf-8')
  );
  
  return {
    // Базовый путь (для деплоя в подпапку)
    base: './',
    
    // Корневая папка
    root: './src',
    
    // Публичная папка
    publicDir: '../public',
    
    // Настройки сервера для разработки
    server: {
      port: 3000,
      open: '/index.html', // Открывать главную страницу
      host: true,
      cors: true,
    },
    
    // Настройки сборки
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/index.html'),
          about: resolve(__dirname, 'src/about.html'),
          catalog: resolve(__dirname, 'src/catalog.html'),
          item: resolve(__dirname, 'src/item.html'),
          // Добавьте другие HTML файлы по мере необходимости:
          // about: resolve(__dirname, 'src/about.html'),
          // contacts: resolve(__dirname, 'src/contacts.html'),
        },
        output: {
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split('.')[1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType)) {
              extType = 'images';
            } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
              extType = 'fonts';
            } else if (/css/i.test(extType)) {
              extType = 'css';
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
      // Оптимизация размера бандла
      reportCompressedSize: true,
      chunkSizeWarningLimit: 500,
    },
    
    // Разрешение путей
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@js': resolve(__dirname, 'src/js'),
        '@styles': resolve(__dirname, 'src/styles'),
      },
    },
    
    // CSS настройки
    css: {
      devSourcemap: !isProduction,
    },
    
    // Оптимизация зависимостей
    optimizeDeps: {
      include: [], // Добавьте пакеты которые нужно прекомпилировать
    },
  };
});