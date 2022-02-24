import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@functions': path.resolve(__dirname, 'src/functions'),
            '@interfaces': path.resolve(__dirname, 'src/interfaces'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@testing': path.resolve(__dirname, 'src/testing'),
            '@types': path.resolve(__dirname, 'src/types')
        }
    }
});
