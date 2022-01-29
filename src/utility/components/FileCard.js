import { FileText, Download } from 'react-feather'
import { Row, Col } from 'reactstrap/lib'


const FileCard = ({fileName, fileSize, hasTitle = true}) => {
    return (
        <div className="border rounded p-1 m-1 file-card">
            <Row>
                <Col>
                    {hasTitle ? <Row>
                        <Col>
                            <h5>Nombre de Archivo Cargado:</h5>
                        </Col>
                    </Row> : <div></div>}
                    <Row>
                        <div className='mx-1'>
                            <FileText className='text-focus' strokeWidth="2.2" size={40}/>
                        </div>
                        <div>
                            <div>
                                <span>{fileName ? fileName : "N/A"}</span>
                            </div>
                            <div>
                                <span>{fileSize ? fileSize : "N/A"}</span>
                            </div>
                        </div>
                    </Row>
                </Col>
                <Col xs="1" className="text-center align-self-center">
                    <Download className='text-focus' size={40}/>
                </Col>
            </Row>
        </div>
    )
}

export default FileCard