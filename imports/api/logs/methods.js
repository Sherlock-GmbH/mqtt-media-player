// Framework
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
// Custom
import { Logs } from './collection';

Meteor.methods({
  'logs.insert'(topic, payload) {
    check(topic, String);
    check(payload, String);

    return Logs.insert({
      topic,
      payload,
      createdAt: new Date(),
    });
  },
});
