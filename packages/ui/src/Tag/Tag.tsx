import './tag.less';

export interface TagProps {
  children: string;
}

const Tag = ({ children }: TagProps): JSX.Element => {
  console.log('test tag');
  return <span className="cui-tag">{children}</span>;
};

export default Tag;
