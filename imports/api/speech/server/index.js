import { exec } from 'child_process'
import kill from 'tree-kill'

export default class Speech {

  constructor(opts) {
    console.log('Init Speech Plugin.')
    this.speechProc = null
    // configure
    this.configureVoice({
      processor: 'say',
      speed: 130,
      voice: 'Anna'
    })
  }

  mqttInterface() {
    return ['say','stopTalking','configureVoice']
  }

  configureVoice(opts) {
    this.voice = (opts.voice) ? opts.voice : 'Anna'
    this.processor = (opts.processor) ? opts.processor : 'say'
    this.language = (opts.language) ? opts.language : 'en'
    this.speed = (opts.speed) ? opts.speed : 130
    this.call = this.processor +
                ' -v ' + this.voice +
                ((this.processor === 'say') ? ' -r ' : ' -s ') + this.speed
  }

  say(txt) {
    this.stopTalking()
    this.speechProc = exec(this.call + ' "' + txt + '"')
  }

  stopTalking() {
    if(this.speechProc && this.speechProc.pid) {
      kill(this.speechProc.pid)
    }
  }
}
