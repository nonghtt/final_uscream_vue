<template>
    <div class="container">
        <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 20px;">공지사항</span>
            </div>

            <div class="mb-5">
                <label for="title" class="form-label"
                    style="font-size: 18px; font-weight: bold; color: gray; padding-top: 17px; padding-left: 20px;">제목</label>
                <div class="underline-input">
                    <input type="text" id="title" class="form-control" v-model="title">
                    <div class="underline"></div>
                </div>
            </div>
            <div ref="editor" style="height: 1000px;"></div>

        </div>
        <div class="d-flex justify-content-end">    
            <button type="button" class="btn savebtn btn-sm" @click="saveNotice">
                저장
            </button>
            <button type="button" class="btn btncolor btn-sm" @click="goToNoticeList">
                목록
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
            noticeContent:null// 입력된 공지사항 내용을 담을 변수
        };
    },
    mounted() {
        const query = this.$route.query;
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
            this.noticeContent = this.editor.getMarkdown();
        },
        saveNotice() {
            if (!this.title || !this.noticeContent) {
                alert("제목과 내용을 입력해주세요.");
                return;
            }
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
</style>
