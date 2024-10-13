import Link from "next/link";
import { Suspense } from "react"

export default async function Static2({ params }) {



    const name = decodeURIComponent(params.id0.replaceAll("-", " ")) //pagina actual
    const name1 = decodeURIComponent(params.id1.replaceAll("-", " ")) //pagina actual
    const name2 = decodeURIComponent(params.id2.replaceAll("-", " "))


    let data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data`)
    data = await data.json()
    data = JSON.parse(data.body)

    let targetItem;
    if (data && data.options) {

        // Buscar la categoría
        for (const category of data.options) {
            if (category.name === name) {
                for (const subcategory of category.options) {
                    if (subcategory.name === name1) {
                        for (const item of subcategory.options) {
                            if (item.name === name2) {
                                targetItem = item;
                                break; // Sale del bucle interno
                            }
                        }
                        if (targetItem) break; // Sale del segundo bucle
                    }
                }
                if (targetItem) break; // Sale del primer bucle
            }
        }
    }

    let imagesInterface = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/getImagesInterface`)
    imagesInterface = await imagesInterface.json()
    imagesInterface = JSON.parse(imagesInterface.body)

    let imagesOptions = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/getImages`, {
        method: "POST",
        body: JSON.stringify({ idSection: targetItem.id }), // data can be `string` or {object}!
        headers: {
            "Content-Type": "application/json",
        }
    })
    imagesOptions = await imagesOptions.json()
    imagesOptions = JSON.parse(imagesOptions.body)

    targetItem.options = targetItem.options.map((e, i) => {
        return { ...e, image: imagesOptions.imagesBase64.find((el) => el.idElement === e.id)?.src ?? "" }
    })





    return (
        <main style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Flor.webp)` }}>
            <header>

                <Link href={`/${params.id0}`}>
                    <img className='title' src={`${process.env.NEXT_PUBLIC_URL}/images/Title.webp`} alt="Título La Vene" />
                </Link>
                <svg className={`esquinaSupDerecha`} xmlns="http://www.w3.org/2000/svg" alt="esquinaSupDerecha" viewBox="0 0 138 138" fill="none">
                    <path d="M0 0H138V138L0 0Z" fill="#b32624" />
                </svg>


            </header>
            <section>
                <div>
                    <Link className='flex' href={`/${params.id0}/${params.id1}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                            <path d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z" fill="#33363F" />
                        </svg>
                        <h2 className='ml-2'>{name1}</h2>
                    </Link>
                    <h3 className='ml-8'>{name2}</h3>
                </div>
            </section>
            <article>
                <Suspense fallback={<div>Loading...</div>}>
                    <div className='flex'>

                        <div style={{ scrollBehavior: "smooth" }} className={data.interface.productsListViewMode ? "galery galery-small" : "galery"}>

                            {targetItem.options.map((e, i) => {

                                return <div className={e.visible ? data.interface.productsListViewMode ? "galery-item-small-user" : 'galery-item ' : "hidden"} key={e.id}>

                                    {e.image ? <img src={e.image} alt={e.name} /> : <div className="skeleton animate-pulse space-x-4 bg-red-300 h-[auto] aspect-square w-[70%] rounded"></div>}

                                    <h4>{e.name}</h4>
                                    <p >{e.description}</p>
                                    <div className={!e.description && data.interface.productsListViewMode ? "sinDescription flex items-center [padding:2px]" : "flex items-center [padding:2px]"} ><span>$</span><p className='[min-width:20px] font-bold rounded-md [margin-left:2px] [padding:2px]'>{e.price}</p></div>
                                </div>
                            })}

                        </div>
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
                            return <Link href={e.link} target="_blank" key={e.id} className="redes"><img src={imagesInterface.socialMedia.find((el) => el.idElement === e.id).src} id={e.id} alt={e.name} /></Link>
                        })}
                    </div>
                </Suspense>
                {/* <img className="redes" src={`${process.env.NEXT_PUBLIC_URL}/images/Social.webp`} alt="redes" /> */}

            </footer>
        </main>
    )
}
