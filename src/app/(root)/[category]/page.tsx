import { redirect } from 'next/navigation';

const CategoryPage = async () => {
  redirect('/shop');
  return null;
};

export default CategoryPage;
