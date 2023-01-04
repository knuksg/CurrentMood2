// 유튜브 api 관련

// iframe api 불러오기
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 유튜브 플레이어 생성
var player
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '285',
    width: '380',
    playerVars: {
      controls: 0,
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 재생목록 생성
const videoIDs = JSON.parse(window.sessionStorage.getItem('videoIDs'))
const videoTitles = JSON.parse(window.sessionStorage.getItem('videoTitles'))
const videoChannels = JSON.parse(window.sessionStorage.getItem('videoChannels'))

if (! videoIDs) {
  window.sessionStorage.setItem('videoIDs', JSON.stringify([]))
  window.sessionStorage.setItem('videoTitles', JSON.stringify([]))
  window.sessionStorage.setItem('videoChannels', JSON.stringify([]))
}

// 비디오 플레이어가 준비되었을 때 실행할 함수
function onPlayerReady(event) {
  // 재생목록, 재생순서, 재생시간을 세션에서 받아온다.
  const index = window.sessionStorage.index
  const time = window.sessionStorage.time

  // 재생목록이 있을 경우에만 실행한다.
  if (videoIDs) {
    // 재생순서가 재생목록을 벗어났을 경우 처음부터 재생한다.
    if (index > videoIDs.length-1) {
      player.loadPlaylist({
        playlist:videoIDs,
        index:0,
        startSeconds:0,
      })
    } else {
      player.loadPlaylist({
        playlist:videoIDs,
        index:index,
        startSeconds:time,
      })
    }

    // 재생/정지 버튼
    const videoBtn = document.querySelector("#video-btn")
    videoBtn.addEventListener('click', function(event) {
      if (videoBtn.classList.contains("bi-play-fill")) {
        playVideo()
      }
      else {
        pauseVideo()
      }
    })

    // 현재 재생중인 곡의 인덱스를 초기화한다.
    const currentVideoId = 0

    // 다음곡 버튼
    const next = document.getElementById("next");
    // 인덱스가 재생목록 범위 안에 있으면 다음곡을 재생하고 아니면 마지막곡을 재생한다.
    next.addEventListener("click", function() {
      if (currentVideoId < videoIDs.length - 1) {
        currentVideoId++;
        player.nextVideo();
      }
      else {
        player.playVideoAt(currentVideoId)
      }
    });

    // 이전곡 버튼
    const pre = document.getElementById("previous");
    // 인덱스가 재생목록 범위 안에 있으면 이전곡을 재생하고 아니면 처음곡을 재생한다.
    pre.addEventListener("click", function() {
      if (currentVideoId > 0) {
        currentVideoId--;
        player.previousVideo();
      }
      else {
        player.playVideoAt(currentVideoId)
      }
    });

    // 재생 시간 계산 함수
    function formatTime(time) {
      time = Math.round(time)

      var minutes = Math.floor(time / 60),
      seconds = time - minutes * 60

      // seconds에 값을 대입하는데, seconds가 10보다 작으면 0+seconds, 아니면 seconds를 대입함.
      seconds = seconds < 10 ? '0' + seconds : seconds

      return minutes + ":" + seconds
    }

    // 재생 시간 & 전체 시간 표시 함수
    function updateTimerDisplay() {
      const currentTime = document.querySelector("#current-time")
      currentTime.innerText = formatTime(player.getCurrentTime())
      const duration = document.querySelector("#duration")
      duration.innerText = formatTime(player.getDuration())
    }

    updateTimerDisplay()
    
    // 프로그래스바
    const progressBar = document.querySelector("#progress-bar")
    function updateProgressBar() {
      progressBar.value = (player.getCurrentTime() / player.getDuration()) * 100
      // 초기 프로그레스바 색상 설정
      progressBar.style.background = 'linear-gradient(to right, #fff 0%, #fff '+progressBar.value +'%, #6c757d ' + progressBar.value + '%, #6c757d 100%)'
    }
    
    updateProgressBar()

    // 프로그레스바 조작 함수
    progressBar.addEventListener('mouseup', function(e) {
      var newTime = player.getDuration() * (e.target.value / 100)
      player.seekTo(newTime)
    })
    progressBar.addEventListener('touchend', function(e) {
      var newTime = player.getDuration() * (e.target.value / 100)
      player.seekTo(newTime)
    })

    // 현재 재생중인 곡 정보 표시 함수
    function updateNowPlayingDisplay() {
      // bottomPlayer
      const bottomPlayer = document.querySelector('#bottom-player')
      const bottomPlayerImg = bottomPlayer.querySelector('img')
      bottomPlayerImg.src = `https://i.ytimg.com/vi/${videoIDs[currentVideoId]}/hqdefault.jpg`
      const bottomPlayerTitle = bottomPlayer.querySelector('p.title')
      bottomPlayerTitle.innerText = videoTitles[currentVideoId]
      const bottomPlayerChannel = bottomPlayer.querySelector('p.channel')
      bottomPlayerChannel.innerText = videoChannels[currentVideoId]

      // detailPlayer
      if (document.querySelector('#detail-player')) {
        const detailPlayer = document.querySelector('#detail-player')
        const detailPlayerId = detailPlayer.querySelector('#id')
        detailPlayerId.innerText = videoIDs[currentVideoId]
        const detailPlayerTitle = detailPlayer.querySelector('#title')
        detailPlayerTitle.innerText = videoTitles[currentVideoId]
        const detailPlayerChannel = detailPlayer.querySelector('#channel')
        detailPlayerChannel.innerText = videoChannels[currentVideoId]
        // const detailPlayerLink = detailPlayer.querySelector('#link')
        // var link ="{% url 'articles:song_detail' 12345 %}".replace(/12345/, video_id=videoIDs[currentVideoId]);
        // detailPlayerLink.href = link
        const playlistItems = document.querySelectorAll('#playlist-item')
        playlistItems.forEach((playlistActive) => {
          const playlistTitle = playlistActive.querySelector('#playlist-title')
          if (playlistTitle.innerText == videoTitles[currentVideoId]) {
            playlistActive.classList.add('bg-dark')
          } else {
            playlistActive.classList.remove('bg-dark')
          }
        })
      }
      // if (document.querySelector('.playlist')) {
      //   const playlistItems = document.querySelectorAll('#playlist-item')
      //   playlistItems.forEach((playlistActive) => {
      //     const playlistTitle = playlistActive.querySelector('#playlist-title')
      //     if (playlistTitle.innerText == videoTitles[currentVideoId]) {
      //       playlistActive.classList.add('bg-dark')
      //     } else {
      //       playlistActive.classList.remove('bg-dark')
      //     }
      //   })
      // }
    }

    updateNowPlayingDisplay()
    
    time_update_interval = setInterval(function () {
      updateTimerDisplay();
      updateProgressBar();
      updateNowPlayingDisplay();
    }, 1000)

    session_update_interval = setInterval(function () {
      window.sessionStorage.setItem('index', player.getPlaylistIndex())
      window.sessionStorage.setItem('time', player.getCurrentTime())
    }, 1)
  }
}

// 플레이어 상태가 바뀌었을 때 실행될 함수
var done = false;
function onPlayerStateChange(event) {
  const videoBtn = document.querySelector("#video-btn")
  // 버퍼링 중일 때
  if (event.data==-1) {
    // 플레이리스트 인덱스를 받아와서 현재 재생 중인 비디오 아이디에 넣는다.
    currentVideoId = player.getPlaylistIndex()
  }
  // 재생 중일 때
  else if (event.data == YT.PlayerState.PLAYING && !done) {
    videoBtn.classList.add("bi-pause-fill")
    videoBtn.classList.remove("bi-play-fill")
  }
  // 일시정지 중일 때
  else if (event.data == YT.PlayerState.PAUSED && !done) {
    videoBtn.classList.add("bi-play-fill")
    videoBtn.classList.remove("bi-pause-fill")
  }
  // 끝났을 때
  else if (event.data == YT.PlayerState.ENDED) {
    videoBtn.classList.add("bi-play-fill")
    videoBtn.classList.remove("bi-pause-fill")
  }
  // if (document.querySelector('#song')) {
  //   const song = document.querySelector('#song')
  //   const songImg = song.querySelector('img')
  //   songImg.src = `https://i.ytimg.com/vi/${videoIDs[currentVideoId]}/hqdefault.jpg`
  //   bottomPlayer.classList.add('d-none')
  //   if (document.querySelector('#playlist-bottom')) {
  //     const body = document.querySelector('body')
  //     body.style.overflow = 'hidden'
  //   }
  // } else {
  //   bottomPlayer.classList.remove('d-none')
  // }
  // if (document.querySelector('.playlist')) {
  //   const body = document.querySelector('body')
  //   body.style.overflow = 'hidden'
  // }
}
function playVideo() {
  player.playVideo();
}
function pauseVideo() {
  player.pauseVideo();
}
function stopVideo() {
  player.stopVideo();
}

// 클릭 관련

// 플레이리스트에 추가
document.addEventListener('click', function(e) {
  if (e.target.closest("#song-container")) {
    const bottomPlayer = document.querySelector('#bottom-player')
    slideUp(bottomPlayer, duration=500)
    const songContainer = e.target.closest("#song-container")
    const songId = songContainer.querySelector('div').id
    const songTitle = songContainer.querySelector('p.title').innerText
    const songChannel = songContainer.querySelector('p.channel').innerText

    // 플레이리스트가 존재한다면
    if (videoIDs) {
      // 플레이리스트에 이미 존재하는 노래인지 판단
      // 플레이리스트에 존재한다면
      if (videoIDs.includes(songId)) {
        const idx = videoIDs.indexOf(songId)
        // 가장 마지막 인덱스가 아니라면 기존 인덱스 삭제하고 새로 추가
        if (idx > -1 && idx < videoIDs.length - 1) {
          videoIDs.splice(idx, 1)
          videoIDs.push(songId)
          videoTitles.splice(idx, 1)
          videoTitles.push(songTitle)
          videoChannels.splice(idx, 1)
          videoChannels.push(songChannel)
        }
      // 플레이리스트에 없다면 추가
      } else {
        videoIDs.push(songId)
        videoTitles.push(songTitle)
        videoChannels.push(songChannel)
      }
    } else {
      videoIDs.push(songId)
      videoTitles.push(songTitle)
      videoChannels.push(songChannel)
    }

    window.sessionStorage.setItem('videoIDs', JSON.stringify(videoIDs))
    window.sessionStorage.setItem('videoTitles', JSON.stringify(videoTitles))
    window.sessionStorage.setItem('videoChannels', JSON.stringify(videoChannels))

    player.loadPlaylist( {
      playlist:videoIDs,
      index: videoIDs.length - 1
    } );
  }

  // 플레이리스트 뮤직 재생
  // if (e.target.closest("div.playlist-item")) {
  //   slideUp(bottomPlayer, duration=500)
  //   const playlistMusic = e.target.closest("div.playlist-item").querySelector('div.playlist-vidid')
  //   const playlistTitle = document.querySelector('p.playlist-title').innerText
  //   const playlistChannel = document.querySelector('p.playlist-channel').innerText

  //   const idx = videoIDs.indexOf(playlistMusic.id)
    
  //   player.loadPlaylist( {
  //     playlist:videoIDs,
  //     index: idx
  //   } );

  // }
})

// 하단 플레이어 관련
const bottomPlayer = document.querySelector('#bottom-player')

let isMouseDown = false
let startY, endY

bottomPlayer.addEventListener('mousedown', (e) => {
  isMouseDown = true
  bottomPlayer.classList.add('active')

  startY = e.pageY
})
bottomPlayer.addEventListener('touchstart', (e) => {
  isMouseDown = true
  bottomPlayer.classList.add('active')

  startY = e.pageY
})

bottomPlayer.addEventListener('mouseleave', (e) => {
  endY = e.pageY
  if (isMouseDown && (endY - startY) > 30) {
    slideDown(bottomPlayer, duration=400)
  }

  isMouseDown = false
  bottomPlayer.classList.remove('active')
})

bottomPlayer.addEventListener('mouseup', (e) => {
  endY = e.pageY
  if (isMouseDown && (endY - startY) > 30) {
    slideDown(bottomPlayer, duration=400)
  }

  isMouseDown = false
  bottomPlayer.classList.remove('active')
})
bottomPlayer.addEventListener('touchend', (e) => {
  endY = e.pageY
  if (isMouseDown && (endY - startY) > 0) {
    slideDown(bottomPlayer, duration=400)
  }

  isMouseDown = false
  bottomPlayer.classList.remove('active')
})

let slideDown = (target, duration=500) => {
  player.stopVideo()
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.boxSizing = 'border-box';
  target.style.height = target.offsetHeight + 'px';
  target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout( () => {
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
    //alert("!");
  }, duration);
}

let slideUp = (target, duration=500) => {
  console.log('asdf')
  target.style.removeProperty('display');
  let display = window.getComputedStyle(target).display;

  if (display === 'none')
    display = 'block';

  target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + 'ms';
  target.style.height = height + 'px';
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');
  window.setTimeout( () => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
}
