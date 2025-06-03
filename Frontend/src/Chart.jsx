import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

export function Chart() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
 
  // Handle add expense button click
  const handleAddExpense = () => {
    navigate('/add-new-expense');
  };

  useEffect(() => {
    async function getTransactions() {
      const url = import.meta.env.VITE_API_URL + '/transactions';
      try {
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response.status === 401) {
          setTransactions([]);
          setIsLoading(false);
          return null;
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
        setIsLoading(false);
        return null;
      }
    }

    getTransactions().then(transactions => {
      if (transactions) setTransactions(transactions);
      setIsLoading(false);
    });
  }, []);

  const categories = ["Education", "Groceries", "Health", "Clothing", "Travelling", "Other"];
  
  // Calculate the total expenses per category
  const categoryTotals = categories.map(category => {
    return transactions
      .filter(item => item.category === category)
      .reduce((total, item) => total + item.expense, 0);
  });

  // Check if there are any transactions
  const hasTransactions = transactions && transactions.length > 0;
  const hasExpenses = categoryTotals.some(total => total > 0);
  
  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Expenses by Category',
        data: categoryTotals,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div className="spinner"></div>
        <Typography variant="h6" color="textSecondary" style={{ marginTop: '20px' }}>
          Loading your expenses...
        </Typography>
      </Box>
    );
  }

  if (!hasTransactions || !hasExpenses) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#e9ecef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '40px' }}>📊</span>
        </div>
        <Typography variant="h6" color="textSecondary" style={{ marginBottom: '10px' }}>
          No expenses to display yet
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ maxWidth: '400px', marginBottom: '20px' }}>
          Start adding your expenses to see beautiful charts and track your spending habits.
        </Typography>
        <button 
          onClick={handleAddExpense}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.3s',
            ':hover': {
              backgroundColor: '#45a049',
            }
          }}
        >
          Add Your First Expense
        </button>
      </Box>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', position: 'relative' }}>
      <Doughnut 
        data={data} 
        options={{ 
          responsive: true, 
          plugins: { 
            legend: { 
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ₹${value} (${percentage}%)`;
                }
              }
            }
          },
          cutout: '65%',
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }} 
      />
    </div>
  );
}

// Add some basic spinner styles
const styles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4CAF50;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
`;

// Add styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
