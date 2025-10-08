import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { authAxiosInstance } from '../../app/store/authSlice';
import Layout from '../../components/Layout';
import Input from '../../components/UI/Input';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signupUser(e) {
    setLoading(true);
    e.preventDefault();
    const userInfo = { firstName, lastName, email, password };
    const res = await authAxiosInstance.post('/signup', userInfo);
    setLoading(false);
    if (res.status == '200') {
      navigate('/signin');
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Container>
        <Row style={{ marginTop: '60px' }}>
          <Col md={{ span: 6, offset: 3 }}>
            <Form onSubmit={signupUser}>
              <h3 style={{ marginBottom: '20px', color: '#555' }}>
                Sign up as Admin
              </h3>
              <Row>
                <Col md={6}>
                  <Input
                    type="text"
                    label="First Name"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                </Col>

                <Col md={6}>
                  <Input
                    type="text"
                    label="Last Name"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                </Col>
              </Row>

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
                Signup
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
