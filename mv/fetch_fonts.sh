#!/bin/sh
# MV で使うフォント (すべて SIL Open Font License) を Google Fonts のリポジトリから取得する
set -e
cd "$(dirname "$0")"
mkdir -p fonts
for p in ofl/delagothicone/DelaGothicOne-Regular.ttf \
         "ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf" \
         "ofl/notoserifjp/NotoSerifJP%5Bwght%5D.ttf" \
         ofl/dotgothic16/DotGothic16-Regular.ttf \
         ofl/rampartone/RampartOne-Regular.ttf \
         ofl/reggaeone/ReggaeOne-Regular.ttf; do
  f="fonts/$(basename "$p")"
  [ -f "$f" ] || curl -sSfL -o "$f" "https://raw.githubusercontent.com/google/fonts/main/$p"
done
echo "fonts ready"
