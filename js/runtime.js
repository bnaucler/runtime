const api_addr = "https://api.themoviedb.org/3/";
const api_key = "1beccc996fd1da809239854fc6a859ed";
const backdrop_addr = "https://image.tmdb.org/t/p/original";
const imdb_addr = "https://www.imdb.com/title/";

function mkxhr(url, rfunc) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) rfunc(xhr);
    };
    xhr.open('GET', url, true);
    xhr.send();
}

function validatemov(resp) {

    if(resp.runtime < 15) return 1;
    if(resp.popularity < 2) return 1;

    return 0;
}

function processidreq(xhr) {
    var resp = JSON.parse(xhr.responseText);
    if(validatemov(resp)) return;

    var hr = Math.floor(resp.runtime / 60);
    var min = String((resp.runtime % 60)).padStart(2, '0');
    var resptit = resp.title + " (" + resp.release_date.substring(0, 4) + ")";
    var resptime = hr + ":" + min;

    var container = document.getElementById("container");

    console.log(resptit + " - " + resptime);

    var ranc = document.createElement("a");
    var rdata = document.createElement("div");
    var rbg = document.createElement("div");
    var rol = document.createElement("div");
    var rtime = document.createElement("div");
    var rtitle = document.createElement("div");

    var bgimg = backdrop_addr + resp.backdrop_path;

    rtitle.appendChild(document.createTextNode(resptit));
    rtime.appendChild(document.createTextNode(resptime));

    rdata.appendChild(rol);
    rdata.appendChild(rbg);
    rdata.appendChild(rtitle);
    rdata.appendChild(rtime);

    rdata.className = "data";
    rbg.className = "bg";
    rol.className = "overlay";
    rtitle.className = "title";
    rtime.className = "time";
    rbg.style.backgroundImage = "url(" + bgimg + ")";
    rbg.style.backgroundSize = "cover";
    ranc.href = imdb_addr + resp.imdb_id;

    ranc.appendChild(rdata);
    container.appendChild(ranc);
}

function processnamereq(xhr) {
    var resp = JSON.parse(xhr.responseText);
    var alen = resp.results.length;
    var container = document.getElementById('container');
    container.innerHTML = "";

    for(var i = 0; i < alen; i++) {
        var url = api_addr + "movie/" + resp.results[i].id + "?api_key=" + api_key;
        mkxhr(url, processidreq);
    }
}

function searchmov(elem) {
    var name = elem.elements["search"].value;
    var url = api_addr + "search/movie/?query=" + encodeURI(name) + "&api_key=" + api_key;
    mkxhr(url, processnamereq);
}
