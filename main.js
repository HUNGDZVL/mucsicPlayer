const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $(".cd");
const PLAYER_STORAGE_KEY ='F8_PLAYER'

const heading = $("header h2");
const cdThum = $(".cd-thumb");
const audio = $("#audio");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const playBtn = $(".btn-toggle-play");
const app = {
  currentIndex: 0, //lay ra chi muc dau tien cua mang
  isPlaying: false, //
  isRandom: false, //
  isRepeat: false, //
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
  setConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },
  songs: [
    //list music
    {
      name: "Yasuo MMA",
      singer: "Alice",
      path: "./assets/music/music1.mp3",
      image: "./assets/img/hinh1.jpg",
    },
    {
      name: "Zed Montage",
      singer: "Poln",
      path: "./assets/music/music2.mp3",
      image: "./assets/img/hinh2.jpg",
    },
    {
      name: "All for love",
      singer: "Join",
      path: "./assets/music/music3.mp3",
      image: "./assets/img/hinh3.jpg",
    },
    {
      name: "Riven MMA",
      singer: "Bob",
      path: "./assets/music/music4.mp3",
      image: "./assets/img/hinh4.jpg",
    },
    {
      name: "Akali Montage",
      singer: "Tommy",
      path: "./assets/music/music5.mp3",
      image: "./assets/img/hinh5.jpg",
    },
    {
      name: "Yasuo MMA",
      singer: "Alice",
      path: "./assets/music/music1.mp3",
      image: "./assets/img/hinh1.jpg",
    },
    {
      name: "Zed Montage",
      singer: "Poln",
      path: "./assets/music/music2.mp3",
      image: "./assets/img/hinh2.jpg",
    },
    {
      name: "All for love",
      singer: "Join",
      path: "./assets/music/music3.mp3",
      image: "./assets/img/hinh3.jpg",
    },
    {
      name: "Riven MMA",
      singer: "Bob",
      path: "./assets/music/music4.mp3",
      image: "./assets/img/hinh4.jpg",
    },
    {
      name: "Akali Montage",
      singer: "Tommy",
      path: "./assets/music/music5.mp3",
      image: "./assets/img/hinh5.jpg",
    },
  ],
  //ham render bai hat trong list songs
  render: function () {
    // get out viewer
    const htmls = this.songs.map((song, index) => {
      //thay doi cac gia tri t????ng ???ng (rander) v??o th??? html th??ng qua map (return c???u tr??c nh??ng thay ?????i gi?? tr??? th??ng qua bi???n n???i suy $)
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                <div class="thumb" style="background-image: url('${
                  song.image
                }')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
    });
    playlist.innerHTML = htmls.join(""); // noi text htmls trong list songs
  },
  //h??m l???y b??i h??t trong list songs
  defineProperties: function () {
    // ham lay bai hat trong list music bat dau tu element[0]
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });

     
  },
  //ham x??? l?? c??c event onlick
  handleEvents: function () {
    //x??? l?? CD quay v?? d???ng
    const cdThumAnimate = cdThum.animate(
      [
        //thuoc tinh quay dia
        { transform: "rotate(360deg)" }, //hanh vi quay 360 do
      ],
      {
        duration: 10000, //10s quay
        iterations: Infinity, //quay vo han
      }
    );
    cdThumAnimate.pause(); //dung lai khi chua playing
    //bat event scroll
    const _this = this; // dat this chung de xu dung o nhieu function khac nhau
    const cdWidth = cd.offsetWidth; // lay width cua cd
    // xu li phong to thu nho CD cdhaeder
    document.onscroll = function () {
      // evetn scroll
      const scrollTop = document.documentElement.scrollTop || window.scrollY; // bat event scroll
      const newcdWidth = cdWidth - scrollTop; //tinh chieu dai cua header cd khi bi thu nho lai do scroll bai hat

      cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0; //chieu dai moi cua header cd khi bi thu nho lai do scroll bai hat va kiem tra xem (toan tu 3 ngoi) neu gia tri am thi mac dinh = 0
      cd.style.opacity = newcdWidth / cdWidth;
    };
    // xu li khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying == false) {
        //neu isplaying = false thi playing va doi gia tri isplaying thanh true
        //ham onplay
        audio.play(); // khi click play thi add class playing
      } else {
        //ham onpause
        audio.pause(); // khi clcik pause thi truyen toi onpause
      }
    };
    //khi song dc play
    audio.onplay = function () {
      //event onplay duoc thuc hien
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumAnimate.play();
    };
    //khi song bi pause
    audio.onpause = function () {
      //event onpause dc thuc hien
      _this.isPlaying = false;
      cdThumAnimate.pause();

      player.classList.remove("playing");
    };

    // khi tien do bai hat thay doi

    audio.ontimeupdate = function () {
      //ham tra lai so giay khi bai hat dc load
      if (audio.duration) {
        //n???u nh?? audio kh??ng ph???i l?? NaN (ki???u s??? kh??ng x??c ?????nh) th?? th???c thi code if(is true)
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        ); //ham lam tron so time
        progress.value = progressPercent; //truyen vao value gia tri tuong ung tung giay cua bai hat trong the input
      }
    };
    //xu li khi tua bai hat
    progress.oninput = (e) => {
      //event onchange khi thay doi gia tri value the input
      const seekTime = ((audio.duration / 100) * e.target.value).toFixed(0); //tong so giay cua bai hat chia cho 100% * gia tri value tuong ung tofixed la tron, e.target l?? l???y to??n b??? th??? ch???a n?? (element) (th??? input)
      audio.currentTime = seekTime;
    };
    
    //khi click nut next bai hat
    nextBtn.onclick = (e) => {
      if (_this.isRandom) {
        //khi random bat thi bat che de random bai hat ngau nhien
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      //goi ham next
      audio.play(); //goi hanh vi play
      _this.render();
      _this.scrollToActiveSong();
    };
    //khi click prev tua bai hat trc
    prevBtn.onclick = (e) => {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      //goi ham prev
      audio.play(); //goi hanh vi play
      _this.render();
      _this.scrollToActiveSong();
    };
    // khi click random/ bat tat che do random
    randomBtn.onclick = (e) => {
      _this.isRandom = !_this.isRandom; // neu gia tri random khac nhau thi
      _this.setConfig('isRandom', _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom); //them active khi click ma k co active va xoa active khi click lai icon
      
    };
    // xu li phat lai mot bai hat
    repeatBtn.onclick = (e) => {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);

      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // xu l?? next song khi b??i h??t k???t th??c
    audio.onended = () => {
      if (_this.isRepeat) {
        audio.play(); //phat lai bai hat
      } else {
        nextBtn.onclick();
      }
    };
    // l???ng nghe click v??o playlist khi click vao bai hat
    playlist.onclick = (e) => {
      const songNode = e.target.closest(".song:not(.active)");
      if (
        //xu li khi click vao songs
        songNode ||
        !e.target.closest(".option")
      ) {
        //closest tra ve element chinh no or the cha cua no neu k co tra ve null
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index); //dataset get value  cua element = getAttribiu
          _this.loadCurrentSong();
          audio.play();
          _this.render();
        }

        //xu li khi click vao song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  //khi scroll khuat man hinh thi goi function delay 500 mml s
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },

  //h??m x??? l?? load b??i h??t theo list song
  loadCurrentSong: function () {
    //ham rander bai hat dau tien ra dao dien

    heading.textContent = this.currentSong.name;
    cdThum.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function(){
      this.isRandom = this.config.isRandom
      this.isRepeat = this.config.isRepeat;

  },
  //event next chuyen sang bai ke tiep
  nextSong: function () {
    this.currentIndex++;
    //kiem tra xem list het chua neu het roi thi quay lai tu dau
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }

    this.loadCurrentSong();
  },

  //even prev tua lai bai trc
  prevSong: function () {
    this.currentIndex--;
    //kiem tra xem list het chua neu het roi thi quay lai tu dau
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }

    this.loadCurrentSong();
  },
  // random song v?? ki???m tra xem c?? b??? l???p l???i hay kh??ng, neu l???p l???i th?? random ti???p khi n??o k tr??ng th?? okok
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex); // neu newIndex bang this.currentIndex thi moi lap
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  //goi tat ca function
  start: function () {
    this.loadConfig();//laod cau hinh tu config vao ung dung

    //get render htmls, event phia tren
    //dinh nghia cac oject
    this.defineProperties();

    // lang nghe event, xu li event trong Dom
    this.handleEvents();

    //tai thong tin bai hat dau tien vao dao dien khi chay ung dung
    this.loadCurrentSong();

    // rander danh sach list music sang htmls
    this.render();
    // hien thi trang thai ban dau cua btn rander repeatBtn
    randomBtn.classList.toggle("active", this.isRandom)
    repeatBtn.classList.toggle("active", this.isRepeat)
  },
};

app.start();
