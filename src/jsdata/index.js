import store from './store';

class STModel {

  constructor(name, config) {

    this.name = name;
    this.store = store;
    this.mapper = store.defineMapper(name, config);

  }

  findAll(query, options) {
    return this.store.findAll(this.name, query, options);
  }

  filter(query) {
    return this.store.filter(this.name, query);
  }

  remove(item) {
    return this.store.remove(this.name, item[this.mapper.idAttribute]);
  }

  mon(event, callback) {
    const listener = (name, data) => name === this.name && callback(name, data);
    this.store.on(event, listener);
    return () => this.store.off(event, listener);
  }

  bindAll(component, query, property) {

    const onDataChange = () => {
      // eslint-disable-next-line
      component[property] = this.filter(query);
      // eslint-disable-next-line
      // console.warn('!');
    };

    const offs = [
      this.mon('add', onDataChange),
      this.mon('remove', onDataChange),
    ];

    component.$on(`STUnbind${this.name}`, (params = {}) => {
      if (params.component === component) {
        offs.forEach(off => off());
      }
    });

    return this.filter(query);

  }

  unbind(component) {
    // TODO: refactor without event emitting
    component.$emit(`STUnbind${this.name}`, { component });
  }

}

// eslint-disable-next-line
export { STModel };
