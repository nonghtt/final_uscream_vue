<template>
    <div>
        <!-- Button trigger modal -->
        <button type="button" class="btn btncolor" data-bs-toggle="modal" data-bs-target="#exampleModal">
            스케줄 추가
        </button>

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog  modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btncolor">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

</script>

<style scoped>
.btncolor:hover {
  background-color: #FFC67B;
  color: #595959;
}

.btncolor {
  color: #595959;
  background-color: #bee96d;
  font-weight: bolder;
  margin-top:5px;
  margin-bottom:5px;
}
</style>