# Markdown Reader

<img alt="Markdown Reader Logo" src="https://raw.githubusercontent.com/md-reader/md-reader/main/src//images/logo-stroke.svg" align="right" width="120">

[English](./README.md) | [中文](./README-cn.md) | 한국어

https://md-reader.github.io

[![](https://badgen.net/chrome-web-store/v/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg) [![](https://badgen.net/chrome-web-store/stars/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg) [![](https://badgen.net/chrome-web-store/users/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg)

마크다운 리더는 브라우저에서 마크다운 문서를 편리하게 미리 볼 수 있게 해주는 강력한 브라우저 확장 프로그램입니다.

> 이 저장소는 Markdown Reader 2.x를 계속 관리하는 포크입니다. 아래 스토어 링크는 업스트림 확장 프로그램을 가리키므로, 이 저장소의 버전을 사용하려면 로컬 빌드 안내를 따르세요.

- **문서 형식**: `file://`, `http://`, `https://` 프로토콜과 `.md`, `.mkd`, `.mdx`, `.markdown` 확장자 파일 미리보기 지원:
  - `https://example.com/example.md` (온라인 Markdown URL)
  - `file:///Users/my-project/readme.markdown` (로컬 마크다운 파일, \*[특정 권한 필요](#파일-액세스-권한-허용))
- **구문 플러그인**: 이모지, 위첨자/아래첨자, 체크박스, 수식, 흐름도, 간트 차트, 목차, 인서션, 약어, 주석, 알림 등의 기능 제공.
- **테마**: 고품질 라이트와 다크 테마, 코드 강조 기능 지원.
- **실시간 리로딩**: 실시간 문서 변경과 더 나은 읽기 경험을 위한 중앙 표시 기능.
- **문서 구성**: 사이드바 디렉토리, 원본 콘텐츠 미리보기, 이미지 미디어 지원 기능 포함.
- **단축키**: 웹 확장 프로그램 단축키를 통한 빠른 기능 실행 지원.

![banner](./example/example-1.png)

기본 테마 형식은 https://github.com/md-reader/theme 에 저장된다.테마 스타일을 보거나 사용자 정의할 경우,이 링크에 접근하여 css 파일을 조정할 수 있다.

## 설치

### A. 웹 확장 스토어에서 설치

스토어에 등록된 버전은 업스트림 프로젝트의 버전입니다. 이 포크를 사용하려면 **B. 빌드 설치**를 따르세요.

<a href="https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg" target="_blank"><img src="./src/images/Chrome.png" style="width:50px"/></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/markdown-reader/djnplooklihmkcioemdjfcednfkpiodc" target="_blank"><img src="./src/images/Edge.png" style="width:50px"/></a>
<a href="https://addons.mozilla.org/firefox/addon/markdown-reader-ext/" target="_blank"><img src="./src/images/Firefox.png" style="width:50px"/></a>
<a href="https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg" target="_blank"><img src="./src/images/Arc.png" style="width:50px"/></a>

### B. 빌드 설치

Chrome의 예:

1. `md-reader` 저장소를 복제하고 빌드하세요:

   ```bash
   # 이 저장소를 복제합니다
   git clone https://github.com/zwping/md-reader.git && cd md-reader

   # 의존성을 설치합니다
   pnpm install

   # 확장 프로그램을 빌드합니다
   pnpm build
   ```

2. 빌드가 완료되면 `extension` 폴더에 압축 해제된 확장 프로그램이 생성되고, `dist` 폴더에 ZIP 패키지가 생성됩니다.

3. 로컬 빌드를 불러오려면 `chrome://extensions`를 열고 오른쪽 위의 **개발자 모드**를 켠 다음 **압축해제된 확장 프로그램을 로드**를 클릭하고 `extension` 폴더를 선택하세요.

## 사용법

Chrome의 예:

설치 후에는 Chrome에서 온라인 마크다운 문서를 미리 볼 수 있습니다. 그러나 Chrome은 기본적으로 로컬 마크다운 문서를 미리 볼 수 없으며 Chrome 확장 프로그램에 대한 파일 액세스 권한을 활성화해야 합니다.

### 파일 액세스 권한 허용

> 보안상의 이유로 Chrome은 기본적으로 로컬 파일에 대한 확장 프로그램 액세스를 비활성화합니다. 따라서 플러그인을 설치한 후 로컬 마크다운 파일을 미리 보려면 권한을 수동으로 활성화해야 합니다.

Chrome 확장 프로그램 관리 페이지에서 설치한 "Markdown Reader" 확장 프로그램을 찾아 "상세정보"를 클릭하고 "파일 URL에 대한 액세스 허용" 옵션을 찾으세요. 세부 정보 페이지에서 이를 활성 상태로 전환하세요 ("Markdown Reader"는 마크다운 파일에 대해 읽기 및 표시 작업만 수행하며 사용자 파일 데이터를 수정하거나 업로드하지 않음을 안심하셔도 됩니다).

### Markdown 문서 열기

Chrome에서 지원되는 Markdown URL이나 로컬 파일을 여세요. Markdown 파일을 브라우저로 끌어다 놓아도 됩니다. 로컬 파일은 먼저 위의 **파일 URL에 대한 액세스 허용** 권한을 켜고 문서 탭을 새로고침해야 합니다.

### 확장 프로그램 설정

Chrome 툴바에서 Markdown Reader 아이콘을 클릭하면 설정 팝업이 열립니다. 설정은 자동으로 저장됩니다.

- **활성화**: Markdown 렌더링을 켜거나 끕니다.
- **가운데 정렬**: 문서 내용을 가운데 정렬합니다.
- **자동 새로고침**: 원본 파일이 변경되면 렌더링된 문서를 다시 불러옵니다.
- **플러그인**: 사용할 Markdown 문법 기능을 선택합니다.
- **테마**: 라이트, 다크 또는 자동 테마를 선택합니다.
- **언어**: 확장 프로그램 인터페이스 언어를 변경합니다.

### 문서 읽기

왼쪽 목차에서 제목을 선택해 해당 위치로 이동할 수 있습니다. 문서의 플로팅 버튼으로 목차 표시 여부를 전환하고, 렌더링된 문서와 원본 Markdown을 전환하거나 페이지 맨 위로 이동할 수 있습니다.

기본 단축키는 **Alt+Shift+B**(목차), **Alt+Shift+C**(가운데 정렬), **Alt+Shift+R**(자동 새로고침), **Alt+Shift+T**(테마)입니다. `chrome://extensions/shortcuts`에서 단축키를 확인하거나 변경할 수 있습니다.

<br/>

이제 모든 작업이 완료되었습니다~! ヾ(◍°∇°◍)ﾉ

이 온라인 문서를 열어 효과를 확인해보세요: [예시 문서](https://raw.githubusercontent.com/md-reader/md-reader/main/example/example.md); 또한 마크다운 문서를 브라우저로 직접 드래그하여 시도해볼 수도 있습니다!

질문이나 제안이 있으면 언제든지 말씀해주세요.

지원을 나타내기 위해 별을 주시는 것도 저에게 큰 격려입니다~!

## 라이선스

라이선스 [MIT](https://github.com/md-reader/md-reader/blob/main/LICENSE)

© 2018-present, [Bener](https://github.com/Heroor)
