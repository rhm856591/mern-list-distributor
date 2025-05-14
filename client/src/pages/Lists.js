// client/src/pages/Lists.js
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const Lists = () => {
  const [agents, setAgents] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, listsRes] = await Promise.all([
          axios.get('/api/agents'),
          axios.get('/api/lists')
        ]);
        
        setAgents(agentsRes.data.data);
        setLists(listsRes.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initial form values for file upload
  const initialValues = {
    file: null
  };

  // Validation schema for the form
  const validationSchema = Yup.object({
    file: Yup.mixed().required('A file is required')
  });

  // Handle file upload and distribution
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!values.file) {
      toast.error('Please select a file to upload');
      setSubmitting(false);
      return;
    }

    // Check if there are agents to distribute to
    if (agents.length === 0) {
      toast.error('Please add agents before uploading a list');
      setSubmitting(false);
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', values.file);

    try {
      setUploading(true);
      const res = await axios.post('/api/lists/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setDistribution(res.data.data);
      toast.success('File uploaded and distributed successfully');
      resetForm();
      
      // Refresh list items
      const listsRes = await axios.get('/api/lists');
      setLists(listsRes.data.data);
    } catch (err) {
      console.error('Error uploading and distributing file:', err);
      toast.error(
        err.response?.data?.message || 'Failed to upload and distribute file'
      );
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Manage Lists</h2>
      
      <div className="card">
        <h3>Upload and Distribute List</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue, errors }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="file">Upload CSV or Excel File</label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  onChange={(event) => {
                    setFieldValue('file', event.currentTarget.files[0]);
                  }}
                  accept=".csv,.xlsx,.xls"
                />
                {errors.file && <div className="error">{errors.file}</div>}
                <p className="help-text">
                  Accepted formats: .csv, .xlsx, .xls. The file should have columns for FirstName, Phone, and Notes.
                </p>
              </div>
              
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting || uploading}
              >
                {uploading ? 'Uploading & Distributing...' : 'Upload & Distribute'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      
      {distribution.length > 0 && (
        <div className="distribution-summary">
          <h3>Distribution Summary</h3>
          {distribution.map((item) => (
            <div key={item._id} className="agent-distribution">
              <h4>{item.agentName}</h4>
              <p>Email: {item.agentEmail}</p>
              <p>Items assigned: {item.count}</p>
              <div className="list-items">
                {item.items.map((listItem) => (
                  <div key={listItem._id} className="list-item">
                    <p>Name: {listItem.firstName}</p>
                    <p>Phone: {listItem.phone}</p>
                    <p>Notes: {listItem.notes || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="list-summary">
        <h3>All List Items</h3>
        
        {loading ? (
          <p>Loading list items...</p>
        ) : lists.length === 0 ? (
          <p>No list items found. Please upload a file to distribute.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Notes</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {lists.map(item => (
                  <tr key={item._id}>
                    <td>{item.firstName}</td>
                    <td>{item.phone}</td>
                    <td>{item.notes || 'N/A'}</td>
                    <td>
                      {item.assignedTo.name} ({item.assignedTo.email})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lists;