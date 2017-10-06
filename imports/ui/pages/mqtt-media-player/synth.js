//
// Inspired from https://stuartmemo.com/qwerty-hancock/
//
export default class Synth {
  constructor() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    this.context = new AudioContext()
    this.masterGain = this.context.createGain()
    this.nodes = []
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(this.context.destination)
  }

  startTone(note) {
    // create new oscillator
    const oscillator = this.context.createOscillator()
    const frequency = this.getFrequency(note)
    // sine // square // triangle
    oscillator.type = 'square'
    oscillator.frequency.value = frequency
    oscillator.connect(this.masterGain)
    oscillator.start(0)
    // add to nodes list
    this.nodes.push(oscillator)
  }

  stopTone(note) {
    var new_nodes = []
    const frequency = this.getFrequency(note)

    for (var i = 0; i < this.nodes.length; i++) {
      if (Math.round(this.nodes[i].frequency.value) === Math.round(frequency)) {
        this.nodes[i].stop(0)
        this.nodes[i].disconnect()
      } else {
        new_nodes.push(this.nodes[i])
      }
    }
    this.nodes = new_nodes
  }

  getFrequency(note) {
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
    let octave = ''

    if (note.length === 3) {
      octave = note.charAt(2)
    } else {
      octave = note.charAt(1)
    }

    var keyNumber = notes.indexOf(note.slice(0, -1))

    if (keyNumber < 3) {
      keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1
    } else {
      keyNumber = keyNumber + ((octave - 1) * 12) + 1
    }
    // Return frequency of note
    return 440 * Math.pow(2, (keyNumber- 49) / 12)
  }
}
