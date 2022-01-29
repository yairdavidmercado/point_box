import { useState, useEffect, useRef, useLayoutEffect} from 'react'
import { Row, Card, CardHeader, CardTitle, Col, Label, Input, Spinner, Button } from 'reactstrap/lib'
import {columns} from './data'
import EmptyState from '@src/assets/images/logo/EMPTY STATE-UPS.svg'

import { getNewMovements } from '../store/actions'
import { useSelector, useDispatch } from 'react-redux'

import { ChevronDown, X } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'

import  Swal  from 'sweetalert2'
import  withReactContent  from 'sweetalert2-react-content'

/**
 * 
 * @param {function} setPerPage Establece las filas por pagina
 * @param {function} getTableData Establece los datos de la tabla
 * @param {Object} columns Estructura de las columnas de la tabla
 */
export const TableSection = ({setPerPage, actions, fileName, currentManager, store}) => {

    // ** Store Vars
    const dispatch = useDispatch()

    // My sweet alert
    const MySwal = withReactContent(Swal)

    const [searchValue, setSearchValue] = useState('')
    const [spinner, setSpinner] = useState(true)
    const [totalRows, setTotalRows] = useState('')
    const [showingFrom, setShowingFrom] = useState(0)
    const [showingTo, setShowingTo] = useState(0)
    const [showingOf, setShowingOf] = useState(0)
    const [refreshTable, setRefreshTable] = useState(0)
    const [dataTableStyles, setDataTableStyles] = useState("react-dataTable my-1 min-vh-10")
    const [canCreate, setCanCreate] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const inputBuscar = useRef(null)

    useEffect(() => {
        if (currentManager) {
            if (currentManager.create === 0) {
                setCanCreate(true)
            }
        }
        if (store.allData.length > 0) {
            setSpinner(false)
            setShowingFrom((((currentPage - 1) * rowsPerPage) + 1))
            setShowingTo((((currentPage - 1) * rowsPerPage) + 1) + rowsPerPage)
            setShowingOf(store.allData.length)
            setDataTableStyles("react-dataTable my-1 border min-vh-10")
        } else {
            setSpinner(false)
            setDataTableStyles("react-dataTable my-1 border min-vh-10")
        }
    
        return () => {
        
        }   
    }, [dispatch])

    useEffect(() => {
        setCurrentPage(store.params.page)
        setShowingFrom((((currentPage - 1) * rowsPerPage) + 1))
        setShowingTo(store.allData.length <= 10 ? store.allData.length : rowsPerPage)
        setShowingOf(store.total)
    
        return () => {
        
        }
    }, [store])

    // ** Table data to render
    const dataToRender = () => {
        const filters = {
            q: searchValue
        }
        const isFiltered = Object.keys(filters).some(function (k) {
            return filters[k].length > 0
        })

        if (store?.data?.length > 0) {
            return store.data
        } else if (store?.data?.length === 0 && isFiltered) {
            return []
        } else {
            return store?.allData?.slice(0, rowsPerPage)
        }
    }

    /**
     * 
     * @param {Event} e Evento obtenido del filtro
     * @param {Number} filterType Tipo de filtro 0: input-text 1: select
     */
    const handleFilter = (e, selectOptions) => {
        const INPUT_TYPE = e.value ? 1 : 0
        const FILTER_VALUE = INPUT_TYPE === 1 ? e.label : e.target ? e.target.value : e.label
        // ** Back to page 1
        setCurrentPage(1)
        const filterData = new Promise((resolve, reject) => {
            const data = actions.getData({ 
                page: 1,
                filterType: selectOptions ? selectOptions.name : undefined,
                q: FILTER_VALUE,
                data: store.allData
            })
            dispatch(data)
            resolve(data)
        })
        filterData.then((res) => {
            setSearchValue(FILTER_VALUE)
            if (res.allData.length > 0) {
                if (INPUT_TYPE === 0) {
                    setShowingFrom(1)
                    if (rowsPerPage > res.data.length) setShowingTo(res.data.length)
                    else setShowingTo(rowsPerPage)
                    setShowingOf(res.total)
                    if (FILTER_VALUE.trim().length > 0) {
                        setTotalRows(`(filtrado de ${res.data.length} registros)`)
                    } else {
                        setTotalRows('')
                    }
                } else if (INPUT_TYPE === 1) {
                    if (selectPerfil.current.props.name === selectOptions.name) {
                        selectCreacionUsuario.current.state.value = {value: 9999, label:"Seleccionar"}
                    } else if (selectCreacionUsuario.current.props.name === selectOptions.name) {
                        selectPerfil.current.state.value = {value: 9999, label:"Seleccionar"}
                    }
                    setShowingFrom(1)
                    if (rowsPerPage > res.data.length) {
                        setShowingTo(res.data.length)
                    } else {
                        setShowingTo(rowsPerPage)
                    }
                    setShowingOf(res.total)
                    if (FILTER_VALUE === "SELECCIONAR") {
                        setTotalRows(`(filtrado de ${res.allData.length} registros)`)
                    } else {
                        setTotalRows('')
                    }
                }
            } else {
                setShowingFrom(0)
                setShowingTo(0)
                setShowingOf(0)
            } 
        })
    }

    // ** Function to handle Pagination and get data
    const handlePagination = page => {
        const curPage = page.selected + 1
        const TABLE_BODY_CHILDS = document.querySelector(".rdt_TableBody").childNodes
        const getNewData = new Promise((resolve, reject) => {
            const data = actions.getData({
                page: curPage,
                q: searchValue,
                data: store.allData
            })
            dispatch(data)
            resolve(data)
        })
        getNewData.then((res) => {
            setCurrentPage(curPage)
            setShowingFrom(((curPage - 1) * rowsPerPage) + 1)
            setShowingTo(((curPage - 1) * rowsPerPage) + TABLE_BODY_CHILDS.length)
        })
    }

    // ** Custom Pagination
    const CustomPagination = () => {
        const count = Number((store.total / rowsPerPage))
        return (
            <Row className='mx-0'>

                <Col className='d-flex justify-content-start mt-2' sm='6'>
                    <p>Mostrando {showingFrom} a {showingTo} de {showingOf} registros {totalRows}</p>
                </Col>

                <Col className='d-flex justify-content-end' sm='6'>
                    <ReactPaginate
                        previousLabel={''}
                        nextLabel={''}
                        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                        onPageChange={page => handlePagination(page)}
                        pageCount={count || 1}
                        breakLabel={'...'}
                        pageRangeDisplayed={2}
                        marginPagesDisplayed={2}
                        activeClassName={'active'}
                        pageClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        nextClassName={'page-item next'}
                        previousClassName={'page-item prev'}
                        previousLinkClassName={'page-link'}
                        pageLinkClassName={'page-link'}
                        breakClassName='page-item'
                        breakLinkClassName='page-link'
                        containerClassName={'pagination react-paginate pagination-sm justify-content-end pr-1 mt-1'}
                    />
                </Col>
            </Row>
        )
    }

    // ** Function to handle per page
    const handlePerPage = e => {
        // ** Back to page 1
        setCurrentPage(1)
        const getNewData = new Promise((resolve, reject) => {
            const data = setPerPage({
                perPage: parseInt(e.target.value)
            })
            dispatch(data)
            resolve(data)
        })
        setRowsPerPage(parseInt(e.target.value))
        getNewData.then((res) => {
            if (store.allData.length > 0) {
                if (refreshTable === 0) setRefreshTable(1)
                else setRefreshTable(0)
                setShowingFrom(1)
                if (e.target.value > store.data.length) {
                    setShowingTo(store.total)
                } else {
                    setShowingTo(e.target.value)
                }
            } else {
                setShowingFrom(0)
                setShowingTo(0)
            }
        })
    }

    
    /*// ** Converts table to CSV
    function convertArrayOfObjectsToCSV(array) {
        let result
        const columnDelimiter = ';'
        const lineDelimiter = '\n'
        const [currentDate, currentTime] = useCurrentDate({delimiter: ":"})
        const downloadedDate = `${currentDate}:${currentTime}`
        const formattedArray = array.map(el => {
            const {serial, profile, created_at, user_created, updated_at, user_update} = el
            return {serial, profile, created_at, user_created, updated_at, user_update, downloadedDate}
        })
        const keys = ["NÚMERO", "PERFIL", "FECHA CREACIÓN", "USUARIO CREACIÓN", "FECHA MODIFICACIÓN", "USUARIO MODIFICACIÓN", "FECHA DESCARGA"]
        result = ''
        result += keys.join(columnDelimiter)
        result += lineDelimiter

        formattedArray.forEach(item => {
            let ctr = 0
            Object.keys(item).forEach(key => {
            if (ctr > 0) result += columnDelimiter
                if (key === "created_at" || key === "updated_at") {
                    const dateTime = item[key].split("T")
                    const realTime = dateTime[1].split(".")[0]
                    const timeFormated = `${dateTime[0]}:${realTime}`
                    const finalDate = timeFormated.replace(/-/g, ':')
                    result += finalDate
                } else {
                    result += item[key]
                }
                ctr++
            })
            result += lineDelimiter
        })
        return result
    }

    // ** Downloads CSV
    function downloadCSV(array) {
        MySwal.fire({
            title: <Download color='#19c4e2' size={100}/>,
            html: <span className='h3'>La descarga ha comenzado...</span>,
            customClass: {
            icon: 'border-0'
            },
            timer: 3000,
            buttonsStyling: false,
            confirmButtonText: 'Continuar',
            showDenyButton: false,
            customClass: {
                confirmButton: 'mx-1 btn btn-primary'
            }
        })
        const link = document.createElement('a')
        let csv = convertArrayOfObjectsToCSV(array)
        if (csv === null) return
        const [currentDate, currentTime] = useCurrentDate({delimiter: "_"})
        const filename = `R_PROF${currentTime}_${currentDate}.csv`

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURI(csv)}`
        }

        link.setAttribute('href', csv)
        link.setAttribute('download', filename)
        link.click()
    }*/

    return (
        <Card className="pb-2">
            <CardHeader className='flex-md-row flex-column align-items-center align-items-start border-bottom mx-3 px-0 pb-0'>
                <CardTitle tag='h4' className="my-2">{title}</CardTitle>
                <div className="align-items-start pb-1">
                    { canCreate ? <Button className={`mt-1 mr-1 ${customClasses.btnHeader}`} color='primary' size='sm' onClick={handleModal}>
                        <User size={15} />
                        <span className='align-middle ml-50'>Agregar perfil</span>
                    </Button> : <div></div>}
                    <UncontrolledButtonDropdown onClick={() => fillExportableData(1)} className={`mt-1 ${customClasses.btnHeader}`}>
                        <DropdownToggle color='primary' size='sm' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Exportar</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <PdfExportable data={pdfProfiles} userInfo={userInfo} rowsPerPage={rowsPerPage} totalRows={store.total} fileName={pdfFilename}/>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(exportableData)}>
                                <FileText size={15} />
                                <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <ExcelExportable onClick={() => fillExportableData(0)} data={exportableData} userInfo={userInfo}/>
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
                </div>
            </CardHeader>
            <Row className='mx-3 mt-1 px-0'>
                <Col className='d-flex align-items-center justify-content-start mt-1 mb-1 divHeaderDataTable' xs='6'>
                    <Label for='sort-select' className="mr-1">Ver</Label>
                    <Input
                        className='dataTable-select'
                        type='select'
                        id='sort-select'
                        value={rowsPerPage}
                        onChange={e => handlePerPage(e)}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </Input>
                </Col>
                <Col className='d-flex align-items-center justify-content-end mt-1 mb-1 divHeaderDataTable' xs='6'>
                    <Label className='mr-1' for='search-input'>
                        Buscar
                    </Label>
                    <Input
                        className='dataTable-filter mb-50'
                        type='text'
                        bsSize='sm'
                        id='search-input'
                        ref={inputBuscar}
                        onChange={handleFilter}
                        style={{marginTop: '7px'}}
                    />
                </Col>
            </Row>
            <DataTable
                    key={refreshTable}
                    noHeader
                    pagination
                    paginationComponent={CustomPagination}
                    paginationPerPage={rowsPerPage}
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    className={dataTableStyles}
                    columns={columns}
                    noDataComponent={<img src={EmptyState}/>}
                    progressPending={spinner}
                    paginationDefaultPage={currentPage}
                    progressComponent={<Spinner color="primary" size="md" className="justify-self-center align-self-center"/>}
                    sortIcon={<ChevronDown size={10} />}
                    data={dataToRender()}
                />
            <Row className="px-1 pb-1 w-100">
                <Col xs="1">
                    <Button color="primary">Guardar</Button>
                </Col>
                <Col xs="1">
                    <Button color="outline-primary">Cancelar</Button>
                </Col>
            </Row>
        </Card>
    )
}
