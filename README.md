# AD Project 블로그 제작
## 20212997 박시윤
나의 프로젝트를 Build하는 과정을 적으라는게 어떤식으로 적여야할지 몰라서 

---
### 테마 적용

영상 4개를 다 보고 나는 제일 먼저 블로그의 테마부터 정하기로 하였다. 블로그의 테마로는 beautiful-jekyll 테마를 골랐다. beautiful-jekyll 테마의 github 링크는 다음과 같다.

> https://github.com/daattali/beautiful-jekyll

beautiful-jekyll에서 주로 수정하는 파일은 다음과 같다.
+ _config.yml
    + 블로그의 설정을 담당하는 파일이다. 블로그 이름 등을 정할 수 있다.
+ index.html
    + home 레이아웃을 사용하여 메인화면을 구성해준다.
+ _posts 폴더
    + 이곳에 포스트를 넣으면 메인화면에 자동으로 나타나게 된다.
+ _layouts 폴더
    + 이곳에 있는 레이아웃을 건드려서 댓글(post.html), Google Analytics(home.html)와의 연동 등을 구현할 것이다.
+ assets 폴더
    + img 폴더
        + 블로그에서 사용될 사진들을 담아놓은 폴더이다. 블로그 프로필 사진인 avatar-icon.png의 수정과 여러 post들의 사진을 넣기 위해서 사용했다.
    + logo 폴더 (직접 추가)
        +pavicon을 구현하기 위한 아이콘 파일들을 담을 폴더이다.
+ _includes 폴더
    + 상당히 많은 파일들이 있고 너무 복잡해서 뭐가 뭔지는 모르겠지만 우리는 pavicon을 구현하기 위해서 이 폴더 안에 있는 head.html을 사용할 것이다.

beautiful-jekyll테마에는 검색 기능, 태그 기능이 처음부터 들어있었다. 따라서 나는 여기에 댓글 기능을 추가하고 블로그의 조회수를 확인하기 위해서 Google Analytics와 블로그를 연동시키려 한다.

---
### 댓글 기능 추가
블로그에 post 글들을 생성하려면 일단 post 레이아웃부터 완성시킬 필요가 있다. 따라서 제일 먼저 댓글 기능을 구현하기로 하였다. 댓글 기능을 구현하는 데에 총 7개의 commit이 발생하였다. 블로그 구조를 파악하는 데에 이해가 필요했고, 이상하게 모든 젬파일들과 모듈파일 등을 추가한 ruby에서 로컬 블로그가 실행되지 않았기 때문에 직접 git repository에 commit하여 확인하는 수 밖에 없었다.

추가한 방법은 블로그 post에 올려두었다 : [바로가기](https://tldbs0420.github.io/2021-12-16-comment/)

댓글 기능 구현을 끝내고 기존에 있던 테스트용 post말고 직접 테스트를 위한 post를 하나 만들어서 실험해보았다. 그 결과 모든 기능들이 구현된 것을 확인할 수 있었다.

---
### Google Analytics와의 연동
블로그에 이미 구현되어 있는 기능들이 많아서 수업시간에 다루어지지 않은 기능으로 무엇을 할 지 고민하다가 Google Analytics를 구현하기로 결정했다.

블로그에 접속하는 사람, 즉 조회수를 확인할 수 있는 방법은 없을까? Google Analytics를 사용하면 가능해진다. 이를 위해 다음 두개의 블로그를 참조하였다.

> https://kim-eun-ji.github.io/etc/2021-05-18-ga/
https://infiduk.github.io/2019/11/05/google-analytics.html

결론적으로 구현에 성공하여 나의 Google Analytics에 들어가면 조회수 양이 보이며 구현 방법은 post에 올려두었다 : [바로가기](https://tldbs0420.github.io/2021-12-16-googleanalytics/)

---
### Favicon 적용
마지막으로 블로그의 탭에서 보이는 사진인 Favicon을 구현하였다. 참고한 블로그는 다음과 같다.

> https://velog.io/@eona1301/Github-Blog-%ED%8C%8C%EB%B9%84%EC%BD%98Favicon-%EC%84%B8%ED%8C%85%ED%95%98%EA%B8%B0

파비콘의 이미지를 고르면서 동시에 테마에서 제공하는 블로그 프로필 이미지도 내 사진으로 변경하였다(조금 부끄럽지만). 블로그 내의 내 사진과 블로그의 Favicon 모두 성공적으로 구현되었다. Favicon 구현 과정은 post에 올려두었다 : [바로가기](https://tldbs0420.github.io/2021-12-16-favicon/)

---
### 마치며
짧은 시간이었지만 이렇게 직접 블로그를 만들어보니 상당히 신선하고 재미있었다. 너무 짧게 배워서 더 복잡한 내용을 배우지 못한 점이 아쉬웠다.
