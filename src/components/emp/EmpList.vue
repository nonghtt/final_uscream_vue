<template>
    <div id="elBody">
        <h3>{{ storename }}점 직원</h3>

        <div class="row row-cols-1 row-cols-md-3 g-4">
            <div class="col" v-for="emp in list" :key="emp.empnum" :id="emp.empnum">
                <div class="card text-center" style="width: 18rem;" :id="'emp' + emp.empnum">
                    <div class="card-body">
                        <h5 class="card-title">{{ emp.empname }}</h5>
                        <p class="card-text">
                            입사 날짜 {{ emp.joindate }} <br />
                            시급 {{ emp.grade.salary.toLocaleString() }}원
                        </p>

                        <div class="emps">
                            <router-link to="#" class="btn custom-btn">스케줄 보기</router-link>
                        </div>
                        <div>
                            <!-- Button trigger modal -->
                            <button type="button" class="btn custom-btn empsBtn" data-bs-toggle="modal" data-bs-target="#exampleModal1">
                                수정
                            </button>                     
                            <button @click='empDel(emp.empnum)' class="btn custom-btn empsBtn">삭제</button>
                        </div>
                    </div>
                </div>

                <!-- Modal -->
                <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">{{ emp.empname }}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div>입사 날짜 <input type="date" :value="emp.joindate"></div>
                                <div>등급</div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                                <button type="button" class="btn custom-btn">수정</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>



    </div>
</template> 


<script>
export default {
    name: 'EmpList',
    data() {
        return {
            id: sessionStorage.getItem("loginId"),
            list: [],
            storename: '',
            editJoindate: null,
            editGrade : '',
            gradeList: []
        };
    },
    created: function () {
        const self = this;
        const storeid = self.id;
        // 직원 정보 불러오기
        self.$axios.get(`http://localhost:8085/emp/storeid/${storeid}`)
            .then(function (res) {
                if (res.status == 200 && res.data.flag == true) {
                    self.list = res.data.list
                    console.log(self.list[0].storeid.storename)
                    self.storename = self.list[0].storeid.storename
                } else {
                    console.log("에러 :" + res.status)
                }
            });

         // grade 셀렉버튼 창 만들어주기 위해서 
         self.$axios.get(`http://localhost:8085/grade/all`)
            .then(function (res) {
                if (res.status == 200 && res.data.flag == true) {
                    self.gradeList = res.data.list;
                    console.log(self.gradeList)
                }
            })
    },
    methods: {
        empDel(empnum) {
            console.log("삭제버튼 클릭 : " + empnum);
            const self = this;
            self.$axios.delete(`http://localhost:8085/emp/${empnum}`)
                .then(function (res) {
                    if (res.status == 200 && res.data.flag == true) {
                        console.log("emp 삭제 성공")
                        document.getElementById(empnum).remove()
                    } else {
                        console.log("emp 삭제 실패")
                    }
                })
        }
    }
}
</script>

<style scoped>
#elBody {
    width: 70%;
    margin: 0 auto;
}

.custom-btn {
    background-color: #B3C755;
}

.custom-btn:hover {
    background-color: #99ab49;
}

.emps {
    margin: 5px 5px;
}

.empsBtn {
    margin: 2px 2px;
}

.modal {
    text-align: center;
}

@media screen and (min-width: 768px) {
    .modal:before {
        display: inline-block;
        vertical-align: middle;
        content: " ";
        height: 100%;
    }
}

.modal-dialog {
    display: inline-block;
    text-align: left;
    vertical-align: middle;
}

h3 {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 30px;
}
</style>