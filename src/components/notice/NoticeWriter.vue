<template>
    <div class="container">
        <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 20px;">공지사항</span>
            </div>


            <div>
                <label for="title">제목</label>
                <input type="text" id="title" v-model="title">
            </div>
            <div ref="editor"></div>
            <button type="button" class="btn btn-primary mr-2" style="background-color: #8eb443; border-color:#8eb443;"
                @click="goToNoticeList">
                목록
            </button>
            <button type="button" class="btn btn-primary savebtn" style="background-color: #8eb443; border-color:#8eb443;"
                @click="saveNotice">
                저장
            </button>
        </div>
    </div>
</template>

<script>
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

export default {
    name: "NoticeWriter",
    data() {
        return {
            editor: null,
            title: "", // 입력된 제목을 담을 변수
            noticeContent: "" // 입력된 공지사항 내용을 담을 변수
        };
    },
    mounted() {
        const query = this.$route.query;
        this.title = query.title || "";

        this.editor = new Editor({
            el: this.$refs.editor,
            height: "500px",
            initialEditType: "markdown",
            previewStyle: "vertical", // 세로 모드로 WYSIWYG 미리보기 설정
            events: {
                change: this.handleEditroChange
            }
        });
    },
    methods: {
        handleEditroChange() {
            this.noticeContent = this.editor.getMarkdown();
        },
        saveNotice() {
            const formData = new FormData();
            formData.append("content", this.noticeContent);
            formData.append("title", this.title);
            formData.append("storeid", this.storeid);

            this.$axios
                .post('http://localhost:8085/notices', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then(response => {
                    console.log(response.data);
                    // 저장 후 목록으로 이동하면서 새로고침되어 데이터가 갱신됨
                    this.$router.push("/NoticeList").catch(error => {
                        console.error(error);
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        },
        goToNoticeList() {
            // 목록 버튼 클릭 시 바로 이동
            this.$router.push("/NoticeList").catch(error => {
                console.error(error);
            });
        }
    }
};
</script>
