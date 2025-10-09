import { Container, Row, Col, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './style.css';

export default function Sidebar({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} className={`sidebar ${showSidebar ? 'active' : ''}`}>
          <div className="sidebar-header">
            <button
              className="toggle-btn d-md-none"
              onClick={() => setShowSidebar(false)}
            >
              ✕
            </button>
            <h5>Menu</h5>
          </div>
          <Nav className="flex-column">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/product" className="nav-link">
              Products
            </NavLink>
            <NavLink to="/order" className="nav-link">
              Orders
            </NavLink>
          </Nav>
        </Col>

        {/* Main content */}
        <Col md={{ span: 10, offset: 2 }} className="main-content">
          <button
            className="toggle-btn d-md-none"
            onClick={() => setShowSidebar(true)}
          >
            ☰
          </button>
          {children}
        </Col>
      </Row>
    </Container>
  );
}
