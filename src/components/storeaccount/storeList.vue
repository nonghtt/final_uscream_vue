<template>
  <div>
      <div class="searchbar">
            <div class="logoplace">

              <h1 class="textjump">
  <span>U</span>
  <span>S</span>
  <span>C</span>
  <span>R</span>
  <span>E</span>
  <span>A</span>
  <span>M</span>
  <span>!</span>
</h1>







            </div>
            <input class="inputsearch" type="text" v-model="address" placeholder="매장명을 입력하세요." />
             <i class="fa-solid fa-magnifying-glass fa-beat-fade fa-2xl" id="icon" @click="searchaddress"></i>
      
          <!-- 검색하면 뿌려지는 DIV -->
          <!-- <div v-for="place in storenamelist" :key="place.storeid"><div class="list.storename">{{ place.store }}</div></div> -->

          <!-- 페이지 onload되면서 전체 리스트 뿌리는 DIV -->
              <div class="results" v-for="(storeinfo, i) in storenamelist" :key="storeinfo.storeid" @click="showbranchdetail(i)">         
                    <div class="storelistbox">
                      <div class="storename" @click="searchaddress">{{ storeinfo.storename }}</div>
                        <img img v-bind:src="'http://localhost:8085/store/img/' + storeinfo.storeid" class="storeimg">
                    </div>
              </div>
      </div>
    
    <div id="map"></div>

  </div>

 
</template>






<script>
export default {
  name: "LocationToAddress",
  data() {
    return {
      markerimg:require("../../assets/marker2.png"),
      latitude: [],
      longitude: [],
      map: null,
      markers: [],
      storelist: [],
      storename:[],           //인포창(마우스오버하면 뜨는 지점정보)에 뜨는 지점명을 위한 변수
      address:'',
      storenamelist:[],       //검색창에 뜨는 지점명 리스트를 위한 변수
      placelist:[]
    };
  },
  created: function() {
      const self= this
      self.$axios.get('http://localhost:8085/store/accounttype/2').then(function(res){
      self.storenamelist = res.data.storelist
      })
    if (window.kakao && window.kakao.maps) {
      this.loadMap();
    } else {
      this.loadScript();
    }
    self.$axios
      .get("http://localhost:8085/store")
      .then(function (res) {
        self.storelist = res.data.storelist;

        for (let i = 0; i < self.storelist.length; i++) {
          const prex = self.storelist[i].x;
          // alert(self.storelist[10].x)
          const prey = self.storelist[i].y;
          const storename = self.storelist[i].storename;
          
          self.storename.push(storename);
          self.latitude.push(prex);
          self.longitude.push(prey);
        }
      })
  },
  mounted(){},
  methods: {
    loadScript() {
      const script = document.createElement("script");
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=3ef0a8044022238ae7c9fb846ea37567&autoload=false";
      script.onload = () => window.kakao.maps.load(this.loadMap.bind(this));

      document.head.appendChild(script);
    },
    loadMap() {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(37.3399, 127.109),
        level: 4,
      };

      this.map = new window.kakao.maps.Map(container, options);
      this.showMarker();
    },
    showMarker() {
  var imageSrc = this.markerimg;

  for (var i = 0; i < this.storelist.length; i++) {
    let lat = this.storelist[i].x;
    let lon = this.storelist[i].y;
    let storename = this.storelist[i].storename;
    let position = new window.kakao.maps.LatLng(lat, lon);
    var imageSize = new window.kakao.maps.Size(50, 50);
    var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

    var marker = new window.kakao.maps.Marker({
      map: this.map,
      position: position,
      title: storename,
      image: markerImage,
      clickable: true
    });

    var iwContent = '<div style="padding:5px;">Hello World!</div>';
    var iwRemoveable = true;

    var infowindow = new window.kakao.maps.InfoWindow({
      content: iwContent,
      removable: iwRemoveable
    });

      window.kakao.maps.event.addListener(marker, 'click', function() {
        infowindow.open(this.map, marker);
    });
  }
},
// 검색된 매장 목록에서 클릭을 통해 해당 지점으로 이동하기 
    showbranchdetail(i){
      let selectlatitude = null
      let selectlongitude = null
      // console.log(this.latitude)
  selectlatitude = this.storenamelist[i].x
  selectlongitude = this.storenamelist[i].y
 
  alert(selectlatitude)
  alert(selectlongitude)

     const position = new window.kakao.maps.LatLng(selectlatitude,selectlongitude);
     this.map.setCenter(position);
            this.map.setLevel(5);

   
          // Custom marker image
          const markerImage = new window.kakao.maps.MarkerImage(
            // 마커이미지 변경필요
              this.markerimg, // 강아지 모양 이미지 URL로 변경
               new window.kakao.maps.Size(50, 50)
            );


            this.marker = new window.kakao.maps.Marker({
              position: position,
              image: markerImage // Custom marker image 설정
            });

            this.marker.setMap(this.map);    
    },
    // 키워드 검색으로 매장검색
    searchaddress(){
      const self =this;
      self.$axios.get('http://localhost:8085/store/storename/'+self.address).then(function(res){
        console.log(res.data.storelist)
        self.storenamelist = res.data.storelist
      })
    }




    
}
}
</script>
<style scoped>
#map {
  position: fixed;
  top: 76px;
  width: 100%;
  height: 100%;
}
.search-menubar{
  height:100px;
  display:flex;
  background-color: #bee96d;
}

