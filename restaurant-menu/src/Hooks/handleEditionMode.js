
export default function handleEditionMode(loading, editionMode, setEditionMode, handleSave) {
    if (loading) return
    if (editionMode) {

        handleSave()
    } else {
        setEditionMode(true)
    }

}
