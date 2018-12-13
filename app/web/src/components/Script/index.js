import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

export default class Script extends PureComponent {

  static propTypes = {
    attributes: PropTypes.object, 
    onCreate: PropTypes.func,
    // eslint-disable-next-line react/require-default-props
    onError: PropTypes.func.isRequired,
    // eslint-disable-next-line react/require-default-props
    onLoad: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
  };

  static defaultProps = {
    attributes: {},
    onCreate: () => {},
    // eslint-disable-next-line react/default-props-match-prop-types
    onError: () => {},
    // eslint-disable-next-line react/default-props-match-prop-types
    onLoad: () => {},
  }

  // A dictionary mapping script URLs to a dictionary mapping
  // component key to component for all components that are waiting
  // for the script to load.
  static scriptObservers = {};

  // 特定的URL是否已经加载完成
  // this.constructor.scriptObservers[url][this.scriptLoaderId] = this.props;
  // 每一个URL对应于多个scriptLoaderId，但是只会检查一个是否已经加载完毕
  static loadedScripts = {};

  // this.constructor.loadedScripts[url] = true;
  static erroredScripts = {};

  // this.constructor.erroredScripts[url] = true;
  static idCount = 0;

  // 该组件已经被实例化了多少个对象
  constructor(props) {
    super(props);
    // eslint-disable-next-line no-plusplus
    this.scriptLoaderId = `id${this.constructor.idCount++}`; 
    // 1.如果某一个页面有多个该Script标签，那么其特定的this.scriptLoaderId都是唯一的
  }

  componentDidMount() {
    const { onError, onLoad, url } = this.props;
    // fix 1:如果该URL已经加载过了，然后又在页面其他地方要求加载，因为this.constructor.loadedScripts[url]已经被设置为true，那么直接调用onLoad方法
    if (this.constructor.loadedScripts[url]) {
      onLoad();
      return;
    }
    // fix 2:如果该URL已经加载过了，而且加载出错，然后又在页面其他地方要求加载，因为tthis.constructor.erroredScripts[url]已经被设置为true，那么直接调用onError方法
    if (this.constructor.erroredScripts[url]) {
      onError();
      return;
    }
    // If the script is loading, add the component to the script's observers
    // and return. Otherwise, initialize the script's observers with the component
    // and start loading the script.
    // fix 3:如果某一个URL已经在加载了，即this.constructor.scriptObservers[url]被设置为特定的值了，那么如果还要求该URL那么直接返回，防止一个组件被加载多次
    if (this.constructor.scriptObservers[url]) {
      this.constructor.scriptObservers[url][this.scriptLoaderId] = this.props;
      return;
    }
    // 8.this.constructor.scriptObservers用于注册某一个URL特定的对象,其值为为该组件添加的所有的props对象，而key为该组件实例的this.scriptLoaderId
    this.constructor.scriptObservers[url] = {
      [this.scriptLoaderId]: this.props
    };
    this.createScript();
  }

  componentWillUnmount() {
    const { url } = this.props;
    const observers = this.constructor.scriptObservers[url];
    // If the component is waiting for the script to load, remove the
    // component from the script's observers before unmounting the component.
    // componentWillUnmount只是卸载当前的组件实例而已，所以直接delete当前实例的this.scriptLoaderId
    if (observers) {
      delete observers[this.scriptLoaderId];
    }
  }

  createScript() {
    const { onCreate, url, attributes } = this.props;
    // 1.onCreate在script标签创建后被调用
    const script = document.createElement('script');
    onCreate();
    // add 'data-' or non standard attributes to the script tag
    // 2.所有attributes指定的属性都会被添加到script标签中
    if (attributes) {
      Object.keys(attributes).forEach(prop => script.setAttribute(prop, attributes[prop]));
    }
    script.src = url;
    // default async to true if not set with custom attributes
    // 3.如果script标签没有async属性，表示不是异步加载的
    if (!script.hasAttribute('async')) {
      script.async = 1;
    }
    // 5.shouldRemoveObserver(observers[key])用于移除特定的监听器并触发onLoad
    const callObserverFuncAndRemoveObserver = (shouldRemoveObserver) => {
      const observers = this.constructor.scriptObservers[url];
      // 监听当前URL的scriptObservers，然后获取该Observer的key，即对应于this.scriptLoaderId，每一个组件实例都是唯一的，一个URL可能多个this.scriptLoadedId相对应:
      // if (this.constructor.scriptObservers[url]) {
    //   this.constructor.scriptObservers[url][this.scriptLoaderId] = this.props;
    //   return;
    // }
      Object.keys(observers).forEach((key) => {
        // 如果某一个特定的key对应的，传入的observers[key]就是该组件实例的this.props
        if (shouldRemoveObserver(observers[key])) {
          delete this.constructor.scriptObservers[url][this.scriptLoaderId];
        }
      });
    };
    // 4.onload将该URL已经加载的状态设置为true
    script.onload = () => {
      this.constructor.loadedScripts[url] = true;
      callObserverFuncAndRemoveObserver((observer) => {
        // 6.调用用户自己的onLoad表示脚本加载完成
        observer.onLoad();
        return true;
      });
    }
    script.onerror = () => {
      this.constructor.erroredScripts[url] = true;
      callObserverFuncAndRemoveObserver((observer) => {
        // 7.调用用户自己的onError表示加载错误
        observer.onError();
        return true;
      });
    };
    document.body.appendChild(script);
  }

  render() {
    return (
      <div />
    );
  }
}
