<template>
    <div id="elBody">
        <h3>{{ storename }} 직원</h3>
        <div class="row row-cols-1 row-cols-md-3 g-4">
            <div class="col" v-for="emp in list" :key="emp.empnum" :id="emp.empnum">
                <div class="card text-center" style="width: 18rem;" :id="'emp' + emp.empnum">
                    <div class="card-body">
                        <h5 class="card-title">
                            {{ emp.empname }}
                            <span class="color-circle" :style="{ backgroundColor: emp.color }"></span>
                        </h5>
                        <p class="card-text">
                            입사 날짜 {{ emp.joindate }} <br />
                            시급 {{ emp.grade.salary.toLocaleString() }}원
                        </p>

                        <!-- <div class="emps">
                            <router-link to="#" class="btn custom-btn">스케줄 보기</router-link>
                        </div> -->
                        <div>
                            <!-- Button trigger modal -->
                            <button type="button" class="btn custom-btn empsBtn" data-bs-toggle="modal"
                                :data-bs-target="'#editEmp' + emp.empnum"
                                @click="editEmp(emp.grade.grade, emp.joindate, emp.empname, emp.color, emp.empnum)">
                                수정
                            </button>
                            <!-- Button trigger modal -->
                            <button type="button" class="btn custom-btn empsBtn" data-bs-toggle="modal"
                                :data-bs-target="'#delEmp' + emp.empnum">
                                삭제
                            </button>
                            <!-- <button @click='empDel(emp.empnum)' class="btn custom-btn empsBtn">삭제</button> -->
                        </div>
                    </div>
                </div>

                <!-- 수정 Modal -->
                <div class="modal fade" :id="'editEmp' + emp.empnum" tabindex="-1" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">{{ emp.empname }}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="editInput">
                                    <div class="editInputTitle">이름</div>
                                    <input type="text" class="form-control" v-model="editname">
                                </div>
                                <div class="editInput">
                                    <div class="editInputTitle">입사 날짜 </div>
                                    <input type="date" class="form-control" v-model="editJoindate">
                                </div>
                                <div class="editInput">
                                    <label for="empGrade" class="form-label title editInputTitle">등급</label>
                                    <select v-model="selectedGrade" class="form-select">
                                        <option v-for="(item, index) in gradeList" :key="index" :value="item.gnum">
                                            {{ item.gnum }} : {{ item.salary }}
                                        </option>
                                    </select>
                                </div>
                                <div class="editInput">
                                    <div class="editInputTitle">컬러</div>
                                    <input type="color" class="form-control" v-model="editcolor">
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                                <button type="button" class="btn custom-btn" data-bs-dismiss="modal"
                                    @click="editEmp2()">수정</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 삭제 Modal -->
                <div class="modal fade" :id="'delEmp' + emp.empnum" tabindex="-1" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">{{ emp.empname }}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <span class="name">{{ emp.empname }}</span>님을 삭제하시겠습니까? <br />

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                                <button type="button" class="btn custom-btn" data-bs-dismiss="modal"
                                    @click='empDel(emp.empnum)'>삭제</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>


        <div style="padding-bottom:70px"></div>
    </div>
</template> 


<script>
export default {
    name: 'EmpList',
    data() {
        return {
            id: sessionStorage.getItem("loginId"),
            list: [],               // 직원 list 
            storename: '',          // 어느 지점인지 보여주기 위해
            gradeList: [],          // 등급 select list
            editJoindate: null,     // 수정 : 입사날짜
            selectedGrade: '',      // 수정 : 등급
            editname: '',           // 수정 : 이름
            editcolor: null,        // 수정 : 색
            editnum: 0              // 수정 : 직원 num (pk)
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
                    //self.storename = self.list[0].storeid.storename
                    console.log(self.list)
                } else {
                    console.log("에러 :" + res.status)
                }
            });

        // 지점명 불러오기
        self.$axios.get(`http://localhost:8085/store/storeid/${storeid}`)
            .then(function (res) {
                if (res.status == 200) {
                    console.log(res.data);
                    self.storename = res.data.storelist.storename
                } else {
                    console.log("에러 :" + res.status)
                }
            })

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
        // 삭제하기
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
        },
        // 수정 눌렀을 때 기본 정보값 넣어주기 위해서
        editEmp(gradeNum, joindate, empName, empColor, empnum) {
            this.selectedGrade = gradeNum;
            this.editJoindate = joindate
            this.editname = empName
            this.editcolor = empColor
            this.editnum = empnum
        },
        // 찐수정
        editEmp2() {
            const self = this;
            let editForm = new FormData();
            editForm.append("empname", self.editname)
            editForm.append("joindate", self.editJoindate)
            editForm.append("grade", self.selectedGrade)
            editForm.append("color", self.editcolor)
            editForm.append("empnum", self.editnum)

            // 수정하기
            self.$axios.put('http://localhost:8085/emp', editForm)
                .then(function (res) {
                    console.log(res.status)
                    const updatedEmp = self.list.find(emp => emp.empnum === self.editnum);
                    if (updatedEmp) {
                        updatedEmp.empname = self.editname;
                        updatedEmp.joindate = self.editJoindate;
                        updatedEmp.grade = self.gradeList.find(grade => grade.gnum === self.selectedGrade);
                        updatedEmp.color = self.editcolor;
                    }

                })
        }
    }
}
</script>

<style scoped>
@import url(//fonts.googleapis.com/earlyaccess/notosanskr.css);

#elBody {
    width: 70%;
    margin: 0 auto;
    margin-bottom: 50px;
    font-family: 'Noto Sans KR', sans-serif;
}

.custom-btn {
    background-color: #bee96d;
}

.custom-btn:hover {
    background-color: #FFC67B;
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
    width: 50%;
}

h3 {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 30px;
}

.name {
    font-weight: 700;
}

.editInput {
    margin-top: 20px;
    margin-bottom: 20px;
}

.editInputTitle {
    margin-bottom: 5px;
}

.color-circle {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-left: 3px;
    vertical-align: middle;
    margin-bottom: 3px;
}

h3 {
  text-align: left;
}
</style>