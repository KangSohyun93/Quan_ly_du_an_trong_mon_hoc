import React from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Dropdown,
  Container,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { GrTasks } from "react-icons/gr";
import { BsListTask } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import { FaStar } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import "./Navbar_SV.css";

function Navbar_SV() {
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === `/home${path}`; // Kiểm tra đường dẫn đầy đủ
    // Hoặc nếu bạn muốn kiểm tra một phần:
    // return location.pathname.includes(path);
  };
  return (
    <Navbar bg="light" expand="lg" className="px-3 nav_container">
      <Container fluid>
        <div className="d-flex align-items-center">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              Sprint 4
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#sprint1">Sprint 1</Dropdown.Item>
              <Dropdown.Item href="#sprint2">Sprint 2</Dropdown.Item>
              <Dropdown.Item href="#sprint3">Sprint 3</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <span className="mx-3">|</span>
          <Nav className="me-auto">
            <Nav.Link
              href="/home/introduce"
              className={isActive("/introduce") ? "active" : ""}
            >
              <FaClipboardList className="me-1 icon d-inline-block" />
              Introduce
            </Nav.Link>
            <Nav.Link
              href="#dashboard"
              className={isActive("#dashboard") ? "active" : ""}
            >
              <LuLayoutDashboard className="me-1 icon d-inline-block" />
              Dashboard
            </Nav.Link>
            <Nav.Link
              href="#team-task"
              className={isActive("#team-task") ? "active" : ""}
            >
              <GrTasks className="me-1 icon d-inline-block" />
              Team task
            </Nav.Link>

            <Nav.Link
              href="#my-task"
              className={isActive("#my-task") ? "active" : ""}
            >
              <BsListTask className="me-1 icon d-inline-block" />
              My task
            </Nav.Link>

            <Nav.Link
              href="#roadmap"
              className={isActive("#roadmap") ? "active" : ""}
            >
              <SlCalender className="me-1 icon d-inline-block" />
              Roadmap
            </Nav.Link>

            <Nav.Link
              href="#rate"
              className={isActive("#rate") ? "active" : ""}
            >
              <FaStar className="me-1 icon d-inline-block" />
              Rate
            </Nav.Link>
          </Nav>
        </div>
        <div className="d-flex align-items-center">
          <span className="me-2 text-secondary">🔍 Filter</span>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
          </Form>
        </div>
      </Container>
    </Navbar>
  );
}

export default Navbar_SV;
