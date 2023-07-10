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
                <div style="height: 300px;">
                    <div class="mb-5">
                        <label for="content" class="form-label"
                            style="font-size: 16px; font-weight: bold; color: gray;">내용</label>
                        <div ref="viewer"></div>
                        <div class="underline-input"></div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="d-flex justify-content-end">
                        <button @click="movePage('/VocList')" class="btn btn-secondary">
                            <i class="bi bi-arrow-left-circle-fill me-1"></i>
                            목록
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container" style="max-width: 800px;">
            <label for="title" class="form-label" style="font-size: 16px; font-weight: bold; color: gray;">댓글보이는 곳</label>
            <!-- 댓글 리스트 출력 -->
            <div v-for="comment in comments" :key="comment.storeid">
                <p>내용: {{ comment.storecomment }}</p>
                <button class="btn btn-sm btn-primary" @click="editComment(comment.voccomnum)">
                수정
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteComment(comment.voccomnum)">
                삭제
                </button>
            </div>
            <hr>

            <!-- 댓글 입력 칸 -->
            <div class="mb-3">
                <label for="cmtContent" class="form-label">댓글 내용</label>
                <textarea id="cmtContent" class="form-control" v-model="cmtContent"></textarea>
            </div>
            <button class="btn btn-secondary" @click="addComment">댓글 저장</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

export default {
    name: 'StoreVoc',
    data() {
        return {
            vocnum: 0,
            title: '',
            category: 0,
            content: '',
            canEdit: true,
            accounttype: sessionStorage.getItem('accounttype'),
            storeid: sessionStorage.getItem('loginId'),
            viewerInstance: null,
            cmtTitle: '', // 댓글 제목
            cmtContent: '', // 댓글 내용
            comments: [] // 댓글 리스트
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
        this.vocDetail();
        console.log("mounted:" + this.storeid)
    },
    methods: {
        detail(item) {
            this.$router.push({
                query: {
                    title: item.title,
                    content: item.content,
                },
            });
        },
        setContent(content) {
            if (this.viewerInstance) {
                this.viewerInstance.setMarkdown(content);
            }
        },
        formatDate(dateString) {
            return dateString.substring(0, 10);
        },
        fetchBoardDetail() {
            const vocnum = this.$route.query.vocnum;
            this.vocnum = vocnum;
            axios
                .get(`http://localhost:8085/vocs/schid/${vocnum}`)
                .then(response => {
                    this.vocnum = response.data.voc.vocnum;
                    this.title = response.data.voc.title;
                    this.category = response.data.voc.category;
                    this.content = response.data.voc.content;
                    this.viewerInstance = new Viewer({
                        el: this.$refs.viewer,
                        initialValue: this.content,
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        },
        movePage(url) {
            this.$router.push(url);

        },
        addComment() {
            if (!this.cmtContent) {
                alert("댓글 내용을 입력하세요.");
                return;
            }

            const formData = new FormData();
            console.log("ggg:" + this.storeid)
            formData.append("storecomment", this.cmtContent);
            formData.append("vocnum", this.vocnum);
            formData.append("storeid", this.storeid);
            console.log(this.storeid);
            console.log(this.accounttype);
            this.$axios
                .post('http://localhost:8085/voccomments', formData, {} )
                .then(response => {
                    console.log(response.data);
                    // 저장 후 목록으로 이동하면서 새로고침되어 데이터가 갱신됨
                    this.vocDetail();

                    // 댓글 입력창 초기화
                    this.cmtContent = '';

                })
                .catch(error => {
                    console.error(error);
                });
        },
        vocDetail() {
            const vocnum = this.$route.query.vocnum;
            axios
                .get(`http://localhost:8085/voccomments/schnum/${vocnum}`)
                .then(response => {
                    this.comments = response.data.list;
                    console.log(response.data.list)
                })
                .catch(error => {
                    console.error(error);
                });
        },
        editComment(comment) {
            // 선택한 댓글의 내용을 입력 필드에 표시하여 수정할 수 있도록 설정합니다.
            this.cmtContent = comment.storecomment;

            // 댓글 입력창으로 자동 스크롤됩니다.
            const commentInput = document.getElementById('cmtContent');
            if (commentInput) {
                commentInput.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // 저장 버튼 클릭 시 수정된 내용을 서버에 전송합니다.
            const formData = new FormData();
            formData.append("voccomnum", comment.voccomnum);
            formData.append("storecomment", this.cmtContent);

            axios
                .put(`http://localhost:8085/voccomments/edit/${comment}`, formData)
                .then(response => {
                    if (response.data.flag) { // 수정 성공 여부를 확인합니다.
                        this.$store.commit('SET_SNACKBAR', {
                            show: true,
                            msg: '수정 완료',
                            color: 'success',
                        });
                        // 댓글 목록을 갱신합니다.
                        this.vocDetail();
                    }
                })
                .catch(error => {
                    console.error(`댓글 수정에 실패했습니다. 오류: ${error.message}`);
                });
        },

        deleteComment(comment) {
            axios
                .delete(`http://localhost:8085/voccomments/del/${comment}`)
                .then(response => {
                    if (response.data.flag) { // 삭제 성공 여부를 확인합니다.
                        this.$store.commit('SET_SNACKBAR', {
                            show: true,
                            msg: '삭제 완료',
                            color: 'error',
                        });
                        // 댓글 목록을 갱신합니다.
                        this.vocDetail();
                    }
                })
                .catch(error => {
                    console.error(`댓글 삭제에 실패했습니다. 오류: ${error.message}`);
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