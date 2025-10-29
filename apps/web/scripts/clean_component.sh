#!/bin/bash

# 스크립트 실행 위치를 기준으로 절대 경로 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 인자가 정확히 1개가 아니면 에러
if [ $# -ne 1 ]; then
    echo "❌ 에러: 인자를 정확히 1개만 입력해야 합니다."
    echo "Usage: $0 <component-name>"
    echo "Example: $0 Button"
    exit 1
fi

# 변수 설정
name=$1

route_file="${PROJECT_ROOT}/src/routes/component/${name}.tsx"
component_dir="${PROJECT_ROOT}/src/registry/components/${name}"

menu_file="${PROJECT_ROOT}/src/data/componentsMenu.ts"  
docs_map_file="${PROJECT_ROOT}/src/data/docsMap.ts" 
codes_map_file="${PROJECT_ROOT}/src/data/rawCodesMap.ts" 

# 삭제할 대상이 존재하는지 확인
if [ ! -f "$route_file" ] && [ ! -d "$component_dir" ]; then
    echo "❌ 삭제할 컴포넌트를 찾을 수 없습니다."
    echo "   - Route 파일: $route_file"
    echo "   - Component 디렉토리: $component_dir"
    exit 1
fi

# 삭제 전 확인 (선택사항 - 원하면 주석 해제)
echo "다음 항목을 삭제하시겠습니까?"
[ -f "$route_file" ] && echo "  - $route_file"
[ -d "$component_dir" ] && echo "  - $component_dir"
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
if perl -i.bak -0pe "s/  \{\s+title: \"$name\",\s+url: \"\/component\/$name\",\s+\},\n//gs" "$menu_file"; then
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
if perl -i.bak -ne "print unless /\"\Q$name\E\.tsx\":\s*\(\)\s*=>\s*import\(.*\Q$name\E\.example\.tsx/" "$codes_map_file"; then
    echo "✅ codesMap.ts 업데이트 완료"
    rm -f "${codes_map_file}.bak"
else
    echo "❌ codesMap.ts 업데이트 실패"
    error_occurred=1
fi

if [ $error_occurred -eq 0 ]; then
    echo "✅ 모든 설정 파일에서 컴포넌트 항목이 삭제되었습니다!"
else
    echo "⚠️  일부 파일 업데이트 중 오류가 발생했습니다."
    exit 1
fi

# 파일 삭제
error_occurred=0

if [ -f "$route_file" ]; then
    if rm "$route_file"; then
        echo "✅ Route 파일 삭제 완료: $route_file"
    else
        echo "❌ Route 파일 삭제 실패: $route_file"
        error_occurred=1
    fi
fi

if [ -d "$component_dir" ]; then
    if rm -r "$component_dir"; then
        echo "✅ Component 디렉토리 삭제 완료: $component_dir"
    else
        echo "❌ Component 디렉토리 삭제 실패: $component_dir"
        error_occurred=1
    fi
fi

if [ $error_occurred -eq 0 ]; then
    echo "✅ 컴포넌트 파일들이 삭제되었습니다!"
else
    echo "⚠️  일부 파일 삭제 중 오류가 발생했습니다."
    exit 1
fi