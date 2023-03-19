import { fireEvent, render, screen } from '@testing-library/react';
import Button from '../Button';

const btnText = 'test_btn';

describe('Button', () => {
  it('render', () => {
    const { container } = render(<Button>{btnText}</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('mount', () => {
    render(<Button>{btnText}</Button>);
    expect(screen.getByText(btnText)).toBeInTheDocument();
  });

  it('type', () => {
    // defualt
    const { rerender } = render(<Button>{btnText}</Button>);
    expect(screen.getByText(btnText)).toHaveClass('btn-default');

    // primary
    rerender(<Button type="primary">{btnText}</Button>);
    expect(screen.getByText(btnText)).toHaveClass('btn-primary');
  });

  it('onClick', () => {
    const handleClick = jest.fn();
    const { rerender } = render(
      <Button onClick={handleClick}>{btnText}</Button>,
    );
    fireEvent.click(screen.getByText(btnText));
    expect(handleClick).toBeCalled();
    expect(handleClick).toBeCalledTimes(1);

    // no call
    rerender(<Button>{btnText}</Button>);
    fireEvent.click(screen.getByText(btnText));
  });
});
