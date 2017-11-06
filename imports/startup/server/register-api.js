// Register your apis here
import '../../api/logs/methods.js'
import Mqtt from '../../api/mqtt/server'
import Audio from '../../api/audio/server'
import Booting from '../../api/booting'

const mqtt = new Mqtt()

// add Audio connector
if( Meteor.settings.public.serverPlugins &&
    Meteor.settings.public.serverPlugins.length > 0
  ) {
  // init all active plugins
  Meteor.settings.public.serverPlugins.map((plugin) => {
    if(plugin === 'audio') {
      mqtt.addConnector(new Audio())
    }
    if(plugin === 'booting') {
      mqtt.addConnector(new Booting())
    }
  })
}
