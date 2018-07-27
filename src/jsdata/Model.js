/* eslint-disable no-param-reassign */
import Vue from 'vue';
import { serverDateTimeFormat } from '@/config/moments';
import store from './store';

class Model {

  constructor(config) {

    this.name = config.name;
    this.store = store;
    this.mapper = store.defineMapper(this.name, { notify: false, ...config });
    this.offs = {};

  }

  create(params) {

    if (!params.deviceCts) {

      params.deviceCts = serverDateTimeFormat();

    }

    return this.store.create(this.name, params);
  }

  get(id) {
    return this.store.get(this.name, id);
  }

  find(id, options) {
    return this.store.find(this.name, id, options);
  }

  findAll(query, options) {
    return this.store.findAll(this.name, query, options);
  }

  filter(query) {
    return Object.seal(this.store.filter(this.name, query));
  }

  remove(item) {
    return this.store.remove(this.name, item[this.mapper.idAttribute]);
  }

  mon(event, callback) {
    const listener = (name, data) => name === this.name && callback(name, data);
    this.store.on(event, listener);
    return () => this.store.off(event, listener);
  }

  bind(component) {

    const cid = componentId(component);

    const onDataChange = () => {
      setTimeout(() => component.$forceUpdate());
    };

    this.offs[cid] = this.offs[cid] || {};
    const offs = this.offs[cid];

    if (offs[undefined]) {
      this.unbind(component, undefined);
    }

    offs[undefined] = [
      this.mon('add', onDataChange),
      this.mon('remove', onDataChange),
    ];

  }

  bindAll(component, query, property) {

    const cid = componentId(component);

    const onDataChange = () => {
      Vue.set(component, property, this.filter(query));
      // setTimeout(() => component.$forceUpdate());
    };

    this.offs[cid] = this.offs[cid] || {};
    const offs = this.offs[cid];

    if (offs[property]) {
      this.unbind(component, property);
    }

    offs[property] = [
      this.mon('add', onDataChange),
      this.mon('remove', onDataChange),
    ];

    return this.filter(query);

  }

  bindOne(component, id, property) {

    const cid = componentId(component);

    const getDataById = () => this.store.get(this.name, id);

    const onDataChange = () => {
      Vue.set(component, property, getDataById());
    };

    this.offs[cid] = this.offs[cid] || {};
    const offs = this.offs[cid];

    if (offs[property]) {
      this.unbind(component, property);
    }

    offs[property] = [
      this.mon('add', onDataChange),
      this.mon('remove', onDataChange),
    ];

    return getDataById();

  }

  unbind(component, property) {
    const cid = componentId(component);
    const offs = this.offs[cid];
    offs[property].forEach(off => off());
    delete offs[property];
  }

  unbindAll(component) {

    const cid = componentId(component);

    if (!this.offs[cid]) {
      return;
    }

    Object.keys(this.offs[cid])
      .forEach(property => this.unbind(component, property));

    delete this.offs[cid];

  }

}

function componentId(component) {
  // TODO: refactor without private property usage
  // eslint-disable-next-line
  return component._uid;
}

export default Model;
