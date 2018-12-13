import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';
import { stringify } from 'qs';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

const getUrl = () => `/Exception/403?${stringify({redirect: encodeURIComponent(window.location.href) })}`

export default ({ children }) => (
  <Authorized authority={children.props.route.authority} noMatch={<Redirect to={getUrl()} />}>
    {children}
  </Authorized>
);
