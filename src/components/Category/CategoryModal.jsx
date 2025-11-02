import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Form, Container, Button, Image } from 'react-bootstrap';
import { X } from 'lucide-react';
import CategoryOptions from './ExtractCategory';
import { createCategory, updateCategory } from '@/app/store/categorySlice';

export default function CategoryModal({ show, setShow, task, category }) {
  const dispatch = useDispatch();
  const isAddMode = task === 'add';
  const title = isAddMode ? 'Add a new category:' : 'Edit category:';

  // Local state
  const [categoryName, setCategoryName] = useState('');
  const [parentId, setParentId] = useState('');
  const [categoryImage, setCategoryImage] = useState(undefined);

  // Populate form when editing
  useEffect(() => {
    if (!isAddMode && category) {
      setCategoryName(category.name || '');
      setParentId(category.parentId || '');
      setCategoryImage(
        category.image
          ? {
              preview: category.image.url,
              name: 'category image',
            }
          : undefined
      );
    } else {
      setCategoryName('');
      setParentId('');
      setCategoryImage(undefined);
    }
  }, [category, isAddMode, show]);

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

  const handleRemoveImage = () => {
    if (categoryImage?.preview && categoryImage.file) {
      URL.revokeObjectURL(categoryImage.preview);
    }
    setCategoryImage(undefined);
  };

  async function handleCreateCategory(e) {
    e.preventDefault();
    if (!categoryName.trim()) {
      console.error('Category: Missing name.');
      return;
    }

    const form = new FormData();
    form.append('name', categoryName);
    if (parentId) form.append('parentId', parentId);
    if (categoryImage?.file) form.append('image', categoryImage.file);

    dispatch(createCategory(form));
    handleClose();
  }

  async function handleUpdateCategory(e) {
    e.preventDefault();
    if (!category?._id) {
      console.error('No category ID provided for update.');
      return;
    }
    const form = new FormData();
    if (categoryName) form.append('name', categoryName);
    if (parentId) form.append('parentId', parentId);
    if (categoryImage?.file) form.append('image', categoryImage.file);
    dispatch(
      updateCategory({ categoryId: category._id, updatedCategoryData: form })
    );
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={isAddMode ? handleCreateCategory : handleUpdateCategory}>
        <Modal.Body>
          {/* Category Name */}
          <Form.Group className='mb-3'>
            <Form.Label className='mt-1 fw-semibold'>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter category name'
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Form.Group>

          {/* Parent Category */}
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

          {/* Image Upload (visible for both add and edit) */}
          <Form.Group>
            <Form.Label className='mt-1 fw-semibold'>Category Image</Form.Label>
            <br />
            <Form.Control
              type='file'
              name='categoryImage'
              onChange={handleCategoryImage}
            />
          </Form.Group>

          {/* Image Preview */}
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
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button type='submit' variant='primary'>
            {isAddMode ? 'Add Category' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
