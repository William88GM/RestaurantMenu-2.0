import { headers } from 'next/headers'; // Para obtener los headers

import Dynamic0 from "./Dynamic0";
import Static0 from "./Static0";

export default async function Home({ params }) {

    // Obtener los headers desde la solicitud
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';

    // Detectar si el visitante es un bot
    const isBot = /Googlebot|Bingbot|Slurp|DuckDuckBot|Yahoo! Slurp|Baiduspider/i.test(userAgent);

    // Si es bot, mostrar la versión estática
    if (isBot) {
        return <Static0 params={params} />;
    }

    // Si es un usuario normal, mostrar la versión dinámica
    return <Dynamic0 params={params} />;

}