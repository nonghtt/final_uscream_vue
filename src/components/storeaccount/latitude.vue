<template>
  <div>
    <div>

      <input class="inputsearch" type="text" v-model="address" placeholder="주소를 입력하세요" />
      <i class="fa-solid fa-magnifying-glass fa-2xl" id="icon"></i>
    </div>
    <div id="map"></div>
    <div>
        {{ msg }}
      </div>
  </div>
</template>

<style scoped>
#map {
  width: 80%;
  left:70px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-content: center;
  border-radius: 30px;
    margin-top: 25px;
    margin-bottom: 25px;
}
.inputsearch{
  text-align: center;
  width:80%;
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
    border:solid;
    border-color: #8eb443;

}
#icon{
  width:50px;
  height:100px;
  z-index:5;
  position:absolute;
  top:529px;
  left:597px;
  border:none;
  z-index:100;
}
</style>

<script>
import axios from "axios";

export default {
  name: "AddressToLocation",
  data() {
    return {
      address: "",
      map: null,
      marker: null,
      msg:'',
      latitude:0, //위도(x)
      longitude:0, //경도(y)
      position:[],
      markerimg:require("../../assets/marker2.png")
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.loadMap();
    } else {
      this.loadScript();
    }
  },
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
        center: new window.kakao.maps.LatLng(37.3399,127.109),
        level: 3
      };

      this.map = new window.kakao.maps.Map(container, options);

      
    },
    showLocation() {
      this.position.length = 0;
      if (this.address === "") {
        alert("주소를 입력하세요.");
        return;
      }
   
      const encodedAddress = encodeURIComponent(this.address);
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyAEMcBVXcTsB5UmbNou29kkZkSPpq4mDJA`;
   
      axios
        .get(apiUrl).then(response => {
          const result = response.data.results[0];
          if (result) {
            
            console.log(result.geometry.location.lat)
            console.log(result.geometry.location.lng)
            const latitude = result.geometry.location.lat;
            const longitude = result.geometry.location.lng;

            this.position.push(latitude)
            this.position.push(longitude)

            console.log(this.position)

            this.$emit("sendposition",this.position)
          
            const position = new window.kakao.maps.LatLng(latitude, longitude);

            if (this.marker) {
              this.marker.setMap(null);
            }

            this.map.setCenter(position);
            this.map.setLevel(3);

            // Custom marker image
            const markerImage = new window.kakao.maps.MarkerImage(
              this.markerimg
              , // 강아지 모양 이미지 URL로 변경
              new window.kakao.maps.Size(50, 50)
            );

            this.marker = new window.kakao.maps.Marker({
              position: position,
              image: markerImage // Custom marker image 설정
            });

            this.marker.setMap(this.map);

          } else {
            alert("주소를 찾을 수 없습니다.");
          }
        })
        .catch(error => {
          console.error("Error:", error);
          alert("주소를 가져오는 도중 오류가 발생했습니다.");
        });
    }
  }
};
</script>
