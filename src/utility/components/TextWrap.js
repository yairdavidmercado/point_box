import { useState } from "react"

const TextWrap = ({textContent, className}) => {
    const [isTextWrapped, setIsTextWrapped] = useState(true)
        const handleOverflow = (e) => {
        if (isTextWrapped) {
            e.target.style.whiteSpace = "normal"
            setIsTextWrapped(false)
        } else {
            e.target.style.whiteSpace = "nowrap"
            setIsTextWrapped(true)
        }
        }
        return (
        <div className={className} style={{textOverflow: "ellipsis", overflow:"hidden", whiteSpace:"nowrap", cursor:"pointer"}} onClick={handleOverflow}>{textContent}</div>
        )
}

export default TextWrap