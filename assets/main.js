/*
1. Render song
2. Scroll top : Kéo lên bn thí thu nhỏ bấy nhiêu, kéo xuống bn thì giãn ra bấy nhiêu
3. Các chức năng Play/Pause/Seek 
4. CD rotate
5. Chức năng next / previous.
7. Random song
8. Chức năng next/ repeat khi kết thúc bài hát
9. Scroll active song
10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
//Biến
const cd = $('.cd');
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const playing = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
  isShow: false,
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Muộn rồi mà sao còn",
      singer: "Sơn Tùng MTP",
      path: './assets/music/song1.mp3',
      image: './assets/image/img1.jpg'
    },

    {
      name: "Ai rồi cũng khác",
      singer: "Hamlet Trương",
      path: './assets/music/song2.mp3',
      image: './assets/image/img2.jpg'
    },

    {
      name: "Trên tình bạn dưới tình yêu",
      singer: "Min",
      path: './assets/music/song3.mp3',
      image: './assets/image/img3.jpg'
    },

    {
      name: "Sóng gió",
      singer: "Hương Ly",
      path: './assets/music/song4.mp3',
      image: './assets/image/img4.jpg'
    },

    {
      name: "Nếu có kiếp sau",
      singer: "Hương Ly",
      path: './assets/music/song5.mp3',
      image: './assets/image/img5.jpg'
    },

    {
      name: "Chạy ngay đi",
      singer: "Sơn Tùng MTP",
      path: './assets/music/song6.mp3',
      image: './assets/image/img6.jpg'
    },

    {
      name: "CÔ thắm không về nữa đâu",
      singer: "Phát Hà",
      path: './assets/music/song7.mp3',
      image: './assets/image/img7.jpg'
    },
    {
      name: "Ngắm hoa lệ rơi",
      singer: "Châu Khải Phong",
      path: './assets/music/song8.mp3',
      image: './assets/image/img8.jpg'
    }
  ],
  //load các bài hát lên 
  render: function () {
    const html = this.songs.map((song, index) => {
      return `<div data-index="${index}" class="song ${index === this.currentIndex ? 'active' : ' '}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                          <h3 class="title">${song.name}</h3>
                          <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                          <i class="fas fa-ellipsis-h"></i>
                    </div>
                    <div class="options">
                    <i class="fa fa-download" aria-hidden="true"><a href="#"> Tải xuống</a></i>
                          <i class="fa fa-share-alt-square" aria-hidden="true"><a href="#"> Chia sẽ</a></i>   
                    </div>
              </div>
                `
    })
    //Chia tách các phần tử trong mảng thành chuỗi
    playlist.innerHTML = html.join('')
  },

  // Hàm chứa các thuộc tính
  defineProperties: function () {
    //Trả về audio đầu tiên đc load lên UI,
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex]
      }
    })
  },
  //Sử lý tất cả tấ tcác sự kiện DOM 
  handelEvent: function () {
    //Xử lý quay cd
    const cdThumbAnimate1 = cdThumb.animate([{
      transform: 'rotate(360deg)'
    }
    ], {
      duration: 10000,
      iterations: Infinity
    })
    cdThumbAnimate1.pause()

    // const cdThumbAnimate2 = cdThumb.animate([{
    //   transform: 'scale(0.75)',
    // }
    // ], {
    //     duration: 600,
    //     iterations: Infinity
    //   })
    // cdThumbAnimate2.pause()
    //Xử lí cuộn màn hình => phóng to/ thu nhỏ CD
    const cdWidth = cd.scrollWidth;//Độ dài hiện tại của đĩa cd
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop; //độ dài mới của đĩa cd sau khi scroll 
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    }

    //Xử lí sự kiện play song
    playBtn.onclick = function () {
      cdThumb.style.boxShadow = '0px 10px 60px  pink'
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }

    // Khi song đc playing
    audio.onplay = function () {
      cdThumbAnimate1.play();
      // cdThumbAnimate2.play();
      app.isPlaying = true
      playing.classList.add('playing')
    }

    // Khi song không  đc play
    audio.onpause = function () {
      cdThumbAnimate1.pause();
      // cdThumbAnimate2.pause();
      app.isPlaying = false
      playing.classList.remove('playing')
    }

    //Dịch chuyển theo tến độ bài hát
    audio.ontimeupdate = function () {
      if (audio.duration != NaN) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent;
      }
    }

    //Thay đối tiến độ bài hát
    progress.oninput = function (e) {
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
      audio.play() // Tua không bị giật lát
    }

    //Xử lý nút next bài hát
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.randSong()
      }
      else {
        app.nextSong();
      }
      audio.play();
      app.scrollToActiveSong()
    }

    //Xử lý nút previous bài hát
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.randSong()
      }
      else {
        app.prevSong();
      }
      audio.play();
      app.scrollToActiveSong()
    }

    //Xử lý nút random bài hát
    randBtn.onclick = function () {
      app.isRandom = !app.isRandom
      randBtn.classList.toggle('active', app.isRandom)
    }

    //Xử lý kết thúc bài hát
    audio.onended = function () {
      if (app.isRepeat)
        audio.play()
      else
        nextBtn.click();
    }

    //Xử lý nút repeat
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      repeatBtn.classList.toggle('active', app.isRepeat)
    }

    //Xử lý play song when click on
    playlist.onclick = function (e) {
      const getSong = e.target.closest('.song:not(.active)')
      const getOptions = e.target.closest('.option')
      const optionBtn = $('.option')
      const content = $('.options')


      //Xử lý khi click vào song list
      if (getSong && !getOptions) {
        app.currentIndex = getSong.dataset.index;
        app.loadCurrentSong()
        audio.play()
      }
      //Xử lý khi click vào options
      if (getOptions) {
          content.style.display =' block'
      }
      else
          content.style.display =' none'     
    }
  },

  //Đưa thông tin song hiện tại lên UI
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
    if ($('.song.active')) {
      $('.song.active').classList.remove('active');
    }
    const list = $$('.song');
    list.forEach((song) => {
      if (song.getAttribute('data-index') == this.currentIndex) {
        song.classList.add('active');
      }
    });
  },

  //next Song
  nextSong: function () {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },

  //Xử lý previous song
  prevSong: function () {
    this.currentIndex--
    if (this.currentIndex < 0)
      this.currentIndex = this.songs.length
    this.loadCurrentSong()
  },

  //Xử lý random bài hát
  randSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex == this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      if (this.currentIndex <= 3) {
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      } else {
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 300);
  },
  //Hàm nhận và chạy tất cả các hàm khác có trong aap
  start: function () {
    //Định nghĩa cá thuộc tính cho Object
    this.defineProperties();

    //Load thông tin bài hát lên 
    this.loadCurrentSong();

    // Xử lí các sự kiện (DOM events)
    this.handelEvent();

    //Render playlist ra Music
    this.render();
  }

}


//Chạy tát cả các function có trong file js
app.start();
