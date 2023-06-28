<template>
    <div class="container">
        <div class="card" style="box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <div class="card-header">
                <span class="mr-2">Write</span>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" class="form-control" id="title" v-model="title" :maxlength="100" required>
                    <div class="invalid-feedback" v-if="!title || title.length < 3">Min 3 characters</div>
                </div>
                <div>
                    <textarea class="form-control editor" v-model="content"></textarea>
                </div>
            </div>
            <div class="card-footer">
                <div class="d-flex justify-content-end">
                    <button class="btn btn-success btn-sm" @click="save">
                        <i class="mdi mdi-content-save-all"></i> Save
                    </button>
                    <button class="btn btn-secondary btn-sm ml-2" @click="movePage('/NoticeList')">
                        <i class="mdi mdi-arrow-left"></i> Back
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            title: '',
            content: '',
        };
    },
    methods: {
        confirmDialog(title, message) {
            return new Promise(resolve => {
                if (confirm(title + '\n' + message)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        },
        async save() {
            const content = this.content;
            const title = this.title;

            let res = await this.confirmDialog('Confirm Write', 'Do you want to save it?');
            if (res) {
                axios
                    .post('notice/add', {
                        title: title,
                        content: content,
                    })
                    .then(response => {
                        if (response.data > 0) {
                            this.$store.commit('SET_SNACKBAR', {
                                show: true,
                                msg: 'Insert Complete',
                                color: 'success',
                            });
                            this.movePage('/detail?noticenum=' + response.data);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        movePage(path) {
            this.$router.push(path);
        },
    },
};
</script>

<style scoped>
.editor {
    border: 1px solid #ccc;
    min-height: 300px;
    padding: 10px;
}
</style>
