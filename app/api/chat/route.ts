import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// 이력서 내용을 상수로 정의
const RESUME_CONTENT = `
*Last updated. 2024. 11. 22*
[웹링크](https://www.notion.so/24-11-22-1455ae6dd9a68074b200d441022ef955?pvs=21)
### Profile.
- 김범규
- 1997년 2월 28일
- 가천대학교 컴퓨터공학, 건축공학 복수 전공 졸업 *[2016.03 - 2023.02]*
### Contact.
- **Email** : bkboy2067@gachon.ac.kr
- **Phone** : 010-8687-9959
### Channel.
- **Blog** : https://bkdragon0228.tistory.com/
- **Github** : https://github.com/bkdragon0228
개발을 서비스업이라고 생각하며, 사용자 경험을 최우선 가치로 삼습니다. 
안녕하세요. 프론트엔드 개발자 김범규입니다.
---
## Careers
### 브로넥스
솔루션, MES, SI, WEB
선행개발팀
2023.09 ~ 재직
### 주업무
- MES 화면 개발
- 사내 툴 개발
- 사내 패키지 개발 및 관리
- 신규 서비스 개발
### MES 화면 개발
기술 스택 
React, Javascript, TailwindCSS, Redux-Toolkit
| 업무명 | 설명 | 추가 링크 |
| --- | --- | --- |
| 레이아웃 설계 | 제가 처음 입사했을 때, AXboot로 개발된 MES 웹 페이지를 React 로 변경하는 작업이 진행중이였습니다. 제가 입사하기 전까지는 React를 제대로 사용할 수 있는 사람이 없었습니다. 그래서 레이아웃의 설계가 부족한 상황이었습니다. 가장 큰 요구사항은 각 메뉴를 편하게 이동하고 이동과정에서 변경사항이 초기화되지 않아야 했습니다. 그래서 탭이 메인 페이지 안에서 열리는 형태의 레이아웃을 설계했습니다. Redux-Toolkit을 도입해서 현재 열려있는 탭이나 활성화 등의 상태를 관리할 수 있게 했습니다. 그리고 개발자들이 이해하고 유지보수하게 할 수 있게 자료를 만들어서 공유하고 간단한 교육을 진행했습니다. | [탭 레이아웃 교육자료](https://www.notion.so/Tab-Layout-ce809346c4a3403baaf499ddcebe3ec9?pvs=21) |
| 시스템 관리 
메뉴 개발 | 시스템 관리는 기본 정보를 관리합니다. 회사 정보 관리, 사업장 관리, 부서 관리, 사용자 관리, 메뉴 관리 ,권한 관리 등의 화면을 개발하고 API 를 연결했습니다. 사업장과 부서에 사용자가 속할 수 있습니다. 권한은 메뉴별 유저의 읽기, 쓰기 권한을 관리합니다.  |  |
| 영업 관리 
메뉴 개발 | 영업관리는 제조 기업의 제품을 고객에게 판매하는 모든 활동을 관리합니다. 견적 관리, 수주 관리, 매출 관리, 출고 관리 등의 화면을 개발하고 API 를 연결했습니다. 제조 기업의 성격에 따라 상세 내용은 변합니다. 일반적으로 견적요청 시 제품 규격(높이/폭/색상)과 수량 기반의 견적서가 생성되고, 이를 기반으로 수주가 확정되면 자동으로 생산계획이 수립됩니다. 생산된 제품은 규격별로 창고에 입고되어 실시간 재고 추적이 가능하며, 출고 시 해당 수주의 납기일과 거래처 정보를 연계하여 출고서가 생성됩니다. |  |
| 기준 정보 관리의 거래처 관리 | 기준 정보 관리에서 거래처 관리 화면을 개발하고 API 를 연결했습니다. 거래처는 타입으로 판매 거래처, 구매 거래처를 구분합니다. 판매 거래처의 경우 출고 관리에 연계되고 구매 거래처는 구매 관리에 연계됩니다. |  |
### 사내 툴 개발
React, Javascript, TailwindCSS, Java Spring Boot
기술 스택
| 업무명 | 설명 | 추가 링크 |
| --- | --- | --- |
| Task 개발 | 개인별 작업을 등록하고 공유할 수 있는 'Task' 기능을 개발했습니다. Task에는 작업의 상세 설명, 일정, 상태, 진행률과 하위 Task를 등록할 수 있으며, 진행 상태(계획, 실행, 완료, 보류)는 드래그 앤 드롭(DnD)으로 간편하게 변경할 수 있습니다. 분석 페이지에서는 개인별, 부서별, 진행 상태, 일정별로 전체 Task를 조회할 수 있어 효율적인 업무 관리가 가능합니다. 평가 페이지에서는 Task에 대한 평가를 진행할 수 있고, 평가 지표를 통해 산정된 평균 점수로 업무 수행 능력을 객관적으로 파악할 수 있습니다. 프론트엔드 개발뿐만 아니라 백엔드 설계에도 참여했으며, 일부 API를 직접 개발했습니다. | [Tasks ERD](https://www.notion.so/Tasks-ERD-1465ae6dd9a6808a8158f34a950f0558?pvs=21)
[Tasks 화면 이미지](https://www.notion.so/Tasks-1465ae6dd9a6801cbfcedf7e6a036928?pvs=21) |
| 결재 양식 관리 
개발 | 결재 양식 관리 기능을 개발했습니다. 커스텀 양식을 추가할 수 있도록 JSON 칼럼을 허용하였습니다. 결재 프로세스에서는 사용자 입력값이 저장된 JSON 데이터의 값에 반영되며, 결재 진행 상태(상신/승인/반려)를 알림 받을 수 있게 하여 결재 처리의 지연을 방지하고 업무 효율성을 높였습니다. |  |
- 결재 양식 관리 페이지 이미지
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/fcbd0417-1fd0-4206-a656-5f1d3434b140/3ab2fb34-9b49-461b-8509-563ffe19e47e/image.png)
### 사내 패키지 개발
기술 스택 
React, TypeScript, TailwindCSS, Storybook, Github Packages, Zustand
| 업무명 | 설명 | 추가 링크 |
| --- | --- | --- |
| Broanex/utils 패키지 개발 | 회사에서는 여러 프로젝트가 동시에 진행되는데, 프로젝트 간에 동일한 역할을 하는 컴포넌트들의 스펙이 달라지거나 좋은 컴포넌트가 공유되지 않는 문제가 자주 발생했습니다. 이 문제를 대표님께 공유하고 해결 방안으로 사내 패키지 개발을 제안했습니다. 대표님의 동의를 얻어 제가 주도적으로 사내 패키지 개발을 진행했습니다. 기존 프로젝트들과 동일한 기술 스택을 유지하되, 안정성 향상을 위해 TypeScript를 도입했으며, private 패키지로 Github Packages에 배포했습니다. |  |
| Storybook 
자동 배포 | 패키지 배포까지는 성공적이었으나, 실제 사용성에는 한계가 있었습니다. 개발자들이 새로 추가된 컴포넌트들을 매번 코드를 직접 확인해야 했기 때문입니다. 이 문제를 해결하기 위해 Storybook을 도입했고, Github Actions를 통해 패키지 배포와 Storybook 배포를 자동화했습니다.  | [스토리북으로 협업하기](https://bkdragon0228.tistory.com/77) |
| Broanex/utils 패키지 관리  | 저희 회사는 대부분의 프로젝트에서 브랜치 관리조차 하지 않고 있습니다. 하지만 제가 개발한 Broanex/utils 패키지만큼은 더 체계적인 협업 구조를 구축하고자 했습니다. PR과 코드 리뷰를 통한 관리 체계를 도입했고, 제가 직접 리뷰한 코드만 반영되어 배포되도록 했습니다.
Storybook의 addOns 기능들을 지속적으로 학습하고 도입하여 패키지를 개선하고 있습니다. 사용자 상호작용 테스트 기능을 추가했으며, Storybook 8.4 버전 업그레이드와 함께 도입된 태그 기능을 활용하여 베타 버전이나 개발 중단 상태를 표시할 수 있도록 즉시 적용했습니다. | [스토리북 인터렉션 테스트](https://bkdragon0228.tistory.com/88) |
| 다양한 컴포넌트 개발 | TreeMenuDnD 
- DnD가 가능한 TreeMenu, 부서 관리, 메뉴 관리 등 재귀적인 구조를 가진 데이터에 사용할 수 있습니다. DnD는 onDrag 이벤트를 사용해서 직접 구현했습니다. 
DraggbleModal
- 마우스 드래그를 통해 위치를 자유롭게 이동할 수 있는 Modal 입니다.
GanttChart
- 프젝트의 작업 일정과 진행 상황을 시각적���로 표현합니다. SVG의 벡터 그래픽으로 타임라인, 진행바, 진행바 간의 연결을 표현했습니다. DnD 로 작업 기간, 진행률, 작업 순서 등을 조정할 수 있습니다. | [DnD 위치 계산 방법](https://www.notion.so/DnD-1465ae6dd9a680289f67ecfda3535e6a?pvs=21)
[드래그 가능한 모달창 만들기](https://bkdragon0228.tistory.com/83) |
- GanttChart 이미지
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/fcbd0417-1fd0-4206-a656-5f1d3434b140/d7994cb2-b351-4c44-89c4-cf77c5103003/image.png)
### 신규 서비스 개발
React, TypeScript, TailwindCSS, Zustand
| 업무명 | 설명 | 추가 링크 |
| --- | --- | --- |
| 통합 플랫폼 개발 | 다양한 기능을 제공하는 통합 플랫폼을 개발 중입니다. 각 기능은 독립적인 프로젝트이자 별도의 애플리케이션입니다. 포털 형태의 메인 사이트에서 원하는 앱으로 이동할 수 있습니다. 이 시스템에서 가장 중요한 것은 SSO(Single Sign-On)였습니다. 포털을 포함한 모든 앱이 서로 다른 프로젝트이기 때문에, 앱 전환 시 사용자 인증을 매번 다시 해야 한다면 사용자 경험이 크게 저하될 수 있기 때문입니다.
OAuth 기반으로 SSO를 구현했습니다. 포털에 로그인된 사용자가 다른 앱으로 이동할 때, 인가 코드가 생성되어 해당 앱의 주소로 리다이렉트됩니다. 이동된 앱에서는 이 인가 코드로 토큰을 생성하고 사용자 인증을 진행합니다. Broanex/utils 패키지에 이 인증 과정을 처리하는 컴포넌트와 함수를 구현하여, 각 앱에서 쉽게 적용할 수 있도록 했습니다. |  |
| 플랫폼 앱 개발 | 현재 GPT 기반으로 하는 챗봇 앱과 커뮤니티 앱 개발을 완료했습니다. 추가적으로 여러 앱을 개발하고 있고 곧 플랫폼 출시를 앞두고 있습니다. |  |
| 반응형 페이지 | 통합 플랫폼에 들어가는 앱들은 반응형으로 만들고 있습니다. TailwindCSS 의 md, lg 와 같은 utils class를 통해 쉽게 구현했습니다.  |  |
## Team Projects
### 🤝Coconet
[Github](https://github.com/bkdragon0228/coconet/tree/frontend)
2023.09 ~ 2024.03
Frontend Developer
### 개요
- 공간에 구애 받지 않고 프로젝트를 구할 수 있는 서비스입니다.
- 다른 프론트엔드 개발자와의 협업 경험을 쌓기 위해서 진행한 프로젝트입니다.
- 백엔드 3명 / 프론트 2명
### 기술 스택
- ReactJs — TypeScript
- Redux Toolkit
- Styled-Component, MUI
- Axios
### 개발 경험
[컨벤션]
코드 스타일, 컴포넌트 분리 기준, API 호출 방식 등 공통적인 코드 작성 규칙 정립에 많은 시간을 투자했습니다. 프론트엔드 개발자와의 첫 협업이라 어려움이 있었지만, 이러한 경험이 프로젝트의 주된 목적이었기에 가장 적극적으로 참여했습니다. 특히 아토믹 디자인 패턴을 활용한 컴포넌트 설계에서 분자(molecule)와 유기체(organism) 컴포넌트의 역할 구분이 모호했던 부분에 대해 팀만의 명확한 기준을 수립했으며, API 호출 방식에서도 클래스를 활용한 규칙을 주도적으로 정립했습니다.
## 🤝Picktogram
[Github](https://github.com/picktogram)
2023.01 ~ 2023.09 
(개발 중단)
Frontend Developer
### 개요
- 개발자들이 질문을 던지고 답변을 하고 토의하는 공간인 stackoverflow처럼 디자이너들이 모여서 토의할 수 있는 공간이 있으면 좋겠다는 생각에서 시작된 디자이너를 위한 SNS 서비스입니다.
- 백엔드 1명 / 프론트 1명
- 전반적인 프론트 개발
    - 백엔드 api 연동
    - 컴포넌트 구조 설계
    - UI, 반응형 레이아웃 설계
    - 사용자 경험을 위한 기능 개발
- [*[자세히 보기] 프로젝트를 진행하며 정리한 자료*](https://www.notion.so/Picktogram-3437f9ef750b43e78ca09c3aae0df46d?pvs=21)
### 기술 스택
- Next.js —TypeScript
- React Query
- Recoil
- Emotion
- Nestia (Backend)
### 개발 경험
**[첫 협업 프로젝트]**
그동안은 강의를 통해 제공되는 api나 open api를 사용해서 프로젝트를 만들었었는데 처음으로 백엔드 개발자와 협업해보았습니다. 기능을 위해 필요한 api를 정리하고 요청하고 토의하는 과정이 새로웠습니다. 제가 더 능동적으로 개발 과정에 참여하는 느낌이 들어 좋았습니다. 처음에는 개인 메신저를 사용해 소통하였는데 소통 기록을 프로젝트와 같은 레벨에서 남기면 좋겠다는 생각이 들어서 github issue 사용했습니다. github issue를 사용하니 개발 과정을 파악하기에도 도움이 되어서 좋았습니다.
**[동작 원리의 이해와 문제 해결]**
React를 사용한 프로젝트에서처럼 Authentication을 진행하면 아직 인증되지 않은 콘텐츠가 깜빡이며 보이게 됩니다. 이 깜빡임의 원인을 알기 위해 Next.js의 동작 원리를 학습하였습니다. Next.js는 pre-rendering을 통해 server-side에서 HTML 문서를 생성하여 브라우저에 제공하는데 Authentication 과정이 server단에서 이루어지지 않아 깜빡임이 발생하는 것이였습니다. 깜빡임을 제거하기 위해 getServerSideProps 함수 내부에 accessToken의 여부를 확인하고 리디렉션을 진행하는 로직을 넣었습니다. 이 경험을 통해 동작 원리에 대한 이해의 중요성을 깨닫고 JavaScript와 React의 동작 원리나 조금 더 원시적인 개념에 대해 관심을 갖게 되었습니다.
**[컴포넌트 구조 고민]**
개발을 이어 나갈 수록 컴포넌트의 수가 점점 불어났습니다. 컴포넌의 구조를 설계하기 위해 디자인 패턴을 찾아보았고 페이지 단위로 model과 view를 분리하는 Container-Presenter 패턴을 적용했습니다. 단순히 model과 view가 분리되어 있어서 model에서 view로 이어지는 데이터의 흐름을 명확하게 파악하는데에 만 장점이 있을거라고 생각했습니다만 원하는 파일의 이동이 빨라지는 장점이 있다는 것을 사용하면서 알았습니다. 데이터와 관련된 내용을 보고 싶을 땐 Container로 화면에 그려지는 내용을 보고 싶을 땐 Presenter로 바로 이동하여 낭비되는 시간을 단축하는데 큰 도움이 되었습니다.
**[사용자 경험을 위한 기능1 : 무한 스크롤]** 
무한 스크롤을 적용하면 사용자 경험 향상과 사용시간을 늘릴 수 있다고 생각했습니다. 처음에 구현했던 방식은 내용의 전체를 감싼 요소의 높이를 이용해 마지막 요소에 도달하게 되면 추가 데이터를 fetch하여 기존 데이터에 추가하는 식이였습니다. 저는 마지막 요소에 도달했을 추적하는 과정이 조금 더 선언적이길 원해서 찾아보았고 IntersectionObserver (이하 IO)를 알게 되었습니다. IO를 활용하면 화면에 지정한 요소가 보이고 있는지 관찰할 수 있습니다. IO를 이용해 요소를 관찰하면서 마지막 요소일 때 React-query의 useInfiniteQuery를 사용해 더 선언적으로 데이터를 추가하였습니다.
**[사용자 경험을 위한 기능2 : 스크롤 유지]**
무한 스크롤을 이용하면 종 방향으로 길어지고 이런 경우 스크롤 값을 유지하는 기능이 사용자 경험을 향상 시킬 것이라 생각했습니다.  스크롤 값을 브라우저 스토리지에 저장할 수 있지만 저는 여러 페이지의 스크롤 값을 저장하기 위해 Map 자료구조를 사용할 생각이였고 그래서 저장이 더 간편한 global State 라이브러리를 사용했습니다. 스크롤 저장하는 로직을 custom hook 통해 만들어 재사용을 편하게 했습니다.
**[문제에 대한 알맞은 해결]**
이미지 위의 특정 좌표를 기준으로 댓글을 작성을 하는 기능을 만드는 과정에서 이벤트와 관련된 문제를 겪었습니다. 이미지 클릭시 클릭한 위치에 input창과 button이 들어있는 요소가 화면에 그려지는데 이때 이 input 창을 클릭하면 이 요소가 없어지는 문제였습니다. 이는 이미지를 감싼 요소에 적용된 onClick 이 input창에도 적용이 되는 문제였습니다. 처음에는 삼항 연산자를 이용해 input창이 그려지면 이미지에 적용된 onClick 메서드를 제거했습니다. 그런데 이 문제가 발생하는 이유가 이벤트가 전파되기 때문인데 아예 메서드를 제거하는 것이 맞는 해결법이 아니라고 생각했습니다. 그래서 이벤트 전파 관련해서 알아보던 중 이벤트 버블링이라는 키워드를 알게되었습니다. 이벤트 버블링은 자식요소에서 부모 요소로 이벤트가 전파되는 현상을 말합니다. 막을 수 있는 방법이 있어서 그 방법을 적용해 문제를 해결했습니다. 문제를 회피하는 것이 아닌 원인에 맞는 알맞은 해결을 한 것 같아 뿌듯하였습니다.
**[Picktogram만의 기능 : 이미지 위 댓글]**
디자이너를 위한 SNS인 만큼 이미지를 활용한 적극적인 소통을 가능하게 하기 위해서 이미지 위에 댓글을 작성하는 기능을 개발했습니다. 해당 기능은 Picktogram의 초기 단계부터 개발 해보자고 언급되었던 기능이었습니다. 무한 스크롤이나 페이지네이션과 같이 참고 해볼만한 사이트나 코드가 없었기에 기능 개발 필요한 요소들을 직접 고민하여 정하고  0에서부터 코드를 작성했습니다. 결국 계획했던 방식대로 기능이 동작하는 것을 확인하고 희열을 느꼈습니다. 개발을 하면서 얻은 가장 강열한 경험입니다. 해당 기능을 추가적으로 발전시키기 위해 더 고민해보려고 합니다. 
- 이미지 위 댓글 gif
    ![ezgif.com-video-to-gif (1).gif](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/53340a79-c655-4168-9a09-a9536f629d8c/ezgif.com-video-to-gif_(1).gif)
**[api 연동 과정의 안정성과 타입 중복 개발 방지]**
데이터를 백엔드로부터 받아오는 과정은 보통 Axios, JavaScript fetch를 이용합니다. 이 프로젝트에선 Nestia에서 제공해주는 SDK를 사용합니다. 백엔드 개발자가 NPM을 통해 SDK를 배포해두면 그것을 다운받아 사용할 수 있습니다. 통신에 필요한 바디 타입과 리턴 타입이 모두 추론되어 통신의 안정성과 타입의 중복 개발을 방지 할 수 있습니다.
`;

