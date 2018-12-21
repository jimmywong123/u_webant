import React from 'react';
import intl from 'react-intl-universal';
import Link from 'umi/link';
import Exception from '@/components/Exception';
import { string } from 'util_react_web';

const { getIntl } = string;

const Exception500 = () => (
  <Exception
    type="500"
    linkElement={Link}
    backText={getIntl(intl, 'base.back.to.home', 'Back to home')}
  />
);

export default Exception500;
