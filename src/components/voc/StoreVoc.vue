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
                        <div class="underline-input">
                        </div>
                    </div>
                </div>
                <hr>
                <div class="d-flex justify-content-end">
                    <button v-if="accounttype === '2'" @click="movePage('/VocList')"
                        class="btn btn-secondary btn-sm">목록</button>
                </div>
                <hr>

                <div class="mb-5">
                    <label for="reply" class="form-label" style="font-size: 16px; font-weight: bold; color: gray;">댓글</label>

                    <!-- 댓글 리스트 -->
                    <div v-for="item in replies" :key="item.voccomnum" class="mb-3">
                        <div>작성자: {{ item.storeid.storename }}</div>
                        <div>댓글 내용: {{ item.storecomment }}</div>
                        <div>작성일시: {{ formatDate(item.wdate) }}</div>
                        <button @click="addComment" class="btn btn-primary" style="background-color: greenyellow;">수정</button>
                        <button @click="delComment" class="btn btn-primary" style="background-color: red;">삭제</button>

                        <hr>
                    </div>

                    <!-- 댓글 작성 칸 -->
                    <div>
                        <label for="commentInput" class="form-label" style="font-size: 16px; font-weight: bold; color: gray;">여기다 댓글 작성해</label>
                        <input type="text" id="commentInput" v-model="newComment" class="form-control mb-3">
                        <button @click="saveComment" class="btn btn-primary">저장</button>
                    </div>
                </div>

            </div>
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
            editButtonText: '완료',
            viewerInstance: null,
            replies:[], //댓글 데이터
            newComment:'',
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

        this.fetchReplies(); //댓글 데이터 불러오기
    },
    methods: {
        detail(item) {
            let name = '';
            if (this.accounttype == 1) {
                name = 'HeadNotice';
            } else if (this.accounttype == 2) {
                name = 'StoreNotice';
            }

            this.$router.push({
                name,
                query: {
                    vocomnum: item.vocomnum,
                    wdate: item.wdate,
                },
            });
        },
        setContent(content) {
            if (this.viewerInstance) {
                this.viewerInstance.setMarkdown(content);
            }
        },
        formatDate(dateString) {
            const formattedDate = dateString.substring(0, 10);
            return formattedDate;
        },
        fetchBoardDetail() {
            const vocnum = this.$route.query.vocnum;
            axios
                .get(`http://localhost:8085/vocs/schid/${vocnum}`)
                .then(response => {
                    this.vocnum = response.data.dto.vocnum;
                    this.title = response.data.dto.title;
                    this.category = response.data.dto.category;
                    this.content = response.data.dto.content;
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
            const vocnum = this.vocnum;
            axios
                .delete(`http://localhost:8085/vocs/del/${vocnum}`)
                .then(response => {
                    if (response.data.flag) {
                        this.$store.commit('SET_SNACKBAR', {
                            show: true,
                            msg: '삭제 완료',
                            color: 'error',
                        });
                        this.movePage('/VocList');
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
            const vocnum = this.vocnum;
            const formData = new FormData();
            formData.append('content', this.content);
            formData.append('category', this.category);
            formData.append('title', this.title);

            axios
                .put(`http://localhost:8085/vocs/edit/${vocnum}`, formData)
                .then(response => {
                    console.log(response.data);
                    // 저장 후 목록으로 이동하면서 새로고침되어 데이터가 갱신됨
                    this.$router.push('/VocList').catch(error => {
                        console.error(error);
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        },

        fetchReplies() { // 화살표 함수로 변경
            axios
                .get('http://localhost:8085/voccomments') // 댓글 데이터를 불러오는 API 엔드포인트
                .then((response) => {
                    console.log(response.data)
                    this.replies = response.data.list; // 댓글 데이터를 replies에 저장
                    //console.log(response.data)
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        replyEdit(reply) {
            const voccomnum = reply.voccomnum;
            const storecomment = reply.storecomment;
            axios
                .put(`http://localhost:8085/voccomments/edit/${voccomnum}`, { storecomment })
                .then(response => {
                    console.log(response.data);
                    // 수정 완료 후 작업 수행
                })
                .catch(error => {
                    console.error(error);
                });
        },

        replyDel(reply) {
            const voccomnum = reply.voccomnum;
            axios
                .delete(`http://localhost:8085/voccomments/del/${voccomnum}`)
                .then(response => {
                    if (response.data.flag) {
                        this.$store.commit('SET_SNACKBAR', {
                            show: true,
                            msg: '삭제 완료',
                            color: 'error',
                        });

                        // 삭제한 댓글을 replies 배열에서 제거
                        const index = this.replies.findIndex(item => item.voccomnum === voccomnum);
                        if (index !== -1) {
                            this.replies.splice(index, 1);
                        }
                    }
                })
                .catch(error => {
                    console.error(`댓글 삭제에 실패했습니다. 오류: ${error.message}`);
                });
        },
        saveComment() {
        const formData = new FormData();
        formData.append('storeid', this.storeid);
        formData.append('storecomment', this.newComment);
        formData.append('vocnum', this.vocnum);
        console.log(this.newComment);
        
        axios
            .post('http://localhost:8085/voccomments', formData)
            .then(response => {
                console.log(response.data)
                if (response.data.flag) {
                  
                    const addedComment = response.data.dto;
                    this.replies.push(addedComment); // 새로운 댓글을 replies 배열에 추가
                    this.newComment = ''; // 댓글 입력 칸 초기화

                    this.$store.commit('SET_SNACKBAR', {
                        show: true,
                        msg: '댓글이 추가되었습니다.',
                        color: 'success'
                    });
                } else{
                    console.log('에러 :'+response.status)
                }
            })
            .catch(error => {
                console.error(`댓글 추가에 실패했습니다. 오류: ${error.message}`);
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
