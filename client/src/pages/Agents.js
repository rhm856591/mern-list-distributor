// client/src/pages/Agents.js
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  const handleDeleteAgent = async (id) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await axios.delete(`/api/agents/${id}`);
        toast.success('Agent deleted successfully');
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error('Error deleting agent:', err);
        toast.error('Failed to delete agent');
      }
    }
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
          <div>
            {agents.map(agent => (
              <div key={agent._id} className="agent-item">
                <div className="agent-info">
                  <h4>{agent.name}</h4>
                  <p>Email: {agent.email}</p>
                  <p>Mobile: {agent.mobile}</p>
                </div>
                <div className="agent-actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteAgent(agent._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents;