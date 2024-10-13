import Link from "next/link";
import { Suspense } from "react"

export default async function StaticHome() {
    //aquí iría el await de datos que se renderizaran estáticamente
    let data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data`)
    data = await data.json()
    data = JSON.parse(data.body)

    let imagesInterface = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/getImagesInterface`)
    imagesInterface = await imagesInterface.json()
    imagesInterface = JSON.parse(imagesInterface.body)


    console.log("data", data);

    return (
        <main style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Flor.webp)` }}>
            <header>

                <img className='title ' src={`${process.env.NEXT_PUBLIC_URL}/images/Title.webp`} alt="Título La Vene" />
                <Link href="/login">
                    <svg className={`esquinaSupDerecha`} xmlns="http://www.w3.org/2000/svg" alt="esquinaSupDerecha" viewBox="0 0 138 138" fill="none">
                        <path d="M0 0H138V138L0 0Z" fill="#b32624" />
                    </svg>
                </Link>

            </header>
            <section>
                <h1 className="mx-8 text-center font-bold border-b-2 border-b-black">Bienvenido a La Vene San Juan</h1>
            </section>
            <article>
                <Suspense fallback={<div>Loading...</div>}>
                    <div className='containerSucursales' style={{ scrollBehavior: "smooth" }} >
                        { /*Modo normal*/}
                        {data.options.map((e, i) => {
                            return <div key={e.id} className={e.visible ? "" : "hidden"}>
                                <Link className="link-pagSuc" key={e.id} href={`/${e.name.replaceAll(" ", "-")}`}>{e.name}</Link>
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
                            return <Link href={e.link} target="_blank" key={e.id} className="redes"><img src={imagesInterface.socialMedia.find((el) => el.idElement === e.id).src} id={e.id} alt={e.name} /></Link>
                        })}
                    </div>
                </Suspense>
                {/* <img className="redes" src={`${process.env.NEXT_PUBLIC_URL}/images/Social.webp`} alt="redes" /> */}

            </footer>
        </main>
    )
}
