import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  Container,
  Image,
} from 'react-bootstrap';
import Layout from '@/components/Layout';
import { getCategories } from '@/app/store/categorySlice';
import axiosInstance from '@/axios/axiosInstance';
import CategoryOptions from '@/components/Category/ExtractCategory';
import { X } from 'lucide-react';

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
    <ul className='list-group list-group-flush ms-2'>
      {category.map((cat) => (
        <li
          key={cat.id}
          className='list-group-item border-0 ps-3 py-1 d-flex flex-column'
        >
          <div className='fw-semibold text-dark'>{cat.name}</div>

          {cat.children?.length > 0 && (
            <div className='ms-3 mt-1 border-start ps-2'>
              {renderCategories(cat.children)}
            </div>
          )}
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
    const file = e.target.files[0];
    if (file) {
      const newImage = {
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      };
      setCategoryImage(newImage);
    }
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
    if (categoryImage?.file) form.append('image', categoryImage.file);

    const res = await axiosInstance.post('/category/create', form);
    console.log(res.data);
    if (res.status === 201) {
      handleClose();
      dispatch(getCategories());
    }
  }

  const handleRemoveImage = () => {
    if (categoryImage?.preview) {
      // Revoke object URL to prevent memory leak
      URL.revokeObjectURL(categoryImage.preview);
    }
    setCategoryImage(undefined);
  };

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

          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add a new category:</Modal.Title>
            </Modal.Header>

            <Form onSubmit={createCategory}>
              <Modal.Body>
                <Form.Group className='mb-3'>
                  <Form.Label className='mt-1 fw-semibold'>Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter category name'
                    value={categoryName}
                    onChange={(e) => {
                      setCategoryName(e.target.value);
                    }}
                  />
                </Form.Group>

                {/* Select parent ID for new  category */}
                <Form.Group>
                  <Form.Label className='mt-1 fw-semibold'>
                    Parent Category
                  </Form.Label>
                  <Form.Select
                    name='parentId'
                    className='form-control'
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                  >
                    <CategoryOptions />
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label className='mt-1 fw-semibold'>
                    Category Image
                  </Form.Label>
                  <br />
                  <Form.Control
                    type='file'
                    name='categoryImage'
                    onChange={handleCategoryImage}
                  />
                </Form.Group>

                {/* Image preview */}
                {categoryImage?.preview && (
                  <Container
                    className='d-flex-column border mt-2'
                    style={{ width: '140px' }}
                  >
                    <div className='position-relative rounded image-wrapper'>
                      <Image
                        src={categoryImage.preview}
                        alt={categoryImage.name}
                        fluid
                      />
                      <Button
                        variant='danger'
                        size='sm'
                        className='remove-btn position-absolute top-0 end-0 py-0 rounded-circle'
                        onClick={handleRemoveImage}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                    <div className='text-truncate small mt-1'>
                      {categoryImage.name?.length <= 18
                        ? categoryImage.name
                        : `${categoryImage.name.slice(0, 15)}...`}
                    </div>
                  </Container>
                )}
              </Modal.Body>

              <Modal.Footer>
                <Button variant='secondary' onClick={() => setShow(false)}>
                  Cancel
                </Button>
                <Button type='submit' variant='primary'>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Col>
      </Row>

      <Container className='mt-3'>
        <h5 className='mb-3'>List of added categories:</h5>
        {category.length > 0 ? (
          renderCategories(category)
        ) : (
          <p className='text-muted'>No categories found.</p>
        )}
      </Container>
    </Layout>
  );
}
