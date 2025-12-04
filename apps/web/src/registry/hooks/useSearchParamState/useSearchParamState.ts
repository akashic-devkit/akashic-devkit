import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo, useRef } from "react";

/**
 * useState의 setState와 동일한 타입
 * 값 자체 또는 이전 상태를 받아 새 값을 반환하는 함수
 */
type SetStateAction<T> = T | ((prevState: T) => T);

/**
 * 기본 serializer가 자동 적용되는 원시 타입
 */
type Primitive = string | number | boolean;

/**
 * 커스텀 serializer 옵션
 * serialize와 deserialize는 반드시 쌍으로 제공해야 함
 */
type SerializerOptions<T> = {
  /** 상태값을 URL 문자열로 변환 */
  serialize: (value: T) => string;
  /** URL 문자열을 상태값으로 변환 */
  deserialize: (value: string) => T;
};

/**
 * useSearchParamState 훅 옵션
 */
type UseSearchParamStateOptions<T> = T extends Primitive
  ? { serializer?: SerializerOptions<T> }
  : { serializer?: SerializerOptions<T> };

/**
 * 타입에 따른 기본 serializer 생성
 *
 * - string: 그대로 사용
 * - number: String/Number 생성자 사용
 * - boolean: 'true'/'false' 문자열로 변환
 * - 객체/배열: JSON.stringify/parse 사용
 *
 * @param defaultValue - 기본값 (타입 추론에 사용)
 * @returns SerializerOptions 객체
 */
function getDefaultSerializer<T>(defaultValue: T): SerializerOptions<T> {
  switch (typeof defaultValue) {
    case "string":
      return {
        serialize: (v) => v as string,
        deserialize: (v) => v as T,
      } as SerializerOptions<T>;

    case "number":
      return {
        serialize: (v) => String(v),
        deserialize: (v) => Number(v) as T,
      } as SerializerOptions<T>;

    case "boolean":
      return {
        serialize: (v) => (v ? "true" : "false"),
        deserialize: (v) => (v === "true") as T,
      } as SerializerOptions<T>;

    default:
      // 객체, 배열 등 참조 타입
      return {
        serialize: (v) => JSON.stringify(v),
        deserialize: (v) => JSON.parse(v) as T,
      };
  }
}

/**
 * URL Search Param을 React 상태처럼 선언적으로 관리하는 훅
 *
 * useState와 동일한 API를 제공하며, 상태가 URL에 자동 동기화됨
 *
 * @template T - 상태 타입
 * @param key - URL search param 키
 * @param defaultValue - URL에 값이 없을 때 사용할 기본값
 * @param options - 커스텀 serializer 옵션
 * @returns [state, setState] 튜플
 *
 * @example
 * ```tsx
 * // 원시 타입 - 자동 serializer 적용
 * const [page, setPage] = useSearchParamState('page', 1);
 * const [search, setSearch] = useSearchParamState('q', '');
 * const [isOpen, setIsOpen] = useSearchParamState('open', false);
 *
 * // 참조 타입 - JSON.stringify/parse 자동 적용
 * const [filters, setFilters] = useSearchParamState('filters', { sort: 'date' });
 *
 * // 커스텀 serializer
 * const [date, setDate] = useSearchParamState('date', new Date(), {
 *   serializer: {
 *     serialize: (v) => v.toISOString(),
 *     deserialize: (v) => new Date(v),
 *   },
 * });
 *
 * // 함수형 업데이트
 * setPage((prev) => prev + 1);
 * ```
 */
export function useSearchParamState<T>(
  key: string,
  defaultValue: T,
  options?: UseSearchParamStateOptions<T>
): [T, (value: SetStateAction<T>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const { serialize, deserialize } = options?.serializer ?? getDefaultSerializer(defaultValue);

  /**
   * 현재 URL에서 파싱된 상태값
   * URL에 키가 없거나 파싱 실패 시 defaultValue 반환
   */
  const state = useMemo(() => {
    const param = searchParams.get(key);

    if (param === null) return defaultValue;

    try {
      return deserialize(param);
    } catch {
      return defaultValue;
    }
  }, [searchParams, key, defaultValue, deserialize]);

  /**
   * 함수형 업데이트에서 최신 상태 참조를 위한 ref
   * setSearchParams 콜백 내에서 클로저 문제 방지
   */
  const stateRef = useRef(state);
  stateRef.current = state;

  /**
   * 상태 업데이트 함수
   * - 값 또는 함수형 업데이트 지원
   * - defaultValue, null, undefined로 설정 시 URL에서 키 삭제
   */
  const setState = useCallback(
    (value: SetStateAction<T>) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        const nextValue = typeof value === "function" ? (value as (prev: T) => T)(stateRef.current) : value;

        // 기본값이거나 nullish한 경우 URL에서 제거하여 깔끔하게 유지
        if (nextValue === defaultValue || nextValue === null || nextValue === undefined) {
          newParams.delete(key);
        } else {
          newParams.set(key, serialize(nextValue));
        }

        return newParams;
      });
    },
    [key, serialize, setSearchParams, defaultValue]
  );

  return [state, setState];
}
