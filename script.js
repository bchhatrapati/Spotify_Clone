console.log("Lets write JavaScript");

let currentSong = new Audio();
let songs;

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();


    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");


    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3") || element.href.endsWith(".mpeg")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track;
    if (!pause) {
        currentSong.play();
        document.getElementById("play").src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

function formatToMMSS(seconds) {
    if (typeof seconds !== 'number' || !isFinite(seconds) || seconds < 0) {
        return '00:00';
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


async function main() {

    //Get the list of all the songs
    songs = await getSongs();
    playMusic(songs[0], true);

    //show al songs in the playlist
    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Master Suraj</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="play-btn" src="play.svg" alt="play">
                            </div> </li>`;

    }

    //Attached an event listener to each song
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim().replaceAll("&amp;", "&"));
        })
    })

    //Attach an event listener to play, previous and next buttons
    let playBtn = document.getElementById("play");
    playBtn.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playBtn.src = "pause.svg"
        } else {
            currentSong.pause();
            playBtn.src = "play.svg";
        }
    })

    //Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatToMMSS(currentSong.currentTime)} / ${formatToMMSS(currentSong.duration)}`;

        //Make seekbar active
        document.querySelector(".circle").style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`;
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })

    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //Add an event listener for previous and next
    let prev = document.getElementById("previous");
    let nex = document.getElementById("next");



    prev.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`/`).slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    nex.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`/`).slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });
}
main();
