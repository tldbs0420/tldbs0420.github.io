---
layout: post
title: git과 github
subtitle: 분산 버전관리 시스템 git과 협업을 위한 github
tags: [gitblog]
comments: true
---
이번에 유레카 프로젝트에서 git과 github에 대해 배웠다.

# git과 github
여러 명이서 프로그램을 만든다고 생각해보자. 하나의 프로그램에는 상당히 많은 양의 코드가 있을 것이고 그 코드들을 혼자 관리해도 힘든데 여럿이 다루면 관리가 상당히 힘들어진다. 그래서 이때 생겨난 것이 git이다. git이란 분산 버전관리 시스템이다. 내가 다른 사람과 동시에 개발을 하거나 했을 때 코드를 어떻게 합쳐야할까? 그리고 누군가 이미 코드를 더 개발해놨는데 나는 아무것도 모르고 구버전에서 나의 코드를 개발하거나 하면 어떻게 될까? 이런 문제들을 해결하기 위해 git을 사용할 수 있다. 그리고 이런 git을 local 저장소가 보다 더 넓은 범위인 remote 저장소에서 사용할 수 있게 해주는 게 github이다. github로 다른사람들과 쉽게 협업을 할 수 있다.

# git의 명령어
git의 명령어에는 대표적으로 git init, git pull, git status, git add, git commit, git push이 있다.

git init은 현재 디렉토리를 git 저장소로 지정하는 명령어이다.

git pull은 github의 repository의 변경사항들을 로컬 디렉토리로 복사해오는 작업이다. 누군가 나 이전에 push를 했다면 반드시 git pull을 해야한다.

Working Directory에 있는 변경된 파일들을 git add로 stage 시킬 수 있다. git status로 어떤 파일들이 변경되었는지 등을 확인할 수 있다.

git commit을 알기 전에 commit을 먼저 확인해보면 commit은 git에서의 저장단위이다. git add로 stage된 파일들을 commit으로 git의 repository에 한꺼번에 보낼 수 있는 것이다. -m 옵션으로 간단하게 commit을 수행할 수 있다.
> git commit -m "커밋 내용"

git log로 커밋 기록을 확인할 수 있다.

git push는 commit된 내용을 github의 repository로 보내는 역할을 한다.

# branch
branch는 코드의 흐름을 분산시켜주는 기능이다. 기능을 서로 따로 개발한 뒤 branch를 병합시킴으로써 프로그램을 합칠 수 있다.

>git branch <branch 이름>

을 통해 branch를 생성한다.
>git chechout <branch 이름>

을 통해 작업중인 branch를 전환한다.
>git merge <branch 이름>

을 통해 작업중을 branch를 입력한 branch에 병합한다.
>git branch -d <branch 이름>

을 통해 branch를 삭제한다.

---
나는 git을 내가 1학년일 때인 2021학년도 1학기에 소프트웨어프로젝트I 과목에서 처음 배우게 되었다. 이번에 배운 git과 github는 그때 배운 내용과는 크게 다르지 않았기에 복습하는 형태로 수업을 들을 수 있었다.