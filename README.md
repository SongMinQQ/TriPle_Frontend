# TriPle

<div align="center">
  <img src="./public/TriPle_logo.png" alt="TriPle Logo" />
</div>

## 프로젝트 소개

그룹 기반 여행 일정 관리 서비스 **TriPle**입니다.

여러 인원이 함께 여행을 준비할 때는 소통 비용이 높고, 일정/역할/의사결정이 분산되기 쉽습니다.
TriPle은 여행이 특정 멤버 조합으로 장소를 바꿔가며 진행된다는 점에 주목해,
여행자들이 소통하고 결정을 내릴 수 있는 협업 공간을 제공합니다.

- 여행자들의 복잡한 소통과 결정을 하나의 협업 공간으로 단순화
- 여행 모임 관리에 드는 비용 최소화

## FSD 아키텍처 구조

```text
.
├─ app/                # Next.js 라우팅 및 페이지
├─ widgets/            # 페이지 단위 조합 컴포넌트
├─ entities/           # 도메인 모델/도메인 UI
├─ shared/
│  ├─ ui/              # 공용 UI 컴포넌트
│  ├─ hooks/           # 공통 훅
│  ├─ lib/             # 공통 유틸
│  ├─ providers/       # 전역 Provider
│  └─ styles/          # 전역 스타일
├─ public/             # 정적 에셋(로고 포함)
└─ .github/workflows/  # CI/CD 및 동기화 워크플로우
```
