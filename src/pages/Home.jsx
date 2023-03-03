import axios from "axios";
import React, { useState } from "react";
import { Card, Col, InputGroup, Button, Spinner, Form, Modal, } from "react-bootstrap";
import { Helmet } from "react-helmet";
import emptyProfileImg from "../assets/person-circle.svg";
import Forbidden from "./Forbidden";

const liff = window.liff;

const Home = () => {
  const [showModalIdcardNotFound, setShowModalIdcardNotFound] = useState(false); // ไม่พบบัตรประชาชน
  const [showModalEmptyForm, setShowModalEmptyForm] = useState(false); // ฟอร์มว่าง
  const [showModalRegisterSuccess, setShowModalRegisterSuccess] = useState(false); // สมัครสำเร็จ
  const [showModalSystemError, setShowModalSystemError] = useState(false); // ระบบผิดพลาด
  const [showModalDataNotFound, setShowModalDataNotFound] = useState(false); // ไม่พบข้อมูล
  const [showModalDuplicateUser, setShowModalDuplicateUser] = useState(false); // ผู้ใช้ซ้ำ
  const [showModalDuplicateIdcard, setShowModalDuplicateIdcard] = useState(false); // บัตรประชาชนซ้ำ
  const [showModalAlreadyRegister, setShowModalAlreadyRegister] = useState(false); // ลงทะเบียนแล้ว

  const handleCloseShowModalIdcardNotFound = () => setShowModalIdcardNotFound(false);
  const handleCloseShowModalEmptyForm = () => setShowModalEmptyForm(false);
  const handleCloseShowModalRegisterSuccess = async () => {
    const msg = [{ type: "text", text: "ตรวจสอบค่างวด" }];
    await liff.sendMessages(msg);
    await liff.closeWindow();
  };
  const handleCloseShowModalSystemError = () => liff.closeWindow();
  const handleCloseShowModalDataNotFound = () => setShowModalDataNotFound(false);
  const handleCloseShowModalDuplicateUser = () => liff.closeWindow();
  const handleCloseShowModalDuplicateIdcard = () => liff.closeWindow();
  const handleCloseShowModalAlreadyRegister = () => liff.closeWindow();

  const handleShowModalIdcardNotFound = () => setShowModalIdcardNotFound(true);
  const handleShowModalEmptyForm = () => setShowModalEmptyForm(true);
  const handleShowModalRegisterSuccess = () => setShowModalRegisterSuccess(true);
  const handleShowModalSystemError = () => setShowModalSystemError(true);
  const handleShowModalDataNotFound = () => setShowModalDataNotFound(true);
  const handleShowModalDuplicateUser = () => setShowModalDuplicateUser(true);
  const handleShowModalDuplicateIdcard = () => setShowModalDuplicateIdcard(true);
  const handleShowModalAlreadyRegister = () => setShowModalAlreadyRegister(true);

  const [loading, setLoading] = useState(false);

  if (liff.isInClient()) {
    liff.init({ liffId: import.meta.env.VITE_LIFF_ID }).then(() => {
      if (liff.isLoggedIn()) {
        try {
          getUserToken();
          getUserProfile();
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          liff.login();
        } catch (err) {
          console.error(err);
        }
      }
    });
  } else {
    alert("กรุณาเข้าใช้งานใน Line Application บนโทรศัพท์");
    return <Forbidden to="/Forbidden" />;
  }

  const getUserToken = () => {
    const userToken = liff.getIDToken();
    return userToken;
  };

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

  const makeRequest = (dataFromUser) => {
    setLoading(true);

    const config = {
      method: "POST",
      url: `${import.meta.env.VITE_API_URL}/api/v1/ProcessLineApi/VerifyLine`,
      headers: {
        Authorization: `Basic ${import.meta.env.VITE_BASIC_AUTH}`,
        "Content-Type": "application/json",
      },
      data: dataFromUser,
    };

    axios(config)
      .then((res) => {
        const data = res.data;

        if (data.responseCode === "200" && data.responseMesg === "Success") {
          console.log(data);
          //alert('ลงทะเบียนสำเร็จ')
          handleShowModalRegisterSuccess();
        } else if (data.responseCode === "211" && data.responseMesg === "data not found") {
          console.log(data);
          //alert('ไม่พบข้อมูลหรือข้อมูลไม่ถูกต้อง')
          handleShowModalDataNotFound();
        } else if (data.responseCode === "212" && data.responseMesg === "Duplicate IDcardNo") {
          console.log(data);
          //alert('เลขบัตรซ้ำ')
          handleShowModalDuplicateIdcard();
        } else if (data.responseCode === "213" && data.responseMesg === "Duplicate UserID") {
          console.log(data);
          //alert('ใช้ line ซ้ำ')
          handleShowModalDuplicateUser();
        } else if (data.responseCode === "331" && data.responseMesg === "DataError") {
          console.log(data);
          //alert('ไม่พบข้อมูลในระบบ')
          handleShowModalIdcardNotFound();
        } else if (data.responseCode === "" && data.responseMesg === "") {
          console.log(data);
          handleShowModalEmptyForm();
        } else {
          console.log(data);
          //alert('ระบบเกิดข้อผิดพลาด โปรดติดต่อผู้ดูแลระบบ')
          handleShowModalSystemError();
        }
      })
      .catch((err) => {
        console.error(err);
        handleShowModalSystemError();
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    let dataFromUser = JSON.stringify({
      IDCard: formData.get("idCard"),
      TelephoneNumber: formData.get("phoneNum"),
      Token: getUserToken(),
    });

    makeRequest(dataFromUser);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>ลงทะเบียน</title>
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
          <Card.Img
            className="top-img"
            variant="top"
            alt="register-image"
            src="/cover-register.jpg"
          />
          <h1 className="title-form">กรอกข้อมูลเพื่อลงทะเบียน</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Col} md="4" className="idcard-input">
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="idcard-button"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
                  </svg>
                </InputGroup.Text>
                <Form.Control
                  required
                  inputMode="numeric"
                  maxLength={13}
                  minLength={13}
                  name="idCard"
                  placeholder="หมายเลขบัตรประชาชน"
                />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md="4" className="phone-input">
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="phone-button"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                    />
                  </svg>
                </InputGroup.Text>
                <Form.Control
                  required
                  inputMode="numeric"
                  maxLength={10}
                  minLength={10}
                  name="phoneNum"
                  placeholder="หมายเลขโทรศัพท์"
                />
              </InputGroup>
            </Form.Group>
            <Button
              className="btn-primary"
              type="submit"
              disabled={loading}
              hidden={loading}
            >
              ตรวจสอบ
            </Button>
            {loading && (
              <Button className="btn-primary">
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                โปรดรอ...
              </Button>
            )}
          </Form>
          <div className="pdpa-link">
            <a href="https://sabuyleasing.co.th/privacy-policy">
              นโยบายความเป็นส่วนตัว
            </a>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------------- */}

      <Modal
        show={showModalIdcardNotFound}
        onHide={handleCloseShowModalIdcardNotFound}
        centered
      >
        <Modal.Body>
          <div className="row-error">
            <div className="col-3-error">
              <div className="img-in-col-3-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="currentColor"
                  className="bi bi-person-x"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  <path
                    fillRule="evenodd"
                    d="M12.146 5.146a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </div>
            </div>
            <div className="col-9">
              <Modal.Title className="col-9-title">ขออภัย</Modal.Title>
              <div className="col-9-p">ไม่พบเลขบัตรประชาชนนี้ในระบบ</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleCloseShowModalIdcardNotFound}
          >
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------------------------------------------------------------------- */}

      <Modal
        show={showModalEmptyForm}
        onHide={handleCloseShowModalEmptyForm}
        centered
      >
        {/* <Modal.Header closeButton>
                 <Modal.Title>ขออภัย</Modal.Title> 
            </Modal.Header> */}

        <Modal.Body>
          <div className="row-error">
            <div className="col-3-error">
              <div className="img-in-col-3-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="currentColor"
                  className="bi bi-exclamation-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                </svg>
              </div>
            </div>
            <div className="col-9">
              <Modal.Title className="col-9-title">ขออภัย</Modal.Title>
              <div className="col-9-p">กรุณากรอกข้อมูลให้ครบถ้วน</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseShowModalEmptyForm}>
            รับทราบ
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------------------------------------------------------------------- */}

      <Modal
        show={showModalRegisterSuccess}
        onHide={handleCloseShowModalRegisterSuccess}
        centered
      >
        {/* <Modal.Header closeButton>
                 <Modal.Title>ขออภัย</Modal.Title> 
            </Modal.Header> */}

        <Modal.Body>
          <div className="row-success">
            <div className="col-3-success">
              <div className="img-in-col-3-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="currentColor"
                  className="bi bi-check-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                </svg>
              </div>
            </div>
            <div className="col-9">
              <Modal.Title className="col-9-title">สำเร็จ</Modal.Title>
              <div className="col-9-p">ลงทะเบียนเรียบร้อยแล้ว</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleCloseShowModalRegisterSuccess}
          >
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------------------------------------------------------------------------------- */}

      <Modal
        show={showModalSystemError}
        onHide={handleCloseShowModalSystemError}
        centered
      >
        <Modal.Body>
          <div className="row-error">
            <div className="col-3-error">
              <div className="img-in-col-3-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="currentColor"
                  className="bi bi-emoji-frown"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                </svg>
              </div>
            </div>
            <div className="col-9">
              <Modal.Title className="col-9-title">เกิดข้อผิดพลาด</Modal.Title>
              <div className="col-9-p">โปรดติดต่อผู้ดูแลระบบ</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseShowModalSystemError}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------------------------------------------------------------------------------- */}

      <Modal
        show={showModalDataNotFound}
        onHide={handleCloseShowModalDataNotFound}
        centered
      >
        <Modal.Body>
          <div className="row-error">
            <div className="col-3-error">
              <div className="img-in-col-3-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="currentColor"
                  class="bi bi-info-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
              </div>
            </div>
            <div className="col-9">
              <Modal.Title className="col-9-title">เกิดข้อผิดพลาด</Modal.Title>
              <div className="col-9-p">ไม่พบข้อมูลหรือข้อมูลไม่ถูกต้อง</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseShowModalDataNotFound}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------------------------------------------------------------------------------- */}

      <Modal
        show={showModalDuplicateUser}
        onHide={handleCloseShowModalDuplicateUser}
        centered
      >
        <Modal.Body>
          <div className="row-error">
            <div className="col-3-error">
              <div className="img-in-col-3-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="currentColor"
                  className="bi bi-people"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                </svg>
              </div>
            </div>
            <div className="col-9">
              <Modal.Title className="col-9-title">เกิดข้อผิดพลาด</Modal.Title>
              <div className="col-9-p">Line นี้ถูกลงทะเบียนใช้งานแล้ว</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseShowModalDuplicateUser}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------------------------------------------------------------------------------- */}

      <Modal
        show={showModalDuplicateIdcard}
        onHide={handleCloseShowModalDuplicateIdcard}
        centered
      >
        <Modal.Body>
          <div className="row-error">
            <div className="col-3-error">
              <div className="img-in-col-3-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="currentColor"
                  className="bi bi-person-vcard"
                  viewBox="0 0 16 16"
                >
                  <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5ZM9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8Zm1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Z" />
                  <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2ZM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96c.026-.163.04-.33.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1.006 1.006 0 0 1 1 12V4Z" />
                </svg>
              </div>
            </div>
            <div className="col-9">
              <Modal.Title className="col-9-title">เกิดข้อผิดพลาด</Modal.Title>
              <div className="col-9-p">
                เลขบัตรประชาชนนี้ถูกลงทะเบียนแล้ว
                หากท่านต้องการยืนยันความเป็นเจ้าของ โปรดติดต่อผู้ดูแลระบบ
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleCloseShowModalDuplicateIdcard}
          >
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------------------------------------------------------------------------------- */}

      <Modal
        show={showModalAlreadyRegister}
        onHide={handleCloseShowModalAlreadyRegister}
        centered
      >
        <Modal.Body>
          <div className="row-success">
            <div className="col-3-success">
              <div className="img-in-col-3-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="currentColor"
                  className="bi bi-person-fill-check"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z" />
                </svg>
              </div>
            </div>
            <div className="col-9">
              <Modal.Title className="col-9-title">ลงทะเบียนสำเร็จ</Modal.Title>
              <div className="col-9-p">คุณได้ลงทะเบียนกับเราเรียบร้อยแล้ว</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleCloseShowModalAlreadyRegister}
          >
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;
