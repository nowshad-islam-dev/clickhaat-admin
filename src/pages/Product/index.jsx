import { useState } from 'react';
import { Row, Col, Button, Modal, Form, Container } from 'react-bootstrap';
import Layout from '@/components/Layout';
import Input from '@/components/UI/Input';
import CategoryOptions from '@/components/Category/ExtractCategory';
import axiosInstance from '@/axios/axiosInstance';

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
    setProductImages((prev) => [...prev, ...files]);
  }

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
    productImages.forEach((img) => {
      form.append('picture', img);
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

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add a new product:</Modal.Title>
            </Modal.Header>

            <Form onSubmit={createProduct} encType='multipart/form-data'>
              <Modal.Body>
                <Input
                  type='text'
                  placeholder='Product Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  type='number'
                  placeholder='Product Price'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />

                <Input
                  type='number'
                  placeholder='Product Quantity'
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />

                <Input
                  type='textarea'
                  placeholder='Product Description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <Input
                  type='number'
                  placeholder='Discount Offer'
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                />

                <Form.Select
                  name='picture'
                  className='form-control'
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <CategoryOptions />
                </Form.Select>

                <Form.Label htmlFor='categoryImage' className='mt-1'>
                  Product Images
                </Form.Label>
                <Container>
                  {productImages.length > 0
                    ? productImages.map((pic, idx) => (
                        <div key={idx}>{pic.name}</div>
                      ))
                    : null}
                </Container>
                <Form.Control
                  type='file'
                  name='categoryImage'
                  id='categoryImage'
                  onChange={handleProductImage}
                />
              </Modal.Body>

              <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>
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
    </Layout>
  );
}
