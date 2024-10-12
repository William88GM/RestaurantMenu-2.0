
export default async function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key)

    } catch (err) {
        console.log(err);
    }
}