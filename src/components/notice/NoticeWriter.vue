
<template>
    <div class="container">
        <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 20px;">공지사항</span>
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
            <div id="editor"></div>
            <button type="button" class="btn btn-primary mr-2" style="background-color: #8eb443; border-color:#8eb443;">
                <router-link class="listbtn" to="/NoticeList">목록</router-link>
            </button>
            <router-link class="savebtn" to="/NoticeList" @click="saveNotice">저장</router-link>
        </div>
    </div>
</template>

<script>
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

export default {
    name: 'NoticeWriter',
    data() {
        return {
            editor: null,
            noticeContent: [], // 로컬 데이터로 사용할 변수 선언
            category: '', // 선택된 분류를 담을 변수
            title: '' // 입력된 제목을 담을 변수
        };
    },
    mounted() {
        this.editor = new Editor({
            el: document.querySelector('#editor'),
            height: "500px",
            initialEditType: 'markdown'
        });
    },
    methods: {
        saveNotice() {
            const formData = new FormData();
            const content = this.editor.getMarkdown(); // 공지사항 내용을 가져옴

            formData.append("content", content);
            formData.append("category", this.category);
            formData.append("title", this.title);
            console.log(this.category)
            console.log(this.title)
            this.$axios
                .post('http://localhost:8085/notices', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(response => {
                    // 저장 성공 후의 처리
                    console.log(response.data);
                })
                .catch(error => {
                    // 저장 실패 후의 처리
                    console.error(error);
                });
        }
    }
}
</script>