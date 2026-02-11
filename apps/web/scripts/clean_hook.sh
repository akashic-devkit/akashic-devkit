#!/bin/bash

# 스크립트 실행 위치를 기준으로 절대 경로 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 인자가 정확히 1개가 아니면 에러
if [ $# -ne 1 ]; then
    echo "❌ 에러: 인자를 정확히 1개만 입력해야 합니다."
    echo "Usage: $0 <hook-name>"
    echo "Example: $0 useMobile"
    exit 1
fi

# 변수 설정
name=$1


hook_dir="${PROJECT_ROOT}/src/registry/hooks/${name}"
hook_file="${PROJECT_ROOT}/src/registry/hooks/${name}/${name}.ts"
example_file="${PROJECT_ROOT}/src/registry/hooks/${name}/${name}.example.tsx"
guide_file="${PROJECT_ROOT}/src/registry/hooks/${name}/${name}.guide.md"

menu_file="${PROJECT_ROOT}/src/data/hooksMenu.ts"  
docs_map_file="${PROJECT_ROOT}/src/data/docsMap.ts" 
codes_map_file="${PROJECT_ROOT}/src/data/rawCodesMap.ts" 

# 삭제할 대상이 존재하는지 확인
if [[ ! -d "$hook_dir" ]]; then
    echo "❌ 삭제할 훅을 찾을 수 없습니다."
    echo "   - Hook 디렉토리: $hook_dir"
    exit 1
fi

# 삭제 전 확인 (선택사항 - 원하면 주석 해제)
echo "다음 항목을 삭제하시겠습니까?"
[ -d "$hook_dir" ] && echo "  - $hook_dir"
read -p "계속하시겠습니까? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "취소되었습니다."
    exit 0
fi


# 에러 플래그 초기화
error_occurred=0

# 메뉴 파일 수정
# menu.ts에서 해당 컴포넌트 항목 삭제
echo "🔄 menu.ts 업데이트 중..."
if perl -i.bak -0pe "s/  \{\s+title: \"$name\",\s+url: \"\/hook\/$name\",\s+\},\n//gs" "$menu_file"; then
    echo "✅ menu.ts 업데이트 완료"
    rm -f "${menu_file}.bak"
else
    echo "❌ menu.ts 업데이트 실패"
    error_occurred=1
fi

# docsMap.ts에서 해당 컴포넌트 항목 삭제
echo "🔄 docsMap.ts 업데이트 중..."
if perl -i.bak -ne "print unless /\b$name:\s*\(\)\s*=>\s*import\(.*\Q$name\E\.guide\.md/" "$docs_map_file"; then
    echo "✅ docsMap.ts 업데이트 완료"
    rm -f "${docs_map_file}.bak"
else
    echo "❌ docsMap.ts 업데이트 실패"
    error_occurred=1
fi

# codesMap.ts에서 해당 컴포넌트 항목 삭제
echo "🔄 codesMap.ts 업데이트 중..."
if perl -i.bak -ne "print unless /\"\Q$name\E\.ts\":\s*\(\)\s*=>\s*import\(.*\Q$name\E\.example\.tsx/" "$codes_map_file"; then
    echo "✅ codesMap.ts 업데이트 완료"
    rm -f "${codes_map_file}.bak"
else
    echo "❌ codesMap.ts 업데이트 실패"
    error_occurred=1
fi

if [ $error_occurred -eq 0 ]; then
    echo "✅ 모든 설정 파일에서 훅 항목이 삭제되었습니다!"
else
    echo "⚠️  일부 파일 업데이트 중 오류가 발생했습니다."
    exit 1
fi

# 파일 삭제
error_occurred=0

if [ -d "$hook_dir" ]; then
    if rm -r "$hook_dir"; then
        echo "✅ Hook 디렉토리 삭제 완료: $hook_dir"
    else
        echo "❌ Hook 디렉토리 삭제 실패: $hook_dir"
        error_occurred=1
    fi
fi

if [ $error_occurred -eq 0 ]; then
    echo "✅ 훅 파일들이 삭제되었습니다!"
else
    echo "⚠️  일부 파일 삭제 중 오류가 발생했습니다."
    exit 1
fi