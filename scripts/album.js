var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        {title: 'Blue', duration: '4:26'},
        {title: 'Green', duration: '3:14'},
        {title: 'Red', duration: '5:01'},
        {title: 'Pink', duration: '3:21'},
        {title: 'Magenta', duration: '2:15'}
    ]
};

var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        {title: 'Hello, Operator?', duration: '1:01'},
        {title: 'Ring, ring, ring', duration: '5:01'},
        {title: 'Fits in your pocket', duration: '3:21'},
        {title: 'Can you hear me now?', duration: '3:14'},
        {title: 'Wrong phone number', duration: '2:15'}
    ]
};

var albumMMJ = {
    title: 'Evil Urges',
    artist: 'My Morning Jacket',
    label: "ATO Records",
    year: '2008',
    albumArtUrl: 'assets/images/album_covers/22.png',
    songs: [
        {title: 'Evil Urges', duration: '5:12'},
        {title: 'TMIGTS Pt 1', duration: '3:49'},
        {title: 'Highly Suspicious', duration: '3:05'},
        {title: 'I\'m Amazed', duration: '4:33'},
        {title: 'Thank You Too!', duration: '4:27'},
        {title: 'Sec Walkin\'', duration: '3:35'},
        {title: 'Two Halves', duration: '2:34'},
        {title: 'Librarian', duration: '4:26'},
        {title: 'Look at You', duration: '3:28'},
        {title: 'Aluminum Park', duration: '3:56'},
        {title: 'Remnants', duration: '3:02'},
        {title: 'Smokin\' from Shootin\'', duration: '5:02'},
        {title: 'TMIGTS Pt 2', duration: '8:12'},
        {title: 'Good Intentions', duration: '0:05'}
    ]
};

//function below will generate song row content
var createSongRow = function(songNumber, songName, songLength){
    var template = 
        '<tr class = "album-view-song-item">'
        + '<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '<td class="song-item-title">' + songName + '</td>'
        + '<td class="song-item-duration">' + songLength + '</td>'
     + '</tr>';
    
    return template;
}

    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album){
    //first, we are capturing all of the info we need from the HTML and setting them to a JS variable for use
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
    
    //next we assign the values of the elements to appropriately named js values
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
    
    //ensure the album song list is empty before working with it
    albumSongList.innerHTML = '';
    
    //loop through songs from album and ```insert into HTML via the createSongRow function
    for (var i = 0; i < album.songs.length; i++){
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];

var songRows = document.getElementsByClassName('album-view-song-item');

//album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"</span></a>';

//load album when window loads
window.onload = function(){
    setCurrentAlbum(albumPicasso);
    var albums = [albumPicasso, albumMarconi, albumMMJ];
    var index = 1;
    albumImage.addEventListener('click', function(event){
        setCurrentAlbum(albums[index]);
        index++;
        if (index == albums.length){
            index = 0;
        }
    });
    
    songListContainer.addEventListener('mouseover', function(event){
        if (event.target.parentElement.className === "album-view-song-item"){
            event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
        } 
    });
    
    for (var i = 0; i < songRows.length; i++){
        songRows[i].addEventListener('mouseleave', function(event){
           this.children[0].innerHTML = this.children[0].getAttribute('data-song-number'); 
        });
    }
};
    