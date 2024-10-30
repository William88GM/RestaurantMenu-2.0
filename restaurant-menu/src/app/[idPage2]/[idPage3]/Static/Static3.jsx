import Link from "next/link";
import { Suspense } from "react"

export default async function Static3({ params }) {



    const name = decodeURIComponent(params.idPage2.replaceAll("-", " ")) //pagina actual
    const name1 = decodeURIComponent(params.idPage3.replaceAll("-", " ")) //pagina actual



    let data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data`)
    data = await data.json()
    data = JSON.parse(data.body)

    let targetSubcategory;
    if (data && data.options) {

        // Buscar la categoría
        for (const category of data.options) {
            if (category.name === name) {
                // Buscar la subcategoría dentro de la categoría
                for (const subcategory of category.options) {
                    if (subcategory.name === name1) {
                        targetSubcategory = subcategory;
                        break; // Sale del bucle tan pronto como encuentra la subcategoría
                    }
                }
                break; // Sale del bucle de categoría después de buscar la subcategoría
            }
        }
    }

    let imagesInterface = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/getImagesInterface`)
    imagesInterface = await imagesInterface.json()
    imagesInterface = JSON.parse(imagesInterface.body)

    let imagesOptions = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/getImages`, {
        method: "POST",
        body: JSON.stringify({ idSection: targetSubcategory.id }), // data can be `string` or {object}!
        headers: {
            "Content-Type": "application/json",
        }
    })
    imagesOptions = await imagesOptions.json()
    imagesOptions = JSON.parse(imagesOptions.body)

    targetSubcategory.options = targetSubcategory.options.map((e, i) => {
        return { ...e, image: imagesOptions.imagesBase64.find((el) => el.idElement === e.id)?.src ?? "" }
    })





    return (
        <main style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/background.webp)`, backgroundColor: process.env.NEXT_PUBLIC_BACKGROUNDCOLORMAIN }}>
            <header>

                <Link href={`/${params.idPage2}`}>
                    <img className='title' src={`${process.env.NEXT_PUBLIC_URL}/images/Title.webp`} alt="Título La Vene" />
                </Link>
                <svg className={`esquinaSupDerecha`} xmlns="http://www.w3.org/2000/svg" alt="esquinaSupDerecha" viewBox="0 0 138 138" fill="none">
                    <path d="M0 0H138V138L0 0Z" fill={process.env.NEXT_PUBLIC_COLORESIIESQUINASIICLOSED} />
                </svg>


            </header>
            <section>
                <Link className='flex' href={`/${params.idPage2}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                        <path d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z" fill="#33363F" />
                    </svg>
                    <h2 className='ml-2'>INICIO</h2>
                </Link>
                <h3 className='ml-8'>{name1}</h3>
            </section>
            <article>

                <div className='container' style={{ scrollBehavior: "smooth" }} >
                    {/*Modo normal*/}
                    {targetSubcategory.options.map((e, i) => {
                        return <div key={e.id} className={e.visible ? 'link-pag2' : "hidden"}>
                            <Link id={`link-pag2-${e.id}`} className='link-pag2 [padding:2px] rounded-md' href={`/${name.replaceAll(" ", "-")}/${name1.replaceAll(" ", "-")}/${e.name.replaceAll(" ", "-")}`}>{e.name}
                                {e.image ? <img src={e.image} className="cursor-pointer" width="30px" height="30px" alt={e.name} /> : <div className={`animate-pulse space-x-4 pulseBackground aspect-square pr-6 h-[30px] w-[30px] rounded`}></div>}
                            </Link>


                        </div>
                    })}
                </div>

            </article>

            <footer>


                <svg className='esquinaInfIzquierda' alt="esquinaInfIzquierda" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none">
                    <path d="M138 138H0V0L138 138Z" fill={process.env.NEXT_PUBLIC_COLORESIIESQUINASIICLOSED} />
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
