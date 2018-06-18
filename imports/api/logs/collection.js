// Definition of the logs collection
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

let Logs = {}

if(Meteor.settings.public.logging) {
  Logs = new Mongo.Collection('logs');
}

export default Logs
