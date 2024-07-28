import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../util/authContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const manageProfileItems = [
  { name: "Resume", url: "/resume" },
  { name: "Portfolio", url: "/portfolio" },
  { name: "Other Info", url: "/info" },
];
const jobSites = [
  { name: "Seek.com", url: "http://seek.com" },
  { name: "Glassdoor", url: "https://www.glassdoor.com.au/Job/index.htm" },
  { name: "Indeed", url: "https://indeed.com.au" },
  { name: "LinkedIn", url: "https://linkedin.com/jobs" },
];

function Navigation() {
  const [expanded, setExpanded] = useState(false);
  const user = useAuth();
  const navigate = useNavigate();

  const onSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      setExpanded(false); // 로그아웃 후 메뉴 닫기
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = () => {
    setExpanded(false); // 메뉴 항목 클릭 시 닫기
  };

  const renderDropdownItem = (item, isExternal = false) => (
    <NavDropdown.Item
      key={item.name}
      as={isExternal ? "a" : Link}
      to={isExternal ? {} : item.url}
      href={isExternal ? item.url : ""}
      target={isExternal ? "_blank" : ""}
      rel={isExternal ? "noopener noreferrer" : ""}
      onClick={handleSelect}
    >
      {item.name}
    </NavDropdown.Item>
  );

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-primary text-light"
      sticky="top"
      expanded={expanded}
    >
      <Container fluid className="d-flex justify-content-between m-2">
        <Navbar.Brand as={Link} to="/" className="text-light">
          ApplyGo
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpanded(!expanded)}
          className="border-light bg-light"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/add-application" onClick={handleSelect}>
              Add
            </Nav.Link>
            <Nav.Link as={Link} to="/list" onClick={handleSelect}>
              List
            </Nav.Link>
            <Nav.Link as={Link} to="/scrapingJobs" onClick={handleSelect}>
              Job search
            </Nav.Link>
            <Nav.Link as={Link} to="/" onClick={handleSelect}>
              Status
            </Nav.Link>
            <NavDropdown title="Manage Profile" id="collapsible-nav-dropdown">
              {manageProfileItems.map((item) => renderDropdownItem(item))}
            </NavDropdown>
            <NavDropdown title="Job Sites" id="collapsible-nav-dropdown">
              {jobSites.map((item) => renderDropdownItem(item, true))}
            </NavDropdown>
          </Nav>
          <Nav>
            {user.isLoggedIn ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/manage-profile"
                  className="text-white"
                  onClick={handleSelect}
                >
                  {user.user.email}
                </Nav.Link>
                <button
                  onClick={onSignOut}
                  className="btn btn-link nav-link text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" onClick={handleSelect}>
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
