import React, { useEffect, useState } from 'react'



export default function Article({ namesUrlCategories, dragActive, dataEditableRef, setEdiciones, handleVisionItem, handleDetails, viewerMode, p, EditionMode, NormalMode, details = null, editionModeState, viewerModeState, logged, data, ediciones, galleryRef, cardRef, imagesHaveChanged }) {


    let baseURL = `${process.env.NEXT_PUBLIC_URL}`

    for (const index in namesUrlCategories) {
        if (namesUrlCategories.length > 0) {
            baseURL = baseURL.concat(`/${namesUrlCategories[index].replaceAll(" ", "-")}`)
        }
    }

    useEffect(() => {
        console.log("dragActive", dragActive);
    }, [dragActive])

    //Ver si no carga el modo ediciones igualmente, tal vez haya que usar cookies

    return <article>
        {editionModeState && logged && data && viewerModeState !== null && ediciones[0] ?
            <EditionMode data={data} dataEditableRef={dataEditableRef} viewerMode={viewerMode} setEdiciones={setEdiciones} dragActive={dragActive} logged={logged} handleVisionItem={handleVisionItem} imagesHaveChanged={imagesHaveChanged} galleryRef={galleryRef} ediciones={ediciones} />
            :
            <NormalMode handleDetails={handleDetails} viewerMode={viewerMode} p={p} details={details} baseURL={baseURL} galleryRef={galleryRef} cardRef={cardRef} ediciones={ediciones} />
        }
    </article >

}
