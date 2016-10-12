//album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"</span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playFromPlayerBar = $('.main-controls .play-pause');

var setSong = function(songNumber){
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         formats: [ 'mp3' ],
         preload: true
    });
    
    setVolume(currentVolume);
};

var seek = function(time){
    if (currentSoundFile){
        currentSoundFile.setTime(time);
    }
};

var setVolume = function(volume){
    if (currentSoundFile){
        currentSoundFile.setVolume(volume);
    }
};


var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
};

//generate song row content
var createSongRow = function(songNumber, songName, songLength){
    var template = 
        '<tr class = "album-view-song-item">'
        + '<td class="song-item-number" data-song-number = "' + songNumber + '">' + songNumber + '</td>'
        + '<td class="song-item-title">' + songName + '</td>'
        + '<td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
     + '</tr>';
    
    var $row = $(template);
    
    //click behavior of song numbers and main control buttons
    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));

	   if (currentlyPlayingSongNumber !== null) {
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	   }
	   if (currentlyPlayingSongNumber !== songNumber) {
           setSong(songNumber);
           currentSoundFile.play();
           updateSeekBarWhileSongPlays();
           currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
           
           var $volumeFill = $('.volume .fill');
           var $volumeThumb = $('.volume .thumb');
           $volumeFill.width(currentVolume + '%');
           $volumeThumb.css({left: currentVolume + '%'});
           
           $(this).html(pauseButtonTemplate);
           updatePlayerBarSong();
           
	   } else if (currentlyPlayingSongNumber === songNumber) {
		  if (currentSoundFile.isPaused()){
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
          } else {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentSoundFile.pause();
            }
        }
    };
    
    var onHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber){
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber){
            songNumberCell.html(songNumber);
        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album){
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
   
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    //empty album song list variable
    $albumSongList.empty();
    
    //loop through songs from album and insert into HTML via the createSongRow function
    for (var i = 0; i < album.songs.length; i++){
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    };
};

var setCurrentTimeInPlayerBar = function(currentTime){
    var $time = $('.current-time');
    var $startTime = buzz.toTimer(currentTime.getTime());
    $time.html($startTime);
};

var setTotalTimeInPlayerBar = function(totalTime){
    var $totalTimeClass = $('.total-time');
    var $timeDuration = buzz.toTimer(totalTime.getDuration());
    $totalTimeClass.html($timeDuration);
};

var filterTimeCode = function(timeInSeconds){
    var $duration = $('.song-item-duration');
    var $floatingPoint = parseFloat(timeInSeconds);
    var $mins = Math.floor($floatingPoint / 60);
    var $secs = Math.floor($floatingPoint - $mins * 60);
    return $mins + ':' + $secs;
};

var updateSeekBarWhileSongPlays = function(){
    if (currentSoundFile){
        currentSoundFile.bind('timeupdate', function(event){
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(currentSoundFile);
            setTotalTimeInPlayerBar(currentSoundFile);
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
    var offsetXPercent = seekBarFillRatio * 100;
    
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
    
};

var setupSeekBars = function(){
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event){
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        //calculate width of entire bar
        var seekBarFillRatio = offsetX / barWidth;
        
        if ($(this).parent().attr('class') == 'seek-control'){
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        
        updateSeekPercentage($(this), seekBarFillRatio);  
    });
    
    $seekBars.find('.thumb').mousedown(function(event) {
         var $seekBar = $(this).parent();
        
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
             
             if ($seekBar.parent().attr('class') == 'seek-control'){
                seek(seekBarFillRatio * currentSoundFile.getDuration());    
             } else {
                 setVolume(seekBarFillRatio);
             }
             
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     })
};


//tracks index # of song
var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};

//increment song index when clicking forward
var nextSong = function(){
    var getLastSongNumber = function(index){
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length){
        currentSongIndex = 0;
    }
    
    //set a new current song
     setSong(currentSongIndex + 1);
     currentSoundFile.play();
     updateSeekBarWhileSongPlays();
     updatePlayerBarSong();
    
    var lastSongNumber = parseInt(getLastSongNumber(currentSongIndex));
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};


//decrement song index when click back button
var previousSong = function(){
    var getLastSongNumber = function(index){
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    
    if (currentSongIndex < 0){
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    //set a new current song
     setSong(currentSongIndex + 1);
     currentSoundFile.play();
     updateSeekBarWhileSongPlays();
     updatePlayerBarSong();
    
    var lastSongNumber = parseInt(getLastSongNumber(currentSongIndex));
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentSoundFile);

};



var togglePlayFromPlayerBar = function(){
    if ($playFromPlayerBar.click){
        var $songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
        
        if (currentSoundFile.isPaused()){
            $songNumberCell.html(pauseButtonTemplate);
            $playFromPlayerBar.html(playerBarPauseButton);
        } else {
            $songNumberCell.html(playButtonTemplate);
            $playFromPlayerBar.html(playerBarPlayButton);
        }
    
        currentSoundFile.togglePlay();
    }
};


//load album when window loads
$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playFromPlayerBar.click(togglePlayFromPlayerBar);
});
