import './debug-console.html';

Template.debugConsole.onCreated(function(){
  console.log('Setup keylistner for debug console.');
  // simple check if we display debug-console
  $(document).keypress(function(event){
    // press d character to toggle
    if(event.which == 100){
      $('.debug-console').toggle('hidden');
    }
  });
});
