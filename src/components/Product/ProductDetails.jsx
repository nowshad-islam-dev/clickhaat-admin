import { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Button,
  Image,
  Row,
  Col,
  InputGroup,
} from 'react-bootstrap';
import CategoryOptions from '../Category/ExtractCategory';

export default function ProductDetails({ product, mode, show, onClose }) {
  const [formData, setFormData] = useState({
    name: product.name || '',
    price: product.price || '0',
    description: product.description || '',
    quantity: product.quantity || '0',
    category: product.category?.id || '',
    offer: product.offer || '0',
  });

  useEffect(() => {
    setFormData({
      name: product.name || '',
      price: product.price || '0',
      description: product.description || '',
      quantity: product.quantity || '0',
      category: product.category?.id || '',
      offer: product.offer || '0',
    });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log(formData);
    onClose();
  };

  const isViewMode = mode === 'view';

  return (
    <Modal show={show} onHide={onClose} size='lg' centered>
      <Modal.Header closeButton className='border-0'>
        <div className='d-flex flex-column'>
          <Modal.Title className='mb-0'>
            {isViewMode ? 'Product Details' : 'Edit Product'}
          </Modal.Title>
          <small className='text-muted'>
            {product.name}
            {product.category?.name && (
              <span className='badge bg-secondary ms-2'>
                {product.category.name}
              </span>
            )}
            {product.offer > 0 && (
              <span className='badge bg-success ms-2'>
                {product.offer}% off
              </span>
            )}
          </small>
        </div>
      </Modal.Header>

      <Modal.Body>
        <Row className='g-4'>
          <Col md={7}>
            <Form>
              <Form.Group className='mb-3'>
                <Form.Label className='fw-semibold'>Name</Form.Label>
                {isViewMode ? (
                  <div className='form-control-plaintext p-2 border rounded-2'>
                    {formData.name || '—'}
                  </div>
                ) : (
                  <Form.Control
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Enter product name'
                  />
                )}
              </Form.Group>

              <Row className='g-2'>
                <Col>
                  <Form.Group className='mb-3'>
                    <Form.Label className='fw-semibold'>Price</Form.Label>
                    {isViewMode ? (
                      <div className='form-control-plaintext p-2 border rounded-2'>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(Number(formData.price || 0))}
                      </div>
                    ) : (
                      <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type='number'
                          name='price'
                          value={formData.price}
                          onChange={handleChange}
                          min='0'
                          step='0.01'
                          placeholder='0.00'
                        />
                      </InputGroup>
                    )}
                  </Form.Group>
                </Col>

                <Col md='auto' style={{ minWidth: 150 }}>
                  <Form.Group className='mb-3'>
                    <Form.Label className='fw-semibold'>Offer (%)</Form.Label>
                    {isViewMode ? (
                      <div className='form-control-plaintext p-2 border rounded-2'>
                        {formData.offer ? `${formData.offer}%` : '—'}
                      </div>
                    ) : (
                      <InputGroup>
                        <Form.Control
                          type='number'
                          name='offer'
                          value={formData.offer}
                          onChange={handleChange}
                          min='0'
                          max='100'
                          placeholder='0'
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className='mb-3'>
                <Form.Label className='fw-semibold'>Description</Form.Label>
                {isViewMode ? (
                  <div
                    className='form-control-plaintext p-2 border rounded-2'
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {formData.description || 'No description provided.'}
                  </div>
                ) : (
                  <Form.Control
                    as='textarea'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder='Write a short description...'
                  />
                )}
              </Form.Group>

              <Row className='g-2 '>
                <Col>
                  <Form.Group className='mb-3'>
                    <Form.Label className='fw-semibold'>Quantity</Form.Label>
                    {isViewMode ? (
                      <div className='d-flex flex-column'>
                        <div className='form-control-plaintext p-2 border rounded-2'>
                          {formData.quantity}
                        </div>
                        <div className='mt-2'>
                          <div className='progress' style={{ height: 8 }}>
                            <div
                              className='progress-bar'
                              role='progressbar'
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(0, Number(formData.quantity || 0))
                                )}%`,
                              }}
                              aria-valuenow={formData.quantity}
                              aria-valuemin='0'
                              aria-valuemax='100'
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Form.Control
                        type='number'
                        name='quantity'
                        value={formData.quantity}
                        onChange={handleChange}
                        min='0'
                        placeholder='0'
                      />
                    )}
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className='mb-3'>
                    <Form.Label className='fw-semibold'>Category</Form.Label>
                    {isViewMode ? (
                      <div className='form-control-plaintext p-2 border rounded-2'>
                        {product.category?.name || '—'}
                      </div>
                    ) : (
                      <Form.Select
                        name='category'
                        className='form-control'
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <CategoryOptions />
                      </Form.Select>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {!isViewMode && (
                <div className='d-flex justify-content-end gap-2'>
                  <Button
                    variant='outline-secondary'
                    onClick={() =>
                      setFormData({
                        name: product.name || '',
                        price: product.price || 0,
                        description: product.description || '',
                        quantity: product.quantity || 0,
                        category: product.category?.name || '',
                        offer: product.offer || 0,
                      })
                    }
                  >
                    Reset
                  </Button>
                </div>
              )}
            </Form>
          </Col>

          <Col md={5} className='d-flex flex-column align-items-center'>
            <div className='w-100 mb-2 text-center'>
              {product.picture && product.picture.length > 1 ? (
                <div
                  id='productImages'
                  className='carousel slide'
                  data-bs-ride='carousel'
                >
                  <div className='carousel-inner'>
                    {product.picture.map((p, idx) => (
                      <div
                        key={idx}
                        className={`carousel-item ${idx === 0 ? 'active' : ''}`}
                      >
                        <Image
                          src={p.url}
                          fluid
                          rounded
                          style={{
                            width: 400,
                            height: 200,
                            objectFit: 'cover',
                            margin: '0 auto',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className='carousel-control-prev'
                    type='button'
                    data-bs-target='#productImages'
                    data-bs-slide='prev'
                  >
                    <span
                      className='carousel-control-prev-icon'
                      aria-hidden='true'
                    />
                    <span className='visually-hidden'>Previous</span>
                  </button>
                  <button
                    className='carousel-control-next'
                    type='button'
                    data-bs-target='#productImages'
                    data-bs-slide='next'
                  >
                    <span
                      className='carousel-control-next-icon'
                      aria-hidden='true'
                    />
                    <span className='visually-hidden'>Next</span>
                  </button>
                </div>
              ) : product.picture && product.picture.length === 1 ? (
                <Image
                  src={product.picture[0].url}
                  fluid
                  rounded
                  style={{ maxHeight: 220, objectFit: 'cover' }}
                />
              ) : (
                <div
                  className='border rounded-2 d-flex align-items-center justify-content-center'
                  style={{ height: 220 }}
                >
                  <small className='text-muted'>No image available</small>
                </div>
              )}
            </div>

            <div className='w-100'>
              <div className='d-flex justify-content-between align-items-center mb-1'>
                <small className='text-muted'>Price</small>
                <div>
                  {product.offer > 0 ? (
                    <>
                      <small className='text-muted text-decoration-line-through me-2'>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(Number(formData.price || 0))}
                      </small>
                      <strong className='text-success'>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(
                          Number(formData.price || 0) *
                            (1 - Number(formData.offer || 0) / 100)
                        )}
                      </strong>
                    </>
                  ) : (
                    <strong>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(Number(formData.price || 0))}
                    </strong>
                  )}
                </div>
              </div>

              <div className='d-flex justify-content-between align-items-center'>
                <small className='text-muted'>Availability</small>
                <span
                  className={`badge ${
                    formData.quantity > 0 ? 'bg-success' : 'bg-danger'
                  }`}
                >
                  {formData.quantity > 0 ? 'In stock' : 'Out of stock'}
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className='border-0'>
        <Button variant='secondary' onClick={onClose}>
          Close
        </Button>
        {!isViewMode && (
          <Button variant='primary' onClick={handleSave}>
            Save Changes
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
