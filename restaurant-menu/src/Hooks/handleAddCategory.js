export default function handleAddCategory(levels, currentLevel, scroll, dataEditableRef, setEdiciones) {
    scroll.current = true
    const newCompletedCategory = generateCategory(levels, currentLevel);
    dataEditableRef.current.options.push(newCompletedCategory)

    setEdiciones((prev) => {
        return [...dataEditableRef.current.options]
    })
    return
}
function generateCategory(levels, currentLevel) {
    const baseCategory = {
        name: `Nombre categoria pag ${currentLevel}`,
        id: crypto.randomUUID(),
        image: "",
        visible: true,
        options: []
    };

    if (currentLevel === levels) {
        return {
            name: `Nombre nuevo producto`,
            id: crypto.randomUUID(),
            description: "Descripción del producto",
            price: "0",
            image: "",
            visible: true
        };
    }

    baseCategory.options.push(generateCategory(levels, currentLevel + 1));

    return baseCategory;
}