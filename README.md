# Legacy Todo 애플리케이션

이 애플리케이션은 AWS 애플리케이션 현대화 워크샵을 위한 레거시 Todo 관리 시스템입니다. 이 애플리케이션은 Amazon Q Developer CLI를 활용한 현대화 실습을 위한 기반 코드로 사용됩니다.

## 애플리케이션 개요

이 Todo 애플리케이션은 다음과 같은 레거시 특성을 가지고 있습니다:

- Node.js와 Express 프레임워크 기반의 모놀리식 구조
- 파일 기반 데이터 저장 (JSON 파일 사용)
- 기본적인 HTML/CSS/JavaScript 프론트엔드
- 확장성 및 보안 고려가 부족한 설계

## 기능

- Todo 항목 생성, 조회, 수정, 삭제 (CRUD 기능)
- 필터링 (전체, 진행 중, 완료된 항목)
- 완료된 항목 일괄 삭제

## 디렉토리 구조


/legacy-todo-app
 ├── server.js           # 메인 애플리케이션 서버
 ├── package.json        # 의존성 정의
 ├── package-lock.json
 ├── config/
 │   └── database.js     # 데이터베이스 설정
 ├── models/
 │   └── todo.js         # Todo 모델
 ├── routes/
 │   └── api.js          # API 라우트
 ├── public/
 │   ├── index.html      # 프론트엔드 메인 페이지
 │   ├── css/
 │   │   └── style.css   # 스타일시트
 │   └── js/
 │       └── app.js      # 프론트엔드 로직
 └── tests/
     └── api.test.js     # 간단한 테스트

## 설치 및 실행 방법

### 사전 요구사항

- Node.js (버전 14 이상)
- npm (버전 6 이상)

### 설치

1. 저장소를 복제합니다:

bash
git clone https://github.com/BangShinChul/legacy-todo-app.git
cd ~/legacy-todo-app

2. 의존성을 설치합니다:

bash
npm install

### 실행

애플리케이션을 실행하려면 다음 명령어를 사용합니다:

bash
node server.js

기본적으로 애플리케이션은 http://localhost:3000 에서 실행됩니다.

## API 엔드포인트

이 애플리케이션은 다음과 같은 RESTful API 엔드포인트를 제공합니다:

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| GET    | /api/todos | 모든 Todo 항목 조회 |
| GET    | /api/todos/:id | 특정 ID의 Todo 항목 조회 |
| POST   | /api/todos | 새 Todo 항목 생성 |
| PUT    | /api/todos/:id | 특정 ID의 Todo 항목 수정 |
| DELETE | /api/todos/:id | 특정 ID의 Todo 항목 삭제 |

## 현대화 대상

이 애플리케이션은 다음과 같은 현대화 대상을 포함하고 있습니다:

1. **데이터 저장소 현대화**: 파일 기반 저장소에서 Amazon DynamoDB로 전환
2. **애플리케이션 아키텍처 현대화**: 모놀리식 구조에서 마이크로서비스 아키텍처로 전환
3. **인프라 현대화**: 컨테이너화 및 서버리스 아키텍처 구현
4. **보안 강화**: 입력 유효성 검사, HTTPS 적용, 인증 메커니즘 구현
5. **CI/CD 파이프라인 구축**: 자동화된 테스트 및 배포 프로세스 구현

## 테스트

기본적인 테스트를 실행하려면 다음 명령어를 사용합니다:

bash
npm test

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
