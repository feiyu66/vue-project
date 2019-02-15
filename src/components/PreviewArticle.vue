<template>
    <div  class="phone-box" v-if="nothingFlag == false">
      <div class="box-title"><p class="tip">{{title}}</p></div>
      <div class="dataOrigin">
        <p class="data">{{publishTime.split(' ')[0]}}</p>
      </div>
      <div class="origin_box">
        <p class="origin">出自：</p>
        <p class="origin_word">{{origin}}</p>
      </div>
      <div class="imageUrl"><img class="imgs" :src="imageUrl + '?x-oss-process=style/dl-m-style'" alt=""></div>
      <div id="words" class="words" v-html="content" ref="html"></div> 

      <!-- Root element of PhotoSwipe. Must have class pswp. -->
      <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

          <!-- Background of PhotoSwipe. 
              It's a separate element as animating opacity is faster than rgba(). -->
          <div class="pswp__bg"></div>

          <!-- Slides wrapper with overflow:hidden. -->
          <div class="pswp__scroll-wrap">

              <!-- Container that holds slides. 
                  PhotoSwipe keeps only 3 of them in the DOM to save memory.
                  Don't modify these 3 pswp__item elements, data is added later on. -->
              <div class="pswp__container">
                  <div class="pswp__item"></div>
                  <div class="pswp__item"></div>
                  <div class="pswp__item"></div>
              </div>

              <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
              <div class="pswp__ui pswp__ui--hidden">

                  <div class="pswp__top-bar">

                      <!--  Controls are self-explanatory. Order can be changed. -->

                      <div class="pswp__counter"></div>

                      <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

                      <button class="pswp__button pswp__button--share" title="Share"></button>

                      <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

                      <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

                      <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
                      <!-- element will get class pswp__preloader--active when preloader is running -->
                      <div class="pswp__preloader">
                          <div class="pswp__preloader__icn">
                            <div class="pswp__preloader__cut">
                              <div class="pswp__preloader__donut"></div>
                            </div>
                          </div>
                      </div>
                  </div>

                  <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                      <div class="pswp__share-tooltip"></div> 
                  </div>

                  <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
                  </button>

                  <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
                  </button>

                  <div class="pswp__caption">
                      <div class="pswp__caption__center"></div>
                  </div>

              </div>

          </div>

      </div>
    </div>
    <p v-else class="nothing">未查询到此文章！</p>
</template>
<script>
import axios from "axios";
import * as PhotoSwipe from "../../static/photoswipe/photoswipe.min.js";
import * as PhotoSwipeUI_Default from "../../static/photoswipe/photoswipe-ui-default.min.js";
import localhost from "../util/localhost";
export default {
  name: "PreviewArticle",
  data() {
    return {
      title: "", // 文章题目
      publishTime: "", // 时间
      origin: "", // 出处
      imageUrl: "", // 图片路径
      content: "<p></p>", // 文章内容
      nothingFlag: false, // 无文章
      items: []
    };
  },
  mounted() {
    let tr = this.$route.query.tr ? this.$route.query.tr : "0";
    let userId = this.$route.query.uid
      ? this.$route.query.uid
      : "13978100708-mbrId";
    let sectionId = this.$route.query.sid ? this.$route.query.sid : "1";
    let articleId = this.$route.query.aid ? this.$route.query.aid : "666";
    let that = this;
    let params = {
      userId: userId
    };
    if (tr == "0") {
      axios
        .get(`${localhost}/health/article/${sectionId}/${articleId}`, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          responseType: "json",
          params: params
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            that.nothingFlag = false;
            that.title = res.data.data.title;
            that.publishTime = res.data.data.publishTime;
            that.origin = res.data.data.origin;
            that.imageUrl = res.data.data.imageUrl;
            that.content = res.data.data.content;
            that.imgData(that)
          } else {
            that.nothingFlag = true;
          }
        });
    } else {
      axios
        .get(`${localhost}/health/article/today`, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          responseType: "json",
          params: params
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            that.nothingFlag = false;
            that.title = res.data.data.title;
            that.publishTime = res.data.data.publishTime;
            that.origin = res.data.data.origin;
            that.imageUrl = res.data.data.imageUrl;
            that.content = res.data.data.content;
            that.imgData(that)
          } else {
            that.nothingFlag = true;
          }
        });
    }
  },
  methods: {
    imgData (that) {
      let imgs = this.content.match(/<img[^>]+>/g);
      this.items = [];
      if (imgs.length != 0) {
        imgs.map(item => {
          item.replace(
            /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
            (match, capture) => {
              this.items.push({
                src: capture,
                w: 600,
                h: 400
              });
            }
          );
          return;
        });
        that.$nextTick(function() {
          // DOM 更新了
          var images = document.getElementsByTagName("img");

          for (var i = 0; i < images.length; i++) {
            (function(index) {
              images[i].onclick = function() {
                var pswpElement = document.querySelectorAll(".pswp")[0];
                var options = {
                  index: index-1
                };
                var gallery = new PhotoSwipe(
                  pswpElement,
                  PhotoSwipeUI_Default,
                  that.items,
                  options
                );
                gallery.init();
              };
            })(i);
          }
        });
      }
    },
    handleClose() {
      console.log("close event");
    },
    onClick() {
      console.log("click event");
      /*
          var pswpElement = document.querySelectorAll('.pswp')[0];

    // build items array
    var items = [
        {
            src: 'https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg',
            w: 964,
            h: 1024
        },
        {
            src: 'https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg',
            w: 1024,
            h: 683
        }
    ];
    
    // define options (if needed)
    var options = {
			 // history & focus options are disabled on CodePen        
      	history: false,
      	focus: false,

        showAnimationDuration: 0,
        hideAnimationDuration: 0
        
    };
    
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
    */
    }
  }
};
</script>
<style scoped>
@import "../../static/photoswipe/photoswipe.css";
@import "../../static/photoswipe/default-skin/default-skin.css";
</style>

<style lang="less" scoped>
.app {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 375px;
  height: 667px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 5px 5px 15px #eeeeee;
  border: 1px solid #cccccc;
}
.nothing {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #cccccc;
  font-size: 2.2vh;
}
.phone-box {
  width: 95%;
  margin: 0 auto;
}
.box-title {
  display: -webkit-flex;
  justify-content: center;
  .tip {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 20px;
    color: rgb(2, 179, 237);
  }
}
.dataOrigin {
  display: -webkit-flex;
  align-items: center;
  margin-top: -10px;
  .data{
    font-size: 13px;
    color: rgb(153, 153, 153);
  }
}
.origin_box{
  display: -webkit-flex;
  margin-top: -15px;
  .origin, .origin_word {
    font-size: 13px;
    color: rgb(153, 153, 153);
    display: inline-block;
  }
  .origin{
    flex: .7;
  }
  .origin_word{
    flex: 3;
  }
}
.imageUrl {
  width: 100%;
  height: 150px;
  margin-bottom: 15px;
  .imgs {
    width: 100%;
    height: 100%;
  }
}
.words {
  display: -webkit-flex;
  flex-direction: column;
  flex-wrap: wrap;
  font-size: 10px;
  color: rgb(51, 51, 51);
  margin-bottom: 100px;
}

</style>


