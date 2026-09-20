# 3-모드 사이트 템플릿

`site.config.json`의 `mode` 값 하나로 사이트 내용을 통째로 바꾸는 구조입니다.
GitHub에 push하면 Cloudflare Pages가 자동으로 다시 빌드/배포합니다.

## 최초 설정 (한 번만)

1. GitHub에 새 리포지토리를 만들고 이 폴더 전체를 push합니다.
   ```bash
   cd site-template
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/<사용자명>/<리포이름>.git
   git push -u origin main
   ```
2. Cloudflare 대시보드 → Workers & Pages → **Create application** → **Pages** → **Connect to Git** → 방금 만든 리포 선택.
3. 빌드 설정:
   - **Framework preset**: None
   - **Build command**: `node scripts/build.js`
   - **Build output directory**: `public`
4. Save and Deploy. 이후로는 `main` 브랜치에 push할 때마다 자동 재배포됩니다.

## 모드 전환 방법

`site.config.json` 파일 하나만 고치고 push하면 됩니다.

```json
{ "mode": "default" }   // 또는 "custom" 또는 "content"
```

### 모드 1 — 평상시 기본 화면 (`mode: "default"`)
- `modes/default.html` 을 지금 쓰고 있는(또는 쓰고 싶은) html 파일 내용으로 **통째로 교체**해 두세요.
- `site.config.json`을 `"default"`로 두고 push하면 이 파일이 배포됩니다.

### 모드 2 — 첨부한 html로 사이트 전체 교체 (`mode: "custom"`)
1. 원하는 html 파일 내용을 `modes/custom.html`에 덮어씁니다.
2. `site.config.json`의 mode를 `"custom"`으로 바꿉니다.
3. push.

### 모드 3 — 원하는 이미지/텍스트로 사이트 채우기 (`mode: "content"`)
1. `content/data.json`의 `title`, `subtitle`, `body`, `images` 값을 원하는 내용으로 채웁니다.
   - `images`는 파일명 배열이며, 실제 이미지 파일은 `content/images/` 폴더에 넣어야 합니다.
2. `site.config.json`의 mode를 `"content"`로 바꿉니다.
3. push.
4. 레이아웃(폰트, 배치 등)을 바꾸고 싶으면 `templates/content-template.html`을 직접 수정하면 됩니다. `{{title}}`, `{{subtitle}}`, `{{body}}`, `{{gallery}}` 자리에 data.json 값이 채워집니다.

## 로컬에서 미리 확인하기

```bash
node scripts/build.js
# public/index.html 이 생성됩니다. 브라우저로 열어서 확인 가능.
```

## 폴더 구조

```
site.config.json        <- 지금 어떤 모드인지 (default / custom / content)
modes/
  default.html           <- 모드 1: 평상시 기본 html
  custom.html            <- 모드 2: 첨부한 html로 교체할 자리
content/
  data.json              <- 모드 3: 제목/부제/본문/이미지 목록
  images/                <- 모드 3: 실제 이미지 파일
templates/
  content-template.html  <- 모드 3용 레이아웃 템플릿
scripts/
  build.js               <- mode에 맞춰 public/index.html을 생성하는 빌드 스크립트
public/                  <- 빌드 산출물 (git에는 안 올라감, Cloudflare가 이 폴더를 서빙)
```
