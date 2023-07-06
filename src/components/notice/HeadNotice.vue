<template>
    <div class="container" style="max-width: 800px;">
        <div class="card">
            <div class="card-body">
                <div class="mb-5">
                    <label for="title" class="form-label"
                        style="font-size: 16px; font-weight: bold; color: gray;">제목</label>
                    <div class="underline-input">
                        <input type="text" id="title" class="form-control" v-model="title">
                        <div class="underline"></div>
                    </div>
                </div>
                <div class="mb-5">
                    <label for="content" class="form-label"
                        style="font-size: 16px; font-weight: bold; color: gray;">내용</label>
                    <div class="underline-input">
                        <div ref="editor" class="editor-container"></div>
                    </div>
                </div>
                <hr>
                <div class="d-flex justify-content-end">
                    <button @click="saveChanges" class="btn btn-warning btn-sm mr-1">{{ editButtonText }}</button>
                    <button @click="deleteBoard" class="btn btn-danger btn-sm">삭제</button>
                    <button @click="movePage('/NoticeList')" class="btn btn-secondary btn-sm">목록</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

export default {
    name: "HeadNotice",
    data() {
        return {
            noticenum: 0,
            title: '',
            content: '',
            canEdit: true,
            editButtonText: '완료',
            editor: null,
        };
    },
    computed: {
        categoryText() {
            return this.category === 1 ? '칭찬' : '불만';
        },
    },
    mounted() {
        this.fetchBoardDetail();
    },
    methods: {
        fetchBoardDetail() {
            const noticenum = this.$route.query.noticenum;
            axios
                .get(`http://localhost:8085/notices/schid/${noticenum}`)
                .then(response => {
                    this.noticenum = response.data.notice.noticenum;
                    this.title = response.data.notice.title;
                    this.content = response.data.notice.content;
                    this.createEditor();
                })
                .catch(error => {
                    console.error(error);
                });
        },
        createEditor() {
            this.editor = new Editor({
                el: this.$refs.editor,
                initialValue: this.content,
                viewer: !this.canEdit, // Set viewer option based on edit mode
            });
        },
        deleteBoard() {
            const noticenum = this.noticenum;
            axios
                .delete(`http://localhost:8085/notices/del/${noticenum}`)
                .then(response => {
                    if (response.data.flag) {
                        this.$store.commit('SET_SNACKBAR', {
                            show: true,
                            msg: '삭제 완료',
                            color: 'error',
                        });
                        this.movePage('/NoticeList');
                    }
                })
                .catch(error => {
                    console.error(`게시글 삭제에 실패했습니다. 오류: ${error.message}`);
                });
        },
        movePage(url) {
            this.$router.push(url);
        },
        saveChanges() {
            const noticenum = this.noticenum;
            const formData = new FormData();
            formData.append('content', this.content);
            formData.append('title', this.title);

            axios
                .put(`http://localhost:8085/notices/edit/${noticenum}`, formData)
                .then(response => {
                    console.log(response.data);
                    // 저장 후 목록으로 이동하면서 새로고침되어 데이터가 갱신됨
                    this.$router.push('/NoticeList').catch(error => {
                        console.error(error);
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        },
    },
};
</script>

<style>
.underline-input {
    position: relative;
}

.underline-input input {
    border: none;
    outline: none;
    font-size: 16px;
    padding: 4px 0;
    width: 100%;
}

.underline-input .underline {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: #000;
}

.editor-container {
    height: 300px;
}
</style>
