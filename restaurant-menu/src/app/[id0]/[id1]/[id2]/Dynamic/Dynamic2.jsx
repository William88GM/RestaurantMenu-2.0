


"use client"
import useData from '@/Hooks/useData'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'
import GalleryItem from '../GalleryItem'
import { closestCenter, DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SessionContext } from '@/Context/SessionContext'
import useAutoLogin from '@/Hooks/useAutoLogin'
import loadFromLocalStorage from '@/Hooks/getCache'
import saveToLocalStorage from '@/Hooks/setCache'
import useImagesInterface from '@/Hooks/useImagesInterface'
import MenuLogged from '@/app/Components/Menu/MenuLogged'
import MenuLogin from '@/app/Components/Menu/MenuLogin'

export const runtime = 'edge';


export default function Dynamic2({ params }) {
    // const name = decodeURIComponent(params.id0)
    // const name1 = decodeURIComponent(params.id1)
    // const name2 = decodeURIComponent(params.id2) //pagina actual
    const name = decodeURIComponent(params.id0.replaceAll("-", " "))
    const name1 = decodeURIComponent(params.id1.replaceAll("-", " "))
    const name2 = decodeURIComponent(params.id2.replaceAll("-", " "))

    const pathname = usePathname()
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
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );
    const [showMenu, setShowMenu] = useState(false)
    const galleryRef = useRef(null)
    const guardando = useRef(null)
    const longitudItemsPrevios = useRef(null)
    const { imagesInterface } = useImagesInterface()
    const [showPassword, setShowPassword] = useState(false)
    const [editionMode, setEditionMode] = useState(false)//modo edicion
    const [toEliminate, setToEliminate] = useState(null)//Se guarda el indice del que se quiere eliminar y muestra el banner





    useEffect(() => {
        if (guardando.current) return

        // if (data && data.options) {
        //     // dataAllRef2.current = structuredClone(data)
        //     dataAllRef2.current = structuredClone(data)
        //     //linea a editar en cada archivo + la del save
        //     dataEditableRef2.current = structuredClone(data?.options.find((e) => e.name === name)?.options.find((e) => e.name === name1)?.options.find((e) => e.name === name2)) //copia el objeto de la categoria de la pagina actual

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

            if (targetItem) {
                dataAllRef2.current = structuredClone(data);
                dataEditableRef2.current = structuredClone(targetItem); // Copia el objeto de la categoría actual
            }





            if (!dataEditableRef2.current || dataEditableRef2.current.visible == false) {
                return window.location.replace(`/${name.replaceAll(" ", "-")}/${name1.replaceAll(" ", "-")}`)
            }




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



            longitudItemsPrevios.current = dataEditableRef2.current.options.length//Evitar scroll la primera vez


        }
        // console.log("Data al principio", data);
    }, [data, logged])






    function handleBannerEliminate(e) {
        if (toEliminate === null) {

            setToEliminate(e.target.id)//5
        } else {
            setToEliminate(null)
        }
    }


    function handleEliminate() {

        dataEditableRef2.current.options = dataEditableRef2.current.options.filter((e) => e.id !== toEliminate)


        setToEliminate(null)

        setEdiciones(dataEditableRef2.current.options)
    }


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

    useEffect(() => {
        if (!scroll.current) return
        scroll.current = false
        // console.log("Estado del eliminate", toEliminate);
        if (longitudItemsPrevios.current == ediciones.length) {//para evitar el scroll la primera vez
            return
        }

        if (galleryRef.current && galleryRef.current && ediciones) { //30 de gap
            galleryRef.current.scrollTop += (galleryRef.current.offsetHeight + 400) * ediciones.length;

        }


    }, [ediciones.length])


    function handleMenu() {
        setShowMenu(!showMenu)
        // console.log("hola");
    }
    function verificarRepetidos(state) {
        // const seen = new Set();
        // const duplicates = state.filter(item => {
        //     if (seen.has(item.name)) {
        //         return true;
        //     }
        //     seen.add(item.name);
        //     return false;
        // });

        // if (duplicates.length > 0) {
        //     return true
        // } else {
        //     false
        // }
        return false
    }

    function verificarSoloNumericos(array) {

        for (const element of array) {


            if (isNaN(element.price)) {

                return true
            }
        }
        return false
    }

    function handleEditionMode() {
        if (loading) return
        if (editionMode) {

            handleSave()
        } else {

            setEditionMode(true)
        }
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
            } else if (verificarRepetidos(datos)) {
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
                postear(images)

            }
        } catch (error) {
            console.log(error);
        }

    }


    function postear(images) {
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/modify`, {
            method: "PUT",
            body: JSON.stringify({ dataAll: dataAllRef2.current, images: images, imagesHaveChanged: imagesHaveChanged.current }), // data can be `string` or {object}!
            headers: {
                "Content-Type": "application/json",
            },
        }).then(
            (res) => res.json(),
        ).then(
            (res) => {
                setLoading(false)
                guardando.current = false
                imagesHaveChanged.current = false
                localStorage.clear();
            }
        ).catch((err) => {
            console.log(err);
            guardando.current = false
            localStorage.clear();
        })
    }






    function handleDragEnd(e) {
        imagesHaveChanged.current = true

        // console.log("Ediciones en el medio", ediciones);
        // saveBefore()

        const { active, over } = e
        const oldIndex = ediciones.findIndex((item) => item.id === active.id)
        const newIndex = ediciones.findIndex((item) => item.id === over.id)

        const newOrder = arrayMove(ediciones, oldIndex, newIndex)

        setEdiciones(newOrder)
        dataEditableRef2.current.options = newOrder
        // console.log("despues", dataEditableRef2.current.options);
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


    function propagar(targets, cambio) {
        // console.log("TARGETS: ", targets);
        targets.forEach((el) => {
            // console.log("ELEMENTO: ", el);
            el.visible = cambio
            if (el.options && el.options[0]) {
                propagar(el.options, cambio)
            }
        })
    }


    function handleVisionItem(id) {
        let cambio = !dataEditableRef2.current.options.find((el) => el.id == id).visible
        dataEditableRef2.current.options.find((el) => el.id == id).visible = !dataEditableRef2.current.options.find((el) => el.id == id).visible
        // dataEditableRef2.current.options.find((el) => el.id == id).visible = true

        let childs = dataEditableRef2.current.options.find((el) => el.id == id).options
        if (childs && childs[0]) {
            // console.log("cambio:", cambio);
            propagar(childs, cambio)
        }
        setEdiciones([...dataEditableRef2.current.options])
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

            <header>


                <Link prefetch={false} href={`/${params.id0}`}>
                    <img className='title' src={`${process.env.NEXT_PUBLIC_URL}/images/Title.webp`} alt="Título La Vene" />
                </Link>
                {logged ? !editionMode && showMenu ?
                    <svg className='esquinaSupDerecha menuSuperior' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none" alt="esquinaSupDerecha">
                        <path d="M0 0H138V138L0 0Z" fill="#900020" />
                    </svg>
                    : <svg className={`esquinaSupDerecha ${!editionMode && "cursor-pointer"}`} onClick={handleMenu} xmlns="http://www.w3.org/2000/svg" alt="esquinaSupDerecha" viewBox="0 0 138 138" fill="none">
                        <path d="M0 0H138V138L0 0Z" fill="#b32624" />
                    </svg> : <svg className='esquinaSupDerecha' xmlns="http://www.w3.org/2000/svg" alt="esquinaSupDerecha" viewBox="0 0 138 138" fill="none">
                    <path d="M0 0H138V138L0 0Z" fill="#b32624" />
                </svg>
                }

                {/*FLOTANTE */}
            </header>


            <section className='flex justify-between flex-row items-center'>
                <div>
                    <Link prefetch={false} className='flex' href={`/${params.id0}/${params.id1}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                            <path d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z" fill="#33363F" />
                        </svg>
                        <h2 className='ml-2'>{name1}</h2>
                    </Link>
                    <h3 className='ml-8'>{name2}</h3>
                </div>
                {/* {viewerMode !== null && !logged && <label className="toggle-switch">
                    <input type="checkbox" checked={viewerMode} name='productsListViewMode' onChange={handleChangeView} />
                    <span className="slider"></span></label>} */}

                {viewerMode !== null && !editionMode && <>{
                    viewerMode ?
                        <svg className={`cursor-pointer buttonViewMode border-pink-950 border-2 rounded-lg p-1  `} onClick={handleChangeView} xmlns="http://www.w3.org/2000/svg" width="45px" height="45px" viewBox="0 0 24 24" fill="none">
                            <path d="M8 6L21 6.00078M8 12L21 12.0008M8 18L21 18.0007M3 6.5H4V5.5H3V6.5ZM3 12.5H4V11.5H3V12.5ZM3 18.5H4V17.5H3V18.5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        :
                        <svg className={`cursor-pointer buttonViewMode border-pink-950 border-2 rounded-lg p-1 `} onClick={handleChangeView} xmlns="http://www.w3.org/2000/svg" width="45px" height="45px" viewBox="0 0 618 618" fill="none">
                            <g clipPath="url(#clip0_7_11)">
                                <path d="M384 153H234C220.667 153 209 163.885 209 176.325V440.675C209 453.115 220.667 464 234 464H384C397.333 464 409 453.115 409 440.675V176.325C409 163.885 397.333 153 384 153Z" fill="#fff" />
                                <path d="M384 516.802H234C220.667 516.802 209 525.103 209 534.589V736.173C209 745.659 220.667 753.96 234 753.96H384C397.333 753.96 409 745.659 409 736.173V534.589C409 525.103 397.333 516.802 384 516.802Z" fill="#7d0032" />
                                <path d="M384 -136.732H234C220.667 -136.732 209 -128.432 209 -118.946V82.6382C209 92.1245 220.667 100.425 234 100.425H384C397.333 100.425 409 92.1245 409 82.6382V-118.946C409 -128.432 397.333 -136.732 384 -136.732Z" fill="#7d0032" />
                            </g>
                            <defs>
                                <clipPath id="clip0_7_11">
                                    <rect x="116" width="386" height="618" rx="63" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>


                }
                </>}
            </section>



            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <article>
                    {editionMode && logged && data && viewerMode !== null && ediciones[0] ? (<>


                        {/*Modo ediciones*/}
                        <div className='flex'>
                            {/* <button className='flecha' onClick={handleScrollLeft}><img style={{ transform: "rotate(180deg)" }} src={`${process.env.NEXT_PUBLIC_URL}/images/flecha.webp`} /></button> */}
                            <div ref={galleryRef} style={{ scrollBehavior: "smooth" }} className={dragActive ? "galery galery-small" : viewerMode ? "galery galery-small" : "galery"}>

                                <SortableContext items={ediciones.map((e) => e.id)} strategy={verticalListSortingStrategy}>

                                    {ediciones[0] && ediciones.map((e, i) => {
                                        return (
                                            <GalleryItem imagesHaveChanged={imagesHaveChanged} handleVisionItem={handleVisionItem} viewerMode={viewerMode} data={data} i={i} ediciones={ediciones} setEdiciones={setEdiciones} dragActive={dragActive} key={e.id} e={e} logged={logged} toEliminate={toEliminate} handleBannerEliminate={handleBannerEliminate} />
                                        )
                                    })}
                                </SortableContext>

                            </div>
                            {/* <button className='flecha' onClick={handleScrollRight}><img src={`${process.env.NEXT_PUBLIC_URL}/images/flecha.webp`} /></button> */}
                        </div>

                        { /*Banner flotante*/}
                        {toEliminate && <div className='modal'>
                            <p>¿Está seguro que desea elminiar el elemento <b> {`${ediciones.find((el) => el.id == toEliminate).name}`}</b>?</p>
                            <div>
                                <button className='text-rose-500 [font-weight:bold]' onClick={handleEliminate}>ELIMINAR</button>
                                <button className='text-green-500 [font-weight:bold]' onClick={handleBannerEliminate}>CANCELAR</button>
                            </div>
                        </div>}


                    </>)
                        : <>
                            {/*Modo normal*/}
                            <div className='flex'>
                                {/* Desktop */}
                                {/* <button className='flecha' onClick={handleScrollLeft}><img style={{ transform: "rotate(180deg)" }} src={`${process.env.NEXT_PUBLIC_URL}/images/flecha.webp`} /></button> */}

                                {!ediciones[0] ?
                                    <span className='loader mt-20'></span> :
                                    <div ref={galleryRef} style={{ scrollBehavior: "smooth" }} className={viewerMode ? "galery galery-small" : "galery"}>

                                        {ediciones[0] && ediciones.map((e, i) => {

                                            return <div onClick={() => viewerMode && handleDetails({ id: e.id, h4: e.name })} className={e.visible ? viewerMode ? "galery-item-small-user" : 'galery-item ' : "hidden"} key={e.id}>

                                                {e.image ? <img src={e.image} alt={e.name} /> : <div className="skeleton animate-pulse space-x-4 bg-red-300 h-[auto] aspect-square w-[70%] rounded"></div>}

                                                <h4>{e.name}</h4>
                                                <p >{e.description}</p>
                                                <div className={!e.description && viewerMode ? "sinDescription flex items-center [padding:2px]" : "flex items-center [padding:2px]"} ><span>$</span><p className='[min-width:20px] font-bold rounded-md [margin-left:2px] [padding:2px]'>{e.price}</p></div>
                                            </div>
                                        })}

                                    </div>
                                }
                                {/* Desktop */}
                                {/* <button className='flecha' onClick={handleScrollRight}><img src={`${process.env.NEXT_PUBLIC_URL}/images/flecha.webp`} /></button> */}
                            </div>


                            {details && p && <div className='modalDetails'>
                                {details.img ? <img src={details.img} /> : <div className="animate-pulse space-x-4 bg-red-300 h-[auto] aspect-square w-[70%] rounded"></div>}

                                <h4>{details.h4}</h4>
                                <p >{details.p}</p>
                                <div className={"flex items-center "} ><span>$</span><p className='[min-width:20px] font-bold rounded-md [margin-left:2px] [padding:2px]'>{details.price}</p></div>
                                <button onClick={() => router.push(`/${name.replaceAll(" ", "-")}/${name1.replaceAll(" ", "-")}/${name2.replaceAll(" ", "-")}`)}>✖</button>
                            </div>}
                        </>
                    }
                </article >
            </DndContext>



            <footer>
                {logged ? loading ? <span className='[font-size:18px] font-bold mr-4'> Guardando</span> :
                    <button className={editionMode ? "editionMode" : "viewerMode"} onClick={handleEditionMode}> {editionMode ?
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
                <MenuLogged setShowPassword={setShowPassword} showPassword={showPassword} showMenu={showMenu} setShowMenu={setShowMenu} handleMenu={handleMenu} />
                : <MenuLogin setShowPassword={setShowPassword} showPassword={showPassword} showMenu={showMenu} setShowMenu={setShowMenu} handleMenu={handleMenu} /> : ""}

        </main>
    );

}
