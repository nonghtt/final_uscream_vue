<template>
    <div class="container">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span class="font-weight-bold">{{ title }}</span>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col">
                        <p>제목</p>
                        <p>{{ title }}</p>
                    </div>
                </div>
                <p>내용</p>
                <div style="height: 300px;">
                    <div ref="viewer" class="form-control" v-html="content"></div>
                </div>
                <hr>
                <div class="d-flex justify-content-end">
                    <button @click="movePage('/edit?noticenum=' + noticenum)" class="btn btn-warning btn-sm mr-1">
                        수정
                    </button>
                    <button @click="del" class="btn btn-danger btn-sm mr-1">
                        삭제
                    </button>
                    <button @click="movePage('/NoticeList')" class="btn btn-secondary btn-sm">
                        뒤로 가기
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';

const getBoardDetailAPI = noticenum =>
    axios
        .get(`http://localhost:8085/notices/schid/${noticenum}`)
        .then(response => response.data)
        .catch(() => {
            throw new Error('게시글을 불러오는데 실패했습니다.');
        });

const deleteBoardAPI = noticenum =>
    axios
        .delete(`/notices/del/${noticenum}`)
        .then(response => {
            if (response.data.flag) {
                return response.data;
            } else {
                throw new Error('게시글 삭제에 실패했습니다.');
            }
        })
        .catch(error => {
            throw new Error(`게시글 삭제에 실패했습니다. 오류: ${error.message}`);
        });


export default {
    data() {
        return {
            noticenum: 0,
            title: '',
            content: '',
        };
    },
    mounted() {
        this.fetchBoardDetail();
    },
    methods: {
        fetchBoardDetail() {
            const noticenum = this.$route.query.noticenum;
            getBoardDetailAPI(noticenum)
                .then(response => {
                    this.noticenum = response.notice.noticenum;  // 프로퍼티 이름 수정
                    this.title = response.notice.title;          // 프로퍼티 이름 수정
                    this.content = response.notice.content;      // 프로퍼티 이름 수정
                    console.log(response);
                })
                .catch(() => {
                    // 오류 처리
                });
        },
        del() {
            const noticenum = this.noticenum;
            deleteBoardAPI(noticenum)
                .then(response => {
                    if (response > 0) {
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
    },
};
</script>
