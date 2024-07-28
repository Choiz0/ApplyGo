import React, { useState, useEffect } from "react";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../util/authContext";
import { db } from "../firebase";

const InfoPage = () => {
  const navigate = useNavigate();
  const currentUser = useAuth();
  const userId = currentUser.user.uid;
  const [info, setInfo] = useState({
    linkedin: "",
    gitHub: "",
    blog: "",
  });
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      if (editMode) {
        await updateDoc(doc(db, `users/${userId}/info`, info.id), info);
        console.log("Document updated successfully");
      } else {
        await addDoc(collection(db, `users/${userId}/info`), info);
        console.log("Document added successfully");
      }
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }

    setEditMode(false);
  };

  const getInfo = async () => {
    try {
      if (userId) {
        const infoRef = collection(db, `users/${userId}/info`);
        const querySnapshot = await getDocs(infoRef);
        const infoData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (infoData.length > 0) {
          setInfo(infoData[0]);
        }
      }
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <Container>
      {editMode ? (
        <>
          <h1>Edit Info</h1>
          <Row className="mb-3">
            <Form.Label column sm="3">
              LinkedIn
            </Form.Label>
            <Col sm="9">
              <Form.Control
                onChange={handleChange}
                name="linkedin"
                type="text"
                value={info.linkedin}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Form.Label column sm="3">
              GitHub
            </Form.Label>
            <Col sm="9">
              <Form.Control
                onChange={handleChange}
                name="gitHub"
                type="text"
                value={info.gitHub}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Form.Label column sm="3">
              Blog
            </Form.Label>
            <Col sm="9">
              <Form.Control
                onChange={handleChange}
                name="blog"
                type="text"
                value={info.blog}
              />
            </Col>
          </Row>
          <Button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </>
      ) : (
        <>
          <h1>Info</h1>
          <Row className="mb-3">
            <Col sm="3">LinkedIn:</Col>
            <Col sm="9">{info.linkedin}</Col>
          </Row>
          <Row className="mb-3">
            <Col sm="3">GitHub:</Col>
            <Col sm="9">{info.gitHub}</Col>
          </Row>
          <Row className="mb-3">
            <Col sm="3">Blog:</Col>
            <Col sm="9">{info.blog}</Col>
          </Row>
          <Button className="btn btn-primary" onClick={handleEdit}>
            Edit
          </Button>
        </>
      )}
    </Container>
  );
};

export default InfoPage;
