import { parse } from 'qs';
import config from './config';
import request from './request';
import LS from 'util_storage';
import Delay from './delay';
import { where, url } from 'util_react_web';

const { getPageQuery } = url;

module.exports = {
  config,
  request,
  getPageQuery,
  LS,
  Delay,
  where,
};
