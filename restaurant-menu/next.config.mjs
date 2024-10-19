/** @type {import('next').NextConfig} */

const nextConfig = {
    async headers() {
        return [
            {
                // Ruta para todas las imágenes en la carpeta /public/images/
                source: '/images/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=2592000, immutable', // Cachear por un mes
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
