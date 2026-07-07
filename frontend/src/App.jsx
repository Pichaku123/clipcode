import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';

export default function App() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}