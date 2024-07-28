import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Row,
  Button,
  Col,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../util/authContext";

const ListPage = () => {
  const currentUser = useAuth();
  const userId = currentUser.user.uid;
  const navigate = useNavigate();
  const [applicationList, setApplicationList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const getApplications = async () => {
    if (currentUser.isLoggedIn) {
      const applicationRef = collection(db, `users/${userId}/applications`);
      const q = query(applicationRef);
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApplicationList(list);
    }
  };

  useEffect(() => {
    if (userId) {
      getApplications();
    }
  }, [userId]);

  const handleClick = (id) => {
    navigate(`/list/${id}`);
  };

  const textRange = (text) => {
    return text.length > 10 ? text.substring(0, 10) + "..." : text;
  };

  const onFilterChange = async (status) => {
    if (status === "All") {
      getApplications();
      setSelectedStatus(status);
      return;
    }
    setSelectedStatus(status);
    const ref = collection(db, `users/${userId}/applications`);
    const q = query(ref, where("status", "==", status));
    const querySnapshot = await getDocs(q);
    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setApplicationList(list);
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Header>
              <h3>Application List</h3>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col className="d-flex justify-content-end">
                  <ButtonGroup size="sm">
                    {[
                      "All",
                      "applied",
                      "interview",
                      "offer",
                      "rejected",
                      "notApplied",
                    ].map((status) => (
                      <Button
                        className="text-sm"
                        size="sm"
                        key={status}
                        variant={
                          selectedStatus === status ? "info" : "outline-info"
                        }
                        onClick={() => onFilterChange(status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Col>
              </Row>
              <Table hover className="border-info rounded" responsive>
                <thead className="table-info">
                  <tr>
                    <th>Company</th>
                    <th>Position</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                    <th>Link</th>
                    <th>Location</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {applicationList.map((application) => (
                    <tr
                      key={application.id}
                      onClick={() => handleClick(application.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{application.company}</td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "150px" }}
                      >
                        {application.position}
                      </td>
                      <td>{application.dateApplied}</td>
                      <td>{application.status}</td>
                      <td>
                        <a
                          href={application.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Link
                        </a>
                      </td>
                      <td>{application.location}</td>
                      <td>{textRange(application.notes)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ListPage;
