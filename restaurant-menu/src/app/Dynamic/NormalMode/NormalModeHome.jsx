import ListItemsHome from "./ListItemsHome"

export default function NormalModeHome({ baseURL, galleryRef, cardRef, ediciones }) {
    return (
        <>
            <div className='containerSucursales' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
                { /*Modo normal*/}
                {!ediciones[0] ?
                    <span className='loader mt-20 m-auto'></span> :
                    ediciones.map((e, i) => {
                        return <ListItemsHome e={e} key={e.id} cardRef={cardRef} />
                    })}
            </div>
        </>
    )
}
