import Link from "next/link";
import Footer from "./Footer";
import ArticleS from "./ArticleS";

export default async function Static2({ params }) {



    const name = decodeURIComponent(params.id0.replaceAll("-", " ")) //pagina actual
    const name1 = decodeURIComponent(params.id1.replaceAll("-", " ")) //pagina actual
    const name2 = decodeURIComponent(params.id2.replaceAll("-", " "))









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
            <section className='flex justify-between flex-row items-center'>
                <div>
                    <Link className='flex' href={`/${params.id0}/${params.id1}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                            <path d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z" fill="#33363F" />
                        </svg>
                        <h2 className='ml-2'>{name1}</h2>
                    </Link>
                    <h3 className='ml-8'>{name2}</h3>
                </div>
                <>
                    <svg className={`cursor-pointer buttonViewMode border-pink-950 border-2 rounded-lg p-1  `} xmlns="http://www.w3.org/2000/svg" width="45px" height="45px" viewBox="0 0 24 24" fill="none">
                        <path d="M8 6L21 6.00078M8 12L21 12.0008M8 18L21 18.0007M3 6.5H4V5.5H3V6.5ZM3 12.5H4V11.5H3V12.5ZM3 18.5H4V17.5H3V18.5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </>
            </section>

            <article>
                <div className='flex'>
                    <ArticleS name={name} name1={name1} name2={name2} />
                </div>
            </article>

            <footer>
                <svg className='esquinaInfIzquierda' alt="esquinaInfIzquierda" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none">
                    <path d="M138 138H0V0L138 138Z" fill="#b32624" />
                </svg>
                <div className="flex mr-6">
                    <Footer name={name} />
                </div>
            </footer>
        </main>
    )
}
