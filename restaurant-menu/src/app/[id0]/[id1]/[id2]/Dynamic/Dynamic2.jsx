"use client"
import useData from '@/Hooks/useData'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SessionContext } from '@/Context/SessionContext'
import useAutoLogin from '@/Hooks/useAutoLogin'
import loadFromLocalStorage from '@/Hooks/getCache'
import saveToLocalStorage from '@/Hooks/setCache'
import useImagesInterface from '@/Hooks/useImagesInterface'
import MenuLogged from '@/GlobalComponents/Menu/MenuLogged'
import MenuLogin from '@/GlobalComponents/Menu/MenuLogin'
import Header from '@/GlobalComponents/Header/Header'
import Section from '@/GlobalComponents/Section/Section'

import EditionMode2 from './EditionMode/EditionMode2'
import NormalMode2 from './NormalMode/NormalMode2'
import Article from '@/GlobalComponents/Article/Article'
import useHandleMenu from '@/Hooks/handleMenu'
import handleVision from '@/Hooks/handleVision'
import handlePostear from '@/Hooks/handlePostear'
import handleEditionMode from '@/Hooks/handleEditionMode'
import handleVerificarRepetidos from '@/Hooks/handleVerificarRepetidos'
import useAutoScroll from '@/Hooks/useAutoScroll'

export const runtime = 'edge';


