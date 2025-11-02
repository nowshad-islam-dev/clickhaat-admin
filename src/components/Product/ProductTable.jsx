import { useState, useEffect } from 'react';
import { Table, Container, Pagination } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { SquarePen, Eye, Trash } from 'lucide-react';
import {
  productSelectors,
  getProducts,
  deleteProduct,
  setPagination,
} from '@/app/store/productSlice';
import ProductDetails from './ProductDetails';

export default function ProductTable() {
  const dispatch = useDispatch();
  const products = useSelector(productSelectors.selectAll);
  const { loading, error, pagination } = useSelector((state) => state.product);
  const { total, page: currentPage, limit } = pagination;
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // view or edit
  const totalPage = total > 0 ? Math.ceil(total / limit) : 0;

  // Fetch new products if currentPage changes
  useEffect(() => {
    dispatch(getProducts({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const handleClick = (pageNum) => {
    if (pageNum === currentPage) return; // Avoid duplicate request
    dispatch(setPagination({ page: pageNum }));
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(setPagination({ page: currentPage - 1 }));
    }
  };

  const handleNext = () => {
    if (currentPage < totalPage) {
      dispatch(setPagination({ page: currentPage + 1 }));
    }
  };

  const handleOpenModal = (product, mode) => {
    setSelectedProduct(product);
    setModalMode(mode);
    setShowProductDetail(true);
  };

  const handleCloseModal = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
    setModalMode('view');
  };

  const handleDelete = (productId) => {
    const isConfirmed = window.confirm(
      'Do you really want to delete this product?'
    );
    if (!isConfirmed) return;
    dispatch(deleteProduct(productId));
  };

  if (loading === 'pending') return <div>Loading....</div>;

  // helper to truncate in the middle, showing start and end with a "...." in between
  const middleTruncate = (str = '', maxLength = 20) => {
    const ell = '....';
    if (str.length <= maxLength) return str;
    const chars = maxLength - ell.length;
    const front = Math.ceil(chars / 2);
    const back = Math.floor(chars / 2);
    return `${str.slice(0, front)}${ell}${str.slice(str.length - back)}`;
  };

  return (
    <Container className='d-flex flex-column min-vh-100 py-3'>
      <div className='table-responsive mb-3 flex-grow-1'>
        <Table className='table-hover table-striped align-middle'>
          <thead className='table-light'>
            <tr>
              <th style={{ minWidth: 200 }}>Name</th>
              <th>Price ($)</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>Offer</th>
              <th className='text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td
                  className='text-truncate'
                  style={{ maxWidth: 220 }}
                  title={p.name}
                >
                  {middleTruncate(p.name || '', 20)}
                </td>
                <td>${p.price}</td>
                <td>{p.quantity}</td>
                <td>{p.category?.name}</td>
                <td>
                  {p.offer ? (
                    <span className='badge bg-info text-dark'>{p.offer}</span>
                  ) : (
                    <span className='text-muted small'>—</span>
                  )}
                </td>
                <td className='text-center'>
                  <SquarePen
                    size={18}
                    color='#555'
                    className='me-2 text-muted'
                    role='button'
                    title='Edit'
                    onClick={() => handleOpenModal(p, 'edit')}
                  />
                  <Eye
                    size={18}
                    color='#555'
                    className='me-2 text-muted'
                    role='button'
                    title='View'
                    onClick={() => handleOpenModal(p, 'view')}
                  />
                  <Trash
                    size={18}
                    color='#555'
                    className='me-2 text-muted'
                    role='button'
                    title='Delete'
                    onClick={() => handleDelete(p._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetails
          show={showProductDetail}
          product={selectedProduct}
          mode={modalMode}
          onClose={handleCloseModal}
        />
      )}

      {/* Pagination - pinned to bottom of container */}
      <div className='mt-auto'>
        <Pagination className='justify-content-center mb-0'>
          <Pagination.Prev onClick={handlePrev} disabled={currentPage === 1} />
          {Array.from({ length: totalPage }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <Pagination.Item
                active={pageNum === currentPage}
                key={idx}
                onClick={() => handleClick(pageNum)}
              >
                {pageNum}
              </Pagination.Item>
            );
          })}
          <Pagination.Next
            onClick={handleNext}
            disabled={currentPage === totalPage}
          />
        </Pagination>
      </div>
    </Container>
  );
}
