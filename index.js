var self = require('sdk/self');
var buttons = require('sdk/ui/button/toggle');
var tabs = require("sdk/tabs");
var workers = require("sdk/page-worker");
var listener;
var reload = false;

var button = buttons.ToggleButton({
    id: "youtube-repeat",
    label: "Toggle Repeat",
    icon: {
        "32": "./icon.png",
        "64": "./icon.png"
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

        if(tab.url.split("www.youtube.com/watch")<=1) {
            return 0;
        }
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

        return 0;
    }

    tab.attach({contentScript: 'self.port.emit("html", document.body.innerHTML);'}).port.on("html", function(html) {
        if(html!="") {
            var indexZero = html.search('ytp-time-current">')+18;
            var indexEnd = html.search('ytp-time-duration">')+19;
            time = html.substr(indexZero, 4);
            timeEnd = html.substr(indexEnd, 4);
            time = time.split(':');
            timeEnd = timeEnd.split(':');
            var seconds = (+time[0]) * 60 + (+time[1]); 
            var secondsEnd = (+timeEnd[0]) * 60 + (+timeEnd[1]); 

            if(seconds>=secondsEnd) {
                if(reload) {
                    tab.reload();
                }
                
                return 0;
            }

            //console.log(seconds);
            toggleRepeat(state, true);
        }
    });
}