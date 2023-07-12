<template>
    <div class="container">
        <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 20px;">고객의소리</span>
            </div>
            <div class="schbox">
                <label for="category">분류</label>
                <select id="category" v-model="category">
                    <option value="1">칭찬</option>
                    <option value="2">불만</option>
                </select>
            </div>
            
            <div>
                <label for="title">제목</label>
                <input type="text" id="title" v-model="title">
            </div>
            <div ref="editor"></div>
        </div>
        <div class="d-flex justify-content-end">
            <button type="button" class="btn savebtn btn-sm" @click="saveVoc">
                저장
            </button>
            <button type="button" class="btn btncolor btn-sm" @click="goToVocList">
                목록
            </button>
        </div>
    </div>
</template>


<script>
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

export default {
    name: "VocWriter",
    data() {
        return {
            editor: null,
            category: "", // 선택된 분류를 담을 변수
            title: "", // 입력된 제목을 담을 변수
            vocContent: "", // 입력된 공지사항 내용을 담을 변수
            storeid : sessionStorage.getItem('loginId'),
        };
    },
    mounted() {
        const query = this.$route.query;
        this.category = query.category || "";
        this.title = query.title || "";

        this.editor = new Editor({
            el: this.$refs.editor,
            height: "500px",
            initialEditType: "WYSIWYG",
            previewStyle: "vertical", // 세로 모드로 WYSIWYG 미리보기 설정
            events: {
                change: this.handleEditroChange
            }
        });
    },
    methods: {
        handleEditroChange() {
         //   console.log(this.editor.getMarkdown());
            this.vocContent = this.editor.getMarkdown();
          //  console.log(this.vocContent)
        },
        saveVoc() {
            const formData = new FormData();
            formData.append("content", this.vocContent);
            formData.append("category", this.category);
            formData.append("title", this.title);
            formData.append("storeid", this.storeid);
           // console.log(this.vocContent + this.title + this.category + this.storeid);
            this.$axios
                .post('http://localhost:8085/vocs', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then(response => {
                    console.log(response.data);
                    // 저장 후 목록으로 이동하면서 새로고침되어 데이터가 갱신됨
                    this.$router.push("/VocList").catch(error => {
                        console.error(error);
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        },
        goToVocList() {
            // 목록 버튼 클릭 시 바로 이동
            this.$router.push("/VocList").catch(error => {
                console.error(error);
            });
        }
    }
};
</script>

<style scoped>
.btncolor:hover {
    background-color: #FFC67B;
    color: #595959;
}

.btncolor {
    height: 38px;
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
</style>