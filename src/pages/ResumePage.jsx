import React, { useState, useEffect } from "react";
import { Container, Form, ListGroup, Col, Row, Button } from "react-bootstrap";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../util/authContext";

const ResumePage = () => {
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeList, setResumeList] = useState([]);
  const currentUser = useAuth();
  const userId = currentUser.user.uid;

  // 이력서 목록 불러오기
  const fetchResumes = async () => {
    if (currentUser.isLoggedIn) {
      const q = query(
        collection(db, `users/${userId}/resume`),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Firestore에서 Timestamp 객체를 읽어와서 날짜 문자열로 변환
        timestamp: doc
          .data()
          .timestamp?.toDate()
          .toLocaleString()
          .split(",")[0],
      }));
      if (list.length == 0) {
        setResumeUrl("");
      }
      setResumeList(list);
      await fetchResumes();
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileUrl = e.target.result;
        // Firestore에 파일 정보 저장
        await addDoc(collection(db, `users/${userId}/resume`), {
          url: fileUrl,
          timestamp: new Date(),
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, `users/${userId}/resume`, id));
    await fetchResumes();
  };

  const handleResumeClick = (url) => {
    setResumeUrl(url); // 선택된 이력서 URL로 설정
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Resume</h1>
        </Col>
        <Form>
          <Form.Group className="mb-3 col-sm-3">
            <Form.Label>Upload Resume</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Form>
        <Col>
          <ListGroup>
            {resumeList.map((resume) => (
              <ListGroup.Item
                key={resume.id}
                onClick={() => handleResumeClick(resume.url)}
                className="resume-item d-flex justify-content-between align-items-center"
                style={
                  resume.url === resumeUrl
                    ? { backgroundColor: "lightgray" }
                    : {}
                }
              >
                <div className="">{resume.name}</div>
                <div>{resume.timestamp}</div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // 클릭 이벤트 버블링 방지
                    handleDelete(resume.id);
                  }}
                  className=""
                >
                  Delete
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col>
          {resumeUrl && (
            <iframe
              src={resumeUrl}
              style={{ width: "100%", height: "500px" }}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ResumePage;
