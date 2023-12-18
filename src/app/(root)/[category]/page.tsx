import WIP from '@/components/UI/WIP';
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
    <div className="flex items-center justify-center">
      <WIP />
    </div>
  );
};

export default CategoryPage;
