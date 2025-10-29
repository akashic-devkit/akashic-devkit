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
first=$(echo "${name:0:1}" | tr '[:lower:]' '[:upper:]')
rest="${name:1}"
Name="${first}${rest}"
example="${Name}Example"

route_template_file="${PROJECT_ROOT}/templates/route/hook/[name].tsx"
hook_template_file="${PROJECT_ROOT}/templates/registry/hook/[name].ts"
example_template_file="${PROJECT_ROOT}/templates/registry/hook/[name].example.tsx"
guide_template_file="${PROJECT_ROOT}/templates/registry/hook/[name].guide.md"

route_output_file="${PROJECT_ROOT}/src/routes/hook/${name}.tsx"
hook_output_file="${PROJECT_ROOT}/src/registry/hooks/${name}/${name}.ts"
example_output_file="${PROJECT_ROOT}/src/registry/hooks/${name}/${name}.example.tsx"
guide_output_file="${PROJECT_ROOT}/src/registry/hooks/${name}/${name}.guide.md"

menu_file="${PROJECT_ROOT}/src/data/hooksMenu.ts"  
docs_map_file="${PROJECT_ROOT}/src/data/docsMap.ts" 
codes_map_file="${PROJECT_ROOT}/src/data/rawCodesMap.ts" 


# 템플릿 파일 존재 확인
if [ ! -f "$route_template_file" ]; then
    echo "❌ 템플릿 파일을 찾을 수 없습니다: $route_template_file"
    exit 1
fi

if [ ! -f "$hook_template_file" ]; then
    echo "❌ 템플릿 파일을 찾을 수 없습니다: $hook_template_file"
    exit 1
fi

if [ ! -f "$example_template_file" ]; then
    echo "❌ 템플릿 파일을 찾을 수 없습니다: $example_template_file"
    exit 1
fi

if [ ! -f "$guide_template_file" ]; then
    echo "❌ 템플릿 파일을 찾을 수 없습니다: $guide_template_file"
    exit 1
fi

# 출력 디렉토리 생성
mkdir -p "${PROJECT_ROOT}/src/registry/hooks/${name}"

# 템플릿의 변수값을 치환하여 파일 생성
sed -e "1d" \
    -e "s/__NAME__/${name}/g" \
    -e "s/__EXAMPLE__/${example}/g" \
    "$route_template_file" > "$route_output_file"

sed "s/__NAME__/${name}/g" "$hook_template_file" > "$hook_output_file"

sed "s/__EXAMPLE__/${example}/g" "$example_template_file" > "$example_output_file"

sed "s/__NAME__/${name}/g" "$guide_template_file" > "$guide_output_file"

# 데이터 추가
# menu.ts 데이터 추가
if ! grep -q "\"$name\"" "$menu_file"; then
    awk -v name="$name" '
    /^];/ {
        print "  {"
        print "    title: \"" name "\","
        print "    url: \"/hook/" name "\","
        print "  },"
    }
    { print }
    ' "$menu_file" > "${menu_file}.tmp" && mv "${menu_file}.tmp" "$menu_file"
    echo "✅ menu.ts에 $name 추가"
else
    echo "⏭️  menu.ts에 $name 이미 존재"
fi

# docsMap.ts 데이터 추가
if ! grep -q "$name:" "$docs_map_file" || ! grep -q "$name.guide.md" "$docs_map_file"; then
    awk -v name="$name" '
    /^} as const;/ {
        print "  " name ": () => import(\"../registry/hooks/" name "/" name ".guide.md?raw\"),"
    }
    { print }
    ' "$docs_map_file" > "${docs_map_file}.tmp" && mv "${docs_map_file}.tmp" "$docs_map_file"
    echo "✅ docsMap.ts에 $name 추가"
else
    echo "⏭️  docsMap.ts에 $name 이미 존재"
fi

# codesMap.ts 데이터 추가
if ! grep -q "\"$name.ts\"" "$codes_map_file"; then
    awk -v name="$name" '
    /^} as const;/ {
        print "  \"" name ".ts\": () => import(\"@/registry/hooks/" name "/" name ".example.tsx?raw\"),"
    }
    { print }
    ' "$codes_map_file" > "${codes_map_file}.tmp" && mv "${codes_map_file}.tmp" "$codes_map_file"
    echo "✅ codesMap.ts에 $name 추가"
else
    echo "⏭️  codesMap.ts에 $name 이미 존재"
fi
    

echo "✅ 컴포넌트 파일들이 생성되었습니다!"
echo "  📄 ${route_output_file}"
echo "  📄 ${hook_template_file}"
echo "  📄 ${example_output_file}"
echo "  📄 ${guide_output_file}"