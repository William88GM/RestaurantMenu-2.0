
export default function loadFromLocalStorage(key) {
    let itemString = localStorage.getItem(key);
    let item
    const now = new Date()
    let isUpToDate = false
    if (itemString) {
        item = JSON.parse(itemString)
        const expirationDate = new Date(item.expiration);
        // console.log("El item es nuevo?...", !(now > expirationDate));
        if (now > expirationDate) {
            isUpToDate = false
            return { isUpToDate, item: false, exists: true }
        } else {
            isUpToDate = true
            return { isUpToDate, item, exists: true }
        }
    }
    return { exists: false, isUpToDate: false, item: false }
}





