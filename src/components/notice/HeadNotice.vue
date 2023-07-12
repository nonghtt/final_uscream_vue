<template>
    <div class="wrapper" style="padding: 40px;">
        <div class="card">
            <div class="card-body">
                <div class="mb-5">
                    <label for="title" class="form-label"
                        style="font-size: 18px; font-weight: bold; color: gray; padding-top: 17px; padding-left: 20px;">제목</label>
                    <div class="underline-input">
                        <input type="text" id="title" class="form-control" v-model="title">
                        <div class="underline"></div>
                    </div>
                </div>
                <div class="mb-5">
                    <label for="content" class="form-label"
                        style="font-size: 18px; font-weight: bold; color: gray; padding-top: 17px; padding-left: 20px;">내용</label>
                    <div class="underline-input">
                        <div ref="editor" class="editor-container"></div>
                    </div>
                </div>
                <div class="d-flex justify-content-end">
                    <button @click="saveChanges" class="btn savebtn btn-sm">저장</button>
                    <button @click="deleteBoard" class="btn delbtn btn-sm">삭제</button>
                    <button @click="movePage('/NoticeList')" class="btn listbtn btn-sm">목록</button>
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
            editor: null,
        };
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
            this.content = this.editor.getMarkdown();
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

<style scoped>
.underline-input {
    position: relative;
}

.underline-input input {
    border: none;
    outline: none;
    font-size: 16px;
    padding-left: 64px;
    width: 100%;
}

.underline-input .underline {
    width: 96%;
    height: 2px;
    left: 2%;
    background-color: rgb(172, 172, 172);
}

.editor-container {
    height: 300px;
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

.savebtn {
    color: #595959;
    font-weight: bolder;
}

.savebtn:hover {
    background-color: #FFC67B;
    color: #595959;
}
.delbtn {
    color: #595959;
    font-weight: bolder;
}
.delbtn:hover {
    background-color: #FFC67B;
    color: #595959;
}
.listbtn {
    color: #595959;
    background-color: #bee96d;
    font-weight: bolder;
}
.wrapper {
    max-width: 1200px;
    margin: 0 auto;
    /* 가운데 정렬을 위한 설정 */
}

.form-control {
    height: 29px;
}

.input-group {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    margin-top: 21px;
    margin-right: 163px;
}</style>
