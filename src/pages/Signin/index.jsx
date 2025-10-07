import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Input from '../../components/UI/Input';
import { loginUserWithCredentials } from '../../app/store/authSlice';

export default function Signin() {
  const loadingState = useSelector((state) => state.auth.loading);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  function loginUser(e) {
    e.preventDefault();
    dispatch(loginUserWithCredentials({ email, password }));
  }

  if (loadingState === 'pending') {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (loadingState !== 'failed' && token) {
      navigate('/');
    }
  }, [token, navigate, loadingState]);

  return (
    <Layout>
      <Container>
        <Row style={{ marginTop: '60px' }}>
          <Col md={{ span: 6, offset: 3 }}>
            <Form onSubmit={loginUser}>
              <h3 style={{ marginBottom: '20px', color: '#555' }}>
                Sign in as Admin
              </h3>
              <Input
                type="email"
                label="Email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Input
                type="password"
                label="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Button variant="primary" type="submit">
                Signin
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
