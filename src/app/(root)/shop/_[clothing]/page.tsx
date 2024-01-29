import { db } from '@/lib/db';
import { clothing } from '@/lib/db/schema/clothing';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await db
    .select({
      name: clothing.name,
    })
    .from(clothing);

  return slugs.map((slug) => ({
    clothing: slug.name,
  }));
}

const page = async () => {
  return <div>page</div>;
};
export default page;
