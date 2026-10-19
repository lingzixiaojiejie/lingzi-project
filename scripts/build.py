"""Rebuild the offline HTML and source ZIP using only the Python standard library."""
from pathlib import Path
import base64
import mimetypes
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output' if (ROOT / 'output' / 'index.html').exists() else ROOT
html = (OUT / 'index.html').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>' + (OUT / 'styles.css').read_text(encoding='utf-8') + '</style>')
html = html.replace('<script src="app.js"></script>', '<script>' + (OUT / 'app.js').read_text(encoding='utf-8') + '</script>')
for ref in set(re.findall(r'assets/[A-Za-z0-9_.-]+', html)):
    asset = OUT / ref
    if not asset.is_file() or not asset.stat().st_size:
        raise ValueError(f'Missing asset: {ref}')
    mime = mimetypes.guess_type(asset.name)[0] or 'application/octet-stream'
    html = html.replace(ref, 'data:' + mime + ';base64,' + base64.b64encode(asset.read_bytes()).decode('ascii'))
(OUT / '机房监控系统-小机房.html').write_text(html, encoding='utf-8')
files = [OUT / name for name in ('index.html', 'styles.css', 'app.js', '使用说明.md', 'preview.png', '机房监控系统-小机房.html')]
files += sorted((OUT / 'assets').glob('*'))
archive = OUT / 'small-room-source.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as bundle:
    for file in files:
        bundle.write(file, file.relative_to(OUT))
    bundle.write(Path(__file__), 'scripts/build.py')
with zipfile.ZipFile(archive) as bundle:
    if bundle.testzip() is not None:
        raise ValueError('ZIP verification failed')
print(f'Built offline HTML and {archive.name}: {archive.stat().st_size:,} bytes')
