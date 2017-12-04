/**
* Soundfont Loading and Player
* https://www.npmjs.com/package/soundfont-player
*
* GM prerendered Soundfonts
* https://github.com/gleitz/midi-js-soundfonts
*/
import WebMidi from 'webmidi'
import Soundfont from 'soundfont-player'
import Synth from './synth.js'

export default class MidiPlayer {
  constructor(ctx) {
    this.instr = {}
    this.sndFont = ctx.sndFont || 'FluidR3_GM'
    this.instrName = ctx.instrument || 'acoustic_grand_piano'
    this.sndFormat = ctx.sndFormat || 'ogg'
    this.manufacturer = ctx.manufacturer || 'CME'
    this.ac = new AudioContext()
    this.input = {}
    this.noteon = ctx.noteon || undefined
    this.sndType = ctx.sndType || 'synth'
    this.synth = new Synth()
    this.isMuted = false

    // select MIDI input
    WebMidi.enable((err) => {
      if (err) {
        console.log("WebMidi could not be enabled.", err)
      } else {
        // check for manufacturer and use this device ID
        // like that we only accept one connected device per manufacturer
        for(var d=0; d < WebMidi.inputs.length; d++) {
          if(WebMidi.inputs[d].manufacturer === this.manufacturer) {
            this.input = WebMidi.getInputById(WebMidi.inputs[d].id)
            console.log(this.input)
            switch (this.sndType) {
              case 'synth':
                this.setListeners()
                break;
              default:
                this.setInstrument(this.instrName)
                break;
            }
          }
        }
      }
    })
  }
  setListeners(){
    this.input.addListener('noteon', 'all', (e) => {
      if(this.isMuted) return
      switch (this.sndType) {
        case 'synth':
          this.synth.startTone(e.note.name + e.note.octave)
          break;
        default:
          this.instr.play(e.note.name + e.note.octave);
          break;
      }
      if(this.noteon) this.noteon(e.note.name + e.note.octave)
    })
    this.input.addListener('noteoff', 'all', (e) => {
      if(this.isMuted) return
      switch (this.sndType) {
        case 'synth':
          this.synth.stopTone(e.note.name + e.note.octave)
          break;
        default:
          // do nothing
          break;
      }
    })
  }
  toggleMute() {
    this.isMuted = (this.isMuted) ? false : true
  }
  setInstrument(instrument) {
    this.instrName = instrument
    // do we use a custom soundfile
    if(this.instrName.indexOf('.js') > -1){
      const cfg = undefined
    }else{
      const cfg = {
        soundfont: this.sndFont,
        format: this.sndFormat
      }
    }
    Soundfont.instrument(this.ac, this.instrName, cfg)
      .then((i) => {
        this.instr = i
        this.setListeners()
      })
  }
}
