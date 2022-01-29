/**
 * @param {String} currentDate Timestamp recibido como prop
 * @param {Number} formatType Tipo de formato de fecha 0: HH:mm:ss:DD:MM:YYYY
 * @description Establece un formato a un fecha dependiendo del tipo de formato
 */
const useFormatDate = (currentDate, formatType) => {
    // Validaciones
    if (currentDate.length <= 0) return { error: true, msg: "No hay fecha"}
    if (typeof formatType !== "number") return { error: true, msg: "El tipo de formato es incorrecto"}
    if (formatType === undefined) return { error: true, msg: "No se ha especificado el tipo de fecha" }

    switch (formatType) {
        case 0:
            let formattedDate = currentDate.split("T")
            let time = formattedDate[1]
            time = time.split(".")[0]
            let date = formattedDate[0]
            date = date.split("-")
            date = date.reverse()
            date = date.join(":")
            formattedDate = `${time}:${date}`
            return formattedDate
        case 1 :
            let formattedDate = currentDate.split("T")
            let date = formattedDate[0]
            date = date.split("-")
            date = date.reverse()
            date = date.join("/")
            break
        default:
            return { error: true, msg: "El tipo de formato es incorrecto"}
    }
}

export default useFormatDate