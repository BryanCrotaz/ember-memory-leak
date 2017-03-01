import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),

  model() {
    let store = this.get("store");
    return store.peekAll('post');
  }
});
