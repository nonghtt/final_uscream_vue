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
            </div>

            <div class="mt-5">
                <label for="comment" class="form-label" style="font-size: 16px; font-weight: bold; color: gray;">댓글</label>
                <tbody>
                <tr v-for="index in replies" :key="index.voccomnum" @click="reply(index)" style="cursor: pointer;">
                    <td class="bi bi-person-fill me-1"></td>
                    {{ reply.writer }}
                    <td>{{ reply.content }}</td>
                    <td>{{ reply.regDttm }}</td>
                    <td>
                    <button @click="replyEdit(reply.replyNo, reply.content)" class="btn btn-primary btn-sm">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    </td>
                    <td>
                    <button @click="replyDel(reply.replyNo)" class="btn btn-danger btn-sm">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                    </td>
                </tr>
                </tbody>
            </div>

            <div class="card-footer">
                <div class="d-flex justify-content-end">
                    <button @click="movePage('/VocComment')" class="btn btn-warning me-2">
                        <i class="bi bi-pencil-fill me-1"></i>
                        수정
                    </button>
                    <button @click="del" class="btn btn-danger me-2">
                        <i class="bi bi-trash-fill me-1"></i>
                        삭제
                    </button>
                    <button @click="movePage('/VocList')" class="btn btn-secondary">
                        <i class="bi bi-arrow-left-circle-fill me-1"></i>
                        목록
                    </button>
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
            console.log(vocnum)
            axios
                .get(`http://localhost:8085/vocs/schid/${vocnum}`)
                .then(response => {
                    console.log(response.data)
                    this.vocnum = response.data.voc.vocnum;
                    this.title = response.data.voc.title;
                    this.category = response.data.voc.category;
                    this.content = response.data.voc.content;
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
            const vocnum = this.$route.query.vocnum;
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
            const vocnum = this.$route.query.vocnum;
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
