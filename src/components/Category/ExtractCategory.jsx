import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories } from '@/app/store/categorySlice';

export const extractCategories = (category, result = []) => {
  for (let cat of category) {
    result.push({ _id: cat._id, name: cat.name });
    if (cat.children?.length > 0) {
      extractCategories(cat.children, result);
    }
  }
  return result;
};

export default function CategoryOptions() {
  const dispatch = useDispatch();
  const { loading, category } = useSelector((state) => state.category);

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(getCategories());
    }
  }, [loading, dispatch]);

  const categoryOptions = useMemo(
    () => extractCategories(category),
    [category]
  );

  return (
    <>
      <option value='' disabled>
        Select parent category
      </option>
      {categoryOptions.map((cat) => (
        <option key={cat._id} value={cat._id}>
          {cat.name}
        </option>
      ))}
    </>
  );
}
