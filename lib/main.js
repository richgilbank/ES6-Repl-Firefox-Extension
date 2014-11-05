const { Panel } = require("dev/panel");
const { Tool } = require("dev/toolbox");
const { Class } = require("sdk/core/heritage");
const self = require("sdk/self");
const tabs = require("sdk/tabs");

const { MessageChannel } = require("sdk/messaging");
const channel = new MessageChannel();
const addonSide = channel.port1;
const panelSide = channel.port2;

// var worker = tabs.activeTab.attach({
//   contentScriptFile: 'content-script.js'
// });
//
// addonSide.onmessage = function(event) {
//   console.log('sending');
//   console.log(event.data);
//   worker.port.emit('eval', event.data);
// }

addonSide.onmessage = function(event) {
  tabs.activeTab.attach({
    contentScriptFile: 'node_modules/traceur/bin/traceur-runtime.js',
    contentScript: event.data
  });
}

const REPLPanel = Class({
  extends: Panel,
  label: "REPL",
  tooltip: "Firefox debugging protocol REPL",
  icon: self.data.url("icon-64.png"),
  url: self.data.url("panel/repl.html"),
  onReady: function() {
    this.postMessage('init', [panelSide]);
  }
});
exports.REPLPanel = REPLPanel;

const replTool = new Tool({
  panels: { repl: REPLPanel }
});
