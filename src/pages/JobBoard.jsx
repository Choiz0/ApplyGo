import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

// 데이터 가져오기 함수
// const fetchJobs = async (
//   dateRange,
//   location,
//   keyword,
//   includeKeywords,
//   excludeKeywords
// ) => {
//   const response = await axios.get("http://localhost:3001/fetch-data", {
//     params: { dateRange, location, keyword, includeKeywords, excludeKeywords },
//   });
//   console.log("Response data:", response.data); // 추가된 로그
//   return response.data;
// };
const fetchJobs = async (
  dateRange,
  location,
  keyword,
  includeKeywords,
  excludeKeywords
) => {
  const response = await axios.get("https://applygo.onrender.com/fetch-data", {
    params: { dateRange, location, keyword, includeKeywords, excludeKeywords },
  });
  console.log("Response data:", response.data);
  return response.data;
};

const JobBoard = () => {
  const [dateRange, setDateRange] = useState("");
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [includeKeywords, setIncludeKeywords] = useState("");
  const [excludeKeywords, setExcludeKeywords] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: jobs,
    error,
    isLoading,
    refetch,
  } = useQuery(
    ["jobs", dateRange, location, keyword, includeKeywords, excludeKeywords],
    () =>
      fetchJobs(dateRange, location, keyword, includeKeywords, excludeKeywords),
    {
      enabled: shouldFetch,
      cacheTime: 3600000, // 1시간
      staleTime: 3600000, // 1시간
      onSuccess: () => setShouldFetch(false),
    }
  );

  const handleSearch = () => {
    if (keyword || dateRange || location) {
      setShouldFetch(true);
      refetch();
      setErrorMessage("");
    } else {
      setErrorMessage(
        "Please enter at least one filter (keyword, date range, or location)."
      );
    }
  };

  if (isLoading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner
          animation="border"
          role="status"
          variant="danger"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container>
      <Row className="my-4">
        <Col xs={12}>
          <Card
            style={{
              borderColor: "#17a2b8", // Bootstrap info color
              borderWidth: "1px",
              marginBottom: "1rem",
            }}
          >
            <Card.Body>
              <h1 className="text-center mb-4">Job Listings (seek)</h1>
              <Form className="mb-4">
                <Row className="g-2">
                  <Col xs={12} md={6} lg={2}>
                    <Form.Group controlId="formKeyword">
                      <Form.Control
                        type="text"
                        placeholder="Enter keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4} lg={2}>
                    <Form.Group controlId="formDateRange">
                      <Form.Select
                        value={dateRange || ""} // 초기값 설정
                        onChange={(e) => setDateRange(e.target.value)}
                      >
                        <option value="" disabled>
                          Date Range
                        </option>
                        <option value="">Anytime</option>
                        <option value="1">1 Day</option>
                        <option value="3">3 Days</option>
                        <option value="7">7 Days</option>
                        <option value="14">14 Days</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4} lg={2}>
                    <Form.Group controlId="formLocation">
                      <Form.Select
                        value={location || ""} // 초기값 설정
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        <option value="" disabled>
                          Location
                        </option>
                        <option value="melbourne">Melbourne</option>
                        <option value="sydney">Sydney</option>
                        <option value="brisbane">Brisbane</option>
                        <option value="australia">Australia</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4} lg={2}>
                    <Form.Group controlId="formIncludeKeywords">
                      <Form.Control
                        type="text"
                        placeholder="Include keywords separated by commas"
                        value={includeKeywords}
                        onChange={(e) => setIncludeKeywords(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4} lg={2}>
                    <Form.Group controlId="formExcludeKeywords">
                      <Form.Control
                        type="text"
                        placeholder="Exclude keywords separated by commas"
                        value={excludeKeywords}
                        onChange={(e) => setExcludeKeywords(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4} lg={2} className="d-flex">
                    <Button
                      variant="secondary"
                      className="w-100 w-md-auto"
                      onClick={handleSearch}
                    >
                      Search
                    </Button>
                  </Col>
                </Row>
              </Form>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        {jobs &&
          jobs.map((job, index) => (
            <Col key={index} sm={12} md={6} lg={4} className="mb-4">
              <Card
                className="d-flex flex-column h-100"
                style={{ borderColor: "#17a2b8", borderWidth: "1px" }}
              >
                <Card.Body className="d-flex flex-column">
                  <div className="flex-grow-1">
                    <Card.Title>{job.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {job.company}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Location:</strong> {job.location}
                      <br />
                      <strong>Salary:</strong> {job.salary}
                      <br />
                      <strong>Posted:</strong> {job.postedDate}
                    </Card.Text>
                    <div className="mt-3">
                      {job.additionalDetails.map((ul, ulIndex) => (
                        <div key={ulIndex}>
                          <ul>
                            {ul.map((li, liIndex) => (
                              <li key={liIndex}>{li}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-auto">
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-info"
                    >
                      View Job
                    </a>
                    <Link
                      to={`/add-application?company=${encodeURIComponent(
                        job.company
                      )}&position=${encodeURIComponent(
                        job.title
                      )}&location=${encodeURIComponent(
                        job.location
                      )}&link=${encodeURIComponent(job.link)}`} // 링크 추가
                      className="btn btn-success"
                    >
                      Add to Applications
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default JobBoard;
