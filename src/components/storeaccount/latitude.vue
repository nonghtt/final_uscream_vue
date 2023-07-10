<template>
  <div>
    <div>

      <input class="inputsearch" type="text" v-model="address" placeholder="주소를 입력하세요" />
      <i class="fa-solid fa-magnifying-glass fa-beat-fade fa-2xl" id="icon" @click="showLocation"></i>
    
    </div>
    <div id="map"></div>
    <div>
        {{ msg }}
      </div>
  </div>
</template>

<style scoped>
#map {
  width: 90%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-content: center;
  border-radius: 30px;
    margin-top: 25px;
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
    border:solid;

}
#icon{
  width:50px;
  height:100px;
  z-index:5;
  position:absolute;
  top:455px;
  left:700px;
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
      position:[]
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
              "https://media.istockphoto.com/id/1268251949/ko/%EB%B2%A1%ED%84%B0/%ED%94%8C%EB%9E%AB-%EC%95%A0%EC%99%84-%EB%8F%99%EB%AC%BC-gps-%EB%A1%9C%EA%B3%A0-%EB%94%94%EC%9E%90%EC%9D%B8-%EA%B0%9C-%EB%A7%B5-%EB%A7%88%EC%BB%A4-%EB%B2%A1%ED%84%B0-%EB%8F%99%EB%AC%BC-%EC%82%B0%EC%B1%85%EC%9D%80-%EC%9C%84%EC%B9%98-%EC%9C%84%EC%B9%98%EC%97%90-%EC%A3%BC%EC%9D%98%ED%95%A9%EB%8B%88%EB%8B%A4-%EC%95%A0%EC%99%84-%EB%8F%99%EB%AC%BC-%EC%9B%B9-%EC%9D%91%EC%9A%A9-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8%EC%97%90-%EB%8C%80%ED%95%9C-%EB%84%A4%EB%B9%84%EA%B2%8C%EC%9D%B4%EC%85%98-%EA%B8%B0%ED%98%B8-%EA%B7%80%EC%97%AC%EC%9A%B4-%ED%96%89%EB%B3%B5-%EA%B0%95%EC%95%84%EC%A7%80.jpg?s=612x612&w=0&k=20&c=hBf2iFyW03qcuBKd_WoD8g96ZA6sk1dwHk3SMuZoIQg=", // 강아지 모양 이미지 URL로 변경
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
