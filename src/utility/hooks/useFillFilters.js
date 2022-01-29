/**
 * 
 * @param {Object} requestData Datos
 * @returns 
 */
const useFillFilters = (requestData) => {
    const data = requestData
    const filteredOptions = data.map((row, index) => {
        return { value: row.id, label: row.name }
    })
    
    filteredOptions.sort((a, b) => {
        if (a.label < b.label) return -1
        if (a.label > b.label) return 1
    })
    filteredOptions.unshift({ value: 9999, label: "Seleccionar" })
    return filteredOptions
}

export default useFillFilters