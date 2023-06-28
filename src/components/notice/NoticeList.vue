<template>
    <div class="container">
        <div class="card"
            style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0; width: 100%; margin: 0 auto;">
            <div class="card-header" style="font-weight: bold; font-size: 20px;">
                공지사항
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-2">
                        <select class="form-select" v-model="schType">
                            <option value="" disabled selected>검색조건</option>
                            <option value="noticenum">글번호</option>
                            <option value="category">분류</option>
                            <option value="title">제목</option>
                        </select>
                    </div>
                    <div class="col-md-8">
                        <input v-model="schVal" type="text" class="form-control" placeholder="검색어"
                            @keypress.enter.prevent="getBoardList">
                    </div>
                    <div class="col-md-2">
                        <button @click="getBoardList" class="btn btn-primary w-100" style="background-color: #8eb443; border-color:#8eb443" >검색</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th style="text-align: center;">분류</th>
                                    <th style="text-align: center;">글번호</th>
                                    <th style="text-align: center;">제목</th>
                                    <th style="text-align: center;">작성일</th>
                                    <th style="text-align: center;">조회수</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in document" :key="item.noticenum" @click="onClickRow(item)" style="cursor: pointer;">
                                    <td>{{ item.noticenum }}</td>
                                    <td>{{ item.category }}</td>
                                    <td>{{ item.title }}</td>
                                    <td>{{ item.wdate }}</td>
                                    <td>{{ item.cnt }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <button @click="movePage('/Noticelist')" class="btn btn-secondary fab-button"
            style="position: fixed; bottom: 16px; left: 16px;">
            <i class="mdi mdi-pencil" style="color: #757575;"></i>
        </button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            headers: [
                { text: '글 번호', align: 'center', value: 'noticenum' },
                { text: '분류', align: 'center', value: 'category' },
                { text: '제목', align: 'start', value: 'title' },
                { text: '작성일', align: 'center', value: 'wdate' },
                { text: '조회수', align: 'center', value: 'cnt' },
            ],
            document: [],
            options: {
                multiSort: true,
                sortBy: [],
                sortDesc: [],
                page: 1,
                itemsPerPage: 5,
            },
            footerOptions: {
                'items-per-page-options': [5, 10, 25, 50, 100],
            },
            totalCount: 0,
            loading: false,
            conditions: [
                { text: '글 번호', value: 'noticenum' },
                { text: '분류', value: 'category' },
                { text: '제목', value: 'title' },
            ],
            schType: '',
            schVal: '',
        };
    },
    mounted() {
        this.getBoardList();
    },
    watch: {
        options: {
            handler() {
                this.getBoardList();
            },
            deep: true,
        },
    },
    methods: {
        getBoardListAPI(params) {
            return axios.get('/notice/list', { params });
        },
        getBoardDataFromAPI(page, itemsPerPage, sort) {
            const params = {
                schType: this.schType,
                schVal: this.schVal,
                page: page,
                rows: itemsPerPage,
                sort: encodeURIComponent(sort),
            };

            return this.getBoardListAPI(params)
                .then(response => {
                    return response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        getBoardList() {
            const vm = this;
            this.loading = true;

            const { sortBy, sortDesc, page, itemsPerPage } = this.options;
            let sort = [];

            if (sortBy.length > 0) {
                sortBy.forEach((value, index) => {
                    sort.push(
                        value
                            .replace(/[A-Z]/g, str => '_' + str[0])
                            .toUpperCase() +
                        ' ' +
                        (sortDesc[index] ? 'desc' : 'asc')
                    );
                });
            } else {
                sort.push('NOTICENUM desc');
            }

            this.getBoardDataFromAPI(page, itemsPerPage, sort)
                .then(response => {
                    const items = response.data;
                    const total = response.total;

                    setTimeout(() => {
                        vm.loading = false;
                        vm.document = items;
                        vm.totalCount = total;
                    }, 1000);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        onClickRow(event, data) {
            this.movePage('/detail?noticenum=' + data.item.noticenum);
        },
        movePage(path) {
            this.$router.push(path);
        },
    },
};
</script>
