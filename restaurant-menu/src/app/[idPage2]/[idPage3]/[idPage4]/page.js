

import { headers } from 'next/headers'; // Para obtener los headers
import Dynamic4 from './Dynamic/Dynamic4';
import Static4 from './Static/Static4';

export const runtime = 'edge';

export default async function Home({ params }) {
    // Obtener los headers desde la solicitud
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';

    // Detectar si el visitante es un bot
    const isBot = /Googlebot|Bingbot|Slurp|DuckDuckBot|Yahoo! Slurp|Baiduspider/i.test(userAgent);

    // Si es bot, mostrar la versión estática
    if (isBot) {
        return <Static4 params={params} />;
    }

    // Si es un usuario normal, mostrar la versión dinámica
    return <Dynamic4 params={params} />;
}

