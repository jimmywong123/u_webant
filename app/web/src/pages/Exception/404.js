import React from 'react';
import intl from 'react-intl-universal';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception404 = () => (
  <Exception
    type="404"
    desc={intl.get('sorry,.the.page.you.')}
    linkElement={Link}
    backText={intl.get('back.to.home')}
  />
);

export default Exception404;
