const useCurrentDate = ({delimiter}) => {
    if (!delimiter) delimiter = ":"
    const today = new Date()
    const currentTime = `${today.getHours()}${delimiter}${today.getMinutes()}${delimiter}${today.getSeconds()}`
    const currentDate = `${today.getFullYear()}${delimiter}${(today.getMonth() + 1)}${delimiter}${today.getDate()}`
    return [currentDate, currentTime]
}

export default useCurrentDate