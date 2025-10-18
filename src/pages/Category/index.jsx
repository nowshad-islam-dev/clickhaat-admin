import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import Layout from '@/components/Layout';
import Input from '@/components/UI/Input';
import { getCategories } from '@/app/store/categorySlice';
import axiosInstance from '@/axios/axiosInstance';
import CategoryOptions from '@/components/Category/ExtractCategory';

export default function Category() {
  const { loading, category } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [parentId, setParentId] = useState('');
  const [categoryImage, setCategoryImage] = useState(undefined);

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(getCategories());
    }
  }, [loading, dispatch]);

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

  function handleClose() {
    setShow(false);
    setCategoryName('');
    setParentId('');
    setCategoryImage(undefined);
  }

  function handleCategoryImage(e) {
    setCategoryImage(e.target.files[0]);
  }

  async function createCategory(e) {
    e.preventDefault();
    if (!categoryName.trim()) {
      console.error('Category: Lacks required information.');
      return;
    }

    const form = new FormData();
    form.append('name', categoryName);
    if (parentId) form.append('parentId', parentId);
    if (categoryImage) form.append('image', categoryImage);

    const res = await axiosInstance.post('/category/create', form);
    console.log(res.data);
    if (res.status === 201) {
      handleClose();
      dispatch(getCategories());
    }
  }

  if (loading === 'pending') {
    return <div>Loading....</div>;
  }

  return (
    <Layout>
      <Row>
        <Col md={12}>
          <div className='d-md-flex w-100 p-2 justify-content-between'>
            <h2>Category</h2>
            <Button variant='dark' onClick={() => setShow(true)}>
              Add Category
            </Button>
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add a new category:</Modal.Title>
            </Modal.Header>

            <Form onSubmit={createCategory}>
              <Modal.Body>
                <Input
                  type='text'
                  placeholder='Category Name'
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                  }}
                />

                {/* Select parent ID for new  category */}
                <Form.Select
                  name='parentId'
                  className='form-control'
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                >
                  <CategoryOptions />
                </Form.Select>

                <Form.Label htmlFor='categoryImage' className='my-2'>
                  Category Image
                </Form.Label>
                <br />
                <Form.Control
                  type='file'
                  name='categoryImage'
                  id='categoryImage'
                  onChange={handleCategoryImage}
                />
              </Modal.Body>

              <Modal.Footer>
                <Button variant='secondary' onClick={() => setShow(false)}>
                  Cancel
                </Button>
                <Button type='submit' variant='primary'>
                  Add
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Col>
      </Row>

      <h5>List of added categories:</h5>
      <ul>{renderCategories(category)}</ul>
    </Layout>
  );
}
