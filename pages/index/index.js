//index.js
//获取应用实例
const app = getApp()
var day = ["今天", "明天", "后天"];
var hourStatus = ["1", "2", "3", "1", "2", "3", "1", "2", "3", "1", "2", "3"];
// var today = [[["日出", "上午5:17"], ["日落", "上午5:17"]], 
            //  [["降雨概率", "上午5:17"], ["湿度", "上午5:17"]],
            //  [["风速", "上午5:17"], ["体感温度", "上午5:17"]],
            //  [["降水量", "上午5:17"], ["气压", "上午5:17"]],
            //  [["能见度", "上午5:17"], ["紫外线指数", "上午5:17"]],
            //  [["空气质量指数", "上午5:17"], ["空气质量", "上午5:17"]]];
Page({
  data: {
    day: day,
    hourStatus: hourStatus,//测试
    // today: today
  },
  onLoad: function () {
    console.log("on load");
    var that = this;
    
    that.getPosition()
  },
  //获取经纬度
  getPosition: function() {
    var that = this;
    console.log("getPosition"),
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        console.log("lat:" + latitude + "lon:" + longitude);
        that.getCity(latitude, longitude)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //获取城市信息
  getCity: function(latitude,longitude) {
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
      success: function(res) {
        // console.log(res)
        var city = res.data.result.addressComponent.city;
        var district = res.data.result.addressComponent.district;
        var street = res.data.result.addressComponent.street;
        that.setData({
          city: city,
          district: district,
          street: street
        });
        that.getWeather(city);
        
        app.globalData.curretCity = city;

        wx.stopPullDownRefresh()//停止下拉刷新
        wx.hideNavigationBarLoading();
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //获取天气信息
  getWeather: function(city) {
    var that = this;
    var url = "https://free-api.heweather.com/s6/weather";
    var quityUrl = "https://free-api.heweather.com/s6/air/now"; 
    var hourlyUrl = "https://free-api.heweather.com/s6/weather/hourly";
    var params = {
      location: city,
      key: "34598fd27be644a3bee84dd16a25314d"
    };
    //实况天气
    wx.request({
      url: url,
      data: params,
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res)
        var temp = res.data.HeWeather6[0].now.tmp;//当前温度
        var cond_txt = res.data.HeWeather6[0].now.cond_txt;//实况天气状况描述
        var wind_sc = res.data.HeWeather6[0].now.wind_sc;//风力
        var wind_dir = res.data.HeWeather6[0].now.wind_dir;//风向
        var hum = res.data.HeWeather6[0].now.hum;//相对湿度
        var fl = res.data.HeWeather6[0].now.fl;//体感温度
        var pcpn = res.data.HeWeather6[0].now.pcpn;//降水量
        var wind_spd = res.data.HeWeather6[0].now.wind_spd;//风速，公里/小时
        var pres = res.data.HeWeather6[0].now.pres;//大气压强
        var vis = res.data.HeWeather6[0].now.vis;//能见度，默认单位：公里
        var cloud = res.data.HeWeather6[0].now.cloud;//云量
        //预报天气
        var daily_forecast = res.data.HeWeather6[0].daily_forecast;//三天内的预报
        that.setData({
          temp: temp,
          cond_txt: cond_txt,
          wind_sc: wind_sc,
          hum: hum,
          fl: fl,
          daily_forecast: daily_forecast,
          today: [[["日出", daily_forecast[0].sr], ["日落", daily_forecast[0].ss]],
            [["降雨概率", daily_forecast[0].pop+"%"], ["湿度", daily_forecast[0].hum+"%"]],
            [["风速", daily_forecast[0].wind_spd +"公里/小时"], ["体感温度", fl]],
            [["降水量", daily_forecast[0].pcpn+"毫米"], ["气压", daily_forecast[0].pres+"百帕"]],
            [["能见度", daily_forecast[0].vis+"公里"], ["紫外线指数", daily_forecast[0].uv_index]]]
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    //quity 空气质量 
    wx.request({
      url: quityUrl,
      data: params,
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res)
        var aqi = res.data.HeWeather6[0].air_now_city.aqi;
        var qlty = res.data.HeWeather6[0].air_now_city.qlty;
        that.setData({
          qlty: qlty,
          aqi: aqi
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    //hourly request 每小时天气
    wx.request({
      url: hourlyUrl,
      data: params,
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res)//暂时获取不到************************
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    console.log("刷新");
    var that = this;
    that.getPosition()
  },

  onShow: function() {
    var that = this;
    that.getPosition()
  },
  onHide: function() {
    
  }
})
