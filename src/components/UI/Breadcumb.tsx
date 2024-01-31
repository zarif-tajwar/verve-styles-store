'use client';
import { capitalize, cn } from '@/lib/util';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useMemo } from 'react';

type Breadcumb = {
  customLabels?: Map<string, string>;
};

const pathNameToLabel = (str: string) => capitalize(str).replaceAll('-', ' ');

const Breadcumb = ({ customLabels }: Breadcumb) => {
  const pathname = usePathname();

  console.log(pathname, 'PATHNAME');

  const links = useMemo(() => {
    let lastDashIndex = 0;
    let hrefs: string[] = [];
    let labels: string[] = [];
    let currHref = '';
    let currLabel = '';

    for (let i = 0; i < pathname.length; i++) {
      const char = pathname.at(i);
      if (!char) continue;

      if (char === '/' && i !== 0) {
        const label = pathNameToLabel(currLabel);
        if (label !== Number.parseInt(label).toString()) {
          hrefs.push(currHref);
          labels.push(pathNameToLabel(currLabel));
        }
        lastDashIndex = i;
        currLabel = '';
      }

      if (char !== '/' && i !== 0) {
        currLabel += char;
      }

      currHref += char;
    }
    const label = pathNameToLabel(currLabel);
    if (label !== Number.parseInt(label).toString()) {
      hrefs.push(currHref);
      labels.push(pathNameToLabel(currLabel));
    }
    return { hrefs, labels };
  }, [pathname]);

  const linkCount = links.hrefs.length;

  return (
    <nav>
      <ul className="flex items-center gap-0.5 text-sm text-primary-400">
        {links.hrefs.map((href, i) => {
          return (
            <Fragment key={href}>
              <li>
                <Link
                  href={href}
                  className={cn(
                    'hover:text-primary-500',
                    href === pathname && 'font-medium text-primary-500',
                  )}
                >
                  {customLabels?.get(links.labels.at(i)!) || links.labels.at(i)}
                </Link>
              </li>
              {i !== linkCount - 1 && (
                <ChevronRight
                  width={14}
                  aria-hidden
                  height={14}
                  className="text-primary-300"
                />
              )}
            </Fragment>
          );
        })}
      </ul>
    </nav>
  );
};
export default Breadcumb;
