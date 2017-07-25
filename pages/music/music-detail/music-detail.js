var musicsData = require('../../../data/music-data.js');
var app = getApp();
Page({
  data: {
    isPlayingMusics: [],
    musicId: "",
    animationData: {}
  },
  onLoad: function (options) {
    var musicId = options.id;
    var musicData = musicsData.musicList[musicId - 1];
    this.setData({
      musicData: musicData,
      musicId: musicId
    }),
      //动态设置当前页面标题
      wx.setNavigationBarTitle({
        title: musicData.name + "-" + musicData.artists.name,
      })
      //判断进入页面时音乐是否播放
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicId == musicId ) {
      var musicId = this.data.musicId;
      var isPlayingMusics = [];
      isPlayingMusics[musicId - 1] = true
      this.setData({
        isPlayingMusics: isPlayingMusics,
        musicId: musicId,
      })
      //app.globalData.g_isPlayingMusic = true;
    }
    this.setMusicMonitor();
  },
  onShow: function () {
      
    //音乐播放时图片旋转
    var musicId = this.data.musicId;
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicId == musicId) {
      var animation = wx.createAnimation({
        duration: 300000,
        timingFunction: 'linear',
      })
      var i;
      for (i = 1; i < 100; i++) {
        var x = 0;
        x = x + 360 * i;
        this.animation = animation
        animation.rotate(x).step()
        this.setData({
          animationData: animation.export()
        })
      }
    }
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
        // musicId: musicId,
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
      // app.globalData.g_currentMusicId = musicId;
    })
    //音乐停止
    wx.onBackgroundAudioStop(function (event) {
      var musicId = app.globalData.g_currentMusicId;
      var isPlayingMusics = [];
      //isPlayingMusics[musicId - 1] = false
      that.setData({
        isPlayingMusics: isPlayingMusics,
        // musicId: musicId,
      }),
        app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicId = musicId;
    })
  },
  //实现音乐的播放与暂停
  onStartTap: function (event) {
    var musicId = this.data.musicId;
    var musicData = musicsData.musicList[musicId - 1];
    var isPlayingMusic = this.data.isPlayingMusics[musicId - 1];
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      var isPlayingMusics = [];
      // isPlayingMusics[musicId - 1] = false;
      this.setData({
        isPlayingMusics: isPlayingMusics,
        // musicId: musicId,
      })
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicId = musicId;
    }
    else {
      wx.playBackgroundAudio({
        dataUrl: musicData.mp3Url,
        title: musicData.name,
        coverImgUrl: musicData.album.picUrl,
      })
      var isPlayingMusics = [];
      isPlayingMusics[musicId - 1] = true;
      this.setData({
        isPlayingMusics: isPlayingMusics,
        //musicId: musicId,
      }),
        app.globalData.g_currentMusicId = musicId;
      app.globalData.g_isPlayingMusic = true;
      // console.log(app.globalData.g_currentMusicId)
    }
  },
  //切换上一首
  onPreviousTap: function (event) {
    var musicId = this.data.musicId;
    var id = musicId - 1;
    this.setData({
      id: id
    })
    if (id > 0) {
      if (app.globalData.g_isPlayingMusic) {
        var musicData = musicsData.musicList[id - 1];
        wx.playBackgroundAudio({
          dataUrl: musicData.mp3Url,
          title: musicData.name,
          coverImgUrl: musicData.album.picUrl,
        })
      }
      //app.globalData.g_currentMusicId = musicId;
      // app.globalData.g_isPlayingMusic = true;
      wx.redirectTo({
        url: 'music-detail?id=' + id
      })
    }
  },
  //切换下一首
  onNextTap: function (event) {
    var musicId = this.data.musicId;
    musicId++;
    var id = musicId;
    this.setData({
      id: id
    })
    var length = musicsData.musicList.length;
    if (id <= length) {
      if (app.globalData.g_isPlayingMusic) {
        var musicData = musicsData.musicList[id - 1];
        wx.playBackgroundAudio({
          dataUrl: musicData.mp3Url,
          title: musicData.name,
          coverImgUrl: musicData.album.picUrl,
        })
      }
      //app.globalData.g_currentMusicId = id;
      //app.globalData.g_isPlayingMusic = true;
      wx.redirectTo({
        url: 'music-detail?id=' + id
      })
    }

  },
  //音乐详情页面跳转上/下一首时改变全局变量g_currentMusicId
  //onUnload 页面卸载 当 redirectTo 或 navigateBack 的时候调用
  onUnload: function () {
    if (this.data.id < this.data.musicId) {
      app.globalData.g_currentMusicId = this.data.id;
    }
    else if (this.data.id > this.data.musicId) {
      app.globalData.g_currentMusicId = this.data.id;
    }
  },
})