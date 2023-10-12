import { db } from '@/lib/db';
import { clothing } from '@/lib/db/schema/clothing';
import { makeValidURL } from '@/lib/util';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await db
    .select({
      name: clothing.name,
    })
    .from(clothing);

  return slugs.map((slug) => ({
    category: makeValidURL(slug.name),
  }));
}

interface PageProps {
  params: { category: string };
}

const CategoryPage = async ({ params }: PageProps) => {
  return (
    <div>
      <div>Params: {params.category}</div>
    </div>
  );
};

export default CategoryPage;
