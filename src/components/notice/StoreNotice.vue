<template>
    <div class="card">
        <div class="card-body" style="padding-bottom: 36px;">
            <div class="mb-5">
                <label for="title" class="form-label"
                    style="font-size: 18px; font-weight: bold; color: gray; padding-top: 63px; padding-left: 180px;">제목</label>
                <div class="underline-input">
                    <input type="text" id="title" class="form-control" v-model="title" :readonly="!canEdit">
                    <hr>
                </div>
            </div>
            <div class="flex-grow-1 overflow-auto" style="display: flex; flex-direction: column; align-items: center;">
                <div class="mb-5">
                    <div ref="viewer"></div>
                    <div class="underline-input">
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center">
            <button v-if="accounttype === '2'" @click="movePage('/NoticeList')"
                class="btn btncolor">목록</button>
        </div>
        <hr>
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

<style scoped>
.underline-input {
    position: relative;
}

.underline-input input {
    border: none;
    outline: none;
    font-size: 16px;
    padding-left: 224px;
    width: 100%;
}

.underline-input .underline {
    width: 81%;
    height: 2px;
    left: 10%;
    background-color: rgb(172, 172, 172);
}

.editor-container {
    height: 300px;
}

textarea.form-control {
    height: 300px;
}

.toastui-editor-contents img {
    margin-left: 330px;
    box-sizing: border-box;
    vertical-align: top;
    max-width: 100%;
}    
</style>




<style scoped>
.btncolor:hover {
    background-color: #FFC67B;
    color: #595959;
}

.btncolor {
    color: #595959;
    background-color: #bee96d;
    font-weight: bolder;
}

.btn-warning {
    color: #595959;
    font-weight: bolder;
}

.btn-danger {
    color: #595959;
    font-weight: bolder;
}

.wrapper {
    max-width: 1200px;
    margin: 0 auto;
    /* 가운데 정렬을 위한 설정 */
}

.form-control {
    height: 32px;
}

.input-group {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    margin-top: 21px;
    margin-right: 163px;
}
</style>
