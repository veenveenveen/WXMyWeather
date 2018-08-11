// pages/lifeStyle.js
var styletype = [["舒适度指数", "穿衣指数"], ["感冒指数", "运动指数"], ["旅游指数", "紫外线指数"], ["洗车指数", "空气污染扩散条件指数"]];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lifeStyle: null,
    styletype: styletype
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getPosition()
  },
  //获取经纬度
  getPosition: function () {
    var that = this;
    console.log("getPosition"),
      wx.getLocation({
        type: 'wgs84',
        altitude: true,
        success: function (res) {
          var latitude = res.latitude;
          var longitude = res.longitude;
          console.log("lat:" + latitude + "lon:" + longitude);
          that.getCity(latitude, longitude)
        },
        fail: function (res) { },
        complete: function (res) { },
      })
  },
  //获取城市信息
  getCity: function (latitude, longitude) {
    var that = this;
    var url = "https://api.map.baidu.com/geocoder/v2/";
    var params = {
      ak: "MfMSSdWm6qEyB636xvANgXhMLswWQvVf",
      output: "json",
      location: latitude + "," + longitude
    };
    wx.request({
      url: url,
      data: params,
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res)
        var city = res.data.result.addressComponent.city;
        var district = res.data.result.addressComponent.district;
        var street = res.data.result.addressComponent.street;
        that.setData({
          city: city,
          district: district,
          street: street
        });
        that.getLifeStyle(city);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getLifeStyle: function(city) {
    var that = this;
    var lifeStyleUrl = "https://free-api.heweather.com/s6/weather/lifestyle";
    var params = {
      location: city,
      key: "34598fd27be644a3bee84dd16a25314d"
    };
    wx.request({
      url: lifeStyleUrl,
      data: params,
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        
        var comf = res.data.HeWeather6[0].lifestyle[0];
        var drsg = res.data.HeWeather6[0].lifestyle[1];
        var flu = res.data.HeWeather6[0].lifestyle[2];
        var sport = res.data.HeWeather6[0].lifestyle[3];
        var trav = res.data.HeWeather6[0].lifestyle[4];
        var uv = res.data.HeWeather6[0].lifestyle[5];
        var cw = res.data.HeWeather6[0].lifestyle[6];
        var air = res.data.HeWeather6[0].lifestyle[7];
        var lifestyle = [[comf, drsg], [flu, sport], [trav, uv], [cw, air]];

        that.setData({
          lifestyle: lifestyle
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})