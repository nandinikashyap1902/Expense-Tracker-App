import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { logoutUser } from './Store/Slices/authSlice';
import './CSS/Header.css';

function Header() {
  const { isAuthenticated, isAdmin, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/signin');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Expense Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/transactions">Transactions</Nav.Link>
                <Nav.Link as={Link} to="/add-transaction">Add Expense</Nav.Link>
              </>
            )}
            
            {/* Admin-specific navigation */}
            {isAdmin && (
              <NavDropdown title="Admin" id="admin-dropdown">
                <NavDropdown.Item as={Link} to="/admin">Admin Dashboard</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/users">Manage Users</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/analytics">Analytics</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <NavDropdown title={user?.email || "Account"} id="account-dropdown">
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;