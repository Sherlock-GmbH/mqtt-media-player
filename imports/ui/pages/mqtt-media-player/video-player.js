VideoPlayer = function(ctx) {
  this.autoplay = ctx.autoplay || true;
  this.video = document.getElementById('bgvid');
  this.video.src = ctx.file;

  if(this.autoplay) {
    this.video.play();
  }
}

VideoPlayer.prototype.stop = function(){
  this.video.pause();
  this.video.currentTime = 0;
  this.video.src = '';
}

VideoPlayer.prototype.pause = function(){
  this.video.pause();
}

VideoPlayer.prototype.resume = function(){
  this.video.play();
}
