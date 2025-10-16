import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import Layout from '../../components/Layout';
import Input from '../../components/UI/Input';
import { getCategories } from '../../app/store/categorySlice';

export default function Category() {
  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = '';
  const { loading, category } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(getCategories());
    }
  }, [loading, dispatch]);

  if (loading === 'pending') {
    return <div>Loading....</div>;
  }

  const renderCategories = (category) => (
    <ul>
      {category.map((cat) => (
        <li key={cat.id}>
          {cat.name}
          {cat.children?.length > 0 && renderCategories(cat.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <Layout>
      <Row>
        <Col md={12}>
          <div className="d-md-flex w-100 p-2 justify-content-between">
            <h2>Category</h2>
            <Button variant="dark" onClick={() => setShow(true)}>
              Add Category
            </Button>
          </div>

          <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add a new category:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShow(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setShow(false)}>
                Add
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>

      <h5>List of added categories:</h5>
      <ul>{renderCategories(category)}</ul>
    </Layout>
  );
}
