import {
  useQuery,
  useSuspenseQuery,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import type {
  DefaultError,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseSuspenseInfiniteQueryOptions,
  UseSuspenseInfiniteQueryResult,
} from "@tanstack/react-query";
import { ReactNode } from "react";

// ============================================
// 1. 각 Container Props 정의
// ============================================

interface UseQueryContainerProps<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
  children: (result: UseQueryResult<TData, TError>) => ReactNode;
}

interface UseSuspenseQueryContainerProps<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
  children: (result: UseSuspenseQueryResult<TData, TError>) => ReactNode;
}

interface UseInfiniteQueryContainerProps<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> extends UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> {
  children: (result: UseInfiniteQueryResult<TData, TError>) => ReactNode;
}

interface UseSuspenseInfiniteQueryContainerProps<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> extends UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> {
  children: (result: UseSuspenseInfiniteQueryResult<TData, TError>) => ReactNode;
}

// ============================================
// 2. 각 Container 컴포넌트 구현
// ============================================

function UseQueryContainer<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({ children, ...queryOptions }: UseQueryContainerProps<TQueryFnData, TError, TData, TQueryKey>) {
  const queryResult = useQuery<TQueryFnData, TError, TData, TQueryKey>(queryOptions);
  return children(queryResult);
}

function UseSuspenseQueryContainer<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({ children, ...queryOptions }: UseSuspenseQueryContainerProps<TQueryFnData, TError, TData, TQueryKey>) {
  const queryResult = useSuspenseQuery<TQueryFnData, TError, TData, TQueryKey>(queryOptions);
  return children(queryResult);
}

function UseInfiniteQueryContainer<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>({
  children,
  ...queryOptions
}: UseInfiniteQueryContainerProps<TQueryFnData, TError, TData, TQueryKey, TPageParam>) {
  const queryResult = useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(queryOptions);
  return children(queryResult);
}

function UseSuspenseInfiniteQueryContainer<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>({
  children,
  ...queryOptions
}: UseSuspenseInfiniteQueryContainerProps<TQueryFnData, TError, TData, TQueryKey, TPageParam>) {
  const queryResult = useSuspenseInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(
    queryOptions
  );
  return children(queryResult);
}

// ============================================
// 3. Discriminated Union Props (suspense, infinite 조합)
// ============================================

// useQuery: suspense: false, infinite: false
type QueryProps<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = {
  suspense?: false;
  infinite?: false;
} & UseQueryContainerProps<TQueryFnData, TError, TData, TQueryKey>;

// useSuspenseQuery: suspense: true, infinite: false
type SuspenseQueryProps<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = {
  suspense: true;
  infinite?: false;
} & UseSuspenseQueryContainerProps<TQueryFnData, TError, TData, TQueryKey>;

// useInfiniteQuery: suspense: false, infinite: true
type InfiniteQueryProps<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> = {
  suspense?: false;
  infinite: true;
} & UseInfiniteQueryContainerProps<TQueryFnData, TError, TData, TQueryKey, TPageParam>;

// useSuspenseInfiniteQuery: suspense: true, infinite: true
type SuspenseInfiniteQueryProps<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> = {
  suspense: true;
  infinite: true;
} & UseSuspenseInfiniteQueryContainerProps<TQueryFnData, TError, TData, TQueryKey, TPageParam>;

// ============================================
// 4. 모든 Props를 Union으로 결합
// ============================================

type AllQueryProps<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> =
  | QueryProps<TQueryFnData, TError, TData, TQueryKey>
  | SuspenseQueryProps<TQueryFnData, TError, TData, TQueryKey>
  | InfiniteQueryProps<TQueryFnData, TError, TData, TQueryKey, TPageParam>
  | SuspenseInfiniteQueryProps<TQueryFnData, TError, TData, TQueryKey, TPageParam>;

// ============================================
// 5. 메인 Query 컴포넌트 (오버로드 시그니처 사용)
// ============================================

// useQuery
function Query<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(props: QueryProps<TQueryFnData, TError, TData, TQueryKey>): ReactNode;

// useSuspenseQuery
function Query<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(props: SuspenseQueryProps<TQueryFnData, TError, TData, TQueryKey>): ReactNode;

// useInfiniteQuery
function Query<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(props: InfiniteQueryProps<TQueryFnData, TError, TData, TQueryKey, TPageParam>): ReactNode;

// useSuspenseInfiniteQuery
function Query<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(props: SuspenseInfiniteQueryProps<TQueryFnData, TError, TData, TQueryKey, TPageParam>): ReactNode;

// 실제 구현
function Query(props: AllQueryProps) {
  const isSuspense = props.suspense === true;
  const isInfinite = props.infinite === true;

  if (!isSuspense && !isInfinite) {
    // useQuery
    const { suspense: _s, infinite: _i, ...containerProps } = props;
    return <UseQueryContainer {...containerProps} />;
  } else if (isSuspense && !isInfinite) {
    // useSuspenseQuery
    const { suspense: _s, infinite: _i, ...containerProps } = props;
    return <UseSuspenseQueryContainer {...containerProps} />;
  } else if (!isSuspense && isInfinite) {
    // useInfiniteQuery
    const { suspense: _s, infinite: _i, ...containerProps } = props;
    return <UseInfiniteQueryContainer {...containerProps} />;
  } else {
    // useSuspenseInfiniteQuery
    const { suspense: _s, infinite: _i, ...containerProps } = props;
    return <UseSuspenseInfiniteQueryContainer {...containerProps} />;
  }
}

export default Query;
