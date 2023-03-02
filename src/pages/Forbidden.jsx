import React from "react";
import { Helmet } from "react-helmet";

const Forbidden = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>ปฏิเสธการเข้าถึงหน้าเว็บไซท์</title>
      </Helmet>
      <div className="body">
        <div className="container">
        <div>
              <img
                className="logo"
                src="/sabuy-logo-with-text.png"
                alt="sabuyleasing-logo"
              />
            </div>
          <div className="forbidden-logo">
            <svg
              svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="currentColor"
              className="bi bi-lock"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
            </svg>
          </div>
          <h1>Access to this page is denied!</h1>
          <p>
            Because you open in external browser. Please open this app in Line
            application.
          </p>
          <div className="forbidden-logo">
            <svg
              svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="currentColor"
              className="bi bi-lock"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
            </svg>
          </div>
          <h1>ปฏิเสธการเข้าถึงหน้าเว็บไซท์</h1>
          <p>
            ดูเหมือนว่าคุณจะเปิดด้วยเบราเซอร์ภายนอก, กรุณาเปิดด้วยไลน์
            แอพลิเคชั่น
          </p>
        </div>
      </div>
    </>
  );
};

export default Forbidden;
