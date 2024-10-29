import useChangeView from "@/Hooks/useChangeView";
import Link from "next/link";
import { useEffect } from "react";

export default function Section({ isHome, viewerMode, handleChangeView, galleryRef, namesUrlCategories, previousPage, actualPage, editionMode, }) {


    let navigateTo = "/"

    for (const index in namesUrlCategories) {
        if (index != namesUrlCategories.length - 1 && namesUrlCategories.length > 1) {
            navigateTo = navigateTo.concat(`${namesUrlCategories[index].replaceAll(" ", "-")}/`)
        }
    }



    useEffect(() => {
        console.log("ediciones", editionMode);
    }, [editionMode])

    if (isHome) {
        return <section>
            <h1 className="mx-8 text-center font-bold border-b-2 border-b-black">Bienvenido a La Vene San Juan</h1>
        </section>
    } else {


        return (
            <section className='flex justify-between flex-row items-center'>
                <div>
                    <Link prefetch={false} className='flex' href={navigateTo}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                            <path d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z" fill="#33363F" />
                        </svg>
                        <h2 className='ml-2'>{previousPage}</h2>
                    </Link>
                    <h3 className='ml-8'>{actualPage}</h3>
                </div>
                {viewerMode !== null && handleChangeView !== null && !editionMode && <>{
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
        )
    }
}