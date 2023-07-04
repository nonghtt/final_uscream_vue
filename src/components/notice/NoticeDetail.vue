<template>
    <div class="container" style="max-width: 800px;">
        <div class="card">
            <div class="card-body">
                <div class="mb-5">
                    <label for="title" class="form-label"
                        style="font-size: 16px; font-weight: bold; color: gray;">제목</label>
                    <div class="underline-input">
                        <input type="text" id="title" class="form-control" v-model="title" :readonly="!canEdit">
                        <div class="underline"></div>
                    </div>
                </div>
                <div class="mb-5">
                    <label for="category" class="form-label"
                        style="font-size: 16px; font-weight: bold; color: gray;">분류</label>
                    <div class="underline-input">
                        <input type="text" id="category" class="form-control" v-model="categoryText" :readonly="!canEdit">
                        <div class="underline"></div>
                    </div>
                </div>
                <div class="mb-5">
                    <label for="content" class="form-label"
                        style="font-size: 16px; font-weight: bold; color: gray;">내용</label>
                    <div class="underline-input">
                        <textarea id="content" class="form-control" v-model="content" :readonly="!canEdit"></textarea>
                    </div>
                </div>
                <hr>
                <div class="d-flex justify-content-end">
                    <button v-if="canEdit" @click="saveChanges" class="btn btn-warning btn-sm mr-1" :disabled="!canEdit">{{
                        editButtonText }}</button>
                    <button v-if="canEdit" @click="deleteBoard" class="btn btn-danger btn-sm">삭제</button>
                    <button v-if="accounttype === '2'" @click="movePage('/NoticeList')"
                        class="btn btn-secondary btn-sm">목록</button>
                    <button v-if="accounttype === '1'" @click="movePage('/NoticeEdit')"
                        class="btn btn-secondary btn-sm">수정</button>
                </div>
        </div>
    </div>
</div></template>




<script>
import axios from 'axios';

export default {
    name: "NoticeDetail",
    data() {
        return {
            noticenum: 0,
            title: '',
            category: 0,
            content: '',
            canEdit: true,
            accounttype: sessionStorage.getItem("accounttype"),
            editButtonText: '완료',

        };
    },
    computed: {
        categoryText() {
            return this.category === 1 ? '칭찬' : '불만';
        },
    },
    mounted() {
        this.fetchBoardDetail();

        if(this.accounttype === '2'){
            this.canEdit = false;
        }
    },
    methods: {
        fetchBoardDetail() {
            const noticenum = this.$route.query.noticenum;
            axios
                .get(`http://localhost:8085/notices/schid/${noticenum}`)
                .then(response => {
                    this.noticenum = response.data.notice.noticenum;
                    this.title = response.data.notice.title;
                    this.category = response.data.notice.category;
                    this.content = response.data.notice.content;
                })
                .catch(error => {
                    console.error(error);
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
            formData.append('category', this.category);
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

textarea.form-control {
    height: 300px;
}</style>
