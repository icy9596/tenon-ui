import classnames from 'classnames';

import './button.less';

type BtnType = 'primary' | 'default';

interface BaseButtonProps {
  type?: BtnType;
}

const Button = ({ type = 'default' }: BaseButtonProps): JSX.Element => {
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
