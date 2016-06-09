self.port.on("monitor", function(url) {
    var html = document.body.innerHTML;
    if(html!="") {
        var indexZero = html.search('ytp-time-current">')+18;
        var indexEnd = html.search('ytp-time-duration">')+19;
        time = html.substr(indexZero, 4);
        timeEnd = html.substr(indexEnd, 4);
        time = time.split(':');
        timeEnd = timeEnd.split(':');
        var seconds = (+time[0]) * 60 + (+time[1]); 
        var secondsEnd = (+timeEnd[0]) * 60 + (+timeEnd[1]); 

        //console.log(seconds);

        if(seconds>=secondsEnd) {
            self.port.emit("reload", url);
        } else {
            if(seconds+10>=secondsEnd) {
                self.port.emit("html", url);
            } else {
                window.setTimeout(function() {self.port.emit("html", url);}, 5000);
            }
        }
    }
});