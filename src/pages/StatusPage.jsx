import { useState, useEffect } from "react";
import { Container, Card, ListGroup, Row, Col } from "react-bootstrap";
import { db } from "../firebase";
import { Bar } from "react-chartjs-2";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { useAuth } from "../util/authContext";

const StatusPage = () => {
  const currentUser = useAuth();
  const userId = currentUser.user.uid;
  const isLoggedIn = currentUser.isLoggedIn;

  const navigate = useNavigate();
  const [applicationList, setApplicationList] = useState([]);
  const getApplications = async () => {
    if (currentUser.isLoggedIn) {
      const querySnapshot = await getDocs(
        collection(db, `users/${userId}/applications`)
      );
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApplicationList(list);
    }
  };
  useEffect(() => {
    if (!currentUser.isLoggedIn) {
      navigate("/login");
    }
    getApplications();
  }, []);

  const applicationStatusCounts = {
    applied: applicationList.filter((app) => app.status === "applied").length,
    interview: applicationList.filter((app) => app.status === "interview")
      .length,
    offer: applicationList.filter((app) => app.status === "offer").length,
    rejected: applicationList.filter((app) => app.status === "rejected").length,
    notApplied: applicationList.filter((app) => app.status === "notApplied")
      .length,
  };

  const dataChart = {
    labels: [
      "Total",
      "Applied",
      "Interview",
      "Offer",
      "Rejected",
      "Not Applied",
    ],
    datasets: [
      {
        label: "Applications",
        data: [
          applicationList.length,
          applicationStatusCounts.applied,
          applicationStatusCounts.interview,
          applicationStatusCounts.offer,
          applicationStatusCounts.rejected,
          applicationStatusCounts.notApplied,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container className="p-2">
      <Row className="justify-content-center" style={{ gap: "20px" }}>
        <ListGroup className="col-sm-3 mt-5" style={{ minWidth: "250px" }}>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            TOTAL:
            <span className="badge bg-primary rounded-pill">
              {applicationList.length}
            </span>
          </ListGroup.Item>
          {Object.entries(applicationStatusCounts).map(([status, count]) => (
            <ListGroup.Item
              key={status}
              className="d-flex justify-content-between align-items-center"
            >
              {status.toUpperCase()}
              <span className="badge bg-primary rounded-pill">{count}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Card
          className="col-5 mt-5 d-none d-sm-block"
          style={{ maxHeight: "500px" }}
        >
          <Bar data={dataChart} />
        </Card>
      </Row>

      <h3 className="text-center mt-5">Jobs to Be Applied For</h3>
      <Row className="mt-3 d-flex justify-content-start">
        {applicationList
          .filter((app) => app.status === "notApplied")
          .map((app) => (
            <Col xs={12} sm={6} md={4} lg={3} key={app.id} className="mb-3">
              <Card
                className="card-hover border-info rounded"
                style={{
                  cursor: "pointer",
                  minHeight: "200px",
                  maxHeight: "200px",
                }}
                onClick={() => navigate(`/list/${app.id}`)}
              >
                <Card.Header
                  className="bg-info text-light text-center"
                  style={{
                    minHeight: "50px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Card.Title>{app.company}</Card.Title>
                </Card.Header>
                <Card.Body
                  style={{
                    minHeight: "150px",

                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Card.Subtitle className="mb-2 text-muted">
                    {app.position}
                  </Card.Subtitle>
                  <Card.Text>{app.location}</Card.Text>
                  <Card.Text
                    style={{
                      maxHeight: "100px",

                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {app.notes}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default StatusPage;
