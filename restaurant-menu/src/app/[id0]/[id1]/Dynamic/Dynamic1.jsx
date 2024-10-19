"use client"
import useData from '@/Hooks/useData'
import Link from 'next/link'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ListItem from '../ListItem'
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
export default function Dynamic1({ params }) {

    // const name = decodeURIComponent(params.id0)
    // const name1 = decodeURIComponent(params.id1) //pagina actual
    const name = decodeURIComponent(params.id0.replaceAll("-", " "))
    const name1 = decodeURIComponent(params.id1.replaceAll("-", " ")) //pagina actual

    const { logged, setLogged } = useContext(SessionContext)
    useAutoLogin()

    const [showMenu, setShowMenu] = useState(false)
    const { data, setData } = useData() //json completo en estado
    const dataEditableRef1 = useRef(null);//tendra solo una parte del json con el que se trabajara en esta pagina
    const [ediciones, setEdiciones] = useState([]) //[{name: ""},{},{},] solo titulos de los inputs editables, se asignaran al json parcial
    const dataAllRef1 = useRef(null) //json completo donde se guardara el json parcial y luego se enviara al backend, ademas de usarlo para actualizar el estado data
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );
    const galleryRef = useRef(null)
    const longitudItemsPrevios = useRef(null)
    const { imagesInterface } = useImagesInterface()
    const guardando = useRef(null)
    const [editionMode, setEditionMode] = useState(false)//modo edicion
    const [toEliminate, setToEliminate] = useState(null)//Se guarda el indice del que se quiere eliminar y muestra el banner
    const scroll = useRef(false)
    const imagesHaveChanged = useRef(false)



    useEffect(() => {
        if (guardando.current) return
        // console.log("Data del use effect antes de hacerle nada", data);
        if (data && data.options) {
            let targetSubcategory;

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

            // Clonar los datos y la subcategoría encontrada
            if (targetSubcategory) {
                dataAllRef1.current = structuredClone(data); // Clona los datos originales
                dataEditableRef1.current = structuredClone(targetSubcategory); // Copia el objeto de la subcategoría actual
            }





            if (!dataEditableRef1.current || dataEditableRef1.current.visible == false) {
                return window.location.replace(`/${name.replaceAll(" ", "-")}`)
            }



            const key = dataEditableRef1.current.id

            const time = 5 //en minutos
            let { exists, isUpToDate, item } = loadFromLocalStorage(key)


            if (dataEditableRef1.current) {
                if (!isUpToDate) {
                    fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/getImages`, {
                        method: "POST",
                        body: JSON.stringify({ idSection: dataEditableRef1.current.id }), // data can be `string` or {object}!
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }).then(
                        (res) => res.json(),
                    ).then(
                        (res) => {

                            const resFormatted = JSON.parse(res.body)

                            dataEditableRef1.current.options = dataEditableRef1.current.options.map((e, i) => {
                                // return { ...e, image: resFormatted.imagesBase64[i]?.src ?? "" }
                                return { ...e, image: resFormatted.imagesBase64.find((el) => el.idElement === e.id)?.src ?? "" }
                            })

                            setEdiciones(dataEditableRef1.current.options)
                            saveToLocalStorage(key, resFormatted, time)

                        }
                    ).catch((err) => console.log(err))
                } else if (item && isUpToDate) {

                    dataEditableRef1.current.options = dataEditableRef1.current.options.map((e, i) => {
                        return { ...e, image: item.data.imagesBase64.find((el) => el.idElement === e.id)?.src ?? "" }
                    })

                    setEdiciones(dataEditableRef1.current.options)

                }
            }





            longitudItemsPrevios.current = dataEditableRef1.current.options.length //Evitar scroll la primera vez
            setEdiciones(dataEditableRef1.current.options)

            // console.log("Data al principio", data);
        }
    }, [data])







    function handleBannerEliminate(e) {

        if (toEliminate === null) {
            setToEliminate(e.target.id)//5
        } else {
            setToEliminate(null)
        }
    }

    function handleEliminate() {

        dataEditableRef1.current.options = dataEditableRef1.current.options.filter((e) => e.id !== toEliminate)

        // console.log("dataRef de eliminar categoria", dataEditableRef1.current.options);
        setToEliminate(null)

        setEdiciones(dataEditableRef1.current.options)
    }




    function handleAddCategory() {
        scroll.current = true
        const newSubCategory = {
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
                    image: ``,
                    visible: true
                },
            ]
        }

        dataEditableRef1.current.options.push(newSubCategory)
        // console.log("dataRef de añadir categoria", dataEditableRef1.current.options);

        setEdiciones((prev) => {

            return [...dataEditableRef1.current.options]
        })

    }

    useEffect(() => {
        if (!scroll.current) return
        scroll.current = false
        if (longitudItemsPrevios.current == ediciones.length) {
            return
        }

        if (galleryRef.current && galleryRef.current && ediciones) { //30 de gap
            galleryRef.current.scrollTop += (galleryRef.current.offsetHeight + 400) * ediciones.length;

        }


    }, [ediciones.length])


    function verificarRepetidos(state) {
        const seen = new Set();
        const duplicates = state.filter(item => {
            if (seen.has(item.name)) {
                return true;
            }
            seen.add(item.name);
            return false;
        });

        if (duplicates.length > 0) {
            return true
        } else {
            false
        }

        return false
    }
    function handleMenu() {
        setShowMenu(!showMenu)
        // console.log("hola");
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

            let elements = document.querySelector(".container");
            let datos
            if (elements) {

                datos = Array.from(elements.children)


                datos = datos.map((e) => {
                    return {
                        name: e.children[0]?.innerText?.trim().replace(/\r?\n|\r/g, ' ') || '',
                        image: e.children[1]?.src || '',
                        id: e.id
                    };
                });

            } else {
                console.error("No se encontró el elemento con la clase .container");
            }

            if (verificarRepetidos(datos)) {
                alert("No pueden haber titulos repetidos")
                return setEditionMode(true)
            } else {
                setEditionMode(false)



                setToEliminate(null)
                //Guarda los titulos editados en el state en la ref que es copia de una parte de Data

                for (const i in dataEditableRef1.current.options) {

                    dataEditableRef1.current.options[i].name = datos.find((e) => e.id === dataEditableRef1.current.options[i].id).name
                    dataEditableRef1.current.options[i].image = datos.find((e) => e.id === dataEditableRef1.current.options[i].id).image
                }
                // console.log("dataRef de guardar", dataEditableRef1.current.options);
                setEdiciones(dataEditableRef1.current.options)//actualiza el texto con lo del placeholder



                const images = {
                    idSection: dataEditableRef1.current.id,
                    imagesBase64: dataEditableRef1.current.options.map((e) => {
                        if (e.image && e.image.startsWith("http")) {
                            return { idElement: e.id, src: "" }
                        } else {
                            return { idElement: e.id, src: e.image }
                        }
                    })
                }


                let copia = structuredClone(dataEditableRef1.current.options);
                copia = copia.map((e) => {
                    return { ...e, image: "" }
                })


                dataAllRef1.current.options.find((e) => e.name === name).options.find((e) => e.name === name1).options = copia
                // console.log("copia luego de filtrarle las img", copia);

                //guarda en data el json actualizado de la ref
                setData(dataAllRef1.current)
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
            body: JSON.stringify({ dataAll: dataAllRef1.current, images: images, imagesHaveChanged: imagesHaveChanged.current }), // data can be `string` or {object}!
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
        // console.log("new Order", newOrder);
        setEdiciones(newOrder)
        dataEditableRef1.current.options = newOrder
        // console.log("despues", dataEditableRef1.current.options);
    }


    //🧐

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
        let cambio = !dataEditableRef1.current.options.find((el) => el.id == id).visible
        dataEditableRef1.current.options.find((el) => el.id == id).visible = !dataEditableRef1.current.options.find((el) => el.id == id).visible
        // dataEditableRef1.current.options.find((el) => el.id == id).visible = true


        if (dataEditableRef1.current.options.find((el) => el.id == id).options[0]) {
            // console.log("cambio:", cambio);
            propagar(dataEditableRef1.current.options.find((el) => el.id == id).options, cambio)
        }
        setEdiciones([...dataEditableRef1.current.options])
    }



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
            </header>


            <section>
                <Link className='flex' prefetch={false} href={`/${params.id0}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                        <path d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z" fill="#33363F" />
                    </svg>
                    <h2 className='ml-2'>INICIO</h2>
                </Link>
                <h3 className='ml-8'>{name1}</h3>
            </section>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>

                <article>
                    {editionMode && logged && data && ediciones[0] ? (<>
                        <div className='container' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
                            {/*Primer pagina*/}

                            { /*Modo ediciones*/}
                            <SortableContext items={ediciones.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                                {ediciones[0] && ediciones.map((e, i) => {
                                    return <ListItem imagesHaveChanged={imagesHaveChanged} handleVisionItem={handleVisionItem} handleBannerEliminate={handleBannerEliminate} key={e.id} i={i} ediciones={ediciones} setEdiciones={setEdiciones} logged={logged} e={e} dragActive={dragActive} toEliminate={toEliminate} />
                                })}
                            </SortableContext>
                        </div>

                        {toEliminate && <div className='modal'>
                            <p>¿Está seguro que desea elminiar la categoría <b> {`${ediciones.find((el) => el.id == toEliminate).name}`}</b> y todos sus hijos ?</p>
                            <div>
                                <button className='text-rose-500 [font-weight:bold]' onClick={handleEliminate}>ELIMINAR</button>
                                <button className='text-green-500 [font-weight:bold]' onClick={handleBannerEliminate}>CANCELAR</button>
                            </div>
                        </div>}

                    </>)
                        : <>
                            <div className='container' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
                                {/*Modo normal*/}
                                {ediciones[0] && ediciones.map((e, i) => {
                                    return <div key={e.id} className={e.visible ? 'link-pag2' : "hidden"}>
                                        <Link prefetch={true} id={`link-pag2-${e.id}`} className='link-pag2 [padding:2px] rounded-md' href={`/${name.replaceAll(" ", "-")}/${name1.replaceAll(" ", "-")}/${e.name.replaceAll(" ", "-")}`}>{e.name}</Link>
                                        {e.image ? <img src={e.image} className="cursor-pointer" onClick={() => document.getElementById(`link-pag2-${e.id}`).click()} width="30px" height="30px" alt={e.name} /> : <div className="animate-pulse space-x-4 bg-red-300 aspect-square pr-6 h-[30px] w-[30px] rounded"></div>}


                                    </div>
                                })}
                            </div>
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
                {logged ? !toEliminate && editionMode ? <button className='añadirProducto' onClick={handleAddCategory}><span>❌</span>Añadir <br /> categoría</button> : "" :
                    <div className="flex mr-6">
                        {/* {imagesInterface && dataAllRef1.current && dataAllRef1.current.interface.socialMedia.map((e) => {
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


