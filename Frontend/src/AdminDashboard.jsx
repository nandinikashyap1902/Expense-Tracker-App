import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, Container, Row, Col, Card, Badge } from 'react-bootstrap';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!isAdmin) return;
      
      try {
        setLoading(true);
        
        // Fetch all users (needs to be implemented in backend)
        const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
          credentials: 'include'
        });
        
        // Fetch all transactions (needs to be implemented in backend)
        const transactionsResponse = await fetch(`${import.meta.env.VITE_API_URL}/admin/transactions`, {
          credentials: 'include'
        });
        
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        if (!transactionsResponse.ok) throw new Error('Failed to fetch transactions');
        
        const usersData = await usersResponse.json();
        const transactionsData = await transactionsResponse.json();
        
        setUsers(usersData);
        setTransactions(transactionsData);
        setLoading(false);
      } catch (err) {
        console.error('Admin dashboard error:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Container className="mt-5">
        <h3>Access Denied</h3>
        <p>You don't have admin privileges to view this page.</p>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <h3>Loading admin dashboard...</h3>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <h3>Error Loading Admin Data</h3>
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>User Statistics</Card.Title>
              <div className="d-flex justify-content-between">
                <div>
                  <h3>{users.length}</h3>
                  <p>Total Users</p>
                </div>
                <div>
                  <h3>{users.filter(user => user.role === 'admin').length}</h3>
                  <p>Admins</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Transaction Statistics</Card.Title>
              <div className="d-flex justify-content-between">
                <div>
                  <h3>{transactions.length}</h3>
                  <p>Total Transactions</p>
                </div>
                <div>
                  <h3>${transactions.reduce((sum, transaction) => 
                    transaction.type === 'expense' ? sum + Number(transaction.amount) : sum, 0).toFixed(2)}</h3>
                  <p>Total Expenses</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>User Management</Card.Title>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Income</th>
                <th>Join Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.role === 'admin' ? 'danger' : 'primary'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td>${user.income}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Recent Transactions</Card.Title>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map(transaction => (
                <tr key={transaction._id}>
                  <td>{transaction._id}</td>
                  <td>{transaction.userEmail || 'Unknown'}</td>
                  <td>
                    <Badge bg={transaction.type === 'expense' ? 'danger' : 'success'}>
                      {transaction.type}
                    </Badge>
                  </td>
                  <td>${transaction.amount}</td>
                  <td>{transaction.category}</td>
                  <td>{new Date(transaction.datetime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
