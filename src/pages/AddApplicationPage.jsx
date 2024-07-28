import React, { useState, useEffect } from "react";
import { Container, Form, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase";

const AddApplicationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;

  const [applications, setApplications] = useState({
    company: "",
    position: "",
    dateApplied: "",
    status: "notApplied",
    link: "",
    location: "",
    notes: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const company = params.get("company") || "";
    const position = params.get("position") || "";
    const loc = params.get("location") || "";
    const link = params.get("link") || "";

    setApplications((prev) => ({
      ...prev,
      company,
      position,
      location: loc,
      link,
    }));
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplications((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const userId = user?.uid;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const docRef = await addDoc(
        collection(db, `users/${userId}/applications`),
        applications
      );
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setApplications({
      company: "",
      position: "",
      dateApplied: "",
      status: "notApplied",
      link: "",
      location: "",
      notes: "",
    });
    navigate("/list");
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Form
        className="d-flex flex-column gap-1 border-info border"
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          maxWidth: "800px",
          width: "80%",
        }}
      >
        <h1>Add Application</h1>

        {/* Company */}
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label>Company</Form.Label>
            <Form.Control
              name="company"
              value={applications.company}
              type="text"
              placeholder="Company"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        {/* Position */}
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label>Position</Form.Label>
            <Form.Control
              name="position"
              value={applications.position}
              type="text"
              placeholder="Position title"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        {/* Date Applied */}
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label>Date Applied</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="dateApplied"
              type="date"
              value={applications.dateApplied}
            />
          </Form.Group>
        </Row>

        {/* Status */}
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={applications.status}
              onChange={handleChange}
            >
              <option value="notApplied">Not Applied</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </Form.Select>
          </Form.Group>
        </Row>

        {/* Link */}
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label>Link</Form.Label>
            <Form.Control
              name="link"
              type="text"
              onChange={handleChange}
              value={applications.link}
              placeholder="Application link"
            />
          </Form.Group>
        </Row>

        {/* Location */}
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label>Location</Form.Label>
            <Form.Control
              name="location"
              type="text"
              value={applications.location}
              placeholder="Location"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        {/* Notes */}
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              name="notes"
              as="textarea"
              onChange={handleChange}
              rows={3}
              placeholder="Additional notes"
              value={applications.notes}
            />
          </Form.Group>
        </Row>

        {/* Submit Button */}
        <Row>
          <Col className="text-end">
            <button type="submit" className="btn btn-info">
              Add Application
            </button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AddApplicationPage;
