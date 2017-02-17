AudioPlayer = function(ctx){
  this.vol = ctx.volume || 100;
  this.autoplay = ctx.autoplay || true;
  this.audio = new Audio(ctx.file);

  if(this.autoplay) this.audio.play();
}

AudioPlayer.prototype.stop = function(){
  this.audio.pause();
  this.audio.currentTime = 0;
}

AudioPlayer.prototype.pause = function(){
  this.audio.pause();
}

AudioPlayer.prototype.resume = function(){
  this.audio.play();
}
