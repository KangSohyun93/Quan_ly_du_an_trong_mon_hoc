import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './css/App.css';

function App() {
  return (
    <div className="screen">
      <Sidebar />
      <Dashboard />
    </div>
  )
}

export default App