import store from './store';

class STModel {

  constructor(name, config) {

    this.name = name;
    this.store = store;
    this.mapper = store.defineMapper(name, config);
    this.offs = {};

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
      // eslint-disable-next-line
      component[property] = this.filter(query);
      setTimeout(() => component.$forceUpdate());
      // eslint-disable-next-line
      // console.warn('!');
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

    const onDataChange = () => {
      // eslint-disable-next-line
      component[property] = this.store.get(this.name, id) || {};
      // eslint-disable-next-line
      // console.warn('!');
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

    return this.store.get(this.name, id) || {};

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
      // eslint-disable-next-line
      console.warn('unbindAll no offs', this);
      return;
    }
    const props = Object.keys(this.offs[cid]);
    props.forEach(property => this.unbind(component, property));
    delete this.offs[cid];
  }

}

function componentId(component) {
  // TODO: refactor without private property usage
  // eslint-disable-next-line
  return component._uid;
}

export default STModel;
