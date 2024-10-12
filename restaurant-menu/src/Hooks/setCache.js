
export default async function saveToLocalStorage(key, data, expirationMinutes) {
  const now = new Date();
  const expirationDate = new Date(now.getTime() + expirationMinutes * 60000); // Expiración en minutos
  const item = {
    data: data,
    expiration: expirationDate.toISOString() // Convertir a cadena para almacenamiento
  };
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    console.error('Almacenamiento local lleno, limpiando...');
    localStorage.clear();
  }

}



// function getLocalStorageSizeInKB() {
//   let totalSize = 0;

//   for (let key in localStorage) {
//       if (localStorage.hasOwnProperty(key)) {
//           // Sumar la longitud de la clave y valor (UTF-16: 2 bytes por carácter)
//           totalSize += ((key.length + localStorage.getItem(key).length) * 2);
//       }
//   }

//   // Convertir bytes a kilobytes
//   const sizeInKB = totalSize / 1024;
//   return sizeInKB.toFixed(2); // Limitar a dos decimales
// }

// console.log(`El tamaño total de localStorage es aproximadamente ${getLocalStorageSizeInKB()} KB.`);
