import React from 'react';
import intl from 'react-intl-universal';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception500 = () => (
  <Exception
    type="500"
    desc={intl.get('sorry,.the.server.is')}
    linkElement={Link}
    backText={intl.get('back.to.home')}
  />
);

export default Exception500;
