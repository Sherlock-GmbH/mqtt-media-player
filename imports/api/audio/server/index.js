import { exec } from 'child_process'
import Player from 'play-sound'
import kill from 'tree-kill'

export default class Audio {

  constructor() {
    console.log('Init Audio Plugin.')
    this.player = new Player({})
    this.audio = null
    this.loops = []
  }

  mqttInterface() {
    return [
      'playAudio', 'stopAudio',
      'playAudioLoop', 'stopAudioLoops'
    ]
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

  playAudioLoop(file) {
    // configure arguments for executable if any
    console.log('playLoop: ', file)
    this.loops.push(
      exec('while :; do afplay ' + file + '; done')
    )
  }

  stopAudio() {
    if(this.audio) this.audio.kill()
  }

  stopAudioLoops() {
    if(this.loops.length > 0)
      this.stopRunningPlayer()
  }

  stopRunningPlayer() {
    this.loops.forEach((sref) => {
      if(sref && sref.pid > 0) {
        kill(sref.pid, 'SIGTERM', function(){
          console.log('Killed player with PID: ', sref.pid)
        })
      }
    })
    this.loops = []
  }
}
