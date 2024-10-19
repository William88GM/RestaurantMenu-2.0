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

                <div className='containerInicio' style={{ scrollBehavior: "smooth" }} >
                    {/*Modo normal*/}
                    {targetCategory.options.map((e, i) => {
                        return <div key={e.id} id={e.id} className={e.visible ? "" : "hidden"}>
                            <Link prefetch={true} style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Card.webp)` }} className={`link-pag1`} href={`/${name.replaceAll(" ", "-")}/${e.name.replaceAll(" ", "-")}`}>{e.name}</Link>
                        </div>
                    })}
                </div>

            </article>

            <footer>


                <svg className='esquinaInfIzquierda' alt="esquinaInfIzquierda" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none">
                    <path d="M138 138H0V0L138 138Z" fill="#b32624" />
                </svg>


                <div className="flex mr-6">
                    {/* {data.interface.socialMedia.map((e) => {
                        return <Link href={e.link} target="_blank" key={e.id} className="redes"><img src={imagesInterface.socialMedia.find((el) => el.idElement === e.id).src} id={e.id} alt={e.name} /></Link>
                    })} */}
                    <Link href={"https://www.facebook.com/share/dypxidhHS4xv43Ye/?mibextid=qi2Omg"} style={{ backgroundPosition: "-46px 0px", backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Social.webp)`, width: "40px", height: "40px", backgroundSize: "136px 40px", backgroundRepeat: "no-repeat" }} target="_blank" className="redes"></Link>
                    <Link href={"https://www.instagram.com/lavenesanjuan?igsh=MW16OWtsc3Jha2g3eA=="} style={{ backgroundPosition: "-95px 0px", backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Social.webp)`, width: "40px", height: "40px", backgroundSize: "136px 40px", backgroundRepeat: "no-repeat" }} target="_blank" className="redes"></Link>
                    {name == "Sucursal Estadio" ?
                        <Link href={"https://api.whatsapp.com/send?phone=%2B542644572435&text=Hola%20%F0%9F%91%8B%0AMe%20gustar%C3%ADa%20hacer%20una%20reserva%0AGracias&type=phone_number&app_absent=0"} style={{ backgroundPosition: "0px 0px", backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Social.webp)`, width: "40px", height: "40px", backgroundSize: "136px 40px", backgroundRepeat: "no-repeat" }} target="_blank" className="redes"></Link>
                        :
                        name == "Sucursal Cabaña" ?
                            <Link href={"https://api.whatsapp.com/send?phone=%2B542646264365&text=Hola%20%F0%9F%91%8B%0AMe%20gustar%C3%ADa%20hacer%20una%20reserva%0AGracias&type=phone_number&app_absent=0"} style={{ backgroundPosition: "0px 0px", backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Social.webp)`, width: "40px", height: "40px", backgroundSize: "136px 40px", backgroundRepeat: "no-repeat" }} target="_blank" className="redes"></Link>
                            : ""
                    }
                </div>

                {/* <img className="redes" src={`${process.env.NEXT_PUBLIC_URL}/images/Social.webp`} alt="redes" /> */}

            </footer>
        </main>
    )
}
