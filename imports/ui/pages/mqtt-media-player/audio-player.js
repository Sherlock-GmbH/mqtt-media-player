AudioPlayer = function(ctx) {
  this.vol = ctx.volume || 100;
  this.autoplay = ctx.autoplay || true;
  this.audio = new Audio(ctx.file);
  this.audio.loop = ctx.loop || false;

  // play audio right away
  if(this.autoplay) this.audio.play();
  // call callback on audio ended
  if(ctx.ended) this.audio.onended = ctx.ended;
}

AudioPlayer.prototype.play = function() {
  this.audio.play();
}

AudioPlayer.prototype.stop = function() {
  this.audio.pause();
  this.audio.currentTime = 0;
}

AudioPlayer.prototype.pause = function() {
  this.audio.pause();
}

AudioPlayer.prototype.resume = function() {
  this.audio.play();
}
