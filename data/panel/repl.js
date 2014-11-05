var toAddon;

window.addEventListener("message", function(event) {
  toAddon = event.ports[0];
  toAddon.start();
});

document.addEventListener('DOMContentLoaded', function(){

  var editor = CodeMirror.fromTextArea(document.querySelector("textarea"), {
    lineNumbers: true,
    matchBrackets: true,
    continueComments: "Enter",
    extraKeys: {"Ctrl-Q": "toggleComment"},
    tabSize: 2,
    autoCloseBrackets: true
  });

  editor.setOption('theme', 'solarized dark');

  var deliverContent = function(content){
    traceur.options.experimental = true;

    var es5 = traceur.Compiler.script(content);
    toAddon.postMessage(es5);
  }

  var combinationKey = 'metaKey';
  // chrome.runtime.sendMessage('platformInfo', function(info) {
  //   if (info.os !== 'mac') {
  //     combinationKey = 'ctrlKey';
  //     document.getElementById('combinationKey').textContent = 'Ctrl';
  //   }
  // });

  document.onkeydown = function(e){
    if(e[combinationKey] && e.which == 13){
      deliverContent(editor.getValue());
    }
  }

  document.querySelector('button').addEventListener('click', function(){
    deliverContent(editor.getValue());
  });
});
