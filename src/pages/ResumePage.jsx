import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  ListGroup,
  Col,
  Row,
  Button,
  Spinner,
} from "react-bootstrap";
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
import { useQuery } from "react-query";

const fetchResumes = async (userId) => {
  const q = query(
    collection(db, `users/${userId}/resume`),
    orderBy("timestamp", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate().toLocaleString().split(",")[0],
  }));
};

const ResumePage = () => {
  const [resumeUrl, setResumeUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const currentUser = useAuth();
  const userId = currentUser.user.uid;

  const {
    data: resumeList,
    isLoading,
    error,
    refetch,
  } = useQuery(["resumes", userId], () => fetchResumes(userId), {
    enabled: !!userId,
  });

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileUrl = e.target.result;
        await addDoc(collection(db, `users/${userId}/resume`), {
          url: fileUrl,
          timestamp: new Date(),
          name: file.name,
        });
        setPreviewUrl(fileUrl);
        refetch(); // 새로운 이력서 추가 후 목록 새로고침
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, `users/${userId}/resume`, id));
    refetch();
  };

  const handleResumeClick = (url) => {
    setResumeUrl(url);
    setPreviewUrl(url);
  };

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return <div>Error loading resumes: {error.message}</div>;
  }

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h1>Resume</h1>
        </Col>
      </Row>
      <Row className="g-3">
        <Col xs={12} md={6}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Upload Resume</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
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
                <div>{resume.name}</div>
                <div>{resume.timestamp}</div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(resume.id);
                  }}
                >
                  Delete
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col xs={12} md={6}>
          {previewUrl && (
            <iframe
              src={previewUrl}
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
