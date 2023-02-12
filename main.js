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
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    //list music
    {
      name: "Love is Gone",
      singer: "Peter",
      path: "./assets/music/music1.mp3",
      image: "./assets/img/hinh1.jpg",
    },
    {
      name: "Ultil You",
      singer: "Poln",
      path: "./assets/music/music2.mp3",
      image: "./assets/img/hinh2.jpg",
    },
    {
      name: "So far Away",
      singer: "Join",
      path: "./assets/music/music3.mp3",
      image: "./assets/img/hinh3.jpg",
    },
    {
      name: "You are the reason ",
      singer: "Bob",
      path: "./assets/music/music4.mp3",
      image: "./assets/img/hinh4.jpg",
    },
    {
      name: "Ido",
      singer: "911",
      path: "./assets/music/music5.mp3",
      image: "./assets/img/hinh5.jpg",
    },
    {
      name: "Why Not Me",
      singer: "Enrique Iglesias",
      path: "./assets/music/music6.mp3",
      image: "./assets/img/hinh6.jpg",
    },
    {
      name: "Someone Your Love",
      singer: "Lewis",
      path: "./assets/music/music7.mp3",
      image: "./assets/img/hinh7.jpg",
    },
    {
      name: "Take Me To Tour Heart",
      singer: "Ricky",
      path: "./assets/music/music8.mp3",
      image: "./assets/img/hinh8.jpg",
    },
    {
      name: "Dance With Your Ghost",
      singer: "Sloan",
      path: "./assets/music/music9.mp3",
      image: "./assets/img/hinh9.jpg",
    },
    {
      name: "I HATE YOU, I LOVE YOU",
      singer: " Olivia O’brien",
      path: "./assets/music/music10.mp3",
      image: "./assets/img/hinh10.jpg",
    },
  ],
  //ham render bai hat trong list songs
  render: function () {
    // get out viewer
    const htmls = this.songs.map((song, index) => {
      //thay doi cac gia tri tương ứng (rander) vào thẻ html thông qua map (return cấu trúc nhưng thay đổi giá trị thông qua biến nội suy $)
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
  //hàm lấy bài hát trong list songs
  defineProperties: function () {
    // ham lay bai hat trong list music bat dau tu element[0]
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  //ham xử lí các event onlick
  handleEvents: function () {
    //xử lí CD quay và dừng
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
        //nếu như audio không phải là NaN (kiểu số không xác định) thì thực thi code if(is true)
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        ); //ham lam tron so time
        progress.value = progressPercent; //truyen vao value gia tri tuong ung tung giay cua bai hat trong the input
      }
    };
    //xu li khi tua bai hat
    progress.oninput = (e) => {
      //event onchange khi thay doi gia tri value the input
      const seekTime = ((audio.duration / 100) * e.target.value).toFixed(0); //tong so giay cua bai hat chia cho 100% * gia tri value tuong ung tofixed la tron, e.target là lấy toàn bộ thẻ chứa nó (element) (thẻ input)
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
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom); //them active khi click ma k co active va xoa active khi click lai icon
    };
    // xu li phat lai mot bai hat
    repeatBtn.onclick = (e) => {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);

      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // xu lí next song khi bài hát kết thúc
    audio.onended = () => {
      if (_this.isRepeat) {
        audio.play(); //phat lai bai hat
      } else {
        nextBtn.onclick();
      }
    };
    // lắng nghe click vào playlist khi click vao bai hat
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

  //hàm xử lí load bài hát theo list song
  loadCurrentSong: function () {
    //ham rander bai hat dau tien ra dao dien

    heading.textContent = this.currentSong.name;
    cdThum.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
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
  // random song và kiểm tra xem có bị lặp lại hay không, neu lặp lại thì random tiếp khi nào k trùng thì okok
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
    this.loadConfig(); //laod cau hinh tu config vao ung dung

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
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
