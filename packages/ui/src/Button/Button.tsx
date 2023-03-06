import classnames from 'classnames';

import './button.less';

export type ButtonnType = 'primary' | 'default';

export interface ButtonProps {
  type?: ButtonnType;
}

const Button = ({ type = 'default' }: ButtonProps): JSX.Element => {
  const className = classnames(
    'btn',
    type === 'default' ? 'btn-default' : 'btn-primary',
  );
  return (
    <button className={className} type="button">
      Button
    </button>
  );
};

export default Button;
