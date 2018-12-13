import React from 'react';
import intl from 'react-intl-universal';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception403 = () => (
  <Exception
    type="403"
    desc={intl.get("sorry,.you.don't.hav") || ''}
    linkElement={Link}
    backText={intl.get('back.to.home') || ''}
  />
);

export default Exception403;
