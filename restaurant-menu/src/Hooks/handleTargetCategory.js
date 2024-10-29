
export default function handleTargetCategory(data, names, depth = 0) {
    if (names.length === 0) return data //Home


    // Punto de salida: si llegamos al último nombre, devolvemos el objeto correspondiente
    if (depth >= names.length || !data.options) {
        return null;
    }

    for (const category of data.options) {
        if (category.name === names[depth]) {
            // Al llegar al último nombre, retornamos el objeto encontrado
            if (depth === names.length - 1) {
                return category;
            }
            // Recurre al siguiente nivel
            const result = handleTargetCategory(category, names, depth + 1);
            if (result) {
                return result;
            }
        }
    }

    return null; // Si no encuentra nada
}

// Ejemplo de uso
// const targetSubcategory = handleTargetCategory(data, ["name", "name1", "name2", "name3"]);
