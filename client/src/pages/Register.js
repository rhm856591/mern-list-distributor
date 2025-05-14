// client/src/pages/Register.js
import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState('');

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setRegisterError('');
    
    if (values.password !== values.confirmPassword) {
      setRegisterError('Passwords do not match');
      setSubmitting(false);
      return;
    }
    
    const { confirmPassword, ...registerData } = values;
    const result = await register(registerData);
    // console.log(result);
    
    if (result.success) {
      toast.success('Registration successful');
      navigate('/dashboard');
    } else {
      setRegisterError(result.message);
      toast.error(result.message);
    }
    
    setSubmitting(false);
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Register Admin Account</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {registerError && <div className="error">{registerError}</div>}
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="div" className="error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                />
                <ErrorMessage name="confirmPassword" component="div" className="error" />
              </div>
              
              <button
                type="submit"
                className="btn btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
              
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;