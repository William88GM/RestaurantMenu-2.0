

import { headers } from 'next/headers'; // Para obtener los headers
import Dynamic2 from './Dynamic2';
import Static2 from './Static2';

export default async function Home({ params }) {
    // Obtener los headers desde la solicitud
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';

    // Detectar si el visitante es un bot
    const isBot = /Googlebot|Bingbot|Slurp|DuckDuckBot|Yahoo! Slurp|Baiduspider/i.test(userAgent);

    // Si es bot, mostrar la versión estática
    if (isBot) {
        return <Static2 params={params} />;
    }

    // Si es un usuario normal, mostrar la versión dinámica
    return <Dynamic2 params={params} />;
}