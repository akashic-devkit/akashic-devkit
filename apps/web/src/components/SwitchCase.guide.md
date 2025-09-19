## 개요

`SwitchCase`는 조건부 렌더링을 위한 React 컴포넌트입니다. JavaScript의 `switch-case` 문과 유사한 방식으로 값에 따라 다른 컴포넌트나 엘리먼트를 렌더링할 수 있습니다.

## Props

### `Props<T>`

| 프로퍼티 | 타입                                                        | 설명                                           |
| -------- | ----------------------------------------------------------- | ---------------------------------------------- |
| `value`  | `T`                                                         | 매칭할 값 (T는 string, number, symbol 중 하나) |
| `cases`  | `Record<T, React.ReactNode> & { default: React.ReactNode }` | 각 케이스에 대응하는 React 노드들과 기본값     |
