// client/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [agentCount, setAgentCount] = useState(0);
  const [listItemCount, setListItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, listsRes] = await Promise.all([
          axios.get('/api/agents'),
          axios.get('/api/lists')
        ]);
        
        setAgentCount(agentsRes.data.count);
        setListItemCount(listsRes.data.count);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      
      <div className="grid">
        <div className="card">
          <h3>Agents</h3>
          <p>Total Agents: {agentCount}</p>
          <Link to="/agents" className="btn">
            Manage Agents
          </Link>
        </div>
        
        <div className="card">
          <h3>List Items</h3>
          <p>Total List Items: {listItemCount}</p>
          <Link to="/lists" className="btn">
            Manage Lists
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;