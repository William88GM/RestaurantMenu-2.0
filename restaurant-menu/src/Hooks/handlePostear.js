
export default function handlePostear(images, setLoading, guardando, imagesHaveChanged, dataAllRef) {
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/modify`, {
        method: "PUT",
        body: JSON.stringify({ dataAll: dataAllRef.current, images: images, imagesHaveChanged: imagesHaveChanged.current }), // data can be `string` or {object}!
        headers: {
            "Content-Type": "application/json",
        },
    }).then(
        (res) => res.json(),
    ).then(
        (res) => {
            setLoading(false)
            guardando.current = false
            imagesHaveChanged.current = false
            localStorage.clear();
        }
    ).catch((err) => {
        console.log(err);
        guardando.current = false
        localStorage.clear();
    })


}
