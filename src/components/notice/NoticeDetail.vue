<template>
    <div class="container" style="max-width: 800px;">
        <div class="card">
            <div class="card-body">
                <div class="mb-5">
                    <label for="title" class="form-label"
                        style="font-size: 16px; font-weight: bold; color: gray;">제목</label>
                    <div class="underline-input">
                        <input type="text" id="title" class="form-control" readonly :value="title">
                        <div class="underline"></div>
                    </div>
                </div>
                <div class="mb-5">
                    <label for="category" class="form-label"
                        style="font-size: 16px; font-weight: bold; color: gray;">분류</label>
                    <div class="underline-input">
                        <input type="text" id="category" class="form-control" readonly :value="categoryText">
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
                    <button @click="moveToEditPage" class="btn btn-warning btn-sm mr-1">수정</button>
                    <button @click="deleteBoard" class="btn btn-danger btn-sm">삭제</button>
                    <button @click="movePage('/NoticeList')" class="btn btn-secondary btn-sm">뒤로 가기</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

const getBoardDetailAPI = (noticenum) =>
    axios
        .get(`http://localhost:8085/notices/schid/${noticenum}`)
        .then((response) => response.data)
        .catch(() => {
            throw new Error('게시글을 불러오는데 실패했습니다.');
        });

const deleteBoardAPI = (noticenum) =>
    axios
        .delete(`http://localhost:8085/notices/del/${noticenum}`)
        .then((response) => {
            if (response.data.flag) {
                return response.data;
            } else {
                throw new Error('게시글 삭제에 실패했습니다.');
            }
        })
        .catch((error) => {
            throw new Error(`게시글 삭제에 실패했습니다. 오류: ${error.message}`);
        });

export default {
    data() {
        return {
            title: '',
            category: 0,
            content: '',
        };
    },
    computed: {
        categoryText() {
            return this.category === 1 ? '칭찬' : '불만';
        },
    },
    mounted() {
        const query = this.$route.query;
        this.noticenum = query.noticenum || '';
        this.title = query.title || '';
        this.category = query.category || 0;
        this.content = query.content || '';

        // 수정 버튼을 눌렀을 때 기존 값을 가져오도록 fetchBoardDetail 메서드 호출
        this.fetchBoardDetail();
    },
    methods: {
        fetchBoardDetail() {
            const noticenum = this.$route.query.noticenum;
            getBoardDetailAPI(noticenum)
                .then((response) => {
                    this.title = response.notice.title;
                    this.category = response.notice.category;
                    this.content = response.notice.content;
                    console.log(response);
                })
                .catch(() => {
                    // 오류 처리
                });
        },
        deleteBoard() {
            const noticenum = this.$route.query.noticenum;
            deleteBoardAPI(noticenum)
                .then((response) => {
                    if (response.flag) {
                        this.$store.commit('SET_SNACKBAR', {
                            show: true,
                            msg: '삭제 완료',
                            color: 'error',
                        });
                        this.movePage('/NoticeList');
                    }
                })
                .catch(() => {
                    // 오류 처리
                });
        },
        movePage(url) {
            this.$router.push(url);
        },
        moveToEditPage() {
            const queryParams = {
                noticenum: this.noticenum,
                title: this.title,
                category: this.category,
                content: this.content,
            };
            this.$router.push({ path: '/NoticeWriter', query: queryParams });
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
