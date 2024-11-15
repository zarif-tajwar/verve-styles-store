import { SVGProps } from 'react';

export type SearchParamsServer = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export interface SvgIconProps extends SVGProps<SVGSVGElement> {}
