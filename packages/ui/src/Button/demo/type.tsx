/**
 * description: 按钮有五种类型：主按钮、次按钮、虚线按钮、文本按钮和链接按钮。主按钮在同一个操作区域最多出现一次。
 */

import { Button } from 'c-ui';

export default () => {
  return (
    <div>
      <Button />
      <Button type="primary" />
    </div>
  );
};
