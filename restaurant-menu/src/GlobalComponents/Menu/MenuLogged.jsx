
import { SessionContext } from '@/Context/SessionContext'
// import * as generateExcel from '@/Hooks/generateExcel.cjs'
import * as generateJson from '@/Hooks/generateJson.cjs'
import useHandleMenu from '@/Hooks/handleMenu'

import useData from '@/Hooks/useData'
import useImagesInterface from '@/Hooks/useImagesInterface'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'

"use strict"

export default function MenuLogged({ setShowPassword, showPassword, showMenu, setShowMenu, handleMenu }) {



    const { logged, setLogged } = useContext(SessionContext)
    const { imagesInterface, setImagesInterface } = useImagesInterface()
    const [formData, setFormData] = useState()
    const { refresh } = useData()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [cerrarSesion, setCerrarSesion] = useState(false)


    async function callData() {
        try {
            localStorage.clear()
            let respuesta = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data`)

            respuesta = await respuesta.json()

            setData(JSON.parse(respuesta.body))

        } catch (err) {
            console.log(err);
        }

    }




    async function pedirConfig() {
        try {

            const response = await axios.get("/api/data/getConfig")


            if (response.status === 200) {

                let settings = JSON.parse(response.data.settings)

                //Le añadimos propiedades a settings de link y media con los id de cada red para render posterior e identificacion
                let dataGrandeInfo = {}
                data.interface.socialMedia.forEach((e) => {
                    dataGrandeInfo = { ...dataGrandeInfo, [`socialName-${e.id}`]: e.name, [`socialLink-${e.id}`]: e.link }

                })
                // console.log("AVERRRRR", data.interface.productsListViewMode);
                settings = { ...settings, ...dataGrandeInfo, ["productsListViewMode"]: data.interface.productsListViewMode }
                setFormData(settings)
            }
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        callData()
    }, [])

    useEffect(() => {
        if (!data) return
        if (data && data.interface) {
            pedirConfig()
            // setImagesInterface(data.interface.socialMedia)
        }
    }, [data])

    const handleFileChange = async (event, index) => {
        const file = event.target.files[0];

        const maxSize = 20 * 1024 * 1024; // Tamaño máximo en bytes (20 MB en este caso)

        if (file && file.size > maxSize) {
            alert('El archivo es demasiado grande. El tamaño máximo permitido es 20 MB.');
            event.target.value = ''; // Limpiar el input correctamente
        } else {
            if (file) {
                try {
                    // Convertir la imagen a WebP con una resolución fija de 300x300
                    const webpImage = await convertImageToWebP(file, 500, 500);
                    // downloadWebP(webpImage) //para en desarrollo ver como queda
                    // Crear un FileReader para leer la imagen en formato WebP
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const newImagesInterface = { ...imagesInterface };
                        newImagesInterface.socialMedia[index].src = reader.result;
                        setImagesInterface(newImagesInterface);

                    };
                    reader.readAsDataURL(webpImage);
                } catch (error) {
                    console.error("Error al convertir la imagen a WebP:", error);
                }
            }
        }
    };

    // Función para convertir la imagen a WebP con una resolución fija
    const convertImageToWebP = (file, targetWidth, targetHeight) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    const ctx = canvas.getContext('2d');

                    // Calcular las coordenadas para mantener el aspecto de la imagen original
                    const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
                    const x = (targetWidth - img.width * scale) / 2;
                    const y = (targetHeight - img.height * scale) / 2;
                    const width = img.width * scale;
                    const height = img.height * scale;

                    // Dibujar la imagen en el canvas con la nueva resolución
                    ctx.drawImage(img, x, y, width, height);

                    // Convertir a WebP
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(new File([blob], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' }));
                        } else {
                            reject(new Error('No se pudo convertir la imagen a WebP'));
                        }
                    }, 'image/webp');
                };
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };






    function handleChange(e) {

        e.preventDefault()
        if (e.target.name === "productsListViewMode") {
            let listMode = { productsListViewMode: !formData.productsListViewMode }
            setFormData({ ...formData, ...listMode })
        } else {

            setFormData(
                {
                    ...formData,
                    [e.target.name]: e.target.value
                })
            if (e.target.name === "user" || e.target.name === "password") {
                setCerrarSesion(true)
            }
        }


    }



    async function handleSubmit(e) {
        e.preventDefault()
        // console.log(formData);
        try {
            setLoading(true)
            const response = await axios.post("/api/data/modify/config", { formData, imagesInterface, data })
            if (response.status === 200) {
                setShowMenu(false)
                setLoading(false)
                callData()
                refresh()
                if (cerrarSesion) {
                    handleCerrarSesion()
                }
            }
            // console.log(response);
        } catch (err) {
            setLoading(false)
            setShowMenu(false)
            callData()
            console.log(err);
            refresh()
            if (cerrarSesion) {
                handleCerrarSesion()
            }
        }


        //tambien hay que hacer que  /api/data/modify/config guarde en dataGrande.json la info de las redes sociales que le llegan
    }


    async function handleCerrarSesion() {
        try {
            setLoading(true)
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/login/closeSession`, {})
            if (response.status === 200) {
                setLogged(false)
                setLoading(false)
                setShowMenu(false)
                localStorage.clear();

                refresh()
            }
        } catch (err) {
            console.log(err);
            setLoading(false)
            setLogged(false)
            setShowMenu(false)
            localStorage.clear();

            refresh()
        }

    }

    async function handleExcel() {

        try {
            // const generateExcel = dynamic(() => import('@/Hooks/generateExcel.js'), { ssr: false })
            const generateExcel = await import('@/Hooks/generateExcel.js')
            // console.log("a ver el import: ", generateExcel.default.generateExcel);
            generateExcel.default.generateExcel(data)

        } catch (err) {
            console.log(err)
        }


    }

    async function handleJson(e) {

        try {

            let res = await generateJson.handleFileUpload(e)
            res.interface = data.interface
            e.target.value = ""
            setData(res)
            console.log("RES JSON: ", res);
        } catch (err) {
            console.log(err);
        }

    }



    const [cosito, setCosito] = useState(null)
    useEffect(() => {
        if (!formData) return
        setCosito(formData.productsListViewMode)

    }, [formData])



    return (
        <>

            <div className={`MenuAdminLogged formLogged`}>
                <h3>Panel Configuración</h3>
                {!loading && formData ?
                    <form onSubmit={handleSubmit} className="my-8" >
                        <label htmlFor="user" className='text-white'>Usuario</label>
                        <input onChange={handleChange} value={formData.user} type="text" name="user" id="user" />
                        <label htmlFor="password" className='text-white'>Contraseña</label>
                        <div className="flex relative">
                            <input onChange={handleChange} value={formData.password} type={showPassword ? "text" : "password"} name="password" id="password" />
                            {showPassword ?
                                <svg onClick={() => setShowPassword(!showPassword)} style={{ right: "8px", marginRight: "8px" }} className="cursor-pointer absolute right-2 top-[50%] translate-y-[-50%] mr-2" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 4.45962C9.91153 4.16968 10.9104 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C3.75612 8.07914 4.32973 7.43025 5 6.82137" stroke="#3b0000" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#3b0000" strokeWidth="1.5" />
                                </svg> :
                                <svg onClick={() => setShowPassword(!showPassword)} style={{ right: "8px", marginRight: "8px" }} className="cursor-pointer absolute right-2 top-[50%] translate-y-[-50%] mr-2" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                                    <path d="M2.68936 6.70456C2.52619 6.32384 2.08528 6.14747 1.70456 6.31064C1.32384 6.47381 1.14747 6.91472 1.31064 7.29544L2.68936 6.70456ZM15.5872 13.3287L15.3125 12.6308L15.5872 13.3287ZM9.04145 13.7377C9.26736 13.3906 9.16904 12.926 8.82185 12.7001C8.47466 12.4742 8.01008 12.5725 7.78417 12.9197L9.04145 13.7377ZM6.37136 15.091C6.14545 15.4381 6.24377 15.9027 6.59096 16.1286C6.93815 16.3545 7.40273 16.2562 7.62864 15.909L6.37136 15.091ZM22.6894 7.29544C22.8525 6.91472 22.6762 6.47381 22.2954 6.31064C21.9147 6.14747 21.4738 6.32384 21.3106 6.70456L22.6894 7.29544ZM19 11.1288L18.4867 10.582V10.582L19 11.1288ZM19.9697 13.1592C20.2626 13.4521 20.7374 13.4521 21.0303 13.1592C21.3232 12.8663 21.3232 12.3914 21.0303 12.0985L19.9697 13.1592ZM11.25 16.5C11.25 16.9142 11.5858 17.25 12 17.25C12.4142 17.25 12.75 16.9142 12.75 16.5H11.25ZM16.3714 15.909C16.5973 16.2562 17.0619 16.3545 17.409 16.1286C17.7562 15.9027 17.8545 15.4381 17.6286 15.091L16.3714 15.909ZM5.53033 11.6592C5.82322 11.3663 5.82322 10.8914 5.53033 10.5985C5.23744 10.3056 4.76256 10.3056 4.46967 10.5985L5.53033 11.6592ZM2.96967 12.0985C2.67678 12.3914 2.67678 12.8663 2.96967 13.1592C3.26256 13.4521 3.73744 13.4521 4.03033 13.1592L2.96967 12.0985ZM12 13.25C8.77611 13.25 6.46133 11.6446 4.9246 9.98966C4.15645 9.16243 3.59325 8.33284 3.22259 7.71014C3.03769 7.3995 2.90187 7.14232 2.8134 6.96537C2.76919 6.87696 2.73689 6.80875 2.71627 6.76411C2.70597 6.7418 2.69859 6.7254 2.69411 6.71533C2.69187 6.7103 2.69036 6.70684 2.68957 6.70503C2.68917 6.70413 2.68896 6.70363 2.68892 6.70355C2.68891 6.70351 2.68893 6.70357 2.68901 6.70374C2.68904 6.70382 2.68913 6.70403 2.68915 6.70407C2.68925 6.7043 2.68936 6.70456 2 7C1.31064 7.29544 1.31077 7.29575 1.31092 7.29609C1.31098 7.29624 1.31114 7.2966 1.31127 7.2969C1.31152 7.29749 1.31183 7.2982 1.31218 7.299C1.31287 7.30062 1.31376 7.30266 1.31483 7.30512C1.31698 7.31003 1.31988 7.31662 1.32353 7.32483C1.33083 7.34125 1.34115 7.36415 1.35453 7.39311C1.38127 7.45102 1.42026 7.5332 1.47176 7.63619C1.57469 7.84206 1.72794 8.13175 1.93366 8.47736C2.34425 9.16716 2.96855 10.0876 3.8254 11.0103C5.53867 12.8554 8.22389 14.75 12 14.75V13.25ZM15.3125 12.6308C14.3421 13.0128 13.2417 13.25 12 13.25V14.75C13.4382 14.75 14.7246 14.4742 15.8619 14.0266L15.3125 12.6308ZM7.78417 12.9197L6.37136 15.091L7.62864 15.909L9.04145 13.7377L7.78417 12.9197ZM22 7C21.3106 6.70456 21.3107 6.70441 21.3108 6.70427C21.3108 6.70423 21.3108 6.7041 21.3109 6.70402C21.3109 6.70388 21.311 6.70376 21.311 6.70368C21.3111 6.70352 21.3111 6.70349 21.3111 6.7036C21.311 6.7038 21.3107 6.70452 21.3101 6.70576C21.309 6.70823 21.307 6.71275 21.3041 6.71924C21.2983 6.73223 21.2889 6.75309 21.2758 6.78125C21.2495 6.83757 21.2086 6.92295 21.1526 7.03267C21.0406 7.25227 20.869 7.56831 20.6354 7.9432C20.1669 8.69516 19.4563 9.67197 18.4867 10.582L19.5133 11.6757C20.6023 10.6535 21.3917 9.56587 21.9085 8.73646C22.1676 8.32068 22.36 7.9668 22.4889 7.71415C22.5533 7.58775 22.602 7.48643 22.6353 7.41507C22.6519 7.37939 22.6647 7.35118 22.6737 7.33104C22.6782 7.32097 22.6818 7.31292 22.6844 7.30696C22.6857 7.30398 22.6867 7.30153 22.6876 7.2996C22.688 7.29864 22.6883 7.29781 22.6886 7.29712C22.6888 7.29677 22.6889 7.29646 22.689 7.29618C22.6891 7.29604 22.6892 7.29585 22.6892 7.29578C22.6893 7.29561 22.6894 7.29544 22 7ZM18.4867 10.582C17.6277 11.3882 16.5739 12.1343 15.3125 12.6308L15.8619 14.0266C17.3355 13.4466 18.5466 12.583 19.5133 11.6757L18.4867 10.582ZM18.4697 11.6592L19.9697 13.1592L21.0303 12.0985L19.5303 10.5985L18.4697 11.6592ZM11.25 14V16.5H12.75V14H11.25ZM14.9586 13.7377L16.3714 15.909L17.6286 15.091L16.2158 12.9197L14.9586 13.7377ZM4.46967 10.5985L2.96967 12.0985L4.03033 13.1592L5.53033 11.6592L4.46967 10.5985Z" fill="#3b0000" />
                                </svg>}
                        </div>



                        <div style={{ flexDirection: "column", margin: "32px 0", padding: "16px", borderRadius: "30px" }} className='flex flex-col my-6 bg-red-300 rounded-3xl p-4'>
                            <h5 style={{ marginRight: "12px" }}>     Visualizar productos en modo lista</h5>
                            {formData && cosito !== null && <label className="toggle-switch">

                                <input type="checkbox" checked={cosito} name='productsListViewMode' onChange={handleChange} />
                                <span className="slider"></span>
                            </label>}
                        </div>


                        <button type='button' onClick={handleExcel}>Descargar Excel </button>



                        <button type='button' onClick={() => document.getElementById("uploadExcel").click()} > Subir Excel</button>

                        <input type="file" className='hidden' id="uploadExcel" onChange={handleJson} accept=".xlsx" />



                        {/* REDES SOCIALES */}

                        {/* {data && imagesInterface ? data.interface.socialMedia.map((e, i) => {
                            return <div className='flex flex-col my-6 bg-red-300 rounded-3xl p-4' key={e.id}>
                                <label className='flex flex-col my-2 text-black font-extrabold  ' >
                                    Nombre Red social {i + 1}
                                    <input className='text-black mt-4' onChange={handleChange} type="text" name={`socialName-${e.id}`} id={`socialName-${e.id}`} value={formData[`socialName-${e.id}`]} />
                                </label>
                                <label className='flex flex-col my-2 text-black font-extrabold'>
                                    Link Red social {i + 1}
                                    <input className='text-black mt-4' onChange={handleChange} type="text" name={`socialLink-${e.id}`} id={`socialLink-${e.id}`} value={formData[`socialLink-${e.id}`]} />
                                </label>
                                <label className='flex my-2 items-center justify-between font-bold bg-red-400 rounded-3xl px-5 py-3 text-black cursor-pointer' onClick={() => document.getElementById(e.id).click()}>
                                    Imagen Red social {i + 1}
                                    <img className='w-7 mx-2 cursor-pointer' src={imagesInterface.socialMedia.find((el) => el.idElement === e.id).src} alt={e.name} />
                                </label>
                                <input accept="image/*" type="file" id={e.id} style={{ display: 'none' }} onChange={(event) => handleFileChange(event, i)} />
                            </div>
                        }) : ""} */}


                        {/* El push del nuevo o la eliminacion se haria en data.interface.socialMedia */}




                        <button type="submit" onClick={handleSubmit} >Guardar</button>
                        <button type="button" style={{ opacity: 0.6 }} onClick={handleCerrarSesion} >Cerrar Sesión</button>
                    </form>

                    :
                    <span className='loaderClarito mt-20'></span>}
            </div>

            {showMenu ? <button onClick={handleMenu} className="buttonMenu">✖</button> : ""}
        </>
    )
}
