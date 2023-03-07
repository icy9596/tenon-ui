import classnames from 'classnames';

import './button.less';

export type ButtonnType = 'primary' | 'default';

export interface ButtonProps {
  type?: ButtonnType;
  onClick?: () => void;
  children: string;
}

const Button = ({
  type = 'default',
  onClick,
  children,
}: ButtonProps): JSX.Element => {
  const className = classnames(
    'btn',
    type === 'default' ? 'btn-default' : 'btn-primary',
  );

  const handleClick = () => {
    onClick?.();
  };

  return (
    <button className={className} type="button" onClick={handleClick}>
      {children}
    </button>
  );
};

export default Button;
