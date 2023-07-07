<template>
    <div>
      <h2>주소를 입력하여 위도와 경도 얻기</h2>
      <div>111
        <label>주소:</label>
        <input type="text" v-model="address" placeholder="주소를 입력하세요" />
        <button @click="getCoordinates">위도, 경도 얻기</button>
      </div>
      <div v-if="coordinates">
        <p>위도: {{ coordinates.latitude }}</p>
        <p>경도: {{ coordinates.longitude }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "AddressGeocoding",
    data() {
      return {
        address: "",
        coordinates: null,
        x:0,
        y:0,
        storeid:'',
        storename:'',
        pwd:'',
        managername:'',
        accounttype: 0
      };
    },
    methods: {
      getCoordinates() {
        if (this.address === "") {
          alert("주소를 입력하세요.");
          return;
        }
  

        
        const encodedAddress = encodeURIComponent(this.address);
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyAEMcBVXcTsB5UmbNou29kkZkSPpq4mDJA`;
  
        axios.get(apiUrl).then((response) => {
            const result = response.data.results[0];
            if (result) {
          
          
              const result = response.data.results[0];



            if (result) {
              const location1 = result.geometry.location;
              this.coordinates = {
                latitude: location1.lat,
                longitude: location1.lng,
              }
            }
              alert(1)
              const location = result.geometry.location;
             

                  this.x = location.x
                  this.y = location.y

                  let formdata = new FormData;

                  const self = this;

                  formdata.append('storeid',self.storeid);
                  formdata.append('storename',self.storename);
                  formdata.append('pwd',self.pwd);
                  formdata.append('managername',self.managername);
                  formdata.append('accounttype',self.accounttype);
                  formdata.append('x',self.x);
                  formdata.append('y',self.y);
                  

              self.$axios.post('http://localhost:8085/store', formdata).then(function(res){
               this.x =res.data.dto.x
                this.y = res.data.dto.y
              })
         
            } else {
              alert("주소를 찾을 수 없습니다.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("주소를 가져오는 도중 오류가 발생했습니다.");
          });
      },
    },
  };
  </script>