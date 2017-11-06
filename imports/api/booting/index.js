import { exec } from 'child_process'

export default class Booting {

  constructor() {
    console.log('Init Booting Plugin.')
  }

  mqttInterface() {
    return ['reboot', 'shutdown']
  }

  reboot() {
    console.log('Booting Plugin: reboot')
    exec('sudo /sbin/shutdown -r now')
  }

  shutdown() {
    console.log('Booting Plugin: shutdown')
    exec('sudo /sbin/shutdown now')
  }
}
