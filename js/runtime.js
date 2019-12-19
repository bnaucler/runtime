var api_addr = "https://api.themoviedb.org/3/";
var api_key = "1beccc996fd1da809239854fc6a859ed";

function mkxhr(url, rfunc) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            rfunc(xhr);
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}

function processidreq(xhr) {
    var resp = JSON.parse(xhr.responseText);
    var hr = Math.floor(resp.runtime / 60);
    var min = String((resp.runtime % 60)).padStart(2, '0');
    var resptit = resp.title + " (" + resp.release_date.substring(0, 4) + ")";
    var resptime = hr + ":" + min;

    var container = document.getElementById("container");

    console.log(resptit + " - " + resptime);

    var rdata = document.createElement("div");
    var rtime = document.createElement("div");
    var rtitle = document.createElement("div");

    rtitle.appendChild(document.createTextNode(resptit));
    rtime.appendChild(document.createTextNode(resptime));

    rdata.className = "data";
    rtitle.className = "title";
    rtime.className = "time";

    rdata.appendChild(rtitle);
    rdata.appendChild(rtime);

    container.appendChild(rdata);
}

function processnamereq(xhr) {
    var resp = JSON.parse(xhr.responseText);
    var alen = resp.results.length;
    var container = document.getElementById('container');
    container.innerHTML = "";
    console.log(resp);

    // TODO: be a little more selective..
    for(var i = 0; i < alen; i++) {
        var url = api_addr + "movie/" + resp.results[i].id + "?api_key=" + api_key;
        mkxhr(url, processidreq);
        console.log("Getting movie with ID: " + resp.results[i].id);
    }
}

function searchmov(elem) {
    var name = elem.elements["search"].value;
    var url = api_addr + "search/movie/?query=" + encodeURI(name) + "&api_key=" + api_key;
    mkxhr(url, processnamereq);
}
