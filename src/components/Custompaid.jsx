import { useState } from 'react'
import { Button, Col, InputGroup, Modal, Row, Form } from "react-bootstrap"
import { useSearchParams } from 'react-router-dom'
import emptyProfileImg from "../assets/person-circle.svg";
import Forbidden from './Forbidden';
import { Helmet } from "react-helmet"

const liff = window.liff

const Custompaid = () => {

    const [showModalInputIncorrect, setShowModalInputIncorrect] = useState(false)
    const [showModalInputIsNull, setShowModalInputIsNull] = useState(false)
    const [showModalIncorrectSyntax, setShowModalIncorrectSyntax] = useState(false)
    const [showModalInputConfirm, setShowModalInputConfirm] = useState(false)

    const handleCloseShowModalInputIncorrect = () => setShowModalInputIncorrect(false)
    const handleCloseShowModalInputIsNull = () => setShowModalInputIsNull(false)
    const handleCloseShowModalIncorrectSyntax = () => setShowModalIncorrectSyntax(false)
    const handleCloseShowModalInputConfirm = () => setShowModalInputConfirm(false)

    const handleShowModalInputIncorrect = () => setShowModalInputIncorrect(true)
    const handleShowModalInputIsNull = () => setShowModalInputIsNull(true)
    const handleShowModalIncorrectSyntax = () => setShowModalIncorrectSyntax(true)
    const handleShowModalInputConfirm = () => setShowModalInputConfirm(true)

    const [searchParams] = useSearchParams()
    const [loading, setLoading] = useState()

    const contractNo = searchParams.get("contractno")
    const customerCode = searchParams.get("customerno")
    const amountFromLoan = searchParams.get("amount")
    const userIdLine = searchParams.get("useridline")
    const customerName = searchParams.get("customername")

    const decodeCustomerName = decodeURIComponent(customerName)

    if (liff.isInClient()) {
        liff.init({ liffId: import.meta.env.VITE_LIFF_ID_2 }).then(() => {
          if (liff.isLoggedIn()) {
            getUserProfile()
          } else {
            liff.login()
          }
        })
    } else {
      alert("กรุณาเข้าใช้งานใน Line Application บนโทรศัพท์")
      return <Forbidden to="/Forbidden"/>
    }

    const getUserProfile = () => {
      liff
        .getProfile()
        .then((profile) => {
          const profileName = profile.displayName;
          const profilePicture = profile.pictureUrl;
  
          document.getElementById("geeting").innerHTML = profileName;
          if (profilePicture === undefined) {
            document
              .querySelector(".user-profile-image")
              .setAttribute("src", emptyProfileImg);
          } else {
            document
              .querySelector(".user-profile-image")
              .setAttribute("src", profilePicture);
          }
        })
        .catch((err) => console.error(err));
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const regex = /[,\s]/g
        const regexInput = /^\d+(\.\d{1,2})?$/

        let amountFromUser = formData.get("amount")

        let amountFormatNum = parseFloat(amountFromUser)
        const amountFromLoanWithoutComma = amountFromLoan.replace(regex, '')
        let amountFromLoanNum = parseFloat(amountFromLoanWithoutComma)

        if (amountFormatNum < 20 || amountFormatNum > amountFromLoanNum) {
            handleShowModalInputIncorrect()
            console.log("error");
        } else if (isNaN(amountFormatNum)) {
            handleShowModalInputIsNull
            console.log("incorrect");
        } else if (regexInput.test(amountFormatNum) == false) {
            handleShowModalIncorrectSyntax()
            console.log("incorrectsyntax");
        } else {
            console.log("gen")

            let amountFormat = new Intl.NumberFormat('th-Th', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(amountFormatNum)
            const message = [{ type: "text", text: `ชำระระบุจำนวน > ${contractNo} > ${amountFormat}` }]
            
            liff.sendMessages(message)
            .then(() => { 
                console.log('Message has been sent') 
                liff.closeWindow()
            })
            .catch((e) => {
                console.log(e)
                liff.closeWindow()
            })
        }
    }

    return (

        <>
        <Helmet>
        <meta charSet="utf-8" />
        <title>ชำระระบุจำนวน</title>
      </Helmet>
            <div className="body">
        <div className="container">
          <div className="header-form">
            <div>
              <img
                className="logo"
                src="/sabuy-logo-with-text.png"
                alt="sabuyleasing-logo"
              />
            </div>
            <div>
              สวัสดี, <span id="geeting">...</span>
              <img
                className="user-profile-image"
                src={emptyProfileImg}
                alt="profile-image"
              />
            </div>
          </div>
          <h1 className="title-form">ชำระระบุจำนวน</h1>
          <h6 className="text-form">
            สัญญาเลขที่ <span className='contractno-inline'>{contractNo}</span>
          </h6>
          <h6 className="text-form">
            ชื่อ <span className='customername-inline'>{customerName}</span>
          </h6>
          <h6 className="text-form">
            ค่างวดเต็มงวด <span className='amount-inline'>{amountFromLoan}</span> บาท
          </h6>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Col} md="4" className="custom-input">
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className='custom-icon' viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/>
                    <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z"/>
                    <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z"/>
                    <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z"/>
                    </svg>
                </InputGroup.Text>
                <Form.Control
                  required
                  inputMode="decimal"
                  pattern="^\d*\.?\d*$"
                  minLength={2}
                  min={20}
                  name="amount"
                  placeholder="ระบุจำนวนเงินที่ต้องการชำระ"
                />
              </InputGroup>
            </Form.Group>
            <p className="text-muted">*ชำระขั้นต่ำ 20 บาท</p>
            <Form.Group as={Row} className="mb-3">
              <Col sm={{ span: 10, offset: 2 }}>
                <Button variant="primary" type="submit">
                  ชำระ
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </div>
      </div>
      {/* ---------------------------------------------------------------------------------------- */}

    <Modal
      show={showModalInputIsNull}
      onHide={handleCloseShowModalInputIsNull}
      centered
    >
      <Modal.Body>
        <div className="row-error">
          <div className="col-3-error">
            <div className="img-in-col-3-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-file-earmark-x" viewBox="0 0 16 16">
              <path d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146z"/>
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
            </svg>
            </div>
          </div>
          <div className="col-9">
            <Modal.Title className="col-9-title">ผิดพลาด</Modal.Title>
            <div className="col-9-p">กรุณากรอกข้อมูลให้ถูกต้อง</div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleCloseShowModalInputIsNull}
        >
          ปิด
        </Button>
      </Modal.Footer>
    </Modal>

  {/* ---------------------------------------------------------------------------------------- */}

  <Modal
    show={showModalInputIncorrect}
    onHide={handleCloseShowModalInputIncorrect}
    centered
  >
    <Modal.Body>
      <div className="row-error">
        <div className="col-3-error">
          <div className="img-in-col-3-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
          </div>
        </div>
        <div className="col-9">
          <Modal.Title className="col-9-title">ผิดพลาด</Modal.Title>
          <div className="col-9-p">จำนวนเงินต้องไม่น้อยกว่า 20 บาท และ ไม่มากกว่า {amountFromLoan} บาท</div>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="primary"
        onClick={handleCloseShowModalInputIncorrect}
      >
        ปิด
      </Button>
    </Modal.Footer>
  </Modal>

  {/* ---------------------------------------------------------------------------------------- */}

  <Modal
    show={showModalIncorrectSyntax}
    onHide={handleShowModalIncorrectSyntax}
    centered
  >
    <Modal.Body>
      <div className="row-error">
        <div className="col-3-error">
          <div className="img-in-col-3-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
          </div>
        </div>
        <div className="col-9">
          <Modal.Title className="col-9-title">ผิดพลาด</Modal.Title>
          <div className="col-9-p">กรุณากรอกทศนิยมไม่เกิน 2 ตำแหน่ง</div>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="primary"
        onClick={handleCloseShowModalIncorrectSyntax}
      >
        ปิด
      </Button>
    </Modal.Footer>
  </Modal>

  {/* ---------------------------------------------------------------------------------------- */}

  <Modal
      show={showModalInputConfirm}
      onHide={handleCloseShowModalInputConfirm}
      centered
    >
      <Modal.Body>
        <div className="row-error">
          <div className="col-3-error">
            <div className="img-in-col-3-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
            </svg>
            </div>
          </div>
          <div className="col-9">
            <Modal.Title className="col-9-title">ยืนยัน</Modal.Title>
            <div className="col-9-p">ต้องการชำระค่างวดจำนวน  บาท ใช่ไหม?</div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleCloseShowModalInputConfirm}
        >
          แก้ไข
        </Button>
        <Button
          variant="primary"
          onClick={handleCloseShowModalInputConfirm}
        >
          ยืนยัน
        </Button>
      </Modal.Footer>
    </Modal>

  {/* ---------------------------------------------------------------------------------------- */}
        </>
    )

}

export default Custompaid