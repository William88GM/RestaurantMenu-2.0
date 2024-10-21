import ListItems1 from "./ListItems1"


export default function NormalMode1({ baseURL, galleryRef, ediciones, }) {


    return (
        <>
            <div className='container' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
                {ediciones[0] && ediciones.map((e, i) => {
                    return <ListItems1 e={e} key={e.id} baseURL={baseURL} />
                })}
            </div>
        </>
    )
}
