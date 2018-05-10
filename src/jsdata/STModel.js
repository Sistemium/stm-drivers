import store from './store';

class STModel {

  constructor(name, config) {

    this.name = name;
    this.store = store;
    this.mapper = store.defineMapper(name, config);
    this.offs = {};

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

    const onDataChange = () => {
      setTimeout(() => component.$forceUpdate());
    };

    this.offs[component] = this.offs[component] || {};
    const offs = this.offs[component];

    if (offs[undefined]) {
      this.unbind(component, undefined);
    }

    offs[undefined] = [
      this.mon('add', onDataChange),
      this.mon('remove', onDataChange),
    ];

  }

  bindAll(component, query, property) {

    const onDataChange = () => {
      // eslint-disable-next-line
      component[property] = this.filter(query);
      // eslint-disable-next-line
      // console.warn('!');
    };

    this.offs[component] = this.offs[component] || {};
    const offs = this.offs[component];

    if (offs[property]) {
      this.unbind(component, property);
    }

    offs[property] = [
      this.mon('add', onDataChange),
      this.mon('remove', onDataChange),
    ];

    return this.filter(query);

  }

  unbind(component, property) {
    const offs = this.offs[component];
    offs[property].forEach(off => off());
    delete offs[property];
  }

  unbindAll(component) {
    if (!this.offs[component]) {
      // eslint-disable-next-line
      console.warn('unbindAll no offs', this);
      return;
    }
    const props = Object.keys(this.offs[component]);
    props.forEach(property => this.unbind(component, property));
    delete this.offs[component];
  }

}

export default STModel;
