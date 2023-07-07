<template>
  <div class="about">
    <h1>This is an about page</h1>


    <div class="test">

            <!-- 지도 테스트 -->
      <li><router-link class="test" to="/latitude">지도테스트</router-link></li>
      <li><router-link class="test" to="/location">위도출력</router-link></li>
      <li><router-link class="test" to="/latitude">주소입력</router-link></li>
      <li><router-link class="test" to="/marker">합친거</router-link></li>
      <li><router-link class="test" to="/testComponent">아웃라인</router-link></li>
    </div>


    <div>
    <label class="custom-file-upload">
      <input type="file" @change="previewImage" />
      <span>파일 선택</span>
    </label>
    <img :src="previewImageUrl" v-if="previewImageUrl" />
  </div>


  </div>
</template>
<style>
.custom-file-upload {
  display: inline-block;
  padding: 10px 20px;
  background-color: #f0f0f0;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
}

.custom-file-upload input[type="file"] {
  display: none;
}

.custom-file-upload span {
  margin-left: 5px;
}
</style>
<script>
export default {
  data() {
    return {
      previewImageUrl: null
    };
  },
  methods: {
    previewImage(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.previewImageUrl = e.target.result;
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }
};
</script>