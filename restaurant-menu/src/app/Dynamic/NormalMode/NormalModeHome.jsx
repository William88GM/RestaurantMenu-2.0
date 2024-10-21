import ListItemsHome from "./ListItemsHome"

export default function NormalModeHome({ baseURL, galleryRef, cardRef, ediciones }) {
    return (
        <>
            <div className='containerSucursales' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
                { /*Modo normal*/}
                {ediciones[0] && ediciones.map((e, i) => {
                    return <ListItemsHome e={e} key={e.id} cardRef={cardRef} />
                })}
            </div>
        </>
    )
}
