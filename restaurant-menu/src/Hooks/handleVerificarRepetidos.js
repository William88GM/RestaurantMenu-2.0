
export default function handleVerificarRepetidos(state) {
    if (!state) return false

    const seen = new Set();
    const duplicates = state.filter(item => {
        if (seen.has(item.name)) {
            return true;
        }
        seen.add(item.name);
        return false;
    });

    if (duplicates.length > 0) {
        return true
    } else {
        false
    }

    return false
}
