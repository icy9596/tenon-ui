import './tag.less';

export interface TagProps {
  children: string;
}

const Tag = ({ children }: TagProps): JSX.Element => {
  return <span className="tenon-tag">{children}</span>;
};

export default Tag;
