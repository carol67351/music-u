var musicsData = require('../../data/music-data.js');
var app = getApp();
Page({
  data: {
    isPlayingMusics: [],
    musicId: "",
  },
  onLoad: function (options) {
   // var globalData = app.globalData;
    //console.log(globalData)
    //var musicId = app.globalData.g_currentMusicId;
    //var isPlayingMusics =[false,false,false,false,false];
    this.setData({
      musicList: musicsData.musicList,
    })
  },
  onShow: function (options) {
    var musicId = app.globalData.g_currentMusicId;
    //实现页面再次载入时音乐图标显示正确
    if (app.globalData.g_isPlayingMusic) {
      //var musicId = app.globalData.g_currentMusicId;
      var isPlayingMusics = [];
      isPlayingMusics[musicId - 1] = true
      this.setData({
        isPlayingMusics: isPlayingMusics,
        musicId: musicId,
      })
      //app.globalData.g_isPlayingMusic = true;
    }
    else {
      var isPlayingMusics = [];
      this.setData({
        isPlayingMusics: isPlayingMusics,
        musicId: musicId
      })
    }
    this.setMusicMonitor();
  },
  //监听总控开关与页面开关一致
  setMusicMonitor: function () {
    var that = this;
    //音乐是否播放
    wx.onBackgroundAudioPlay(function (event) {
      var musicId = app.globalData.g_currentMusicId;
      var isPlayingMusics = [];
      isPlayingMusics[musicId - 1] = true
      that.setData({
        isPlayingMusics: isPlayingMusics,
        musicId: musicId,
      }),
        app.globalData.g_isPlayingMusic = true;
     // app.globalData.g_currentMusicId = musicId;
    })
    //音乐是否暂停
    wx.onBackgroundAudioPause(function (event) {
      var musicId = app.globalData.g_currentMusicId;
      var isPlayingMusics = [];
      //isPlayingMusics[musicId - 1] = false
      that.setData({
        isPlayingMusics: isPlayingMusics,
        //musicId: musicId,
      }),
        app.globalData.g_isPlayingMusic = false;
      //app.globalData.g_currentMusicId = musicId;
    })
    //自动播放下一首
    wx.onBackgroundAudioStop(function (event) {
      var musicId = that.data.musicId;
      var length = musicsData.musicList.length;
      if (musicId > 0 && musicId < length) {
        musicId++;
        var musicData = musicsData.musicList[musicId - 1];
        wx.playBackgroundAudio({
          dataUrl: musicData.mp3Url,
          title: musicData.name,
          coverImgUrl: musicData.album.picUrl,
        })
        var isPlayingMusics = [];
        isPlayingMusics[musicId - 1] = true;
        that.setData({
          isPlayingMusics: isPlayingMusics,
          musicId: musicId,
        }),
          app.globalData.g_isPlayingMusic = true;
        app.globalData.g_currentMusicId = musicId;

      }
      else {
        var isPlayingMusics = [];
        isPlayingMusics[musicId - 1] = false
        that.setData({
          isPlayingMusics: isPlayingMusics,
          //musicId: musicId,
        }),
          app.globalData.g_isPlayingMusic = false;
        //app.globalData.g_currentMusicId = null;
      }
    })
  },
  //实现音乐的播放与暂停
  onMusicTap: function (event) {
    var musicId = event.currentTarget.dataset.musicid;
    var musicData = musicsData.musicList[musicId - 1];
    var isPlayingMusic = this.data.isPlayingMusics[musicId - 1];
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      var isPlayingMusics = [];
      //isPlayingMusics[musicId - 1] = false;
      this.setData({
        isPlayingMusics: isPlayingMusics,
        // musicId: musicId,
      }),
        app.globalData.g_isPlayingMusic = false;
      //app.globalData.g_currentMusicId = null;
    }
    else {
      wx.playBackgroundAudio({
        dataUrl: musicData.mp3Url,
        title: musicData.name,
        coverImgUrl: musicData.album.picUrl,
      })
      var isPlayingMusics = [];
      isPlayingMusics[musicId - 1] = true
      this.setData({
        isPlayingMusics: isPlayingMusics,
        musicId: musicId,
      })
      app.globalData.g_currentMusicId = musicId;
      app.globalData.g_isPlayingMusic = true;
      // console.log(app.globalData.g_currentMusicId)
    }
  },
  //音乐详情页面
  onMusicDetailTap: function (event) {
    var musicId = event.currentTarget.dataset.musicid;
    wx.navigateTo({
      url: 'music-detail/music-detail?id=' + musicId
    })
  },
  //轮播图跳转音乐详情页面
  onSwiperTap: function (event) {
    // target 和currentTarget
    // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper
    var musicId = event.target.dataset.musicid;
    wx.navigateTo({
      url: "music-detail/music-detail?id=" + musicId
    })
  }
})