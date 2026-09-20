// Cloudflare Pages 빌드 커맨드로 실행됨: node scripts/build.js
// site.config.json의 mode 값에 따라 public/index.html을 다르게 생성한다.
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');

function main() {
  const configPath = path.join(ROOT, 'site.config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const mode = config.mode || 'default';

  fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  if (mode === 'default') {
    fs.copyFileSync(path.join(ROOT, 'modes', 'default.html'), path.join(PUBLIC_DIR, 'index.html'));
  } else if (mode === 'custom') {
    fs.copyFileSync(path.join(ROOT, 'modes', 'custom.html'), path.join(PUBLIC_DIR, 'index.html'));
  } else if (mode === 'content') {
    const dataPath = path.join(ROOT, 'content', 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    let galleryHtml = '';
    if (Array.isArray(data.images) && data.images.length > 0) {
      const outImagesDir = path.join(PUBLIC_DIR, 'images');
      fs.mkdirSync(outImagesDir, { recursive: true });
      for (const filename of data.images) {
        const src = path.join(ROOT, 'content', filename); // content 폴더 안에 data.json이랑 같이 이미지가 있다고 가정
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(outImagesDir, filename));
        } else {
          console.warn(`경고: content/${filename} 파일을 찾을 수 없습니다.`);
        }
      }
      galleryHtml = data.images
        .map((filename) => `<img src="images/${filename}" alt="${data.title || ''}">`)
        .join('\n    ');
    }

    let template = fs.readFileSync(path.join(ROOT, 'templates', 'content-template.html'), 'utf-8');

    const values = {
      title: data.title || '',
      subtitle: data.subtitle || '',
      body: data.body || '',
      gallery: galleryHtml,
    };

    template = template.replace(/{{(\w+)}}/g, (_, key) => values[key] ?? '');
    fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), template);
  } else {
    throw new Error(`알 수 없는 mode 값: "${mode}" (default / custom / content 중 하나여야 함)`);
  }

  console.log(`빌드 완료 — mode: "${mode}"`);
}

main();
