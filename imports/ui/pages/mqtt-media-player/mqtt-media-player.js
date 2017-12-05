// Framework
import { Meteor } from 'meteor/meteor'
// App
import './mqtt-media-player.html'
import './mqttws31.js'
import './video-player.js'
import './audio-player.js'
import MidiPlayer from './midi-player.js'
import '../../components/fullscreen-video/fullscreen-video.js'
import '../../components/debug-console/debug-console.js'

// hostname or IP address
host = Meteor.settings.public.mqtt.host || 'localhost'
port = Meteor.settings.public.mqtt.port || 9001
username = Meteor.settings.public.mqtt.username || null
password = Meteor.settings.public.mqtt.password || null
plugins = Meteor.settings.public.plugins || ['audio','video','midi']
topic = '#'  // topic to subscribe to
useTLS = false
cleansession = true

var mqtt
var reconnectTimeout = 2000
var ap, vp, mp
var audioTracks = []
var selectedAudioTrack = 0

var MQTTconnect = function() {
  if (typeof path == "undefined") {
    path = '/mqtt'
  }

  var clientId = "web_" + parseInt(Math.random() * 100, 10)

  mqtt = new Paho.MQTT.Client(host, port, path, clientId)

  var options = {
      timeout: 3,
      useSSL: useTLS,
      cleanSession: cleansession,
      onSuccess: onConnect,
      onFailure: function (message) {
        $('#status').val("Connection failed: " + message.errorMessage + "Retrying")
        setTimeout(MQTTconnect, reconnectTimeout)
      }
  }

  mqtt.onConnectionLost = onConnectionLost
  mqtt.onMessageArrived = onMessageArrived

  if (username != null) {
    options.userName = username
    options.password = password
  }
  mqtt.connect(options)
}

function onConnect() {
  $('#status').val('Connected to ' + host + ':' + port + path)
  // Connection succeeded subscribe to our topic
  mqtt.subscribe(topic, {qos: 0})
  $('#topic').val(topic)
}

function onConnectionLost(response) {
  setTimeout(MQTTconnect, reconnectTimeout)
  $('#status').val("connection lost: " + response.errorMessage + ". Reconnecting")
}

// Audio
function stopAllAudio() {
  for(var s=0; s < audioTracks.length; s++) {
    if(audioTracks[s]){
      audioTracks[s].stop()
      delete audioTracks[s]
    }
  }
  audioTracks = []
}

function audioHandler(action, payload) {
  var ap = audioTracks[selectedAudioTrack]
  switch (action) {
    case 'play-audio':
      var pos = audioTracks.length
      audioTracks.push(
        new AudioPlayer({file: payload, volume: 100, ended: function() {
            // clean up memory
            delete audioTracks[pos]
          }
        })
      )
      break
    case 'play-audio-loop':
      audioTracks.push(
        new AudioPlayer({file: payload, volume: 100, loop: true})
      )
      break
    case 'stop-audio':
      if(ap) ap.stop()
      break
    case 'stop-all-audio':
      stopAllAudio()
      break
    case 'pause-audio':
      if(ap) ap.pause()
      break
    case 'resume-audio':
      if(ap) ap.resume()
      break
    case 'select-audio-track':
      selectedAudioTrack = payload
      break
  }
}

function videoHandler(action, payload) {
  switch (action) {
    case 'play-video':
      vp = new VideoPlayer({file: payload})
      break
    case 'stop-video':
      if(vp) vp.stop()
      break
    case 'pause-video':
      if(vp) vp.pause()
      break
    case 'resume-video':
      if(vp) vp.resume()
      break
  }
}

function midiHandler(action, payload) {
  switch (action) {
    case 'midi-set-instrument':
      if(mp) mp.setInstrument(payload)
      break
    case 'toggle-mute':
      if(mp) mp.toggleMute(payload)
      break
  }
}

function onMessageArrived(message) {
  var topic = message.destinationName
  var action = topic.split('/').pop()
  var payload = message.payloadString

  switch (action) {
    // General
    case 'stop-all':
      stopAllAudio()
      if(vp) vp.stop()
      break
  }

  // check plugin settings and filter out non active ones
  for(var i=0; i < plugins.length; i++) {
    eval(plugins[i] + 'Handler')(action, payload)
  }

  $('#ws').prepend('<li>' + topic + ': ' + payload + '</li>')
}

Template.mqttMediaPlayer.onCreated(function(){
  var roomSlug = FlowRouter.current().params['roomSlug']
  var playerId = FlowRouter.current().params['playerId']
  topic = roomSlug + '/mqtt-media-player/' + playerId + '/#'
  MQTTconnect()
  mp = new MidiPlayer({
    instrument: 'acoustic_grand_piano',
    noteon: (note) => {
      var message = new Paho.MQTT.Message(note)
      message.destinationName = roomSlug + '/mqtt-media-player/' + playerId + '/midi/notes'
      message.qos = 0
      mqtt.send(message)
    }
  })
})
