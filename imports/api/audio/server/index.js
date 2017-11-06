import { exec } from 'child_process'
import Player from 'play-sound'
import kill from 'tree-kill'

export default class Audio {

  constructor() {
    console.log('Init Audio Plugin.')
    this.player = new Player({})
    this.audio = null
    this.loop = null
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

  playLoop(file) {
    this.loop = exec('while :; do afplay ' + file + '; done')
  }

  stopAudio() {
    if(this.loop) this.stopRunningPlayer()
    if(this.audio) this.audio.kill()
  }

  stopRunningPlayer() {
    const sref = this.loop
    if(sref && sref.pid > 0){
      kill(sref.pid, 'SIGTERM', function(){
        console.log('Killed player with PID: ', sref.pid)
        this.loop = null
      })
    }
  }
}
