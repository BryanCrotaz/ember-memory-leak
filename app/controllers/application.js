import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const {get, set, computed} = Ember;

export default Ember.Controller.extend({
	intervalMs: 1000,
	updateNumber: 0,
  observerCount: null,

	init () {
		this._super(...arguments);
		get(this, 'updateTask').perform();
	},

  firstPost: computed.alias("model.firstObject"),

  getTestData(commentCount, include) {
    const comments = [];
    const data = {
      data: {
        type: 'post',
        id: '1',
        relationships: {
          comments: {
            data: comments
          }
        }
      },
    };

    if (include) {
      data.included = comments;
    }

    for (let i = 1; i <= commentCount; i++)
    {
      comments.push({
        type: 'comment',
        id: `test-comment-${i}`,
        attributes: {
          name: `Test comment ${i}`,
        }
      });
    }

    return data;
  },

	updateTask: task(function* () {
		let firstTime = true;
    let store = get(this, 'store');
		while (true)
		{
			yield timeout(get(this, 'intervalMs'));

      this.incrementProperty('updateNumber');

			store.push(this.getTestData(10, firstTime));

			firstTime = false;
		}
	}).drop()
});
