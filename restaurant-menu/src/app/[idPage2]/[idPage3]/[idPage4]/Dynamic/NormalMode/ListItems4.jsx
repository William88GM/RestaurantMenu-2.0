import { useEffect } from "react"

export default function ListItems4({ viewerMode, handleDetails, e, }) {

    useEffect(() => {
        console.log("llega al componente?", viewerMode)
    }, [viewerMode])


    return (
        <div onClick={() => viewerMode && handleDetails({ id: e.id, h4: e.name })} className={e.visible ? viewerMode ? "galery-item-small-user" : 'galery-item ' : "hidden"} >

            {e.image ? <img src={e.image} alt={e.name} /> : <div className="skeleton animate-pulse space-x-4 bg-red-300 h-[auto] aspect-square w-[70%] rounded"></div>}

            <h4>{e.name}</h4>
            <p >{e.description}</p>
            <div className={!e.description && viewerMode ? "sinDescription flex items-center [padding:2px]" : "flex items-center [padding:2px]"} ><span>$</span><p className='[min-width:20px] font-bold rounded-md [margin-left:2px] [padding:2px]'>{e.price}</p></div>
        </div>
    )
}
