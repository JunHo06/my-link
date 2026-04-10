# 마이링크 (MyLink) - 와이어프레임 (Wireframe)

본 문서는 데이터 구조와 화면 배치를 한눈에 파악하기 위해 작성된 **'방문자용 프로필 화면(Public View)'**과 **'소유자용 관리자 대시보드(Admin Dashboard)'**의 다이어그램 레이아웃입니다. (초반의 랜더링 오류를 막기 위해 HTML 태그를 배제한 클린 버전입니다)

---

## 1. 방문자용 프로필 화면 (Public View)

스마트폰(Mobile) 환경에 최적화된 세로형 레이아웃입니다. 프로필 정보, SNS 전용 아이콘, 그리고 대상 타겟을 가리키는 텍스트 링크 버튼들이 직관적으로 배치됩니다.

```mermaid
graph TD
    classDef default fill:#fdfdfd,stroke:#333,stroke-width:1px;
    classDef profile fill:#e1f5fe,stroke:#03a9f4,stroke-width:1px;
    classDef textLink fill:#ffffff,stroke:#cccccc,stroke-width:1px,rx:10px,ry:10px;
    classDef socialBtn fill:#fafafa,stroke:#ddd,stroke-width:1px,rx:5px,ry:5px;

    subgraph "📱 방뭉자 모바일 접속 화면 (/@username)"
        direction TB
        Header["🔗 [우측 상단 프로필 공유하기]"]
        
        ProfileImage["🖼️ 프로필 이미지"]
        ProfileName["@사용자 닉네임"]
        ProfileBio["📝 나를 나타내는 짧은 소개글 영역"]
        
        Social["📱인스타  📺유튜브  💻깃허브"]
        
        Link1["🌐 [파비콘] 첫 번째 메인 링크 제목"]
        Link2["🌐 [파비콘] 두 번째 포트폴리오 링크 제목"]
        Link3["🌐 [파비콘] 세 번째 웹사이트 링크 제목"]
        
        Footer["Powered by MyLink"]
    end

    Header --> ProfileImage
    ProfileImage --> ProfileName
    ProfileName --> ProfileBio
    ProfileBio --> Social
    Social --> Link1
    Link1 --> Link2
    Link2 --> Link3
    Link3 --> Footer

    style Header fill:none,stroke:none;
    style Footer fill:none,stroke:none,color:#999;
    class ProfileImage,ProfileName,ProfileBio profile;
    class Link1,Link2,Link3 textLink;
    class Social socialBtn;
```

---

## 2. 관리자 대시보드 화면 (Admin Dashboard)

웹 관리자 환경(Desktop/Tablet)을 기준으로 한 **화면 분할(Split) 레이아웃**입니다. 
- **좌측(Left):** 링크를 직접 추가/수정/삭제하는 메인 제어 공간.
- **우측(Right):** 변경 사항이 실제 방문자에게 어떻게 보일지 즉시 확인하는 라이브 프리뷰 공간.

```mermaid
graph LR
    classDef navBar fill:#1e293b,stroke:#0f172a,color:#fff;
    classDef linkBox fill:#ffffff,stroke:#e2e8f0,stroke-width:1px,rx:5px;
    classDef addButton fill:#3b82f6,color:#fff,stroke:none,rx:5px,ry:5px;
    classDef previewScreen fill:#f1f5f9,stroke:#94a3b8,stroke-width:3px,rx:15px,ry:15px;

    TopNav["Top Navigation Bar: [내 링크] [배경 테마] [통계] [로그아웃]"]
    
    subgraph "메인 데스크탑 화면 환경"
        direction LR
        
        subgraph "👈 좌측 패널: 링크 제어 및 추가 공간"
            direction TB
            AddBtn["➕ 새 링크 추가 버튼"]
            
            EditLink1["⠿ [파비콘] [제목 텍스트 편집기] 👉 [URL 폼] | [개별 공개제어] [삭제] [저장]"]
            EditLink2["⠿ [파비콘] [제목 텍스트 편집기] 👉 [URL 폼] | [개별 공개제어] [삭제] [저장]"]
            
            AddBtn --> EditLink1
            EditLink1 --> EditLink2
        end
        
        subgraph "👉 우측 패널: 실시간 프리뷰"
            direction TB
            MockupHeader["📱 스마트폰 가상 목업 화면"]
            MockupProfile["🖼️ @닉네임"]
            MockupBtn1["🌐 첫 번째 메인 링크 (미리보기)"]
            MockupBtn2["🌐 두 번째 서브 링크 (미리보기)"]

            MockupHeader --> MockupProfile
            MockupProfile --> MockupBtn1
            MockupBtn1 --> MockupBtn2
        end
    end

    TopNav --> |페이지 진입| AddBtn
    
    class TopNav navBar;
    class AddBtn addButton;
    class EditLink1,EditLink2 linkBox;
    class MockupHeader,MockupProfile,MockupBtn1,MockupBtn2 previewScreen;
    
    %% 데이터 연동 효과 시각화
    EditLink1 -. "데이터 실시간 렌더링 연동" .-> MockupBtn1
    EditLink2 -. "데이터 실시간 렌더링 연동" .-> MockupBtn2
```

---

### 💡 각 UI 디자인 요소별 세부 UX 설명 

#### 2.1 메인 제어 패널 (좌측)
* **드래그 앤 드롭 (`⠿` 아이콘)**: 마우스로 블록의 좌측 끝 그립 핸들을 잡고 위아래로 끌어당겨 시각적으로 링크 정렬 순서를 즉시 변경합니다.
* **빠른 인라인 편집**: 별도의 수정 팝업창을 띄우지 않고, 제목이나 주소 텍스트를 클릭 시 인풋(Input) 폼이 곧바로 활성화되어 쉽게 고칠 수 있도록 동선(UX)을 줄입니다.
* **삭제 즉시 피드백 토스트**: 휴지통 버튼을 눌러 링크 블록 삭제 시, 하단에 *'1개의 링크가 삭제되었습니다. [실행 취소]'* 라는 팝업 토스트(Toast)가 등장하여 위로 올라옵니다. 

#### 2.2 라이브 프리뷰 패널 (우측)
* **초단위 동기화 (Live Data Binding)**: 좌측 입력창에서 텍스트 타이핑을 단 한 글자라도 칠 때, 키보드에 맞추어 즉각적으로 우측 목업 화면의 버튼 텍스트가 동시에 변환되는 최신 트렌드의 인터랙션을 적용합니다.
* **고정형 스크롤(Sticky)**: 링크 목록이 매우 길어져 사용자가 휠을 નીચે(아래)로 길게 내려도, 우측의 스마트폰 프리뷰 컨테이너는 화면 밖으로 밀려 나가지 않고 항상 화면 안에 `position: sticky` 형태로 고정되어 따라다닙니다.
