
export default async function ArticleS({ name, name1, name2 }) {

    let data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data`)
    data = await data.json()
    data = JSON.parse(data.body)

    let targetItem;
    if (data && data.options) {

        // Buscar la categoría
        for (const category of data.options) {
            if (category.name === name) {
                for (const subcategory of category.options) {
                    if (subcategory.name === name1) {
                        for (const item of subcategory.options) {
                            if (item.name === name2) {
                                targetItem = item;
                                break; // Sale del bucle interno
                            }
                        }
                        if (targetItem) break; // Sale del segundo bucle
                    }
                }
                if (targetItem) break; // Sale del primer bucle
            }
        }
    }
    console.log("dataa", data);

    let imagesOptions = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/getImages`, {
        method: "POST",
        body: JSON.stringify({ idSection: targetItem.id }), // data can be `string` or {object}!
        headers: {
            "Content-Type": "application/json",
        }
    })
    imagesOptions = await imagesOptions.json()
    imagesOptions = JSON.parse(imagesOptions.body)

    targetItem.options = targetItem.options.map((e, i) => {
        return { ...e, image: imagesOptions.imagesBase64.find((el) => el.idElement === e.id)?.src ?? "" }
    })


    return (
        <div style={{ scrollBehavior: "smooth" }} className={data.interface.productsListViewMode ? "galery galery-small" : "galery"}>

            {targetItem.options.map((e, i) => {

                return <div className={e.visible ? data.interface.productsListViewMode ? "galery-item-small-user" : 'galery-item ' : "hidden"} key={e.id}>

                    {e.image ? <img src={e.image} alt={e.name} /> : <div className="skeleton animate-pulse space-x-4 bg-red-300 h-[auto] aspect-square w-[70%] rounded"></div>}

                    <h4>{e.name}</h4>
                    <p >{e.description}</p>
                    <div className={!e.description && data.interface.productsListViewMode ? "sinDescription flex items-center [padding:2px]" : "flex items-center [padding:2px]"} ><span>$</span><p className='[min-width:20px] font-bold rounded-md [margin-left:2px] [padding:2px]'>{e.price}</p></div>
                </div>
            })}
        </div>
    )
}
