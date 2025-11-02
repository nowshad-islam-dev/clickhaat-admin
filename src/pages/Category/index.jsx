import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Container } from 'react-bootstrap';
import Layout from '@/components/Layout';
import { getCategories, deleteCategory } from '@/app/store/categorySlice';
import { Trash, SquarePen } from 'lucide-react';
import './style.css';
import CategoryModal from '@/components/Category/CategoryModal';

export default function Category() {
  const { loading, category } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [task, setTask] = useState('');
  const [categoryForModal, setCategoryForModal] = useState(null);

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(getCategories());
    }
  }, [loading, dispatch]);

  const renderCategories = (category) => (
    <ul className='list-group list-group-flush ms-2'>
      {category.map((cat) => (
        <li
          key={cat._id}
          className='list-group-item border-0 ps-3 py-1 d-flex flex-column'
        >
          <div className='fw-semibold text-dark category-name-container'>
            {cat.name}

            <Trash
              size={16}
              color='#555'
              className='me-2 text-muted category-action-button'
              role='button'
              title='Delete'
              onClick={() => handleDelete(cat.id)}
            />

            <SquarePen
              size={16}
              color='#555'
              className='me-2 text-muted category-action-button'
              role='button'
              title='Edit'
              onClick={() => handleOpenEditModal(cat)}
            />
          </div>

          {cat.children?.length > 0 && (
            <div className='ms-3 mt-1 border-start ps-2'>
              {renderCategories(cat.children)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const handleDelete = async (categoryId) => {
    dispatch(deleteCategory(categoryId));
  };

  const handleOpenAddModal = () => {
    setTask('add');
    setShow(true);
  };

  const handleOpenEditModal = (category) => {
    setTask('edit');
    setShow(true);
    setCategoryForModal(category);
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
            <Button variant='dark' onClick={handleOpenAddModal}>
              Add Category
            </Button>
          </div>
          <CategoryModal
            task={task}
            show={show}
            setShow={setShow}
            category={categoryForModal}
          />
        </Col>

        <Col>
          <Container className='mt-3'>
            <h5 className='mb-3'>List of added categories:</h5>
            {category.length > 0 ? (
              renderCategories(category)
            ) : (
              <p className='text-muted'>No categories found.</p>
            )}
          </Container>
        </Col>
      </Row>
    </Layout>
  );
}
