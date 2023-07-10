<template>
  <div id="container">


  </div>
</template>


<script>
import IndexNetsales from '@/components/index/IndexNetsales.vue';
import IndexNotice from '@/components/index/IndexNotice.vue';
import IndexOrder from '@/components/index/IndexOrder.vue';
import IndexVoc from '@/components/index/IndexVoc.vue';

export default {
  data() {
    return {
      previewImageUrl: null
    };
  },
  components: {
    IndexNetsales,
    IndexNotice,
    IndexOrder,
    IndexVoc
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

<style scoped>
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

.box {
  margin: 15px 15px;
  border: 4px solid #bee96d;
  border-radius: 20px;
  flex-basis: 45%;
  height: 39vh;
}

#container {
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
}


</style>