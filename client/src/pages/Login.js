// client/src/pages/Login.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    const initialValues = {
        email: '',
        password: ''
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
    });

    const onSubmit = async (values, { setSubmitting }) => {
        setLoginError('');
        const result = await login(values);

        if (result.success) {
            toast.success('Login successful');
            navigate('/dashboard');
        } else {
            setLoginError(result.message);
            toast.error(result.message);
        }

        setSubmitting(false);
    };

    return (
        <div className="login-page">
            <div className="login-form">
                <h2>Admin Login</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            {loginError && <div className="error">{loginError}</div>}

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

                            <button
                                type="submit"
                                className="btn btn-block"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                            {/* Add this section */}
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                Don't have an account? <Link to="/register">Register</Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;