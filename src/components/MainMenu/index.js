import React, { Component } from 'react';

import { Menu, Icon, Layout } from 'antd';
import { getMenu } from '@/services/base';
import intl from 'react-intl-universal';
import style from './index.less';

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const { Header } = Layout;

const getLocale = () => localStorage.getItem('lang_type') || 'en-US';

class MainMenu extends Component {
  state = {
    initDone: false,
    canChangeLang: getLocale() === 'en-US' ? 'zh-CN' : 'en-US',
  };

  componentDidMount() {
    this.loadMenu();
  }

  handleClick = e => {
    const obj = {
      ...this.changeLang(e.key),
      current: e.key,
    };
    this.setState(obj);
  };

  changeLang = changeTo => {
    if (changeTo === 'en-US' || changeTo === 'zh-CN') {
      localStorage.setItem('lang_type', changeTo);
    }
    return {
      canChangeLang: getLocale() === 'en-US' ? 'zh-CN' : 'en-US',
    };
  };

  getMenuItem = (item, i) => {
    if (item.menuItemGroup) {
      return (
        <MenuItemGroup title={intl.get(item.titleKey)} key={`menuItemGroup${i}`}>
          {item.menuItemGroup.map((data, j) => this.getMenuItem(data, j))}
        </MenuItemGroup>
      );
    }
    if (item.subMenu) {
      return (
        <SubMenu
          key={`subMenu${i}`}
          title={
            <span className="submenu-title-wrapper">
              {item.icon && <Icon type={item.icon} />} {intl.get(item.titleKey)}
            </span>
          }
        >
          {item.subMenu.map((data, j) => this.getMenuItem(data, j))}
        </SubMenu>
      );
    }
    if (item.url) {
      return (
        <Menu.Item key={item.key}>
          <a {...item.url}>
            {item.icon && <Icon type={item.icon} />} {intl.get(item.titleKey)}
          </a>
        </Menu.Item>
      );
    }
    return (
      <Menu.Item key={item.key}>
        {item.icon && <Icon type={item.icon} />} {intl.get(item.titleKey)}
      </Menu.Item>
    );
  };

  loadMenu() {
    getMenu().then(res => {
      const menuObj = res.data;
      const updateState = {
        initDone: true,
      };
      let { current } = this.state;
      if (menuObj && menuObj.left) {
        updateState.leftMenuLsit = menuObj.left;
        if (!current) {
          current = menuObj.left[0].titleKey;
        }
      }
      if (menuObj && menuObj.right) {
        updateState.rightMenuLsit = menuObj.right;
        if (!current) {
          current = menuObj.right[0].titleKey;
        }
      }
      this.setState(updateState);
    });
  }

  render() {
    const { initDone, current, leftMenuLsit, rightMenuLsit, canChangeLang } = this.state;
    return (
      initDone && (
        <Header className={style.header}>
          <Menu
            onClick={this.handleClick}
            selectedKeys={[current]}
            mode="horizontal"
            style={{ float: 'left' }}
          >
            {leftMenuLsit && leftMenuLsit.map(item => this.getMenuItem(item))}
          </Menu>
          <div className="logo" />

          <Menu
            onClick={this.handleClick}
            selectedKeys={[current]}
            mode="horizontal"
            style={{ float: 'right' }}
          >
            {rightMenuLsit && rightMenuLsit.map(item => this.getMenuItem(item))}
            <Menu.Item key={canChangeLang}>
              <a href={`?lang=${canChangeLang}`}>
                <Icon type="global" />
                {intl.get(canChangeLang)}
              </a>
            </Menu.Item>
          </Menu>
        </Header>
      )
    );
  }
}

export default MainMenu;
