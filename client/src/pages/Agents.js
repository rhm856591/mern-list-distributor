// client/src/pages/Agents.js
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Agents.css';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get('/api/agents');
        setAgents(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching agents:', err);
        toast.error('Failed to fetch agents');
        setLoading(false);
      }
    };

    fetchAgents();
  }, [refreshTrigger]);

  const handleViewAgent = (agent) => {
    setSelectedAgent(agent);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAgent(null);
  };

  // Initial form values for adding a new agent
  const initialValues = {
    name: '',
    email: '',
    mobile: '',
    password: ''
  };

  // Validation schema for the form
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    mobile: Yup.string()
      .required('Mobile number is required')
      .matches(/^\+?[0-9\s]+$/, 'Invalid mobile number format'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
  });

  // Handle form submission
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await axios.post('/api/agents', values);
      toast.success('Agent added successfully');
      resetForm();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error adding agent:', err);
      toast.error(
        err.response?.data?.message || 'Failed to add agent'
      );
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h2>Manage Agents</h2>
      
      <div className="card">
        <h3>Add New Agent</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter agent name"
                />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter agent email"
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number (with country code)</label>
                <Field
                  type="text"
                  name="mobile"
                  id="mobile"
                  placeholder="e.g. +1 123 456 7890"
                />
                <ErrorMessage name="mobile" component="div" className="error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter password"
                />
                <ErrorMessage name="password" component="div" className="error" />
              </div>
              
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Agent'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      
      <div className="agent-list">
        <h3>Existing Agents</h3>
        
        {loading ? (
          <p>Loading agents...</p>
        ) : agents.length === 0 ? (
          <p>No agents found. Please add some agents.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Records Assigned</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map(agent => (
                  <tr key={agent._id}>
                    <td>{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>{agent.mobile}</td>
                    <td>{agent.recordCount}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleViewAgent(agent)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Agent Details Modal */}
      {showModal && selectedAgent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Agent Details</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-item">
                <label>Name:</label>
                <span>{selectedAgent.name}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{selectedAgent.email}</span>
              </div>
              <div className="detail-item">
                <label>Mobile:</label>
                <span>{selectedAgent.mobile}</span>
              </div>
              <div className="detail-item">
                <label>Records Assigned:</label>
                <span>{selectedAgent.recordCount}</span>
              </div>
              <div className="detail-item">
                <label>Created At:</label>
                <span>{new Date(selectedAgent.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;