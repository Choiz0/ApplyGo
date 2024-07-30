import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  ListGroup,
  Col,
  Row,
  Button,
  Modal,
  Card,
} from "react-bootstrap";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../util/authContext";
import { db } from "../firebase";

const PortfolioPage = () => {
  const currentUser = useAuth();
  const userId = currentUser.user.uid;

  const [Portfolio, setPortfolio] = useState({
    title: "",
    description: "",
    link: "",
  });
  const [portfolioList, setPortfolioList] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);

  const onChange = (e) => {
    const { name, value } = e.target;
    setPortfolio((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await addPortfolio();
  };

  const addPortfolio = async () => {
    try {
      if (currentUser.isLoggedIn) {
        await addDoc(collection(db, `users/${userId}/portfolio`), Portfolio);
        setPortfolio({
          title: "",
          description: "",
          link: "",
        });
        handleClose();
        await getPortfolio();
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const getPortfolio = async () => {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/portfolio`)
    );
    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPortfolioList(list);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, `users/${userId}/portfolio`, id));
    await getPortfolio();
  };

  useEffect(() => {
    getPortfolio();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center">Portfolio</h1>
      <Button variant="info" className="m-3" onClick={handleShow}>
        Add Portfolio
      </Button>

      <Row className="mt-2 g-3">
        {portfolioList.map((portfolio) => (
          <Col xs={12} md={6} lg={4} key={portfolio.id}>
            <Card className="border-primary mb-3">
              <Card.Header className="bg-primary text-white">
                {portfolio.title}
              </Card.Header>
              <Card.Body>
                <p>{portfolio.description}</p>
                <a
                  href={portfolio.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-link"
                >
                  View Project
                </a>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(portfolio.id)}
                >
                  Delete
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={modalShow} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Portfolio</Modal.Title>
        </Modal.Header>
        <Form onSubmit={onSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={Portfolio.title}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={Portfolio.description}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                name="link"
                value={Portfolio.link}
                onChange={onChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add Portfolio
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default PortfolioPage;