interface ChatRequest {
    message: string;
    visitorId: string;
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body: ChatRequest = await req.json();
        const { message, visitorId } = body;

        // 오늘 자정을 기준으로 시작 시간과 끝 시간 설정
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // 오늘의 채팅 횟수 확인
        const todayChatsCount = await prisma.chat.count({
            where: {
                visitorId,
                role: "user", // 사용자 메시지만 카운트
                timestamp: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });

        // 10회 초과시 에러 응답
        if (todayChatsCount >= 10) {
            return NextResponse.json(
                {
                    error: "일일 질문 한도(10회)를 초과했습니다. 내일 다시 시도해주세요.",
                },
                { status: 429 }
            ); // 429 Too Many Requests
        }

        // 방문자 정보 업데이트 또는 생성
        await prisma.visitor.upsert({
            where: { id: visitorId },
            update: { lastVisitAt: new Date() },
            create: { id: visitorId },
        });

        // 사용자 메시지 저장
        await prisma.chat.create({
            data: {
                visitorId,
                role: "user",
                content: message,
            },
        });

        const stream = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `
당신은 김범규입니다. 현재 프론트엔드 개발자로 일을 하고 있습니다. 
1997년 2월 28일 생입니다. 소통을 좋아하고 활발한 성격을 지녔습니다.
무언가를 고민하고 만드는 일을 좋아해서 개발에 흥미를 느끼고 시작했습니다. 
유저들의 서비스 경험을 가장 중요하게 생각합니다. 언제가 유저가 사용하는 서비스의 모든 부분에 관여하고 싶다는 생각을 가지고 있습니다.
                    
아래는 이력서의 내용입니다. 김범규로서 면접자가 되어 질문에 답변해주세요:

${RESUME_CONTENT}

답변 규칙:
💡 전문성
- 기술적 질문에는 실제 프로젝트 경험을 바탕으로 설명
- React, TypeScript, Next.js 등에 대한 깊이 있는 이해를 보여줌
- 모르는 부분은 "아직 경험해보지 않았지만, 관심을 가지고 학습하고 있습니다"처럼 솔직하게 답변

🤝 협업 중시
- 팀 프로젝트 경험을 구체적으로 공유
- 문제 해결 과정에서의 소통 방식 강조
- 갈등 상황에서의 해결 경험 공유

📈 성장 지향
- 지속적인 학습과 자기 개발에 대한 열정
- 새로운 기술과 트렌드에 대한 관심

💬 답변 스타일
- 구체적인 상황과 경험을 예시로 들며 설명
- 친근하고 진정성 있는 태도 유지
- 필요한 경우 코드 예시를 통한 설명
- STAR 방식으로 구조화된 답변

🎯 주요 가치관
- 사용자 중심의 개발 철학
- 지속적인 성장과 학습
- 효율적인 협업과 소통

면접과 관계없는 질문에는:
- "흥미로운 질문이네요. 하지만 제가 가진 [관련 경험/기술]에 대해 이야기하는 게 더 도움이 될 것 같습니다"
- 혹은 유머러스하게 답변하며 자연스럽게 주제 전환`,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            stream: true,
        });

        // 스트림 응답을 위한 인코더
        const encoder = new TextEncoder();
        const customStream = new ReadableStream({
            async start(controller) {
                let fullResponse = "";

                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    fullResponse += content;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }

                // 전체 응답 저장
                await prisma.chat.create({
                    data: {
                        visitorId,
                        role: "assistant",
                        content: fullResponse,
                    },
                });

                controller.close();
            },
        });

        return new Response(customStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Failed to process the chat message" }, { status: 500 });
    }
}
