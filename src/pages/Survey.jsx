import axios from "axios";
import React, { useState } from "react";
import { Row, Col, Button, Form, Modal, FloatingLabel } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import emptyProfileImg from "../assets/person-circle.svg";
import Forbidden from "./Forbidden";
import { Helmet } from "react-helmet";

const liff = window.liff;

const Survey = () => {
  const [showModalTimeExpired, setShowModalTimeExpired] = useState(false);
  const [showModalUpdateSurveysuccess, setShowModalUpdateSurveysuccess] = useState(false);
  const [showModalUpdateSurveyFail, setShowModalUpdateSurveyFail] = useState(false);

  const handleCloseShowModalTimeExpired = () => liff.closeWindow();
  const handleCloseShowModalUpdateSurveysuccess = async () => {
    const msg = [{ type: "text", text: "ส่งความคิดเห็นเรียบร้อยแล้ว " }];
    await liff.sendMessages(msg);
    await liff.closeWindow();
  };
  const handleCloseShowModalUpdateSurveyFail = () => setShowModalUpdateSurveyFail(false);

  const handleShowModalTimeExpired = () => setShowModalTimeExpired(true);
  const handleShowModalUpdateSurveysuccess = () => setShowModalUpdateSurveysuccess(true);
  const handleShowModalUpdateSurveyFail = () => setShowModalUpdateSurveyFail(true);

  const date = new Date();
  const currentTimestamp = date.getTime();

  const [searchParams] = useSearchParams();

  const insertId = searchParams.get("insertid");
  const expireTimestamp = searchParams.get("expiretime");

  if (liff.isInClient()) {
    liff.init({ liffId: import.meta.env.VITE_LIFF_ID_SURVEY }).then(() => {
      if (currentTimestamp < expireTimestamp) {
        if (liff.isLoggedIn()) {
          try {
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
      } else {
        handleShowModalTimeExpired();
      }
    });
  } else {
    alert("กรุณาเข้าใช้งานใน Line Application บนโทรศัพท์");
    return <Forbidden to="/Forbidden" />;
  }

  const getUserProfile = () => {
    liff
      .getProfile()
      .then((profile) => {
        const profileName = profile.displayName;
        const profileImage = profile.pictureUrl;

        document.getElementById("geeting").innerHTML = profileName;
        if (profileName === undefined) {
          document
            .querySelector(".user-profile-image")
            .setAttribute("src", emptyProfileImg);
        } else {
          document
            .querySelector(".user-profile-image")
            .setAttribute("src", profileImage);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    let dataFromUser = JSON.stringify({
      comment: formData.get("comment"),
      insertId: insertId,
    });

    makeRequest(dataFromUser);
  };

  const makeRequest = (dataFromUser) => {
    const config = {
      method: "POST",
      url: `${import.meta.env.VITE_BE_URL}/api/v1/form`,
      headers: {
        Authorization: `Basic ${import.meta.env.VITE_BASIC_AUTH}`,
        "Content-Type": "application/json",
      },
      data: dataFromUser,
    };

    axios(config)
      .then((res) => {
        if (res.status === 200) {

          handleShowModalUpdateSurveysuccess();

        } else {
          
          handleShowModalUpdateSurveyFail();

        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>แบบสอบถามความพึงพอใจ</title>
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
          <div className="title-form">
            <p className="fs-1">แบบสอบถามความพึงพอใจ</p>
            <p className="fs-3">การชำระค่างวดผ่านไลน์</p>
            <br />
            <p className="fs-6">
              เรายินดีรับฟังความคิดเห็นหรือคำติชมเพื่อช่วยในการปรับปรุงประสบการณ์ใช้งานของคุณให้ดียิ่งขึ้น
            </p>
          </div>
          <Form onSubmit={handleSubmit}>
            <FloatingLabel controlId="floatingTextarea2" label="ข้อเสนอแนะ">
              <Form.Control
                as="textarea"
                placeholder="ข้อเสนอแนะ"
                style={{ height: "100px" }}
                name="comment"
                maxLength={255}
              />
            </FloatingLabel>

            <Form.Group as={Row} className="mb-3">
              <Col sm={{ span: 10, offset: 2 }}>
                <Button type="submit">ส่ง</Button>
              </Col>
            </Form.Group>
          </Form>
        </div>
      </div>

      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      <Modal
        show={showModalTimeExpired}
        onHide={handleCloseShowModalTimeExpired}
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
                  className="bi bi-clock"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                </svg>
              </div>
            </div>
            <div className="col-9">
              <Modal.Title className="col-9-title">เกิดข้อผิดพลาด</Modal.Title>
              <div className="col-9-p">หมดเวลาทำแบบสอบถามแล้วค่ะ</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseShowModalTimeExpired}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      <Modal
        show={showModalUpdateSurveysuccess}
        onHide={handleCloseShowModalUpdateSurveysuccess}
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
                  className="bi bi-file-earmark-check"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
                  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                </svg>
              </div>
            </div>
            <div className="col-9">
              <Modal.Title className="col-9-title">สำเร็จ</Modal.Title>
              <div className="col-9-p">บันทึกคำตอบของคุณเรียบร้อย</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleCloseShowModalUpdateSurveysuccess}
          >
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      <Modal
        show={showModalUpdateSurveyFail}
        onHide={handleCloseShowModalUpdateSurveyFail}
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
                  className="bi bi-file-earmark-x"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146z" />
                  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                </svg>
              </div>
            </div>
            <div className="col-9">
              <Modal.Title className="col-9-title">เกิดข้อผิดพลาด</Modal.Title>
              <div className="col-9-p">
                บันทึกข้อมูลไม่สำเร็จ โปรดลองอีกครั้งภายหลัง
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleCloseShowModalUpdateSurveyFail}
          >
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Survey;
