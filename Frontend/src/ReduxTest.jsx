import { useSelector, useDispatch } from 'react-redux';
import { fetchExpenses } from './Store/Slices/expenseSlice';

function ReduxTest() {
  const dispatch = useDispatch();
  const { items, isLoading, error } = useSelector(state => state.expenses);
  
  const handleTestRedux = () => {
    console.log("Dispatching fetchExpenses action");
    dispatch(fetchExpenses());
  };
  
  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
      <h3>Redux Test Component</h3>
      <button onClick={handleTestRedux}>Test Redux - Fetch Expenses</button>
      
      <div style={{ marginTop: '20px' }}>
        <h4>Redux State:</h4>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Error: {error || 'None'}</p>
        <p>Number of transactions: {items ? items.length : 0}</p>
        
        {isLoading && <p>Loading expenses...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {items && items.length > 0 && (
          <div>
            <p>First few transactions:</p>
            <ul>
              {items.slice(0, 3).map(item => (
                <li key={item._id || item.id}>
                  {item.description || item.name}: {item.amount}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReduxTest;
