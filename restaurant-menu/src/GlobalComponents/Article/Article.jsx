import React, { useEffect, useState } from 'react'



export default function Article({ dragActive, dataEditableRef, setEdiciones, handleVisionItem, handleDetails, viewerMode, p, EditionMode, NormalMode, details = null, baseURL, editionModeState, viewerModeState, logged, data, ediciones, galleryRef, cardRef, imagesHaveChanged }) {


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
