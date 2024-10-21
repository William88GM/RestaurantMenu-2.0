import React, { useEffect, useState } from 'react'



export default function Article({ handleEliminate, dragActive, dataEditableRef, setEdiciones, toEliminate, handleBannerEliminate, handleVisionItem, handleDetails, viewerMode, p, EditionMode, NormalMode, details = null, baseURL, editionModeState, viewerModeState, logged, data, ediciones, galleryRef, cardRef, imagesHaveChanged }) {


    useEffect(() => {
        console.log("dragActive", dragActive);
    }, [dragActive])

    return <article>
        {editionModeState && logged && data && viewerModeState !== null && ediciones[0] ?
            <EditionMode handleEliminate={handleEliminate} data={data} dataEditableRef={dataEditableRef} viewerMode={viewerMode} setEdiciones={setEdiciones} toEliminate={toEliminate} dragActive={dragActive} logged={logged} handleBannerEliminate={handleBannerEliminate} handleVisionItem={handleVisionItem} imagesHaveChanged={imagesHaveChanged} galleryRef={galleryRef} ediciones={ediciones} />
            :
            <NormalMode handleDetails={handleDetails} viewerMode={viewerMode} p={p} details={details} baseURL={baseURL} galleryRef={galleryRef} cardRef={cardRef} ediciones={ediciones} />
        }
    </article >

}
