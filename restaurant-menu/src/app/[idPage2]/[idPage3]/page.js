import { headers } from "next/headers"; // Para obtener los headers
import Dynamic3 from "./Dynamic/Dynamic3";
import Static3 from "./Static/Static3";

export const runtime = "edge";

export default function Home({ params }) {
	// Obtener los headers desde la solicitud
	// const headersList = headers();
	// const userAgent = headersList.get("user-agent") || "";

	// Detectar si el visitante es un bot
	// const isBot = /Googlebot|Bingbot|Slurp|DuckDuckBot|Yahoo! Slurp|Baiduspider/i.test(userAgent);

	// Si es bot, mostrar la versión estática
	// if (isBot) {
	//     return <Static3 params={params} />;
	// }

	// Si es un usuario normal, mostrar la versión dinámica
	return <Dynamic3 params={params} />;
}
