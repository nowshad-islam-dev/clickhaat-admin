import { useState } from 'react';
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  Container,
  InputGroup,
  Image,
} from 'react-bootstrap';
import Layout from '@/components/Layout';
import CategoryOptions from '@/components/Category/ExtractCategory';
import axiosInstance from '@/axios/axiosInstance';
import ProductTable from '@/components/Product/ProductTable';
import { X } from 'lucide-react';
import './style.css';

export default function Product() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [offer, setOffer] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
    setName('');
    setDescription('');
    setCategoryId('');
    setPrice('');
    setQuantity('');
    setOffer('');
    setProductImages([]);
  }

  function handleProductImage(e) {
    const files = Array.from(e.target.files);

    // Maximum 5 images can belong to a product
    if (productImages.length + files.length > 5) {
      alert('Limit exceeded.');
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setProductImages((prev) => [...prev, ...newImages]);
  }

  const handleRemoveImage = (idx) => {
    setProductImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  async function createProduct(e) {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !categoryId) {
      console.error('Product: Lacks required information.');
      return;
    }

    const form = new FormData();
    form.append('name', name);
    form.append('description', description);
    form.append('category', categoryId);
    if (price) form.append('price', price);
    if (quantity) form.append('quantity', quantity);
    if (offer) form.append('offer', offer);
    productImages.forEach((imgObj) => {
      form.append('picture', imgObj.file);
    });

    const res = await axiosInstance.post('/product/create', form);
    if (res.status === 201) {
      handleClose();
    }
    console.log(res.data);
  }

  return (
    <Layout>
      <Row>
        <Col md={12}>
          <div className='d-md-flex w-100 p-2 justify-content-between'>
            <h2>Product</h2>
            <Button variant='dark' onClick={() => setShow(true)}>
              Add Product
            </Button>
          </div>

          <Modal show={show} onHide={handleClose} size='lg' centered>
            <Modal.Header closeButton>
              <Modal.Title>Add New Product</Modal.Title>
            </Modal.Header>

            <Form onSubmit={createProduct} encType='multipart/form-data'>
              <Modal.Body>
                <Form.Group className='mb-3'>
                  <Form.Label className='fw-semibold'>Name</Form.Label>
                  <Form.Control
                    type='text'
                    name='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Enter product name'
                  />
                </Form.Group>

                <Row>
                  <Col md='6'>
                    <Form.Group className='mb-3'>
                      <Form.Label className='fw-semibold'>Price</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type='number'
                          name='price'
                          value={price}
                          min='0'
                          step='0.01'
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder='0.00'
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className='mb-3'>
                      <Form.Label className='fw-semibold'>Offer</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type='number'
                          name='offer'
                          value={offer}
                          onChange={(e) => setOffer(e.target.value)}
                          min='0'
                          max='100'
                          placeholder='0'
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md='5'>
                    <Form.Group className='mb-3'>
                      <Form.Label className='fw-semibold'>Quantity</Form.Label>
                      <Form.Control
                        type='number'
                        name='quantity'
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min='0'
                        placeholder='Quantity'
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label className='fw-semibold'>Category</Form.Label>
                      <Form.Select
                        name='category'
                        className='form-control'
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                      >
                        <CategoryOptions />
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className='mb-3'>
                  <Form.Label className='fw-semibold'>Description</Form.Label>
                  <Form.Control
                    as='textarea'
                    name='description'
                    rows='4'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Write a short description...'
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label className='mt-1 fw-semibold'>
                    Product Images
                  </Form.Label>
                  <Form.Control
                    type='file'
                    multiple
                    accept='image/*'
                    name='categoryImage'
                    onChange={handleProductImage}
                    disabled={productImages.length >= 5}
                  />

                  {productImages.length > 0 && (
                    <Container className='mt-3'>
                      <div className='d-flex gap-3 image-container justify-content-center'>
                        {productImages.map((img, idx) => (
                          <div key={idx} className='border '>
                            <div className='position-relative border rounded image-wrapper'>
                              <Image
                                src={img.preview}
                                alt={img.name}
                                fluid
                                className='preview-image'
                              />
                              <Button
                                variant='danger'
                                size='sm'
                                className='remove-btn position-absolute top-0 end-0 py-0 rounded-circle'
                                onClick={() => handleRemoveImage(idx)}
                              >
                                {X}
                              </Button>
                            </div>
                            <div className='text-truncate small mt-1'>
                              {img.name?.length <= 18
                                ? img.name
                                : `${img.name.slice(0, 15)}...`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Container>
                  )}
                </Form.Group>
              </Modal.Body>

              <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>
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
      <Row>
        <Col>
          <ProductTable />
        </Col>
      </Row>
    </Layout>
  );
}
