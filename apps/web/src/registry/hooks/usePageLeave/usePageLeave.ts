import { useCallback, useEffect, useRef } from "react";

/**
 * 페이지 이탈 이벤트 타입
 * - 'all': visibilitychange와 pagehide 모두 사용
 * - 'pagehide': 페이지 언로드 시에만 실행
 * - 'visibilitychange': 페이지가 hidden 상태로 전환될 때 실행
 */
type LeaveEventType = "all" | "pagehide" | "visibilitychange";

/**
 * sendBeacon 설정
 */
interface SendBeaconConfig {
  /** 데이터를 전송할 서버 엔드포인트 URL */
  url: string;
  /** 전송할 데이터 (객체는 자동으로 JSON으로 변환됨) */
  data: BodyInit | Record<string, unknown> | (() => BodyInit | Record<string, unknown>);
}

/**
 * usePageLeave 훅 Props
 */
interface UsePageLeaveProps {
  /** 페이지 이탈 시 실행할 동기 콜백 함수 */
  callback?: () => void;
  /** 서버로 전송할 beacon 설정 */
  sendBeacon?: SendBeaconConfig;
  /** 사용할 이벤트 타입 (기본값: 'pagehide') */
  eventType?: LeaveEventType;
  /** 훅 활성화 여부 (기본값: true) */
  enabled?: boolean;
  /** 에러 발생 시 실행할 핸들러 */
  onError?: (error: Error) => void;
}

/**
 * 페이지 이탈 시 콜백 실행 및 데이터 전송을 처리하는 훅
 *
 * @example
 * ```tsx
 * // 기본 사용
 * usePageLeave({
 *   callback: () => {
 *     localStorage.setItem('lastVisit', Date.now().toString());
 *   },
 *   sendBeacon: {
 *     url: '/api/analytics',
 *     data: { userId: '123', duration: 1000 },
 *   },
 * });
 *
 * // 동적 데이터
 * usePageLeave({
 *   sendBeacon: {
 *     url: '/api/session-end',
 *     data: () => ({
 *       userId: getCurrentUserId(),
 *       timestamp: Date.now(),
 *     }),
 *   },
 *   eventType: 'all',
 * });
 * ```
 */
const usePageLeave = ({
  callback,
  sendBeacon,
  eventType = "pagehide",
  enabled = true,
  onError,
}: UsePageLeaveProps) => {
  // 중복 실행 방지 플래그
  const hasExecutedRef = useRef(false);

  /**
   * 페이지 이탈 시 실행되는 메인 핸들러
   * 1. callback 실행
   * 2. sendBeacon으로 데이터 전송
   * 3. sendBeacon 실패 시 keepalive fetch로 fallback
   */
  const onPageLeave = useCallback(() => {
    // 이미 실행되었거나 비활성화된 경우 early return
    console.log("??");
    if (hasExecutedRef.current || !enabled) return;
    hasExecutedRef.current = true;

    try {
      // 1. 동기 callback 실행
      if (callback) {
        callback();
      }

      // 2. sendBeacon으로 데이터 전송
      if (sendBeacon) {
        const { url, data } = sendBeacon;

        // 함수인 경우 실행하여 데이터 가져오기
        const rawData = typeof data === "function" ? data() : data;

        // 데이터 타입에 따라 적절한 형식으로 변환
        const payload =
          rawData instanceof Blob || rawData instanceof FormData || typeof rawData === "string"
            ? rawData
            : new Blob([JSON.stringify(rawData)], { type: "application/json" });

        // sendBeacon으로 전송 시도
        const success = navigator.sendBeacon(url, payload);

        // sendBeacon 실패 시 keepalive fetch로 fallback
        if (!success) {
          fetch(url, {
            method: "POST",
            body: payload,
            keepalive: true, // 페이지 언로드 후에도 요청 유지
            headers: payload instanceof Blob ? { "Content-Type": "application/json" } : undefined,
          }).catch((err) => {
            console.error("Fallback fetch failed:", err);
          });
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("Error in page leave handler:", err);
      onError?.(err);
    }
  }, [callback, sendBeacon, enabled, onError]);

  /**
   * visibilitychange 이벤트 핸들러
   * document가 hidden 상태로 전환될 때만 onPageLeave 실행
   */
  const onVisibilityChange = useCallback(() => {
    if (document.visibilityState === "hidden") {
      onPageLeave();
    }
  }, [onPageLeave]);

  useEffect(() => {
    if (!enabled) return;

    // 이벤트 타입에 따라 리스너 등록 여부 결정
    const shouldListenVisibility = eventType === "all" || eventType === "visibilitychange";
    const shouldListenPagehide = eventType === "all" || eventType === "pagehide";

    // visibilitychange 이벤트 리스너 등록
    if (shouldListenVisibility) {
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    // pagehide 이벤트 리스너 등록
    if (shouldListenPagehide) {
      window.addEventListener("pagehide", onPageLeave);
    }

    return () => {
      // cleanup 시 플래그 리셋 (컴포넌트 재마운트 시 정상 동작하도록)
      hasExecutedRef.current = false;

      // 이벤트 리스너 제거
      if (shouldListenVisibility) {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
      if (shouldListenPagehide) {
        window.removeEventListener("pagehide", onPageLeave);
      }
    };
  }, [eventType, enabled, onPageLeave, onVisibilityChange]);
};

export default usePageLeave;
