import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useState,useEffect } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);



export function Chart() {
  const [transactions, setTransactions] = useState([])
 
  useEffect(() => {
    async function getTransactions() {
      const url = import.meta.env.VITE_API_URL + '/transactions'
      try {
        
        const response = await fetch(url, {
          method: 'GET',
          credentials:'include'
        });
        if (response.status === 401) {
          setTransactions([]); // Set to empty array if unauthorized
          return null;
        }
        return await response.json()
      }
      catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]); // Set to empty array on error
        return null;
      }
 
    }
    getTransactions().then(transactions => {
      if (transactions) setTransactions(transactions); // Update only if transactions data exists
    });
  }
    , [])
    const categories = ["Education", "Groceries", "Health", "Clothing", "Travelling", "Other"];
  
  // Calculate the total expenses per category
  const categoryTotals = categories.map(category => {
    return transactions
      .filter(item => item.category === category)
      .reduce((total, item) => total + item.expense, 0); // Sum up expenses for each category
  });
  
     const data = {
  
      labels: categories,
     
      datasets: [
        {
          label: 'expense',
          
        
    data:categoryTotals,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
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
  return (

  <div style={{ maxWidth: 400, margin:'100px auto'}}>
    <Doughnut data={data} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }}/>
    </div>
  )
}
