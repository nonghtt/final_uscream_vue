<template>
    <div style="position:flex;">
        <div class="searchbar">


          <div style="width=300px;"> 매장검색 </div>
          <input type="text" v-model="address" placeholder="주소를 입력하세요" />
          <button @click="searchaddress">검색</button>

          <div v-for="(storename, i) in storenamelist" :key="storename.storeid"  
          @click="showbranchdetail(i)">
          <button class="searchbox">{{ storename.storename }}</button></div>




            <input type="text" v-model="address" placeholder="주소를 입력하세요" />
            <button @click="searchaddress">검색</button>
        </div>
      <div id="map"></div>
    </div>
  </template>
  


  
  <style scoped>
  #map {
    position: fixed;
    top: 76px;
    left: 300px;
    width: 100%;
    height: 100%;
  }
  .searchbar{
    width:300px;
  height:1000px;
  z-index:2;
  background-color: darkgray;
  }
  .searchbox{
  width:300px;
  height:100px;
}
  </style>
  
  <script>
  export default {
    name: "LocationToAddress",
    data() {
      return {
        markerimg:require("../../assets/uscreamlogo.png"),
        latitude: [],
        longitude: [],
        map: null,
        markers: [],
        storelist: [],
        storename:[],
        address:'',
        storenamelist: []

      };
    },
    created: function() {
                const self= this
                self.$axios.get('http://localhost:8085/store').then(function(res){
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
                    const prey = self.storelist[i].y;
                    const storename = self.storelist[i].storename;
                    
                    self.storename.push(storename);
                    self.latitude.push(prex);
                    self.longitude.push(prey);
                  }
                })

            },
    methods: {
            loadScript() {
              const script = document.createElement("script");
              script.src =
                // "//dapi.kakao.com/v2/maps/sdk.js?appkey=3ef0a8044022238ae7c9fb846ea37567&autoload=false";
              script.onload = () => window.kakao.maps.load(this.loadMap.bind(this));
        
              document.head.appendChild(script);
            },
            loadMap() {
                  const container = document.getElementById("map");
                  const options = {
                    center: new window.kakao.maps.LatLng(37.3399, 127.109),
                    level: 9,
                  };
            
                  this.map = new window.kakao.maps.Map(container, options);
                  this.showMarker();
                  },
            showMarker() {
              var imageSrc =
              this.markerimg;
              for (var i = 0; i < this.storelist.length; i++) {
                let lat = this.storelist[i].x;
                let lon = this.storelist[i].y;
                let storename = this.storelist[i].storename
                let position = new window.kakao.maps.LatLng(lat, lon);
        
                // 마커 이미지의 이미지 크기 입니다
                var imageSize = new window.kakao.maps.Size(24, 35);
        
                // 마커 이미지를 생성합니다
                var markerImage = new window.kakao.maps.MarkerImage(
                  imageSrc,
                  imageSize
                );
        
                // 마커를 생성합니다
                new window.kakao.maps.Marker({
                  map: this.map, // 마커를 표시할 지도
                  position: position, // 마커를 표시할 위치
                  title: storename,
                  image: markerImage, // 마커 이미지
                  });
                }
              },
            showbranchdetail(i){
                  let selectlatitude = null
                  let selectlongitude = null
                  console.log(i)
                  selectlatitude = this.latitude[i]
                  selectlongitude = this.longitude[i]
      

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

            
          }
}
}
  </script>
