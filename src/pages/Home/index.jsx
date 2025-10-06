import Layout from '../../components/Layout';
import { Container } from 'react-bootstrap';

export default function Home() {
  return (
    <Layout>
      <Container
        style={{ margin: '5rem', background: '#fff' }}
        className="text-center"
      >
        <h1>Welcome to Admin Dashboard</h1>
        <p>
          lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          euismod, urna eu tincidunt cursus, nisi erat facilisis enim. Curabitur
          ac velit nec sapien dictum tincidunt. Vivamus commodo, justo at dictum
          cursus, enim urna posuere erat.
        </p>
      </Container>
    </Layout>
  );
}
