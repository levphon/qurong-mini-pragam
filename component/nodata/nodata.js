// component/nodata.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      imgsrc:{
          type:String,
          value: app.globalData.nodata
      },
      content:{
          type: String,
          value:'没有找到相关内容'
      }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
