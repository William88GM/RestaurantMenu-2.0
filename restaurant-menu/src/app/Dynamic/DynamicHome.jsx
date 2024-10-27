"use client"
import Link from "next/link";
import useData from "@/Hooks/useData";
import { useContext, useEffect, useRef, useState } from "react";

import { SessionContext } from "@/Context/SessionContext";
import useAutoLogin from "@/Hooks/useAutoLogin";
import useImagesInterface from "@/Hooks/useImagesInterface";
import MenuLogged from "@/GlobalComponents/Menu/MenuLogged";
import MenuLogin from "@/GlobalComponents/Menu/MenuLogin";
import Header from "@/GlobalComponents/Header/Header";
import EditionModeHome from "./EditionMode/EditionModeHome";
import NormalModeHome from "./NormalMode/NormalModeHome";
import Article from "@/GlobalComponents/Article/Article";
import useHandleMenu from "@/Hooks/handleMenu";
import useHandleBannerEliminate from "@/Hooks/useEliminate";
import handleVision from "@/Hooks/handleVision";
import handlePostear from "@/Hooks/handlePostear";
import handleEditionMode from "@/Hooks/handleEditionMode";
import handleVerificarRepetidos from "@/Hooks/handleVerificarRepetidos";
import useAutoScroll from "@/Hooks/useAutoScroll";

