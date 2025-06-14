import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    return currentPath === path ? 'active' : '';
  };

  return (
    <div className="admin-sidebar bg-light p-3 rounded shadow-sm">
      <h5 className="mb-3 border-bottom pb-2">Admin Panel</h5>
      <ListGroup variant="flush">
        <ListGroup.Item 
          as={Link} 
          to="/admin" 
          action 
          active={isActive('/admin')}
          className="border-0 rounded mb-2"
        >
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </ListGroup.Item>
        
        <ListGroup.Item 
          as={Link} 
          to="/admin/users" 
          action 
          active={isActive('/admin/users')}
          className="border-0 rounded mb-2"
        >
          <i className="bi bi-people me-2"></i> User Management
        </ListGroup.Item>
        
        <ListGroup.Item 
          as={Link} 
          to="/admin/transactions" 
          action 
          active={isActive('/admin/transactions')}
          className="border-0 rounded mb-2"
        >
          <i className="bi bi-credit-card me-2"></i> All Transactions
        </ListGroup.Item>
        
        <ListGroup.Item 
          as={Link} 
          to="/admin/analytics" 
          action 
          active={isActive('/admin/analytics')}
          className="border-0 rounded mb-2"
        >
          <i className="bi bi-graph-up me-2"></i> Analytics
        </ListGroup.Item>
        
        <ListGroup.Item 
          as={Link} 
          to="/admin/settings" 
          action 
          active={isActive('/admin/settings')}
          className="border-0 rounded mb-2"
        >
          <i className="bi bi-gear me-2"></i> Settings
        </ListGroup.Item>
      </ListGroup>
      
      <div className="mt-4 pt-2 border-top">
        <small className="text-muted d-block mb-3">Admin Tools</small>
        <ListGroup variant="flush">
          <ListGroup.Item 
            as={Link} 
            to="/admin/create-user" 
            action 
            className="border-0 rounded mb-2 py-2"
          >
            <i className="bi bi-person-plus me-2"></i> Create User
          </ListGroup.Item>
          
          <ListGroup.Item 
            as="button" 
            action 
            className="border-0 rounded mb-2 py-2 text-danger text-start w-100"
            onClick={() => window.confirm('Are you sure you want to clear system logs?')}
          >
            <i className="bi bi-trash me-2"></i> Clear Logs
          </ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  );
};

export default AdminSidebar;
