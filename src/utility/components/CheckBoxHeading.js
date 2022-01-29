import { useState } from "react"
import { Col, CustomInput } from "reactstrap"
import { useSelector } from "react-redux"

const CheckBoxHeading = ({headName, idColumn, idChilds}) => {
    const store = useSelector(state => state.profileDetail)
    const [checkValue, setCheckValue] = useState(true)
    const initialDisabledValue = !store.params.edit
    const [isDisabled, setIsDisabled] = useState(initialDisabledValue)

    const handleCheckbox = () => {
        let checkboxList = []
        const changeValue = new Promise((resolve, reject) => {
            setCheckValue(!checkValue)
            checkboxList = document.querySelectorAll(`[id^="${idChilds}"]`)
            resolve(checkboxList)
        })
        changeValue.then(res => {
            res.forEach((value, key) => {
                if (value.checked === checkValue) {
                    value.click()
                }
            })
        })
    }
    return (
        <Col className="d-flex flex-col align-items-center">
            <CustomInput
                type='checkbox' 
                id={`check${idColumn}`}
                className='custom-control-Primary' 
                checked={checkValue}
                onChange={handleCheckbox}
                disabled={isDisabled}
            />
            <span>{headName}</span>
        </Col>
    )
}

export default CheckBoxHeading