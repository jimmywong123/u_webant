import intl from 'react-intl-universal';
import { string } from 'util_react_web';
const { getIntl } = string;

const config = {
  403: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg',
    title: '403',
    desc: getIntl(intl, 'base.403.cant.access', "Sorry, you don't have access to this page"),
  },
  404: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg',
    title: '404',
    desc: getIntl(intl, 'base.404.page.on.exist', "Sorry, the page you visited does not exist"),
  },
  500: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg',
    title: '500',
    desc: getIntl(intl, 'base.505.server.error', "Sorry, the server is reporting an error"),
  },
};

export default config;
