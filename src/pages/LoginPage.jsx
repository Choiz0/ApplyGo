import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Modal,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useAuth } from "../util/authContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import titleImg from "../assets/titleImg.svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const currentuser = useAuth();
  useEffect(() => {
    if (currentuser.isLoggedIn) {
      navigate("/"); // 이미 로그인한 사용자는 홈으로 리다이렉트
    }
  }, [currentuser, navigate]);

  const handleRegister = (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지

    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        // 로컬 스토리지에 사용자 정보 저장
        // 회원가입 성공
        setShowModal(false); // 모달 닫기
        navigate("/"); // 회원가입 성공 후 홈으로 리다이렉트
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        // 에러 처리
        alert(error.message); // 사용자에게 에러 메시지 표시
      });
  };

  const handleLogin = (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        localStorage.setItem("user", JSON.stringify(userCredential.user));
        navigate("/"); // 로그인 성공 후 홈으로 리다이렉트
      })
      .catch((error) => {
        // 로그인 실패
        alert(error.message); // 사용자에게 에러 메시지 표시
      });
  };

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // 로그인 성공
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        navigate("/"); // 로그인 성공 후 홈으로 리다이렉트
      })
      .catch((error) => {
        // 로그인 실패
        alert(error.message); // 사용자에게 에러 메시지 표시
      });
  };

  return (
    <>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", padding: 0 }}
      >
        <Row className="d-flex align-items-center" style={{ width: "100%" }}>
          <Col
            className="mb-4 text-center"
            style={{ marginRight: "20px", textAlign: "center" }}
          >
            <div style={{ marginBottom: "2rem" }}>
              <img
                src={titleImg}
                alt="Title"
                style={{
                  maxWidth: "40%",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                  paddingTop: "2rem",
                }}
              />
            </div>
            <h1>Welcome to ApplyGo</h1>
            <h3>
              You can manage your resume and track your applications across many
              websites.
            </h3>
            <p>Please login or register to continue.</p>
          </Col>
          <Col lg={6} md={12}>
            <Card className="p-4">
              <Card.Body>
                <h3>Login</h3>
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <div
                    className="d-flex justify-content-end align-items-stretch"
                    style={{ gap: "10px" }}
                  >
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100"
                      style={{ height: "55px" }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="info"
                      onClick={() => setShowModal(true)}
                      className="w-100"
                      style={{ height: "55px" }}
                    >
                      Register
                    </Button>
                    <Button
                      className="w-100"
                      onClick={googleLogin}
                      variant="danger"
                      style={{ height: "55px" }}
                    >
                      Google Login
                    </Button>
                  </div>
                </Form>
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <p>test2@test.com / 12345678</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3" controlId="registerEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginPage;
