const ExcelJS = require('exceljs');
// import * as ExcelJS from "exceljs";


function findIdPadre(col, buscado, worksheet, columnToLetter) {
    let hayElemento = true
    let i = 2
    let target
    col = col - 9
    console.log("Al menos llega?");
    while (hayElemento) {
        hayElemento = false
        target = worksheet.getCell(`${columnToLetter(col)}${i}`)
        if (target.value) {
            hayElemento = true
            console.log("buscado:", buscado);
            console.log("target.value: ", target.value);
            if (target.value == buscado) {
                console.log("El id del padre que se asigno es: ", worksheet.getCell(`${columnToLetter(col - 3)}${i}`).value);


                let res = worksheet.getCell(`${columnToLetter(col - 3)}${i}`).value
                // console.log("El id del padre que se asigno es: ", res);

                return res


            }

            i++
        }
    }
}




async function generateJson(file) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);

    function columnToLetter(column) {
        let temp, letter = '';
        while (column > 0) {
            temp = (column - 1) % 26;
            letter = String.fromCharCode(temp + 65) + letter;
            column = (column - temp - 1) / 26;
        }
        return letter;
    }
    let json = {
        interface: "Falta asignarle interface desde data cuando se le devuelva al menuLogged",
        options: []
    }

    workbook.eachSheet((worksheet) => {
        let col = 34; //AH
        let arrayInicial = []
        let arrayPadres = []

        let hayElemento = true
        let i = 2

        while (hayElemento) {
            hayElemento = false
            if (i) {

                if (worksheet.getCell(`${columnToLetter(col)}${i}`).value) {
                    hayElemento = true

                    let objAGuardar = {}
                    let padreD = worksheet.getCell(`${columnToLetter(col)}${i}`).value
                    let nameD = worksheet.getCell(`${columnToLetter(col + 1)}${i}`).value
                    let idD = worksheet.getCell(`${columnToLetter(col - 2)}${i}`).value || crypto.randomUUID() //para los nuevos
                    let descriptionD = worksheet.getCell(`${columnToLetter(col + 2)}${i}`).value
                    let priceD = worksheet.getCell(`${columnToLetter(col + 3)}${i}`).value
                    let visibleD = worksheet.getCell(`${columnToLetter(col + 4)}${i}`).value
                    let imageD = worksheet.getCell(`${columnToLetter(col - 1)}${i}`).value
                    let idPadreD = worksheet.getCell(`${columnToLetter(col + 6)}${i}`).value || findIdPadre(col, padreD, worksheet, columnToLetter) || ""
                    // console.log("Id random: ", idD);
                    // console.log("ID PADRE:", idPadreD);
                    if (padreD && padreD != "-") objAGuardar.padre = padreD
                    if (nameD && nameD != "-") objAGuardar.name = nameD
                    if (idD && idD != "-") objAGuardar.id = idD
                    // if (descriptionD && descriptionD != "-") objAGuardar.description = descriptionD //Si quiero description en el nivel inicial lo cambio aca: objAGuardar.description= descriptionD || ""
                    objAGuardar.description = descriptionD ? descriptionD == "-" ? "" : descriptionD : ""
                    if (priceD && priceD != "-") objAGuardar.price = priceD
                    if (visibleD != undefined) objAGuardar.visible = visibleD
                    if (imageD && imageD != "-") objAGuardar.image = imageD
                    if (idPadreD && idPadreD != "-") objAGuardar.idPadre = idPadreD

                    arrayInicial.push(objAGuardar)
                    i++
                }
            }
        }
        // console.log("2");

        //crear array de padres
        let hayElemento2 = true
        let i2 = 2
        let ubiPadre = col - 10
        while (hayElemento2) {
            hayElemento2 = false
            if (columnToLetter(ubiPadre) && worksheet.getCell(`${columnToLetter(ubiPadre)}${i2}`).value) {
                hayElemento2 = true
                // console.log("El elemento con supuesto valor es:", worksheet.getCell(`${columnToLetter(ubiPadre + 1)}${i2}`).value);
                // if (!arrayPadres.find(((elem) => elem.name === worksheet.getCell(`${columnToLetter(ubiPadre + 1)}${i2}`).value))) {
                // console.log("Veces que se ejecuto: ", i2 - 1);



                let objAGuardar = {}
                let padreD = worksheet.getCell(`${columnToLetter(ubiPadre)}${i2}`).value
                let nameD = worksheet.getCell(`${columnToLetter(ubiPadre + 1)}${i2}`).value
                let idD = worksheet.getCell(`${columnToLetter(ubiPadre - 2)}${i2}`).value || crypto.randomUUID()
                let descriptionD = worksheet.getCell(`${columnToLetter(ubiPadre + 2)}${i2}`).value
                let priceD = worksheet.getCell(`${columnToLetter(ubiPadre + 3)}${i2}`).value
                let visibleD = worksheet.getCell(`${columnToLetter(ubiPadre + 4)}${i2}`).value
                let imageD = worksheet.getCell(`${columnToLetter(ubiPadre - 1)}${i2}`).value
                let idPadreD = worksheet.getCell(`${columnToLetter(ubiPadre + 6)}${i2}`).value || findIdPadre(ubiPadre, padreD, worksheet, columnToLetter) || ""

                if (i2 > 260) {
                    console.log("Id random: ", idD);
                    console.log("ID PADRE:", idPadreD);
                }

                if (padreD && padreD != "-") objAGuardar.padre = padreD
                if (nameD && nameD != "-") objAGuardar.name = nameD
                if (idD && idD != "-") objAGuardar.id = idD
                if (descriptionD && descriptionD != "-") objAGuardar.description = descriptionD
                if (priceD && priceD != "-") objAGuardar.price = priceD
                if (visibleD != undefined) objAGuardar.visible = visibleD
                if (imageD && imageD != "-") objAGuardar.image = imageD
                if (idPadreD && idPadreD != "-") objAGuardar.idPadre = idPadreD
                objAGuardar.options = []

                arrayPadres.push(objAGuardar)

                // }
                i2++
            }
        }

        // console.log("3");
        arrayInicial.forEach((e, i) => {
            if (i > 260) {

                console.log("Array padres", arrayPadres);
                console.log("array inicial", arrayInicial);
                console.log("Se busca...", arrayPadres.find((el) => el.name === e.padre));
            }


            let objetoAGuardar = {}
            if (e.name && e.name != "-") objetoAGuardar.name = e.name
            if (e.id && e.id != "-") objetoAGuardar.id = e.id
            // if (e.description && e.description != "-") objetoAGuardar.description = e.description
            objetoAGuardar.description = e.description || ""
            if (e.price && e.price != "-") objetoAGuardar.price = e.price
            if (e.visible && e.visible != "-") objetoAGuardar.visible = e.visible
            // if (e.image && e.image != "-") objetoAGuardar.image = e.image
            objetoAGuardar.image = e.image || ""
            if (e.options && e.options != "-") objetoAGuardar.options = e.options





            arrayPadres.find((el) => el.id === e.idPadre).options.push(objetoAGuardar)
        });

        //Ver 
        //Le paso el arrayPadres
        cosas(arrayPadres, col - 10, worksheet)
        // let res = cosas(arrayPadres, col - 8, worksheet)
        // console.log("La res que le llega ", res);
        // json.options.push(res)

    });



    //solo crea el array de padres y les asigna sus hijos que le llegaron por parametro
    function cosas(arrayHijos, col, worksheet) {
        // console.log("4");
        let arrayPadres = []
        let hayElemento2 = true
        let i2 = 2
        let ubiPadre = col - 10
        while (hayElemento2) {
            hayElemento2 = false
            if (columnToLetter(ubiPadre) && worksheet.getCell(`${columnToLetter(ubiPadre)}${i2}`).value) {
                hayElemento2 = true
                // console.log("El elemento con supuesto valor es:", worksheet.getCell(`${columnToLetter(ubiPadre + 1)}${i2}`).value);
                // if (!arrayPadres.find(((elem) => elem.name === worksheet.getCell(`${columnToLetter(ubiPadre + 1)}${i2}`).value))) { //Esta condicion se está cumpliendo y no se guarad nuestras promos
                // console.log("Veces que se ejecuto: ", i2 - 1);

                let objAGuardar = {}
                let padreD = worksheet.getCell(`${columnToLetter(ubiPadre)}${i2}`).value
                let nameD = worksheet.getCell(`${columnToLetter(ubiPadre + 1)}${i2}`).value
                let idD = worksheet.getCell(`${columnToLetter(ubiPadre - 2)}${i2}`).value || crypto.randomUUID()
                let descriptionD = worksheet.getCell(`${columnToLetter(ubiPadre + 2)}${i2}`).value
                let priceD = worksheet.getCell(`${columnToLetter(ubiPadre + 3)}${i2}`).value
                let visibleD = worksheet.getCell(`${columnToLetter(ubiPadre + 4)}${i2}`).value
                let imageD = worksheet.getCell(`${columnToLetter(ubiPadre - 1)}${i2}`).value
                let idPadreD = worksheet.getCell(`${columnToLetter(ubiPadre + 6)}${i2}`).value || findIdPadre(ubiPadre, padreD, worksheet, columnToLetter) || ""
                // console.log("Id random: ", idD);
                // console.log("ID PADRE:", idPadreD);
                if (padreD && padreD != "-") objAGuardar.padre = padreD
                if (nameD && nameD != "-") objAGuardar.name = nameD
                if (idD && idD != "-") objAGuardar.id = idD
                if (descriptionD && descriptionD != "-") objAGuardar.description = descriptionD//Si quiero description en todos los niveles lo cambio aca: objAGuardar.description= descriptionD || ""
                if (priceD && priceD != "-") objAGuardar.price = priceD
                if (visibleD != undefined) objAGuardar.visible = visibleD
                if (imageD && imageD != "-") objAGuardar.image = imageD
                if (idPadreD && idPadreD != "-") objAGuardar.idPadre = idPadreD
                objAGuardar.options = []

                arrayPadres.push(objAGuardar)
                // }
                i2++
            }
        }


        arrayHijos.forEach((e) => {
            // console.log("Aqui empieza la fiesta");
            // console.log("Array padres", arrayPadres);
            // console.log("array inicial", arrayHijos);
            // console.log("Se busca...", arrayPadres.find((el) => el.name === e.padre));
            // console.log("Se le asignará: ", e);

            let objetoAGuardar = {}
            if (e.name && e.name != "-") objetoAGuardar.name = e.name
            if (e.id && e.id != "-") objetoAGuardar.id = e.id
            if (e.description && e.description != "-") objetoAGuardar.description = e.description
            if (e.price && e.price != "-") objetoAGuardar.price = e.price
            if (e.visible && e.visible != "-") objetoAGuardar.visible = e.visible
            if (e.image && e.image != "-") objetoAGuardar.image = e.image
            if (e.options && e.options != "-") objetoAGuardar.options = e.options


            arrayPadres.find((el) => el.id === e.idPadre).options.push(objetoAGuardar)//crear y pasarle un objeto sin la prop padre
        });

        // console.log("A ver el que se supone que lo frena", worksheet.getCell(`${columnToLetter(ubiPadre)}${2}`).value);
        if (worksheet.getCell(`${columnToLetter(ubiPadre)}${2}`).value && worksheet.getCell(`${columnToLetter(ubiPadre)}${2}`).value != "-") {
            // console.log("Llego?");
            cosas(arrayPadres, col - 10, worksheet)
        } else {
            // console.log("Array retornado: ", arrayPadres);
            return json.options.push(arrayPadres[0])
        }


    }









    return json
}

async function handleFileUpload(event) {
    const file = event.target.files[0];

    if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const json = await generateJson(arrayBuffer);

        // Aquí descargamos el JSON convertido
        // const jsonString = JSON.stringify(json, null, 2);
        // const blob = new Blob([jsonString], { type: 'application/json' });
        // const link = document.createElement('a');
        // link.href = URL.createObjectURL(blob);
        // link.download = 'data.json';
        // link.click();

        return json
    }
}



module.exports = {
    handleFileUpload
};