import { SVGProps } from 'react';

export type SearchParamsServer = {
  [key: string]: string | string[] | undefined;
};

export interface SvgIconProps extends SVGProps<SVGSVGElement> {}
