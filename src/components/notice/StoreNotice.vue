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
                <div>
                    <div class="mb-3">
                        <label for="content" class="form-label"
                            style="font-size: 16px; font-weight: bold; color: gray;">내용</label>
                        <div ref="viewer"></div>
                        <div class="underline-input">
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="d-flex justify-content-end">
                <button v-if="accounttype === '2'" @click="movePage('/NoticeList')"
                    class="btn btncolor">목록</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

export default {
    name: 'StoreNotice',
    data() {
        return {
            noticenum: 0,
            title: '',
            category: 0,
            content: '',
            canEdit: true,
            accounttype: sessionStorage.getItem('accounttype'),
            editButtonText: '완료',
            viewerInstance: null,
        };
    },
    computed: {
        categoryText() {
            return this.category === 1 ? '칭찬' : '불만';
        },
    },
    mounted() {
        this.fetchBoardDetail();

        if (this.accounttype === '2') {
            this.canEdit = false;
        }
    },
    methods: {
        setContent(content) {
            if (this.viewerInstance) {
                this.viewerInstance.setMarkdown(content);
            }
        },
        fetchBoardDetail() {
            const noticenum = this.$route.query.noticenum;
            axios
                .get(`http://localhost:8085/notices/schid/${noticenum}`)
                .then(response => {
                    this.noticenum = response.data.notice.noticenum;
                    this.title = response.data.notice.title;
                    this.category = response.data.notice.category;
                    this.content = response.data.notice.content;
                    this.viewerInstance = new Viewer({
                        el: this.$refs.viewer,
                        initialValue: this.content,
                    });
                    console.log(this.content);
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
            this.$router.push(url).catch(error => {
                console.error(error);
            });
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
}

</style>

<style scoped>
.btncolor:hover{
  background-color: #FFC67B;
  color:#303030;
}
.btncolor{
    height: 38px;
    color:#303030;
    background-color: #bee96d;
    font-weight: bolder ;
}

</style>
