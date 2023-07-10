<template>
    <div id="container">
        <h2>고객의 소리</h2>

        <div v-if="accounttype == 1" class="content">
            본사
            오늘 밤이 어제보다 더워
            딴 사람은 몰라도
            네가 잠들 리는 없어
            그 머릿속에 지금 누가 있어
            그게 나일 수 있는
            그런 방법은 없어?
            하루가 끝나갈 때쯤
            우연히 내 얼굴이 떠오른다거나
            (할지도) 별것도 아닌 이유로
            갑자기 내가 궁금할 수 있지
            예를 들게 그럼 봐봐
        </div>

        <div v-if="accounttype == 2" class="content">
            지점
            오늘 밤이 어제보다 더워
            딴 사람은 몰라도
            네가 잠들 리는 없어
            그 머릿속에 지금 누가 있어
            그게 나일 수 있는
            그런 방법은 없어?
            하루가 끝나갈 때쯤
            우연히 내 얼굴이 떠오른다거나
            (할지도) 별것도 아닌 이유로
            갑자기 내가 궁금할 수 있지
            예를 들게 그럼 봐봐
        </div>

         <!-- 라우터 링크 넣어주세요~! -->
        <button class="btn" id="btncolor">더보기</button>
    </div>
</template>

<script>
export default {
    name: 'IndexVoc',
    data() {
        return {
            id: sessionStorage.getItem("loginId"),
            accounttype: sessionStorage.getItem("accounttype"),
            list: [],
        }
    },
}
</script>

<style scoped>
#container {
    margin: 10px 10px;
    text-align: center;
    overflow: hidden;
     /* 이 위는 바꾸지 마세요~ */
}

.content{
    margin-top:5px;
    overflow: auto;
    max-height: 12em;
     /* 이 위는 바꾸지 마세요~ */
}

#btncolor:hover {
    background-color: #FFC67B;
    color: #595959
}

#btncolor {
    margin-top:5px;
    color: #595959;
    background-color: #bee96d;
    font-weight: bolder;
    border: none;
    padding: 5px 10px;
}
</style>