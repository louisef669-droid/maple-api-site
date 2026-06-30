# 🍁 Maple Crystal Manager (MCM)

## 프로젝트 소개

Maple Crystal Manager는 메이플스토리 캐릭터의
주간 결정석 수익을 관리하는 웹 프로젝트이다.

현재 목표

- 여러 계정(프리셋) 관리
- 캐릭터별 결정석 관리
- 주간 수익 계산
- 계정 통계
- 빠른 캐릭터 조회
- 직관적인 Dashboard 제공

---

## 개발 환경

Framework
- Next.js 16
- React
- TypeScript

배포
- Vercel

데이터

- localStorage
- Nexon Open API

---

## 현재 기능

### 캐릭터 조회

- 캐릭터 검색
- 최근 검색 저장
- 마지막 조회 캐릭터 자동 복원

### 즐겨찾기

- 즐겨찾기 등록
- 순서 변경
- 삭제

### 프리셋

- 프리셋 생성
- 삭제
- 이름 변경
- 프리셋별 즐겨찾기 분리
- 프리셋별 최근검색 분리
- 프리셋별 활성 캐릭터 분리

### Dashboard

- 현재 캐릭터 수익
- 현재 프리셋 총 수익
- 전체 프리셋 총 수익
- 결정석 진행률
- TOP 랭킹
- 프리셋별 수익 요약

### 보스

- 체크박스 저장
- 파티 인원 저장
- 자동 합산

---

## 폴더 구조

```
MCM
│
├── app
│   ├── api
│   └── components
│
├── data
│
├── docs
│   ├── PROJECT_NOTE.md
│   ├── CHANGELOG.md
│   └── TODO.md
│
├── lib
│
├── public
│
├── package.json
└── ...
```

---

## localStorage

### 프리셋

```
favorites-{preset}
```

### 보스

```
boss-{preset}-{character}
```

### 파티인원

```
boss-party-{preset}-{character}
```

### 최근검색

```
recent-searches-{preset}
```

### 마지막 조회

```
last-character-name-{preset}
```

### 비활성 캐릭터

```
disabled-characters-{preset}
```

---

## 현재 완료

- Dashboard
- Account
- Boss
- Stat
- Equip
- Union
- Artifact
- Hexa
- Preset 관리
- 즐겨찾기 전체선택 해제 버튼

---

## 다음 개발 예정

- 모바일 UI
- 백업 / 복원
- 프리셋 Export
- 프리셋 Import
- 자동 Nexon 데이터 갱신
- UI 애니메이션 개선

## 다음 개발 예정

- FavoriteGrid.tsx 분리
- SummaryPanel.tsx 분리
- 프리셋 복사 기능
- 검색 자동완성
- 보스 리셋 타이머
- 카드 hover 애니메이션
- 모바일 UI 정리
- 백업 / 복원
- 프리셋 Export
- 프리셋 Import