<template>
    <div>
        <button @click="testGrade">등급 추가 버튼 (한 번만 눌러봐용 호홍)</button>
        <h4>직원 등록</h4>
        <select v-model="selectedGrade" @change="gradeChange()">
            <option :key="0" :value="none">
                --등급 선택--
            </option>
            <option v-for="(item, index) in gradeList" :key="index" :value="item.gnum">
                {{ item.gnum }}
            </option>
        </select>
        <div></div>
        <input value="하이">
    </div>
</template>

<script>
export default {
    name: 'EmpAdd',
    data() {
        return {
            id: sessionStorage.getItem("loginId"),
            storeid: '',
            empname: '',
            joindate: '',
            grade: '',
            color: '',
            gradeList: [],
            selectedGrade: ''
        }
    },
    created: function () {
        const self = this;
        //let storeid = self.id;

        self.$axios.get(`http://localhost:8085/grade/all`)
            .then(function (res) {
                if (res.status == 200 && res.data.flag == true) {
                    self.gradeList = res.data.list;
                    console.log(self.gradeList)
                }
            })


    },
    methods: {
        gradeChange() {
            console.log(this.selectedGrade)
        },
        testGrade() {
            let mul = [1, 1.2, 1.4, 1.6];
            for (let i = 0; i < 4; i++) {
                let formData = new FormData();
                let money = parseInt(9620 * mul[i]);
                money = Math.ceil(money / 10) * 10;

                formData.append("gnum", i + 1);
                formData.append("salary", money);
              
                const self = this;
                self.$axios.post('http://localhost:8085/grade', formData)
                    .then(function (res) {
                        console.log(res.status)
                    })
            }
        }
    }
}
</script>

<style scoped>
</style>