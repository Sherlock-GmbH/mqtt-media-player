import { Meteor } from 'meteor/meteor';
import mqtt from 'mqtt';

export default class Mqtt {

  constructor(opts) {
    // build broker URL
    let url = 'tcp://';

    if(Meteor.settings.public.mqtt.username) url += Meteor.settings.public.mqtt.username + ':'
    if(Meteor.settings.public.mqtt.password) url += Meteor.settings.public.mqtt.password + '@'
    if(Meteor.settings.public.mqtt.host) url += Meteor.settings.public.mqtt.host

    console.log('MQTT subscriber connecting: ', url)

    this.connectors = []

    const client = mqtt.connect(url)

    client.on('connect', function () {
      console.log('MQTT subscriber connected: ', url)
      // subscribe to all topics catch all
      client.subscribe('#')
    })

    client.on('message', Meteor.bindEnvironment((topic, message) => {
        // do we need to log all messages in database
        if(Meteor.settings.public.logging) {
          // split topic
          console.log('MQTT subscriber topic: ', topic.toString())
          // message is Buffer
          console.log('MQTT subscriber message: ', message.toString())
          // send to database
          Meteor.call('logs.insert', topic.toString(), message.toString())
        }
        // do we have server side namespace actived
        if(Meteor.settings.public.mqtt.serverNamespace && Meteor.settings.public.mqtt.serverPlayerId) {
          const namespace = Meteor.settings.public.mqtt.serverNamespace
          const playerId = Meteor.settings.public.mqtt.serverPlayerId
          const ns = namespace + '/mqtt-media-player/' + playerId
          // check if topic is for server
          if(topic.indexOf(ns) > -1) {
            // check which connectors need to be called
            if(this.connectors.length > 0) {
              // parse for each action
              this.connectors.forEach((connector) => {
                connector.mqttInterface().forEach((action) => {
                  // get topic action
                  if(topic.indexOf(action) > -1) {
                    console.log(topic, action)
                    connector[action](message.toString())
                    return
                  }
                })
              })
            }
          }
        }
      })
    )
  }

  addConnector(con) {
    this.connectors.push(con)
  }
}
