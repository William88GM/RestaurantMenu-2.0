import Link from "next/link";
import { Suspense } from "react"

export default async function Static0({ params }) {



    const name = decodeURIComponent(params.id0.replaceAll("-", " ")) //pagina actual



    let data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data`)
    data = await data.json()
    data = JSON.parse(data.body)

    let imagesInterface = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/getImagesInterface`)
    imagesInterface = await imagesInterface.json()
    imagesInterface = JSON.parse(imagesInterface.body)


    let targetCategory;
    if (data && data.options) {

        // Buscar la categoría
        for (const category of data.options) {
            if (category.name === name) {
                targetCategory = category;
                break; // Sale del bucle tan pronto como encuentra la categoría
            }
        }
    }


    return (
        <main style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Flor.webp)` }}>
            <header>

                <Link href={`/`}>

                    <img className='title' src={`${process.env.NEXT_PUBLIC_URL}/images/Title.webp`} alt="Título La Vene" />
                </Link>
                <svg className={`esquinaSupDerecha`} xmlns="http://www.w3.org/2000/svg" alt="esquinaSupDerecha" viewBox="0 0 138 138" fill="none">
                    <path d="M0 0H138V138L0 0Z" fill="#b32624" />
                </svg>


            </header>
            <section>
                <h2>{name} - INICIO</h2>
            </section>
            <article>
                <Suspense fallback={<div>Loading...</div>}>
                    <div className='containerInicio' style={{ scrollBehavior: "smooth" }} >
                        {/*Modo normal*/}
                        {targetCategory.options.map((e, i) => {
                            return <div key={e.id} id={e.id} className={e.visible ? "" : "hidden"}>
                                <Link style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Card.webp)` }} className={`link-pag1`} href={`/${name.replaceAll(" ", "-")}/${e.name.replaceAll(" ", "-")}`}>{e.name}</Link>
                            </div>
                        })}
                    </div>
                </Suspense>
            </article>

            <footer>


                <svg className='esquinaInfIzquierda' alt="esquinaInfIzquierda" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none">
                    <path d="M138 138H0V0L138 138Z" fill="#b32624" />
                </svg>

                <Suspense fallback={<div>Loading...</div>}>
                    <div className="flex mr-6">
                        {data.interface.socialMedia.map((e) => {
                            return <Link prefetch={true} href={e.link} target="_blank" key={e.id} className="redes"><img src={imagesInterface.socialMedia.find((el) => el.idElement === e.id).src} id={e.id} alt={e.name} /></Link>
                        })}
                    </div>
                </Suspense>
                {/* <img className="redes" src={`${process.env.NEXT_PUBLIC_URL}/images/Social.webp`} alt="redes" /> */}

            </footer>
        </main>
    )
}
