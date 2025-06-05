import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Box, Typography, Button, useTheme, useMediaQuery, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

export function Chart({ transactions }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [chartData, setChartData] = useState(null);
  const [totalExpense, setTotalExpense] = useState(0);

  const categories = [
    'Food',
   'Transportation',
    'Housing',
    'Utilities',
    'Healthcare',
    'Shopping',
    'Entertainment',
     'Education',
    'Personal',
    'Other', 
  ];
  
  // Updated with a more vibrant, modern color palette
  const categoryColors = [
    'rgba(75, 192, 192, 0.8)',    // Teal
    'rgba(255, 159, 64, 0.8)',    // Orange
    'rgba(153, 102, 255, 0.8)',   // Purple
    'rgba(54, 162, 235, 0.8)',    // Blue
    'rgba(255, 99, 132, 0.8)',    // Pink
    'rgba(255, 206, 86, 0.8)'     // Yellow
  ];

  useEffect(() => {
    // Calculate total spent per category
    const categoryTotals = categories.map(category =>
      transactions
        .filter(txn => txn.category === category)
        .reduce((sum, txn) => sum + (txn.amount || 0), 0)
    );
    setChartData({
      labels: categories,
      datasets: [
        {
          label: 'Expenses by Category',
          data: categoryTotals,
          backgroundColor: categoryColors,
          borderColor: categoryColors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        }
      ]
    });
    setTotalExpense(categoryTotals.reduce((sum, val) => sum + val, 0));
  }, [transactions]);

  const handleAddExpense = () => {
    navigate('/add-new-expense');
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: isMobile ? 2 : 4,
        borderRadius: 3,
        background: theme.palette.background.paper,
        marginTop: 0,
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography
        variant={isMobile ? "h6" : "h4"}
        align="center"
        gutterBottom
        sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 3 }}
      >
        Expenses by Category
      </Typography>
      {chartData && totalExpense > 0 ? (
        <Box 
          sx={{ 
            width: '100%',
            maxWidth: isMobile ? '100%' : '650px', // Increased from 400px to 650px
            height: isMobile ? '300px' : '450px',  // Added explicit height 
            mx: "auto", 
            my: 4,              // Added margin for better spacing
            position: 'relative'  // Needed for proper chart rendering
          }}
        >
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,  // This allows the chart to fill the container
              plugins: {
                legend: { 
                  position: 'bottom',
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                      size: 14,
                      weight: 'bold'
                    }
                  } 
                },
                tooltip: {
                  titleFont: {
                    size: 16
                  },
                  bodyFont: {
                    size: 14
                  },
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                      return `${label}: ₹${value} (${percentage}%)`;
                    }
                  }
                }
              },
              cutout: '65%',  // Slightly less cutout for a more substantial look
              animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1000,
                easing: 'easeOutQuart'
              }
            }}
          />
        </Box>
      ) : (
        <Typography align="center" color="text.secondary" sx={{ py: 5 }}>
          No expenses to display.
        </Typography>
      )}
      <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Total Expense: ₹{totalExpense}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddExpense}
          sx={{ borderRadius: 2, px: 3, py: 1 }}  // Larger button
        >
          Add Expense
        </Button>
      </Box>
    </Paper>
  );
}

export default Chart;