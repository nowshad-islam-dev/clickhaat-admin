import { useState, useEffect } from 'react';
import { Table, Container, Pagination } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '@/app/store/productSlice';

export default function ProductTable() {
  const dispatch = useDispatch();
  const { loading, ids, entities } = useSelector((state) => state.product);
  const { page, limit, total } = useSelector(
    (state) => state.product.pagination
  );

  const [currentPage, setCurrentPage] = useState(page || 1);
  const totalPage = total > 0 ? Math.ceil(total / limit) : 0;

  // Fetch new products if currentPage changes
  useEffect(() => {
    dispatch(getProducts({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const handleClick = (pageNum) => {
    if (pageNum === currentPage) return; // Avoid duplicate request
    setCurrentPage(pageNum);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPage) setCurrentPage((prev) => prev + 1);
  };

  if (loading === 'pending') return <div>Loading....</div>;

  return (
    <Container>
      <Table className='responsive'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Offer</th>
          </tr>
        </thead>
        <tbody>
          {ids.map((id) => {
            const p = entities[id];
            return (
              <tr key={id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.quantity}</td>
                <td>{p.category.name}</td>
                <td>{p.offer}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className='justify-content-center mt-3'>
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
    </Container>
  );
}
