import { render, screen } from '@testing-library/react';

import Tag from '../Tag';

const tagText = 'test';

describe('Tag', () => {
  it('render', () => {
    const { container } = render(<Tag>{tagText}</Tag>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('mount', () => {
    render(<Tag>{tagText}</Tag>);
    expect(screen.getByText(tagText)).toBeInTheDocument();
  });
});