export default function Dynamic2({ params }) {

    const name = decodeURIComponent(params.id0.replaceAll("-", " "))
    const name1 = decodeURIComponent(params.id1.replaceAll("-", " "))
    const name2 = decodeURIComponent(params.id2.replaceAll("-", " "))


    const router = useRouter()
    const querys = useSearchParams()
    const p = querys.get("p")
    const { logged, setLogged } = useContext(SessionContext)

    const scroll = useRef(false)
    const imagesHaveChanged = useRef(false)
    useAutoLogin()

    const { data, setData } = useData() //json completo en estado
    const dataEditableRef2 = useRef(null);//tendra solo una parte del json con el que se trabajara en esta pagina
    const [ediciones, setEdiciones] = useState([]) //[{name: ""},{},{},] solo titulos de los inputs editables, se asignaran al json parcial
    const dataAllRef2 = useRef(null) //json completo donde se guardara el json parcial y luego se enviara al backend, ademas de usarlo para actualizar el estado data
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)


    const galleryRef = useRef(null)
    const guardando = useRef(null)
    const longitudItemsPrevios = useRef(null)
    const { imagesInterface } = useImagesInterface()
    const [showPassword, setShowPassword] = useState(false)
    const [editionMode, setEditionMode] = useState(false)//modo edicion
    const [toEliminate, setToEliminate] = useState(null)//Se guarda el indice del que se quiere eliminar y muestra el banner


    const [showMenu, setShowMenu, handleMenu] = useHandleMenu()


    useEffect(() => {
        if (guardando.current) return
        if (data && data.options) {

            let targetItem;
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

            // Clonar los datos y la subcategoría encontrada
            if (targetItem) {
                dataAllRef2.current = structuredClone(data);
                dataEditableRef2.current = structuredClone(targetItem); // Copia el objeto de la categoría actual
            }

            //Navegar a la categoria previa a la actual
            if (!dataEditableRef2.current || dataEditableRef2.current.visible == false) {
                return window.location.replace(`/${name.replaceAll(" ", "-")}/${name1.replaceAll(" ", "-")}`)
            }

            //COMIENZA CARGA DE IMAGENES
            const key = dataEditableRef2.current.id
            const time = 5 //en minutos
            let { exists, isUpToDate, item } = loadFromLocalStorage(key)
            if (dataEditableRef2.current) {
                if (!isUpToDate) {
                    if (!logged) {//Si esta logged que no se muestre nada hasta que hayann cargado hasta las imagenes, no solo el texto, asi al guardar las imagenes no hay riesgo de que se guarde la imagen del loading
                        setEdiciones(dataEditableRef2.current.options)
                    }

                    fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/getImages`, {
                        method: "POST",
                        body: JSON.stringify({ idSection: dataEditableRef2.current.id }), // data can be `string` or {object}!
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }).then(
                        (res) => res.json(),

                    ).then(
                        (res) => {

                            const resFormatted = JSON.parse(res.body)

                            dataEditableRef2.current.options = dataEditableRef2.current.options.map((e, i) => {
                                // return { ...e, image: resFormatted.imagesBase64[i]?.src ?? "" }
                                return { ...e, image: resFormatted.imagesBase64.find((el) => el.idElement === e.id)?.src ?? "" }
                            })

                            setEdiciones(dataEditableRef2.current.options)
                            saveToLocalStorage(key, resFormatted, time)
                        }
                    ).catch((err) => console.log(err))
                } else if (item && isUpToDate) {

                    dataEditableRef2.current.options = dataEditableRef2.current.options.map((e, i) => {
                        return { ...e, image: item.data.imagesBase64.find((el) => el.idElement === e.id)?.src ?? "" }
                    })

                    setEdiciones(dataEditableRef2.current.options)

                }
            }
            //FIN CARGA DE IMAGENES


            longitudItemsPrevios.current = dataEditableRef2.current.options.length//Evitar scroll la primera vez


        }
        // console.log("Data al principio", data);
    }, [data, logged])







    function handleAddCategory() {
        scroll.current = true
        const newSubCategory = {
            name: "Nombre nuevo producto",
            id: crypto.randomUUID(),
            description: "Descripción del producto",
            price: "0",
            image: "",
            visible: true
        }

        dataEditableRef2.current.options.push(newSubCategory);
        setEdiciones([...dataEditableRef2.current.options]);

    }

    useAutoScroll(scroll, galleryRef, ediciones, longitudItemsPrevios)



    function verificarSoloNumericos(array) {

        for (const element of array) {


            if (isNaN(element.price)) {

                return true
            }
        }
        return false
    }











    async function handleSave() {
        guardando.current = true
        try {

            // console.log("esta guardando? ", guardando.current);


            let elements = document.querySelector(".galery");
            let datos
            if (elements) {

                datos = Array.from(elements.children);


                datos = datos.map((e) => {

                    return {//tambien se puede usar un find con el localName=="h4" por ej
                        image: e.children[0]?.src || '',
                        name: e.children[1]?.innerText?.trim().replace(/\r?\n|\r/g, ' ') || '',
                        description: e.children[2]?.innerText?.trim().replace(/\r?\n|\r/g, ' ') || '',
                        price: e.children[3]?.innerText?.replace(/^./, '').trim().replace(/\r?\n|\r/g, ' ') || '',
                        id: e.id
                    };
                });

            } else {
                console.error("No se encontró el elemento con la clase .galery");
            }

            if (verificarSoloNumericos(datos)) {
                alert("Solo pueden haber numeros en el precio, use punto para las decimales si las necesita.")
                return setEditionMode(true)
            } else if (handleVerificarRepetidos(false)) {
                alert("No pueden haber titulos repetidos")
                return setEditionMode(true)
            } else {
                setEditionMode(false)




                setToEliminate(null)
                //Guarda los titulos editados en el state en la ref que es copia de una parte de Data

                for (const i in dataEditableRef2.current.options) {

                    dataEditableRef2.current.options[i].name = datos.find((e) => e.id === dataEditableRef2.current.options[i].id).name
                    dataEditableRef2.current.options[i].image = datos.find((e) => e.id === dataEditableRef2.current.options[i].id).image
                    dataEditableRef2.current.options[i].description = datos.find((e) => e.id === dataEditableRef2.current.options[i].id).description
                    dataEditableRef2.current.options[i].price = datos.find((e) => e.id === dataEditableRef2.current.options[i].id).price
                }
                setEdiciones(dataEditableRef2.current.options)//actualiza el texto con lo del placeholder
                // console.log("Con esto se setean las ediciones al guardar", dataEditableRef2.current.options);


                const images = {
                    idSection: dataEditableRef2.current.id,
                    imagesBase64: dataEditableRef2.current.options.map((e) => {
                        if (e.image && e.image.startsWith("http")) {
                            return { idElement: e.id, src: "" }
                        } else {
                            return { idElement: e.id, src: e.image }
                        }
                    })
                }





                let copia = structuredClone(dataEditableRef2.current.options);//Sera necesario? 

                copia = copia.map((e) => {
                    return { ...e, image: "" }
                })


                dataAllRef2.current.options.find((e) => e.name === name).options.find((e) => e.name === name1).options.find((e) => e.name === name2).options = copia
                // console.log("ediciones despues de filtrar imgs", ediciones);
                // console.log("copia luego de filtrarle las img", copia);

                //guarda en data el json actualizado de la ref
                setData(dataAllRef2.current)
                //envia el json
                // postear(images)
                handlePostear(images, setLoading, guardando, imagesHaveChanged, dataAllRef2)

            }
        } catch (error) {
            console.log(error);
        }

    }









    //🧐

    const [viewerMode, setViewerMode] = useState(null)

    useEffect(() => {
        if (!data) return
        let key = "viewMode"
        let { exists, isUpToDate, item } = loadFromLocalStorage(key)

        // console.log("EL MODO DE VISTA ESTA ACTUALIZADO??", isUpToDate);
        if (!isUpToDate) {
            saveToLocalStorage(key, data.interface.productsListViewMode, (60 * 24 * 7))
            setViewerMode(data.interface.productsListViewMode)
        } else {
            // console.log("EL MODO CARGADO ES", item.data);
            setViewerMode(item.data)
        }
    }, [data])

    function handleChangeView() {

        let key = "viewMode"
        saveToLocalStorage(key, !viewerMode, (60 * 24 * 7))
        setViewerMode(!viewerMode)

    }

    useEffect(() => {
        if (viewerMode === null) return
        if (galleryRef.current) galleryRef.current.scrollTop = 0
    }, [viewerMode])


    const [details, setDetails] = useState({ img: "", h4: "", p: "", price: "" })


    function handleVisionItem(id) {
        const res = handleVision(id, dataEditableRef2)
        setEdiciones(res)
    }





    function handleDetails({ id }) {
        // Cambia solo la query 'p' sin renderizar de nuevo la página
        router.push(`/${name.replaceAll(" ", "-")}/${name1.replaceAll(" ", "-")}/${name2.replaceAll(" ", "-")}?p=${id}`)
    }
    useEffect(() => {


        if (p && dataEditableRef2.current) {
            console.log("p", p);
            const target = dataEditableRef2.current.options.find((e) => e.id === p)
            if (target) {
                console.log("target", target);
                setDetails({ img: target.image, h4: target.name, p: target.description, price: target.price })
            }
        } else {
            setDetails({ img: "", h4: "", p: "", price: "" })
        }
    }, [p])


    return (
        <main style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Flor.webp)` }}>


            <Header navigateTo={`/${params.id0}`} handleMenu={handleMenu} logged={logged} editionMode={editionMode} showMenu={showMenu} />

            <Section navigateTo={`/${params.id0}/${params.id1}`} previousPage={name1} actualPage={name2} editionMode={editionMode} viewerMode={viewerMode} handleChangeView={handleChangeView} />

            <Article handleVisionItem={handleVisionItem} dataEditableRef={dataEditableRef2} imagesHaveChanged={imagesHaveChanged} dragActive={dragActive} logged={logged} data={data} ediciones={ediciones} p={p} handleDetails={handleDetails} setEdiciones={setEdiciones} viewerMode={viewerMode} EditionMode={EditionMode2} NormalMode={NormalMode2} details={details} editionModeState={editionMode} viewerModeState={viewerMode} galleryRef={galleryRef} baseURL={`/${name.replaceAll(" ", "-")}/${name1.replaceAll(" ", "-")}/${name2.replaceAll(" ", "-")}`} />




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

                {logged ? !editionMode && showMenu ? <svg className='esquinaInfIzquierda menuInferior' alt="esquinaInfIzquierda" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none">
                    <path d="M138 138H0V0L138 138Z" fill="#900020" />
                </svg> : !editionMode && <svg className='esquinaInfIzquierda cursor-pointer' onClick={handleMenu} alt="esquinaInfIzquierda" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none">
                    <path d="M138 138H0V0L138 138Z" fill="#b32624" />
                </svg> : <svg className='esquinaInfIzquierda' alt="esquinaInfIzquierda" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none">
                    <path d="M138 138H0V0L138 138Z" fill="#b32624" />
                </svg>}

                {logged && !toEliminate && editionMode ? <button className={dragActive ? "modoArrastre" : "modoEscritura"} onClick={() => setDragActive(!dragActive)}>{dragActive ? "Arrastre" : "Escritura"}</button> : ""}
                {logged ? !toEliminate && editionMode ? <button className='añadirProducto' onClick={handleAddCategory}><span>❌</span>Añadir <br /> producto</button> : "" :
                    <div className="flex mr-6">
                        {/* {imagesInterface && dataAllRef2.current && dataAllRef2.current.interface.socialMedia.map((e) => {
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
                }
            </footer>
            {!editionMode && showMenu ? logged ?
                <MenuLogged setShowMenu={setShowMenu} showMenu={showMenu} handleMenu={handleMenu} setShowPassword={setShowPassword} showPassword={showPassword} />
                : <MenuLogin setShowMenu={setShowMenu} showMenu={showMenu} handleMenu={handleMenu} setShowPassword={setShowPassword} showPassword={showPassword} /> : ""}

        </main>
    );

}
