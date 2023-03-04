import type { ReactElement } from 'react';
import { cloneElement } from 'react';

import './icon.less';

interface IconProps {
  children: ReactElement;
}

const Icon = (props: IconProps): JSX.Element => {
  const cloned = cloneElement(props.children, {
    style: { fill: 'currentColor' },
  });
  return <span className="icon">{cloned}</span>;
};

export default Icon;
