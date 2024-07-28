import { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../util/authContext";

const AppDetailPage = () => {
  const currentUser = useAuth();
  const userId = currentUser.user.uid;
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);

  const getApplication = async () => {
    if (currentUser.isLoggedIn) {
      const docRef = doc(db, `users/${userId}/applications`, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const app = { id: docSnap.id, ...docSnap.data() };
        setApplication(app);
      } else {
        console.log("No such document!");
      }
    }
  };

  useEffect(() => {
    getApplication();
  }, [id, currentUser.isLoggedIn, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateRef = doc(db, `users/${userId}/applications`, id);
      await updateDoc(updateRef, application);
      setIsUpdate(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      const deleteRef = doc(db, `users/${userId}/applications`, id);
      await deleteDoc(deleteRef);
      navigate("/list");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      {!isUpdate ? (
        <Card
          style={{
            width: "600px",
            minHeight: "400px",
            padding: "1rem",
            fontSize: "1.2rem",
            borderColor: "#17a2b8", // Bootstrap info color
          }}
        >
          <Card.Body>
            <Card.Title style={{ fontSize: "1.5rem", textAlign: "center" }}>
              Application Detail
            </Card.Title>
            <Card.Text>
              <strong>Company:</strong> {application.company}
            </Card.Text>
            <Card.Text>
              <strong>Position:</strong> {application.position}
            </Card.Text>
            <Card.Text>
              <strong>Date Applied:</strong> {application.dateApplied}
            </Card.Text>
            <Card.Text>
              <strong>Status:</strong> {application.status}
            </Card.Text>
            <Card.Text>
              <strong>Link:</strong>{" "}
              <a
                href={application.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {application.link}
              </a>
            </Card.Text>
            <Card.Text>
              <strong>Location:</strong> {application.location}
            </Card.Text>
            <Card.Text>
              <strong>Notes:</strong> {application.notes}
            </Card.Text>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="primary" onClick={() => setIsUpdate(true)}>
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Form className="d-flex flex-column gap-3 w-75" onSubmit={handleSubmit}>
          <h1>Update Application</h1>
          {/* Company */}
          <Row className="mb-3">
            <Form.Label column sm="3">
              Company
            </Form.Label>
            <Col sm="9">
              <Form.Control
                name="company"
                value={application.company}
                type="text"
                placeholder="Company"
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* Position */}
          <Row className="mb-3">
            <Form.Label column sm="3">
              Position
            </Form.Label>
            <Col sm="9">
              <Form.Control
                name="position"
                value={application.position}
                type="text"
                placeholder="Position title"
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* Date Applied */}
          <Row className="mb-3">
            <Form.Label column sm="3">
              Date Applied
            </Form.Label>
            <Col sm="9">
              <Form.Control
                onChange={handleChange}
                name="dateApplied"
                type="date"
                value={application.dateApplied}
              />
            </Col>
          </Row>

          {/* Status */}
          <Row className="mb-3">
            <Form.Label column sm="3">
              Status
            </Form.Label>
            <Col sm="9">
              <Form.Select
                name="status"
                value={application.status}
                onChange={handleChange}
              >
                <option value="notApplied">Not Applied</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Link */}
          <Row className="mb-3">
            <Form.Label column sm="3">
              Link
            </Form.Label>
            <Col sm="9">
              <Form.Control
                name="link"
                type="text"
                onChange={handleChange}
                value={application.link}
                placeholder="Application link"
              />
            </Col>
          </Row>

          {/* Location */}
          <Row className="mb-3">
            <Form.Label column sm="3">
              Location
            </Form.Label>
            <Col sm="9">
              <Form.Control
                name="location"
                type="text"
                value={application.location}
                placeholder="Location"
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* Notes */}
          <Row className="mb-3">
            <Form.Label column sm="3">
              Notes
            </Form.Label>
            <Col sm="9">
              <Form.Control
                name="notes"
                as="textarea"
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes"
                value={application.notes}
              />
            </Col>
          </Row>

          {/* Submit Button */}
          <Row>
            <Col className="d-flex justify-content-end gap-2 flex-column flex-sm-row">
              <Button variant="success" type="submit">
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => setIsUpdate(false)}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Container>
  );
};

export default AppDetailPage;