.searchbar{
  position: relative;
  z-index:2;
  margin: 29px 14px 27px 27px;
height:795px;
width: 300px;
background-color: rgb(236 237 234 / 70%);
overflow-y: auto;
overflow-x: hidden;
}

/* 통통튀는 글자 넣을 거임 */
.logoplace{
height:75px;
background-color: white;
}
.textjump{
  width: 100%;  
  height: 75px;
  background: #bee96d;
  -webkit-font-smoothing: antialiased;
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  height: 100px;
  vertical-align: middle;
}

h1 span {
  position: relative;
  top: 5px;
  display: inline-block;
  animation: bounce .3s ease infinite alternate;
  font-family: 'Titan One', cursive;
  font-size: 40px;
  color: #FFF;
  text-shadow: 0 1px 0 #0DBC79,
               0 2px 0 #0DBC79,
               0 3px 0 #0DBC79,
               0 4px 0 #0DBC79,
               0 5px 0 #0DBC79,
               0 6px 0 #0DBC79,
               0 7px 0 transparent,
               0 8px 0 transparent,
               0 9px 0 transparent,
               0 10px 10px rgba(0, 0, 0, .4);
}

h1 span:nth-child(2) { animation-delay: .1s; }
h1 span:nth-child(3) { animation-delay: .2s; }
h1 span:nth-child(4) { animation-delay: .3s; }
h1 span:nth-child(5) { animation-delay: .4s; }
h1 span:nth-child(6) { animation-delay: .5s; }
h1 span:nth-child(7) { animation-delay: .6s; }
h1 span:nth-child(8) { animation-delay: .7s; }

@keyframes bounce {
  100% {
    top: -10px;
    text-shadow: 0 1px 0 #bee96d,
                 0 2px 0 #bee96d,
                 0 3px 0 #bee96d,
                 0 4px 0 #bee96d,
                 0 5px 0 #bee96d,
                 0 6px 0 #bee96d,
                 0 7px 0 #CCC,
                 0 8px 0 #CCC,
                 0 9px 0 #CCC,
                 0 50px 25px rgba(0, 0, 0, .2);
  }
}




/* 마우스 스크롤 디자인 */
.searchbar::-webkit-scrollbar {
    width: 10px;
    display: flex;
    background-color: #bee96d;
  }
/* 마우스 스크롤 디자인 (움직이는 부분)*/
  .searchbar::-webkit-scrollbar-thumb {
    background-color:#bee96d;
    border-radius:20px;
    /* border-radius: 10px; */
    background-clip: padding-box;
    border: 2px solid transparent;
  }
/* 마우스 스크롤 디자인 (움직이는 부분외 여백부분)*/
  .searchbar::-webkit-scrollbar-track {
    background-color: grey;
    border-radius:20px;
    /* border-radius: 10px; */
    box-shadow: inset 0px 0px 10px white;
  }

.storename{
  text-align: left;
  border:none;
  margin:10px;
}
.storelistbox{
  padding:10px 10px 10px 10px;
  position:relative;
  text-align: center;
  vertical-align:center;
  width:300px;
  height:100px;
  font-weight: bold;
  border:none;
}
#icon{
  width:50px;
  height:100px;
  z-index:5;
  position:absolute;
  top:119px;
  left:247px;
}
.storeimg{
  position:absolute;
  top:5px;
  right:20px;
  width:90px;
  height:90px;
  z-index:1;
  border-radius: 10px;
}

.search{
  float: right;
  z-index:5;
  left:267px;
  position:fixed;
  width:100%;
  height:100%;
}
.inputsearch{
  text-align: center;
  width:97%;
  height: 70px;
  border-radius: 10px;
  border:none;
  margin:7px 5px 5px 5px;
  display: inline-block;
    line-height: 100px;
    text-align: center;
    font-size: 20px;
    position:relative;
    outline: none;
}

</style>