export const runtime = 'edge';
export default function DynamicHome() {

    useAutoLogin()
    const { logged } = useContext(SessionContext)

    const imagesHaveChanged = useRef(false)








    const { data, setData } = useData() //json completo en estado
    const dataEditableRef = useRef(null);//tendra solo una parte del json con el que se trabajara en esta pagina
    const [ediciones, setEdiciones] = useState([]) //[{ name: e.name, id: e.id },{},{},] solo titulos de los inputs editables, se asignaran al json parcial
    const dataAllRef = useRef(null) //json completo donde se guardara el json parcial y luego se enviara al backend, ademas de usarlo para actualizar el estado data
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const { imagesInterface } = useImagesInterface()


    const guardando = useRef(null)
    const galleryRef = useRef(null)
    const cardRef = useRef(null)
    const longitudItemsPrevios = useRef(null)
    const scroll = useRef(false)

    const [editionMode, setEditionMode] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const { toEliminate, setToEliminate } = useHandleBannerEliminate()
    const [showMenu, setShowMenu, handleMenu] = useHandleMenu()




    useEffect(() => {
        if (guardando.current) return
        if (data && data.options) {

            // La busqueda de la seccion segun la url iría aqui

            // Clonar los datos
            dataAllRef.current = structuredClone(data)
            dataEditableRef.current = structuredClone(data)

            //COMIENZA CARGA DE IMAGENES
            //Ver cacheadas en localstorage
            setEdiciones(dataEditableRef.current.options)
            //fetch de img si la seccion las necesita
            //FIN CARGA DE IMAGENES

            longitudItemsPrevios.current = dataEditableRef.current.options.length //Evitar scroll la primera vez
        }
    }, [data])





    function handleAddCategory() {
        scroll.current = true
        const newCompletedCategory = {
            name: "Nombre categoria pag 1",
            id: crypto.randomUUID(),
            image: "",
            visible: true,
            options: [
                {
                    name: "Nombre nueva categoría",
                    id: crypto.randomUUID(),
                    image: "",
                    visible: true,
                    options: [
                        {
                            name: "Nombre nueva categoria",
                            id: crypto.randomUUID(),
                            image: "",
                            visible: true,
                            options: [
                                {
                                    name: "Nombre nuevo producto",
                                    id: crypto.randomUUID(),
                                    description: "Descripción del producto",
                                    price: "0",
                                    image: "",
                                    visible: true
                                },
                            ]
                        }
                    ]
                }
            ]
        }

        dataEditableRef.current.options.push(newCompletedCategory)
        setEdiciones((prev) => {

            return [...dataEditableRef.current.options]
        })

    }



    useAutoScroll(scroll, galleryRef, ediciones, longitudItemsPrevios)



    async function handleSave() {
        // console.log("dataRefAlprincipio del guardado", dataAllRef.current);
        guardando.current = true
        try {

            let elements = document.querySelector(".containerSucursales");
            let datos
            if (elements) {

                datos = Array.from(elements.children)


                datos = datos.map((e) => {
                    return {
                        name: e.children[0]?.innerText?.trim().replace(/\r?\n|\r/g, ' ') || '',
                        id: e.id
                    };
                });

            } else {
                console.error("No se encontró el elemento con la clase .containerSucursales");
            }

            if (handleVerificarRepetidos(datos)) {
                alert("No pueden haber titulos repetidos")
                return setEditionMode(true)
            } else {
                setEditionMode(false)



                setToEliminate(null)
                //Guarda los titulos editados en el state en la ref que es copia de una parte de Data
                for (const i in dataEditableRef.current.options) {

                    dataEditableRef.current.options[i].name = datos.find((e) => e.id === dataEditableRef.current.options[i].id).name
                    dataEditableRef.current.options[i].image = datos.find((e) => e.id === dataEditableRef.current.options[i].id).image
                }
                setEdiciones(dataEditableRef.current.options)



                const images = {
                    idSection: dataEditableRef.current.id,
                    imagesBase64: dataEditableRef.current.options.map((e) => {
                        if (e.image && e.image.startsWith("http")) {
                            return { idElement: e.id, src: "" }
                        } else {
                            return { idElement: e.id, src: e.image }
                        }
                    })
                }


                let copia = structuredClone(dataEditableRef.current.options);
                copia = copia.map((e) => {
                    return { ...e, image: "" }
                })


                dataAllRef.current.options = copia

                //guarda en data el json actualizado de la ref
                setData(dataAllRef.current)

                //envia el json
                // postear(images)
                // postear({})
                handlePostear({}, setLoading, guardando, imagesHaveChanged, dataAllRef)
            }
        } catch (error) {
            console.log(error);
        }
    }




    function handleVisionItem(id) {
        const res = handleVision(id, dataEditableRef)
        setEdiciones(res)
    }





    return (<main style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Flor.webp)` }}>

        <Header handleMenu={handleMenu} showMenu={showMenu} navigateTo={`/`} isHome={true} logged={logged} editionMode={editionMode} />

        {/* <Section navigateTo={`/`} previousPage={"Home"} actualPage={"Home"} editionMode={editionMode} viewerMode={null} handleChangeView={null} /> */}

        <section>
            <h1 className="mx-8 text-center font-bold border-b-2 border-b-black">Bienvenido a La Vene San Juan</h1>
        </section>

        <Article dragActive={dragActive} imagesHaveChanged={imagesHaveChanged} logged={logged} handleVisionItem={handleVisionItem} EditionMode={EditionModeHome} NormalMode={NormalModeHome} baseURL={`/`} editionModeState={editionMode} data={data} ediciones={ediciones} setEdiciones={setEdiciones} dataEditableRef={dataEditableRef} galleryRef={galleryRef} cardRef={cardRef} />



        <footer>
            {logged ? loading ? <span className='[font-size:18px] font-bold mr-4'> Guardando</span> :
                <button className={editionMode ? "editionMode" : "viewerMode"} onClick={() => handleEditionMode(loading, editionMode, setEditionMode, handleSave)}> {editionMode ?
                    <svg fill='#00dd60' version="1.0" xmlns="http://www.w3.org/2000/svg"
                        width="100%" height="100%" viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet">
                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
                            <path d="M4599 4732 c-14 -9 -589 -654 -1277 -1432 -688 -778 -1266 -1424
-1283 -1434 -29 -18 -35 -18 -70 -5 -25 9 -182 146 -476 413 -391 357 -445
403 -513 435 -66 31 -86 36 -171 39 -152 6 -249 -29 -351 -126 -66 -63 -120
-160 -139 -249 -23 -113 5 -257 69 -351 15 -22 303 -378 641 -792 484 -593
624 -759 665 -786 78 -52 152 -74 246 -74 130 0 236 44 325 136 27 27 517 807
1271 2021 675 1088 1238 1996 1251 2018 12 22 23 53 23 68 0 43 -29 97 -64
118 -39 24 -112 25 -147 1z"/>
                        </g>
                    </svg> :
                    <svg fill='#962220' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="100%" width="100%" version="1.1" id="_x32_" viewBox="0 0 512 512" xmlSpace="preserve">
                        <g>
                            <path className="st0" d="M229.806,376.797l-58.165-40.976l-1.128-0.112c-26.889-2.741-53.247,9.248-68.79,31.31   c-14.743,20.928-20.101,43.743-25.282,65.812c-3.528,15.064-7.181,30.64-13.805,45.613c-5.483,12.382-9.156,16.802-9.169,16.822   l-3.784,4.283l5.148,2.479c23.958,11.542,56.31,13.143,88.766,4.394c34.09-9.182,62.639-28.109,80.372-53.28   c15.543-22.062,17.963-50.919,6.322-75.316L229.806,376.797z M208.721,442.4c-4.171,5.915-9.148,11.483-14.795,16.605   c-0.892,0.597-1.81,1.259-2.774,2.007c-10.657,8.382-24.548,4.775-16.101-12.224c8.447-17.012-6.44-22.456-18.534-11.286   c-15.175,14.022-22.298,2.826-19.491-4.913c2.8-7.738,12.881-18.291,4.446-25.111c-5.076-4.112-11.628,1.895-22.082,10.041   c-5.988,4.662-19.773,3.148-14.186-17.55c3.023-7.693,6.768-15.11,11.766-22.206c10.847-15.412,29.244-24.462,48.105-23.741   l49.81,35.087C221.923,406.631,219.575,426.988,208.721,442.4z" />
                            <path className="st0" d="M191.519,277.032c-6.238,7.943-8.939,18.095-7.484,28.09c1.47,9.994,6.972,18.946,15.229,24.764l26.83,18.9   c8.257,5.817,18.547,7.988,28.45,6.007c9.903-1.993,18.554-7.962,23.938-16.5l24.357-38.734l-83.047-58.506L191.519,277.032z" />
                            <path className="st0" d="M447.22,6.635l-0.204-0.138c-15.484-10.907-36.792-7.778-48.492,7.109L229.839,228.265l81.658,57.523   L456.847,54.687C466.934,38.658,462.697,17.541,447.22,6.635z" />
                        </g>
                    </svg>}
                </button> : ""}
            {!editionMode && showMenu ? <svg className='esquinaInfIzquierda menuInferior' alt="esquinaInfIzquierda" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none">
                <path d="M138 138H0V0L138 138Z" fill="#900020" />
            </svg> : !editionMode && <svg className='esquinaInfIzquierda cursor-pointer' onClick={handleMenu} alt="esquinaInfIzquierda" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none">
                <path d="M138 138H0V0L138 138Z" fill="#b32624" />
            </svg>}
            {logged && !toEliminate && editionMode ? <button className={dragActive ? "modoArrastre" : "modoEscritura"} onClick={() => setDragActive(!dragActive)}>{dragActive ? "Arrastre" : "Escritura"}</button> : ""}
            {logged ?
                !toEliminate && editionMode ?
                    <button className='añadirProducto' onClick={handleAddCategory}><span>❌</span>Añadir <br /> categoría</button> :
                    "" :
                <div className="flex mr-6">
                    {/* REDES SOCIALES */}
                    {/* {imagesInterface && dataAllRef.current && dataAllRef.current.interface.socialMedia.map((e) => {
                        return <Link href={e.link} target="_blank" key={e.id} className="redes"><img src={imagesInterface.socialMedia.find((el) => el.idElement === e.id).src} id={e.id} alt={e.name} /></Link>
                    })} */}
                    <Link href={"https://www.facebook.com/share/dypxidhHS4xv43Ye/?mibextid=qi2Omg"} style={{ backgroundPosition: "-46px 0px", backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Social.webp)`, width: "40px", height: "40px", backgroundSize: "136px 40px", backgroundRepeat: "no-repeat" }} target="_blank" className="redes"></Link>
                    <Link href={"https://www.instagram.com/lavenesanjuan?igsh=MW16OWtsc3Jha2g3eA=="} style={{ backgroundPosition: "-95px 0px", backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Social.webp)`, width: "40px", height: "40px", backgroundSize: "136px 40px", backgroundRepeat: "no-repeat" }} target="_blank" className="redes"></Link>

                </div>


                // <img className="redes" src={`${process.env.NEXT_PUBLIC_URL}/images/Social.webp`} alt="redes" />
            }
        </footer>

        {!editionMode && showMenu ? logged ?
            <MenuLogged setShowMenu={setShowMenu} showMenu={showMenu} handleMenu={handleMenu} setShowPassword={setShowPassword} showPassword={showPassword} />
            : <MenuLogin setShowMenu={setShowMenu} showMenu={showMenu} handleMenu={handleMenu} setShowPassword={setShowPassword} showPassword={showPassword} /> : ""}
    </main>
    );
}

