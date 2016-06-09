var sdk = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
//var worker = require("sdk/page-worker").Page({
//	contentScriptFile: sdk.data.url("../scripts/worker.js"),
	//contentURL: "http://en.wikipedia.org/wiki/Internet"
//});;
var listener;
var reload = false;

var button = buttons.ActionButton({
    id: "youtube-repeat",
    label: "Toggle Repeat",
    icon: {
		"16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },

    badge: null,
    badgeColor: "#00f",
    //onChange: changed,
    //onChange: handleClick,
    onClick: toggleRepeat
});

tabs.on('ready', function(state, tab) {
    if(button.badge != null) {
        //console.log("reloaded");
        toggleRepeat(state, true);
    }
});

function toggleRepeat(state, reloaded) {
    if(typeof tab == "undefined") {
        tab = tabs.activeTab;
    }

    if(tab.url.split("www.youtube.com/watch").length<2) {
    	//console.log("not yt url");

    	return 0;
    }

    if(typeof reloaded == "undefined") {
        reloaded = false;
    }

    //console.log(button.badge);
    //console.log(reloaded);
    if(button.badge == null && reloaded == false) {
        button.badge = "Looping";
        toggled = true;
        reload = true;
    } else if(button.badge=="Looping" && reloaded == false) {
        button.badge = null;
        reload = false;
    }

	worker = tab.attach({
		contentScriptFile: sdk.data.url("../scripts/worker.js")
	});

    //console.log("send message");
    //worker.postMessage([tab]);
    worker.port.emit("monitor", tab.url);

	worker.port.on("html", function(message) {
		worker.port.emit("monitor", tab.url);
	});

	worker.port.on("reload", function(message) {
		//console.log("reloaded");
		worker.port.removeListener("html").removeListener("reload");

		if(reload) {
		    tab.reload();
		}
	});
}