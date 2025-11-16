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
example="${name}Example"

route_template_file="${PROJECT_ROOT}/templates/route/component/[name].tsx"
component_template_file="${PROJECT_ROOT}/templates/registry/component/[name].tsx"
example_template_file="${PROJECT_ROOT}/templates/registry/component/[name].example.tsx"
guide_template_file="${PROJECT_ROOT}/templates/registry/component/[name].guide.md"
dependencies_template_file="${PROJECT_ROOT}/templates/registry/component/[name].json"

route_output_file="${PROJECT_ROOT}/src/routes/component/${name}.tsx"
component_output_file="${PROJECT_ROOT}/src/registry/components/${name}/${name}.tsx"
example_output_file="${PROJECT_ROOT}/src/registry/components/${name}/${name}.example.tsx"
guide_output_file="${PROJECT_ROOT}/src/registry/components/${name}/${name}.guide.md"
dependencies_output_file="${PROJECT_ROOT}/src/registry/components/${name}/${name}.json"

menu_file="${PROJECT_ROOT}/src/data/componentsMenu.ts"  
docs_map_file="${PROJECT_ROOT}/src/data/docsMap.ts" 
codes_map_file="${PROJECT_ROOT}/src/data/rawCodesMap.ts" 


# 템플릿 파일 존재 확인
if [ ! -f "$route_template_file" ]; then
    echo "❌ 템플릿 파일을 찾을 수 없습니다: $route_template_file"
    exit 1
fi

if [ ! -f "$component_template_file" ]; then
    echo "❌ 템플릿 파일을 찾을 수 없습니다: $component_template_file"
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

if [ ! -f "$dependencies_template_file" ]; then
    echo "❌ 템플릿 파일을 찾을 수 없습니다: $dependencies_template_file"
    exit 1
fi

# 출력 디렉토리 생성
mkdir -p "${PROJECT_ROOT}/src/registry/components/${name}"

# 템플릿의 변수값을 치환하여 파일 생성
sed -e "1d" \
    -e "s/__NAME__/${name}/g" \
    -e "s/__EXAMPLE__/${example}/g" \
    "$route_template_file" > "$route_output_file"

sed "s/__NAME__/${name}/g" "$component_template_file" > "$component_output_file"

sed "s/__EXAMPLE__/${example}/g" "$example_template_file" > "$example_output_file"

sed "s/__NAME__/${name}/g" "$guide_template_file" > "$guide_output_file"

sed "s/__NAME__/${name}/g" "$dependencies_template_file" > "$dependencies_output_file"

# 데이터 추가
# menu.ts 데이터 추가
if ! grep -q "\"$name\"" "$menu_file"; then
    awk -v name="$name" '
    /^];/ {
        print "  {"
        print "    title: \"" name "\","
        print "    url: \"/component/" name "\","
        print "  },"
    }
    { print }
    ' "$menu_file" > "${menu_file}.tmp" && mv "${menu_file}.tmp" "$menu_file"
    echo "✅ menu.ts에 $name 추가"
else
    echo "⏭️  menu.ts에 $name 이미 존재"
fi

# docsMap.ts 데이터 추가
if ! grep -q "$name:" "$docs_map_file" || ! grep -q "components/$name/$name.guide.md" "$docs_map_file"; then
    awk -v name="$name" '
    /^} as const;/ {
        print "  " name ": () => import(\"../registry/components/" name "/" name ".guide.md?raw\"),"
    }
    { print }
    ' "$docs_map_file" > "${docs_map_file}.tmp" && mv "${docs_map_file}.tmp" "$docs_map_file"
    echo "✅ docsMap.ts에 $name 추가"
else
    echo "⏭️  docsMap.ts에 $name 이미 존재"
fi

# codesMap.ts 데이터 추가
if ! grep -q "\"$name.tsx\"" "$codes_map_file"; then
    awk -v name="$name" '
    /^} as const;/ {
        print "  \"" name ".tsx\": () => import(\"@/registry/components/" name "/" name ".example.tsx?raw\"),"
    }
    { print }
    ' "$codes_map_file" > "${codes_map_file}.tmp" && mv "${codes_map_file}.tmp" "$codes_map_file"
    echo "✅ codesMap.ts에 $name 추가"
else
    echo "⏭️  codesMap.ts에 $name 이미 존재"
fi
    

echo "✅ 컴포넌트 파일들이 생성되었습니다!"
echo "  📄 ${route_output_file}"
echo "  📄 ${component_output_file}"
echo "  📄 ${example_output_file}"
echo "  📄 ${guide_output_file}"
echo "  📄 ${dependencies_output_file}"