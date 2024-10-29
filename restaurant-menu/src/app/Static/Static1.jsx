import Link from "next/link";
import { Suspense } from "react"

export default async function Static1() {
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
                <svg className={`esquinaSupDerecha`} xmlns="http://www.w3.org/2000/svg" alt="esquinaSupDerecha" viewBox="0 0 138 138" fill="none">
                    <path d="M0 0H138V138L0 0Z" fill="#b32624" />
                </svg>
                {/* <Link href="/login">
                </Link> */}

            </header>
            <section>
                <h1 className="mx-8 text-center font-bold border-b-2 border-b-black">Bienvenido a La Vene San Juan</h1>
            </section>
            <article>

                <div className='containerSucursales' style={{ scrollBehavior: "smooth" }} >
                    { /*Modo normal*/}
                    {data.options.map((e, i) => {
                        return <div key={e.id} className={e.visible ? "" : "hidden"}>
                            <Link prefetch={true} className="link-pagSuc" key={e.id} href={`/${e.name.replaceAll(" ", "-")}`}>{e.name}</Link>
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

                </div>

                {/* <img className="redes" src={`${process.env.NEXT_PUBLIC_URL}/images/Social.webp`} alt="redes" /> */}

            </footer>
        </main>
    )
}
