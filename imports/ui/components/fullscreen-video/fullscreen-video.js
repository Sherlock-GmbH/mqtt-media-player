import './fullscreen-video.html';

Template.fullscreenVideo.onCreated(function fullscreenVideoOnCreated() {

});

Template.fullscreenVideo.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.fullscreenVideo.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
