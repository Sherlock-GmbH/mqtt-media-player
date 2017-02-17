import { Meteor } from 'meteor/meteor';
import mqtt from 'mqtt';

// build broker URL
let url = 'tcp://';
if(Meteor.settings.public.mqtt.username) url += Meteor.settings.public.mqtt.username + ':';
if(Meteor.settings.public.mqtt.password) url += Meteor.settings.public.mqtt.password + '@';
if(Meteor.settings.public.mqtt.host) url += Meteor.settings.public.mqtt.host;
console.log('MQTT subscriber connecting: ', url);

const client = mqtt.connect(url);

client.on('connect', function () {
  console.log('MQTT subscriber connected: ', url);
  // subscribe to all topics catch all
  client.subscribe('#');
})

client.on('message', Meteor.bindEnvironment(function (topic, message) {
    // split topic
    console.log('MQTT subscriber topic: ', topic.toString());
    // message is Buffer
    console.log('MQTT subscriber message: ', message.toString())
    Meteor.call(
      'logs.insert',
      topic.toString(),
      message.toString()
    );
  })
)
