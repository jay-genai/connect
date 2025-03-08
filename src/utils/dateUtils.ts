import {
  format,
  isToday,
  isTomorrow,
  isAfter,
  isBefore,
  addDays,
} from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 날짜를 한국어 형식으로 포맷팅합니다.
 * @param date 포맷팅할 날짜
 * @param formatStr 포맷 문자열 (기본값: 'yyyy년 MM월 dd일')
 * @returns 포맷팅된 날짜 문자열
 */
export const formatKoreanDate = (
  date: Date | string,
  formatStr = "yyyy년 MM월 dd일"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: ko });
};

/**
 * 날짜를 사용자 친화적인 형식으로 포맷팅합니다. (오늘, 내일, 또는 날짜)
 * @param date 포맷팅할 날짜
 * @returns 포맷팅된 날짜 문자열
 */
export const formatFriendlyDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isToday(dateObj)) {
    return "오늘";
  } else if (isTomorrow(dateObj)) {
    return "내일";
  } else {
    return formatKoreanDate(dateObj);
  }
};

/**
 * 날짜가 지났는지 확인합니다. (오늘은 지나지 않은 것으로 간주)
 * @param date 확인할 날짜
 * @returns 날짜가 지났으면 true, 아니면 false
 */
export const isDueDatePassed = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  return isBefore(dateObj, today) && !isToday(dateObj);
};

/**
 * 날짜가 특정 기간 내에 있는지 확인합니다.
 * @param date 확인할 날짜
 * @param days 오늘로부터의 일수
 * @returns 날짜가 기간 내에 있으면 true, 아니면 false
 */
export const isDateWithinDays = (
  date: Date | string,
  days: number
): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  const futureDate = addDays(today, days);

  return (
    (isAfter(dateObj, today) || isToday(dateObj)) &&
    (isBefore(dateObj, futureDate) || isToday(futureDate))
  );
};
