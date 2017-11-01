import Player from 'play-sound'

export default class Audio {

  constructor() {
    console.log('Init Audio Plugin.')
    this.player = new Player({})
    this.audio = null
  }

  mqttInterface() {
    return ['playAudio', 'stopAudio', 'playLoop']
  }

  playAudio(file) {
    // configure arguments for executable if any
    console.log('playAudio: ', file)
    this.audio = this.player.play(file, {
        afplay: ['-v', 1 ] /* lower volume for afplay on OSX */
      }, function(err){
        if (err && !err.killed) throw err
      }
    )
  }

  stopAudio() {
    this.audio.kill()
  }
}
