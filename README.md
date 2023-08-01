# 🍧 USCREAM(유스크림)
<p align="center"><img src="https://github.com/nonghtt/final_uscream_vue/assets/76997276/71119b6c-78fc-4c92-b86a-da469aee166f"></p>

<div align=center>
  
[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fnonghtt%2Ffinal_uscream_vue&count_bg=%23BEE96D&title_bg=%23474747&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com) 

</div><br/>

# USCREAM (아이스크림 매장 & 판매 관리)
>KOSTA 웹 애플리케이션 구축 프로젝트 기반 FULL-Stack 개발자 양성 과정 257기 파이널 프로젝트 <br/>
>개발기간 : 2023.06.12 ~ 2023.07.12 (31일간)

<br/><br/>

## Team Members 
- 김혜원 : <a href="https://github.com/haeburney">@haeburney</a>
- 김희수 : <a href="https://github.com/Hee-Soo">@Hee-Soo</a>
- 박재연 : <a href="https://github.com/etoile0712">@etoile0712</a>
- 방현중 : <a href="https://github.com/nonghtt">@nonghtt</a>
- 원유경 : <a href="https://github.com/wyk160">@wyk160</a>
- 양승혁 : <a href="https://github.com/Seung-hyuck">@Seung-hyuck</a><br/><br/><br/><br/><br/>



# Project 

## Introduce
유스크림 프로젝트는 KOSTA 257기 파이널 프로젝트로 진행되었습니다.<br/><br/><br/><br/>

## Motivation
프로젝트 회의에서 여러 아이디어가 나왔는데, 이들이 공통적으로 가지고 있던 핵심은 <strong>비즈니스 프로세스 관리</strong>였습니다. 
이후 두 가지 주제로 좁혀졌고, 투표 결과 <strong>"매장 & 상품 관리 프로그램"</strong>으로 결정되었습니다.<br/><br/>
<strong>① 매출 계산</strong><br/> 
매출과 매출에서 원가, 인건비를 제외한 순매출을 계산하는 기능을 통해 년별, 월별, 일별, 지점별 등 다양한 측면에서 캘린더로 매출을 보기 시각적으로 확인할 수 있습니다.<br/><br/>
<strong>② 상품(발주) 관리</strong><br/>
본사는 상품을 추가하거나 삭제할 수 있으며, 지점은 필요한 상품을 신청할 수 있습니다.<br/><br/>
<strong>③ 직원 관리</strong><br/>
지점은 직원을 추가/수정/삭제 할 수 있으며 스케줄 관리를 통하여 해당 날짜에 근무 인원 수를 한 눈에 확인할 수 있습니다. 또한 근태 관리를 통하여 직원의 출퇴근 시간을 파악할 수 있습니다.<br/><br/>
<strong>④ 메일</strong> <br/>
지점이나 본사 계정은 서로 메일을 주고 받을 수 있어, 소통이 용이해집니다.<br/><br/>
<strong>⑤ 공지사항, 고객의 소리</strong> <br/>
본사에서 공지사항을 작성/수정/삭제할 수 있고 지점은 이를 확인 할 수 있습니다. 또한, 고객에게서 온 컴플레인이나 칭찬의 말을 본사에서 작성(전달)하여 지점에서 확인할 수 있습니다. 
컴플레인의 경우, 지점은 해당 글에 댓글로 답변을 작성하는 기능을 구현하여, 지점은 컴플레인에 대한 피드백과 개선 방안을 고려하고, 필요한 조치를 취할 수 있습니다. 이를 통해 소통과 고객 서비스 향상에 기여하게 됩니다.
<br/><br/><br/><br/>


## Features

|구분|관리자(본사)|지점(매장)|
|---|---|---|
|계정 관리|가맹점 아이디 생성|비밀번호 변경|
|공지사항|등록(안내 or 이벤트)|안내, 이벤트(파일 게시판)|
|상품관리|구매/발주 승인, 신제품 등록|구매/발주, 재고 현황 파악|
|직원 관리|표출 메뉴 없음|직원 등록, 업무 스케줄 노출, 출퇴근 시간 노출|
|매출 관리|연도별/월별 매출, 전체, 지점별|연도별/원별/일별 매출, 순매출|
|고객의 소리|전체글|전체글(지점에서 댓글로 답변)|
|메시지|메신저함(발송 가능)|메신저함(발송 가능)|

<br/><br/><br/><br/>

## ERD
<strong>main</strong><br/>
![Uscream](https://github.com/nonghtt/final_uscream_vue/assets/76997276/ad6a64e4-fab6-4bb3-a9ee-189649018578)

<br/><br/><strong>kiosk</strong><br/>
![UscreamKiosk (1)](https://github.com/nonghtt/final_uscream_vue/assets/76997276/ac4e7edc-6c13-4eca-873b-5d2b2237ce08)


<br/><br/><br/><br/>

## Stacks
<h3>Front End</h3>

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)

<h3>Back End</h3>

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Apache Maven](https://img.shields.io/badge/Apache%20Maven-C71A36?style=for-the-badge&logo=Apache%20Maven&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)

<h3>DataBase</h3>

![Oracle](https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white)

<h3>Environment</h3>

![Eclipse](https://img.shields.io/badge/Eclipse-FE7A16.svg?style=for-the-badge&logo=Eclipse&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

<h3>Communication</h3>

![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)

<br/><br/><br/><br/>

<h3>Open API</h3>

<strong>① [KAKAO Maps API](https://apis.map.kakao.com/)</strong><br/>
KAKAO Maps API를 이용하여 가맹점 지도로 검색하는 기능과 지점별 지도 위치를 볼 수 있는 기능을 넣었습니다.<br/><br/>
<strong>② [KAKAO Login REST API](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)</strong><br/>
KAKAO Login REST API를 이용하여 KIOSK 페이지에서 카카오 로그인 기능을 구현했습니다.<br/><br/>
<strong>② [NHN KCP API](https://developer.kcp.co.kr/)</strong><br/>
NHN KCP API를 KIOSK 페이지에서 결제 기능을 구현했습니다.<br/><br/><br/><br/><br/>

## Project Schedule
<strong>Main</strong><br/>
6월 12 ~ 15일 : 주제 선정, 설계<br/>
6월 16 ~ 25일 : Back 구현<br/>
6월 26일 ~ 7월 6일 : Front 구현<br/>
7월 7 ~ 11일 : 디버깅<br/><br/>
<strong>Kiosk</strong><br/>
6월 27일 : 설계<br/>
6월 28일 ~ 7월 4일 : Kiosk Back 구현<br/>
7월 5 ~ 8일 : Kiosk Front 구현<br/><br/><br/><br/><br/>


## Team Member Roles
- 김혜원 : 직원 관리, 근태 관리, 인건비 계산 기능<br/>
- 김희수 : 계정, 지점 기능, 카카오 맵 API 구현, 추가적인 KIOSK 프로그램 기능 구현<br/>
- 박재연 : 공지사항, 고객의 소리 기능<br/>
- 방현중 : GIT 관리, 메일 시스템 구현<br/> 
- 원유경 : 매출 관리 기능 (매출, 순매출)<br/> 
- 양승혁 : 리더, 발주 및 상품 관리 기능, 추가적인 KIOSK 프로그램 기능 구현, 카카오 로그인 API, NHN 결제 구현<br/><br/><br/><br/><br/>

# Installation

<br/><br/><br/><br/>

# 화면 구성 

<strong>Login</strong><br/>

![ulogin](https://github.com/nonghtt/final_uscream_vue/assets/76997276/d38bfcfa-e8ef-4e8d-aeab-717ca2b46599)




<br/><br/><br/><br/>
