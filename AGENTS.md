## 1. 목적

이 프로젝트에서 API 관련 질문이 들어오면, Assistant는 추측하지 않고 **Notion MCP 도구를 통해 상윤’s space의 API 문서 데이터베이스(DB)** 를 확인하여 답변한다.

---

## 2. 필수 규칙

### 2.1 API 질문 답변 시 Notion DB 확인은 필수

- 사용자가 API 관련 질문을 하면 반드시 **Notion MCP로 상윤’s space API명세서 DB**를 조회한다.
- 기억/추정으로 답변하지 않는다.

### 2.2 Request/Response Payload는 DB가 아니라 문서에 있음

- API DB에는 엔드포인트 메타 정보가 정리되어 있으며,
- **요청값/응답값(JSON 구조, 필드, 예시, 에러 응답 등)은 `Request & Response` 문서에 존재한다.**
- 따라서 request body / response body 질문이 나오면 반드시 `Request & Response` 문서를 열어 확인한다.

---

## 3. API 문서 조회 절차

1. API Path로 우선 검색한다.
2. 없으면 기능명/카테고리로 검색한다.
3. 문서 본문에서 아래를 확인한다.

- HTTP Method
- 인증/권한
- Path params / Query params
- Request body
- Response body
- 에러 코드/메시지

---

## 4. 테스트 코드 작성 규칙 (Playwright MCP 기준)

기존 `vitest + msw` 기본 규칙 대신, 이 프로젝트의 기본 테스트 실행은 `Playwright MCP`로 한다.

### 4.1 기본 원칙

- 테스트 실행 및 검증은 Playwright MCP로 수행한다.
- 핵심 사용자 플로우는 E2E 기준으로 작성한다.
- 네트워크 의존이 큰 경우 Playwright route mocking을 사용한다.
- 테스트 결과는 "재현 가능한 단계 + 기대 결과" 형태로 기록한다.

### 4.2 필수 테스트 시나리오

각 주요 기능마다 최소 아래 케이스를 포함한다.

- Success Case
  - 정상 입력/정상 흐름에서 UI와 상태가 올바르게 반영되는지 확인
- Fail Case
  - 문서에 정의된 실패 케이스(400/401/403/500 중 해당)에서 에러 UI/메시지 처리 확인

### 4.3 검증 범위

- 사용자 상호작용(클릭, 입력, 라우팅)
- API 호출 결과가 화면에 반영되는지
- 에러 발생 시 사용자 피드백(토스트, 에러 문구, 버튼 상태)

---

## 5. 현재 프로젝트 기준 API 함수/훅 경로

기존 경로(`lib/api/*.ts`, `hooks/*.ts`) 대신 현재 FSD 구조 기준으로 관리한다.

### 5.1 API 함수 경로

- 공통 API 유틸/클라이언트: `shared/lib/**/*.ts`
- 도메인 API: `entities/*/model/**/*.ts`
- (추후 추가 시) 기능 API: `features/*/api/**/*.ts`

### 5.2 훅 경로

- 공통 훅: `shared/hooks/**/*.ts`
- 도메인/기능 훅: 해당 슬라이스 내부(`entities/*/...`, `features/*/...`)

### 5.3 신규 코드 배치 원칙

- 전역 재사용 로직이면 `shared`에 둔다.
- 도메인 전용 로직이면 해당 `entities/<domain>`에 둔다.
- 특정 사용자 시나리오 전용이면 `features` 레이어 도입 후 배치한다.

---

## 6. 결과 보고 규칙

테스트/구현 완료 후 아래를 반드시 보고한다.

- 변경 파일 경로
- 수행한 Playwright MCP 시나리오
- 통과/실패 결과
- 남은 리스크 또는 확인 필요한 항목
