<template>
    <div class="wrapper" style="padding: 40px;">
        <div class="card">
            <div class="card-body">
                <div class="mb-5">
                    <label for="title" class="form-label"
                        style="font-size: 16px; font-weight: bold; color: gray; padding-top: 17px; padding-left: 20px;">제목</label>
                    <div class="underline-input">
                        <input type="text" id="title" class="form-control" v-model="title">
                        <div class="underline"></div>
                    </div>
                </div>
                <div class="mb-5">
                    <label for="category" class="form-label"
                        style="font-size: 16px; font-weight: bold; color: gray; padding-top: 17px; padding-left: 20px;">분류</label>
                    <div class="underline-input">
                        <select id="category" class="form-control" v-model="category">
                            <option value="1">칭찬</option>
                            <option value="2">불만</option>
                        </select>
                        <div class="underline"></div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="content" class="form-label"
                        style="font-size: 16px; font-weight: bold; color: gray; padding-top: 17px; padding-left: 20px;">내용</label>
                    <div class="underline-input">
                        <div ref="editor"></div>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button @click="saveChanges" class="btn savebtn btn-sm">저장</button>
                        <button @click="deleteBoard" class="btn delbtn btn-sm">삭제</button>
                        <button @click="movePage('/VocList')" class="btn listbtn btn-sm">목록</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <div class="mb-4">
                    <label for="title" class="form-label" style="font-size: 16px; font-weight: bold; color: gray; padding-top: 17px; padding-left: 20px;">지점의견
                        </label>
                    <div v-for="comment in storeVocComments" :key="comment.storeid">
                            <p style="margin-left: 39px;">{{ comment.storecomment }}</p>
                            <div class="d-flex justify-content-end"> 
                            <button class="btn checkbtn btn-sm" @click="confirmHQ">본사확인</button>
                            </div>
                        </div>
                    <div class="underline-input">
                    </div>
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
    name: "HeadVoc",
    data() {
        return {
            vocnum: 0,
            title: '',
            category: 0,
            content: '',
            canEdit: true,
            accounttype: sessionStorage.getItem('accounttype'),
            storeid: sessionStorage.getItem('loginId'),
            editor: null,
            storeVocComments : [],
        };
    },
    computed: {
        categoryText() {
            return this.category === 1 ? '칭찬' : '불만';
        },
    },
    mounted() {
        this.fetchBoardDetail();
        this.storeComments();
    },
    methods: {
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
                    this.storeid = response.data.voc.storeid;
                    this.createEditor();
                })
                .catch(error => {
                    console.error(error);
                });
        },
        storeComments() {
            const vocnum = this.$route.query.vocnum;
            axios
                .get(`http://localhost:8085/voccomments/schnum/${vocnum}`)
                .then(response => {
                    console.log(response.data)
                    this.storeVocComments = response.data.list
                })
                .catch(error => {
                    console.error(error);
                });
        },
        createEditor() {
            this.editor = new Editor({
                el: this.$refs.editor,
                initialValue: this.content,
                viewer: !this.canEdit, 
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
            this.$router.push(url);
        },
        saveChanges() {
            const vocnum = this.vocnum;
            this.content = this.editor.getMarkdown();
            const formData = new FormData();
            formData.append('content', this.content);
            formData.append('category', this.category);
            formData.append('title', this.title);
            formData.append("storeid", this.storeid);

            axios
                .put(`http://localhost:8085/vocs/edit/${vocnum}`, formData)
                .then(response => {
                    console.log(response.data);
                    //저장 후 목록으로 이동하면서 새로고침되어 데이터가 갱신
                    this.$router.push('/VocList').catch(error => {
                        console.error(error);
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        },
        confirmHQ() {
            console.log("click");
            const vocnum = this.$route.query.vocnum;
            axios
                .put(`http://localhost:8085/vocs/checkedit/${vocnum}`)
                .then(response => {
                    if(response.status == 200){
                        console.log(response.data)
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
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
    margin-left: 20px;
    background-color: rgb(172, 172, 172);
}

.editor-container {
    height: 300px;
}

.toastui-editor-contents p {
    padding: 69px;
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

.editbtn:hover {
    background-color: #FFC67B;
    color: #595959;
}

.editbtn {
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
.checkbtn {
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
}
</style>