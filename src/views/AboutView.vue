<template>
  <div class="about">
    <h1>This is an about page</h1>


    


  


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