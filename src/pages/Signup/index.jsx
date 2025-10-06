import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Layout from '../../components/Layout';
import Input from '../../components/UI/Input';

export default function Signup() {
  return (
    <Layout>
      <Container>
        <Row style={{ marginTop: '60px' }}>
          <Col md={{ span: 6, offset: 3 }}>
            <Form>
              <h3 style={{ marginBottom: '20px', color: '#555' }}>
                Sign up as Admin
              </h3>
              <Row>
                <Col md={6}>
                  <Input
                    type="text"
                    label="First Name"
                    placeholder="First Name"
                    value=""
                    onChange={() => {}}
                  />
                </Col>

                <Col md={6}>
                  <Input
                    type="text"
                    label="Last Name"
                    placeholder="Last Name"
                    value=""
                    onChange={() => {}}
                  />
                </Col>
              </Row>

              <Input
                type="email"
                label="Email"
                placeholder="Email"
                value=""
                onChange={() => {}}
              />

              <Input
                type="password"
                label="Password"
                placeholder="Password"
                value=""
                onChange={() => {}}
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
