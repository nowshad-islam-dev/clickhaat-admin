import { NavLink, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../app/store/authSlice';

export default function Header() {
  const isUserLoggedIn = !!useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  return (
    <Navbar
      collapseOnSelect
      expand='lg'
      variant='dark'
      bg='dark'
      className='position-sticky top-0'
    >
      <Container>
        <Link className='navbar-brand' to='/'>
          ClickHaat
        </Link>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'>
            {/* <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
          <Nav>
            {isUserLoggedIn ? (
              <li className='nav-item'>
                <Button variant='dark' onClick={() => dispatch(logout())}>
                  Signout
                </Button>
              </li>
            ) : (
              <>
                <NavLink to='/signin' className='nav-link'>
                  Signin
                </NavLink>
                <li className='nav-item'>
                  <NavLink to='/signup' className='nav-link'>
                    Signup
                  </NavLink>
                </li>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
