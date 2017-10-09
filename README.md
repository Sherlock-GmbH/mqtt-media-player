# MQTT Media Player
The goal of this little app is to provide a simple web audio and web video player.

It provides a interface via MQTT messages.

# MQTT - Message Interface
The player offers a simple MQTT message interface, with general, video, audio or midi specific messages.

## General

| topic            | payload        | default |
|------------------|----------------|---------|
| stop-all         |                |         |
| set-volume       | [1-100]        | 100     |

## Video Player

| topic            | payload        | default |
|------------------|----------------|---------|
| play-video       | video-file-uri | none    |
| stop-video       |                |         |
| pause-video      |                |         |
| set-video-volume | [1-100]        | 100     |

*Example*
Browser URL: http://www.example.com/custom-namespace/mqtt-media-player/custom-player-id

Topic: custom-namespace/mqtt-media-player/custom-player-id/play-video

Payload: https://archive.org/download/Mario1_500/Mario1_500_HQ_512kb.mp4

## Audio Player

| topic            | payload        | default |
|------------------|----------------|---------|
| play-audio       | audio-file-uri | none    |
| stop-audio       |                |         |
| pause-audio      |                |         |
| set-audio-volume | [1-100]        | 100     |

*Example*
Browser URL: http://www.example.com/custom-namespace/mqtt-media-player/custom-player-id

Topic: custom-namespace/mqtt-media-player/custom-player-id/play-audio

Payload: https://archive.org/download/testmp3testfile/mpthreetest.mp3

## Midi Player
Use this player if you want to offer a simple Soundfont player and play it via a connected Midi device.

Per default we use the General Midi sounds of https://github.com/gleitz/midi-js-soundfonts

*Subscription*

| topic                | payload                | default                 |
|----------------------|------------------------|-------------------------|
| midi-set-instrument  | sound-name             | acoustic_grand_piano    |
| midi-set-type        | soundfont or synth     | synth                   |

*Publishing*

| topic                                                           | payload        |
|-----------------------------------------------------------------|----------------|
| custom-namespace/mqtt-media-player/custom-player-id/midi/notes  | note (e.g. C4) |

### Log of MQTT messages

Schema Log entry:

```js
{
  _id: 'vlkjs89u3nvlks',
  topic: 'custom-namespace/mqtt-media-player/custom-player-id/play-audio',
  payload: 'http://192.168.1.2/videos/a.mp3',
  createdAt: new Date()
}
```

## Docker Setup

```
docker build -t sherlock/mqtt-media-player .
```

## Mosquitto broker configuration
The app is using standard websockets to establish a connection to the MQTT broker.

You need to enable the websockets via the configuration.

*/etc/mosquitto/conf.d/websocket.conf*
```
listener 9001
protocol websockets
```

If you want to use SSL use this configuration.

*/etc/mosquitto/conf.d/websocket-ssl.conf*
```
listener 9002 127.0.0.1
protocol websockets
cafile /etc/mosquitto/tls/ca.crt
certfile /etc/mosquitto/tls/your.crt
keyfile /etc/mosquitto/tls/your.key
```

Also see the documentation: http://mosquitto.org/man/mosquitto-conf-5.html
