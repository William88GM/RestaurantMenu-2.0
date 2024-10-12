// const ExcelJS = require('exceljs');
// import * as ExcelJS from "exceljs"

// import { default as dynamic } from 'next/dynamic';

async function generateExcel(data) {
    const ExcelJS = await import('exceljs');
    // const ExcelJS = dynamic(() => import('exceljs'), { ssr: false })

    let json = JSON.stringify(data)
    //Suc cabaña es una copia de suc estadio SOLO para probar el codigo, las ids se repiten
    json = JSON.parse(json);
    // Crear un nuevo libro y una hoja
    const workbook = new ExcelJS.Workbook();


    function generarHoja(workbook, json, suc) {

        const worksheet = workbook.addWorksheet(`${json.options[suc].name}`);

        let col = 1;
        let filasTotales = 1;
        let nivel = 1;

        function columnToLetter(column) {
            let temp, letter = '';
            while (column > 0) {
                temp = (column - 1) % 26;
                letter = String.fromCharCode(temp + 65) + letter;
                column = (column - temp - 1) / 26;
            }
            return letter;
        }


        // Agregar cabeceras
        let cabeceras = [
            "PAG",
            "ID",
            "IMAGEN",
            "PADRE",
            "TITULO",
            "DESCRIPCION",
            "PRECIO",
            "VISIBLE",
            "CANT HIJOS",
            "ID PADRE"
        ];

        function hexToRgb(hex) {
            // Quitar el símbolo # si está presente
            hex = hex.replace(/^#/, '');

            // Convertir hex a RGB
            if (hex.length === 3) {
                hex = hex.split('').map(x => x + x).join('');
            }

            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);

            return { r, g, b };
        }

        function rgbToGray({ r, g, b }) {
            // Calcular el valor gris utilizando la fórmula ponderada
            let gray = Math.round(0.299 * r + 0.587 * g + 0.214 * b);

            // Aplicar un factor de brillo para aclarar el gris
            gray = Math.min(255, Math.round(gray * 1.5)); // Aumenta un 50%

            // Convertir el valor gris a formato hexadecimal
            const grayHex = gray.toString(16).padStart(2, '0');

            return `${grayHex}${grayHex}${grayHex}`;
        }


        function cabecera(col) {
            cabeceras.forEach((e, i) => {
                let cell = worksheet.getCell(`${columnToLetter(col + i)}1`);
                cell.value = e || "-";
                cell.alignment = { horizontal: 'center', vertical: 'center' };
                cell.font = { bold: true };
                if (e == "PAG") {
                    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '171717' } };
                }
                if (e == "ID PADRE") {
                    cell.alignment = { horizontal: 'right', vertical: 'center' };
                }
            });
        }

        let anchos = [
            { width: 8 }, // Ancho para la segunda columna - pag
            { width: 0.2 }, // Ancho para la tercera columna - id
            { width: 0.2 },// Ancho para la sexta columna - imagen
            { width: 0.2 },  // Ancho para la cuarta columna - padre
            { width: 0.2 },   // Ancho para la quinta columna - titulo
            { width: 0.2 },  // Ancho para la septima columna - descripcion
            { width: 0.2 },  // Ancho para la octava columna - precio
            { width: 0.2 },  // Ancho para la novena columna - visible
            { width: 0.2 },  // Ancho para la decima columna - cant hijos
            { width: 0.2 },  // Ancho para la onceava columna - id padre


            { width: 8 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },

            { width: 8 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },


            //Por si tuviese 3 levels mas la app:
            { width: 8 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },


            { width: 8 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },


            { width: 8 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
            { width: 0.2 },
        ];
        // console.log("ANCHOS", anchos);
        function modificarAnchos(lvl, colACambiar, cant) {
            anchos[10 * (lvl - 1) + colACambiar - 1] = { width: cant }
        }




        let contador = [1, 1, 1, 1, 1, 1, 1];
        let posicionColDivisoras = []
        let posicionColPadre = []







        async function cosas(datos, col, nivel, datosPrevios) {
            cabecera(col);
            posicionColDivisoras.push(col)
            posicionColPadre.push(col + 3)

            datos.forEach((e, row) => {
                filasTotales++;

                contador[nivel - 1]++;
                let rowNumber = contador[nivel - 1];

                // console.log("Contador: ", contador);

                //Las columnas 1, 2 y 3 no nos interesa verlas y las vacias tampoco
                if (datosPrevios && datosPrevios.name) {
                    modificarAnchos(nivel, 4, 30)
                }
                if (e.name) {
                    modificarAnchos(nivel, 5, 35)
                }
                if (e.description) {
                    modificarAnchos(nivel, 6, 60)
                }
                if (e.price) {
                    modificarAnchos(nivel, 7, 30)
                }
                if (e.visible == true || e.visible == false) {
                    modificarAnchos(nivel, 8, 15)
                }
                // if (e.options) {//cant hijos
                //     modificarAnchos(nivel, 9, 15)
                // }


                //generar una borde abajo cuando termina la categoria
                if (row == datos.length - 1) {
                    worksheet.getCell(`${columnToLetter(col + 1)}${rowNumber}`).border = {
                        bottom: { style: 'thin', color: { argb: 'FF000000' } }
                    }
                    worksheet.getCell(`${columnToLetter(col + 2)}${rowNumber}`).border = {
                        bottom: { style: 'thin', color: { argb: 'FF000000' } }
                    }
                    worksheet.getCell(`${columnToLetter(col + 3)}${rowNumber}`).border = {
                        bottom: { style: 'thin', color: { argb: 'FF000000' } }
                    }
                    worksheet.getCell(`${columnToLetter(col + 4)}${rowNumber}`).border = {
                        bottom: { style: 'thin', color: { argb: 'FF000000' } }
                    }
                    worksheet.getCell(`${columnToLetter(col + 5)}${rowNumber}`).border = {
                        bottom: { style: 'thin', color: { argb: 'FF000000' } }
                    }
                    worksheet.getCell(`${columnToLetter(col + 6)}${rowNumber}`).border = {
                        bottom: { style: 'thin', color: { argb: 'FF000000' } }
                    }
                    worksheet.getCell(`${columnToLetter(col + 7)}${rowNumber}`).border = {
                        bottom: { style: 'thin', color: { argb: 'FF000000' } }
                    }
                    worksheet.getCell(`${columnToLetter(col + 8)}${rowNumber}`).border = {
                        bottom: { style: 'thin', color: { argb: 'FF000000' } }
                    }
                }



                //PAG (Se genera fuera de esta funcion)

                //ID
                worksheet.getCell(`${columnToLetter(col + 1)}${rowNumber}`).value = e.id || "-";
                worksheet.getCell(`${columnToLetter(col + 1)}${rowNumber}`).alignment = { horizontal: 'left', vertical: 'center' };
                worksheet.getCell(`${columnToLetter(col + 1)}${rowNumber}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: datosPrevios ? datosPrevios.id.slice(0, 6) : "999999" } };

                //IMAGE
                worksheet.getCell(`${columnToLetter(col + 2)}${rowNumber}`).value = e.image || "-";
                worksheet.getCell(`${columnToLetter(col + 2)}${rowNumber}`).alignment = { horizontal: 'center', vertical: 'center' };
                worksheet.getCell(`${columnToLetter(col + 2)}${rowNumber}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: datosPrevios ? datosPrevios.id.slice(0, 6) : "999999" } };

                //PADRE
                worksheet.getCell(`${columnToLetter(col + 3)}${rowNumber}`).value = datosPrevios ? datosPrevios.name : "-";
                worksheet.getCell(`${columnToLetter(col + 3)}${rowNumber}`).alignment = { horizontal: 'left', vertical: 'center' };
                worksheet.getCell(`${columnToLetter(col + 3)}${rowNumber}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: datosPrevios ? datosPrevios.id.slice(0, 6) : "999999" } };
                // worksheet.getCell(`${columnToLetter(col + 2)}${rowNumber}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: datosPrevios ? rgbToGray(hexToRgb(datosPrevios.id.slice(0, 6))) : "999999" } };

                //TITULO
                worksheet.getCell(`${columnToLetter(col + 4)}${rowNumber}`).value = e.name || "-";
                worksheet.getCell(`${columnToLetter(col + 4)}${rowNumber}`).alignment = { horizontal: 'left', vertical: 'center' };
                worksheet.getCell(`${columnToLetter(col + 4)}${rowNumber}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '6ee0b1' } };

                //DESCRIPCION
                worksheet.getCell(`${columnToLetter(col + 5)}${rowNumber}`).value = e.description || "-";
                worksheet.getCell(`${columnToLetter(col + 5)}${rowNumber}`).alignment = { horizontal: 'left', vertical: 'center' };
                worksheet.getCell(`${columnToLetter(col + 5)}${rowNumber}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '6ee0b1' } };

                //PRECIO
                worksheet.getCell(`${columnToLetter(col + 6)}${rowNumber}`).value = e.price || 0;
                worksheet.getCell(`${columnToLetter(col + 6)}${rowNumber}`).alignment = { horizontal: 'center', vertical: 'center' };
                worksheet.getCell(`${columnToLetter(col + 6)}${rowNumber}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '6ee0b1' } };


                //VISIBLE
                worksheet.getCell(`${columnToLetter(col + 7)}${rowNumber}`).value = e.visible;
                worksheet.getCell(`${columnToLetter(col + 7)}${rowNumber}`).alignment = { horizontal: 'center', vertical: 'center' };
                worksheet.getCell(`${columnToLetter(col + 7)}${rowNumber}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '6ee0b1' } }



                //CANT HIJOS
                worksheet.getCell(`${columnToLetter(col + 8)}${rowNumber}`).value = e.options ? `${e.options.length}` : "-";
                worksheet.getCell(`${columnToLetter(col + 8)}${rowNumber}`).alignment = { horizontal: 'center', vertical: 'center' };
                worksheet.getCell(`${columnToLetter(col + 8)}${rowNumber}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: datosPrevios ? datosPrevios.id.slice(0, 6) : "999999" } }


                //ID PADRE
                worksheet.getCell(`${columnToLetter(col + 9)}${rowNumber}`).value = datosPrevios ? datosPrevios.id : "-";
                worksheet.getCell(`${columnToLetter(col + 9)}${rowNumber}`).alignment = { horizontal: 'right', vertical: 'center' };
                worksheet.getCell(`${columnToLetter(col + 9)}${rowNumber}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: datosPrevios ? datosPrevios.id.slice(0, 6) : "999999" } }






                // console.log(contador);

                if (e.options && Array.isArray(e.options)) {
                    cosas(e.options, col + 10, nivel + 1, e);
                }
            });
        }

        // Ejecutar función para procesar los datos
        // cosas(json.options[suc].options, col, nivel);
        let sucursalData = [{
            name: json.options[suc].name,
            id: json.options[suc].id,
            image: json.options[suc].image,
            options: json.options[suc].options,
            visible: json.options[suc].visible
        }]

        // console.log("DATA DE LA SUCURSAL A PROCESAR: ", sucursalData);
        cosas(sucursalData, col, nivel, null);



        //Pintar los divisores
        let pagNum = 1;
        for (let i = 0; i < 4; i++) { //columnas
            const e = posicionColDivisoras[i];
            // console.log("PosicionesColDivisoras: ", posicionColDivisoras);
            // console.log(`Asignando pagNum: ${pagNum} a la columna: ${columnToLetter(e)} fila 2`);

            worksheet.getCell(`${columnToLetter(e)}${2}`).value = pagNum;
            worksheet.getCell(`${columnToLetter(e)}${2}`).alignment = { horizontal: 'center', vertical: 'center' };

            pagNum++;

            for (let index = 0; index < contador[3]; index++) { //filas
                worksheet.getCell(`${columnToLetter(e)}${index}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '171717' } };
                worksheet.getCell(`${columnToLetter(e)}${index}`).font = { bold: true, color: { argb: 'FFFFFF' } };
            }
        }


        // Pintar borde derecho 
        let padreNum = 1
        for (let i = 0; i < 4; i++) {
            const e = posicionColPadre[i];

            padreNum++;

            for (let index = 1; index < contador[4]; index++) {
                if (columnToLetter(e) && index) {

                    worksheet.getCell(`${columnToLetter(e)}${index}`).border = {
                        right: { style: 'thin', color: { argb: 'FF000000' } }
                    }
                }
            }
        }


        // console.log("ANCHOS", anchos);
        // Configurar anchos de columnas
        worksheet.columns = [
            ...anchos
        ];

        worksheet.views = [
            { state: 'frozen', ySplit: 1 }  // ySplit: 1 significa congelar la primera fila
        ];

    }

    json.options.forEach((e, i) => {

        generarHoja(workbook, json, i)
    })


    // Guardar el archivo
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.xlsx';
        link.click();
    }).catch((error) => {
        console.error('Error al generar el archivo Excel:', error);
    });
}

export default {
    generateExcel
};