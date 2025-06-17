// utils/dateFormatter.ts
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/vi' // Vietnamese
import 'dayjs/locale/en' // English
import relativeTime from 'dayjs/plugin/relativeTime'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

// Extend dayjs với các plugin
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

// Set default locale
dayjs.locale('vi')

// ============================================
// ENUMS & TYPES
// ============================================

export enum DateFormatType {
    // Basic formats
    DATE_ONLY = 'DD/MM/YYYY',
    DATE_TIME = 'DD/MM/YYYY HH:mm:ss',
    DATE_TIME_SHORT = 'DD/MM/YYYY HH:mm',
    TIME_ONLY = 'HH:mm:ss',
    TIME_SHORT = 'HH:mm',

    // ISO formats
    ISO_DATE = 'YYYY-MM-DD',
    ISO_DATETIME = 'YYYY-MM-DDTHH:mm:ss',
    ISO_DATETIME_MS = 'YYYY-MM-DDTHH:mm:ss.SSS',

    // Vietnamese formats
    VN_FULL = 'dddd, DD MMMM YYYY',
    VN_FULL_TIME = 'dddd, DD MMMM YYYY - HH:mm',
    VN_MONTH_YEAR = 'MM/YYYY',
    VN_DAY_MONTH = 'DD/MM',

    // English formats
    EN_FULL = 'dddd, MMMM DD, YYYY',
    EN_SHORT = 'MMM DD, YYYY',
    EN_MONTH_YEAR = 'MMM YYYY',

    // Custom formats
    FILENAME_SAFE = 'YYYY-MM-DD_HH-mm-ss',
    DISPLAY_FRIENDLY = 'DD/MM/YYYY lúc HH:mm',
    COMPACT = 'DDMMYYYY',
    YEAR_MONTH = 'YYYY-MM',
}

export enum LocaleType {
    VIETNAMESE = 'vi',
    ENGLISH = 'en',
}

export type DateInput = string | number | Date | Dayjs | null | undefined

// ============================================
// MAIN FORMATTER CLASS
// ============================================

class DateFormatter {
    private currentLocale: LocaleType = LocaleType.VIETNAMESE

    /**
     * Set global locale
     */
    setLocale(locale: LocaleType): void {
        this.currentLocale = locale
        dayjs.locale(locale)
    }

    /**
     * Get current locale
     */
    getLocale(): LocaleType {
        return this.currentLocale
    }

    /**
     * Format date with predefined format
     */
    format(
        date: DateInput,
        formatType: DateFormatType = DateFormatType.DATE_ONLY,
        locale?: LocaleType,
    ): string {
        if (!this.isValidDate(date)) return ''

        const dayjsDate = this.toDayjs(date)
        const targetLocale = locale || this.currentLocale

        return dayjsDate.locale(targetLocale).format(formatType)
    }

    /**
     * Format with custom format string
     */
    formatCustom(date: DateInput, formatString: string, locale?: LocaleType): string {
        if (!this.isValidDate(date)) return ''

        const dayjsDate = this.toDayjs(date)
        const targetLocale = locale || this.currentLocale

        return dayjsDate.locale(targetLocale).format(formatString)
    }

    /**
     * Get relative time (ago/from now)
     */
    fromNow(date: DateInput, locale?: LocaleType): string {
        if (!this.isValidDate(date)) return ''

        const dayjsDate = this.toDayjs(date)
        const targetLocale = locale || this.currentLocale

        return dayjsDate.locale(targetLocale).fromNow()
    }

    /**
     * Get relative time to another date
     */
    from(date: DateInput, compareDate: DateInput, locale?: LocaleType): string {
        if (!this.isValidDate(date) || !this.isValidDate(compareDate)) return ''

        const dayjsDate = this.toDayjs(date)
        const compareDayjsDate = this.toDayjs(compareDate)
        const targetLocale = locale || this.currentLocale

        return dayjsDate.locale(targetLocale).from(compareDayjsDate)
    }

    /**
     * Parse date from string with custom format
     */
    parseCustom(dateString: string, formatString: string): Dayjs | null {
        try {
            const parsed = dayjs(dateString, formatString)
            return parsed.isValid() ? parsed : null
        } catch {
            return null
        }
    }

    /**
     * Convert to different timezone
     */
    toTimezone(date: DateInput, timezone: string): Dayjs | null {
        if (!this.isValidDate(date)) return null

        const dayjsDate = this.toDayjs(date)
        return dayjsDate.tz(timezone)
    }

    /**
     * Check if date is valid
     */
    isValidDate(date: DateInput): boolean {
        if (date === null || date === undefined) return false
        return this.toDayjs(date).isValid()
    }

    /**
     * Convert input to Dayjs object
     */
    private toDayjs(date: DateInput): Dayjs {
        if (dayjs.isDayjs(date)) return date
        return dayjs(date)
    }

    /**
     * Get current date/time
     */
    now(): Dayjs {
        return dayjs()
    }

    /**
     * Get start of day
     */
    startOfDay(date: DateInput): Dayjs | null {
        if (!this.isValidDate(date)) return null
        return this.toDayjs(date).startOf('day')
    }

    /**
     * Get end of day
     */
    endOfDay(date: DateInput): Dayjs | null {
        if (!this.isValidDate(date)) return null
        return this.toDayjs(date).endOf('day')
    }

    /**
     * Add time to date
     */
    add(date: DateInput, value: number, unit: dayjs.ManipulateType): Dayjs | null {
        if (!this.isValidDate(date)) return null
        return this.toDayjs(date).add(value, unit)
    }

    /**
     * Subtract time from date
     */
    subtract(date: DateInput, value: number, unit: dayjs.ManipulateType): Dayjs | null {
        if (!this.isValidDate(date)) return null
        return this.toDayjs(date).subtract(value, unit)
    }

    /**
     * Check if date is before another date
     */
    isBefore(date: DateInput, compareDate: DateInput): boolean {
        if (!this.isValidDate(date) || !this.isValidDate(compareDate)) return false
        return this.toDayjs(date).isBefore(this.toDayjs(compareDate))
    }

    /**
     * Check if date is after another date
     */
    isAfter(date: DateInput, compareDate: DateInput): boolean {
        if (!this.isValidDate(date) || !this.isValidDate(compareDate)) return false
        return this.toDayjs(date).isAfter(this.toDayjs(compareDate))
    }

    /**
     * Check if date is same as another date
     */
    isSame(date: DateInput, compareDate: DateInput, unit?: dayjs.OpUnitType): boolean {
        if (!this.isValidDate(date) || !this.isValidDate(compareDate)) return false
        return this.toDayjs(date).isSame(this.toDayjs(compareDate), unit)
    }

    /**
     * Get difference between two dates
     */
    diff(date: DateInput, compareDate: DateInput, unit?: dayjs.QUnitType): number {
        if (!this.isValidDate(date) || !this.isValidDate(compareDate)) return 0
        return this.toDayjs(date).diff(this.toDayjs(compareDate), unit)
    }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const dateFormatter = new DateFormatter()

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Quick format functions
 */
export const formatDate = (date: DateInput, format: DateFormatType = DateFormatType.DATE_ONLY) =>
    dateFormatter.format(date, format)

export const formatDateTime = (date: DateInput) =>
    dateFormatter.format(date, DateFormatType.DATE_TIME)

export const formatTimeOnly = (date: DateInput) =>
    dateFormatter.format(date, DateFormatType.TIME_ONLY)

export const formatVietnamese = (date: DateInput) =>
    dateFormatter.format(date, DateFormatType.VN_FULL, LocaleType.VIETNAMESE)

export const formatRelative = (date: DateInput) => dateFormatter.fromNow(date)

export const formatISO = (date: DateInput) =>
    dateFormatter.format(date, DateFormatType.ISO_DATETIME)

export const formatFileSafe = (date: DateInput) =>
    dateFormatter.format(date, DateFormatType.FILENAME_SAFE)

/**
 * Validation functions
 */
export const isValidDate = (date: DateInput): boolean => dateFormatter.isValidDate(date)

export const parseDate = (dateString: string, format: string) =>
    dateFormatter.parseCustom(dateString, format)

/**
 * Common date operations
 */
export const addDays = (date: DateInput, days: number) => dateFormatter.add(date, days, 'day')

export const subtractDays = (date: DateInput, days: number) =>
    dateFormatter.subtract(date, days, 'day')

export const isToday = (date: DateInput): boolean => dateFormatter.isSame(date, dayjs(), 'day')

export const isTomorrow = (date: DateInput): boolean =>
    dateFormatter.isSame(date, dayjs().add(1, 'day'), 'day')

export const isYesterday = (date: DateInput): boolean =>
    dateFormatter.isSame(date, dayjs().subtract(1, 'day'), 'day')

// ============================================
// REACT HOOKS
// ============================================

/**
 * Hook for live time updates
 */
import { useState, useEffect } from 'react'

export const useLiveTime = (
    format: DateFormatType = DateFormatType.DATE_TIME,
    interval: number = 1000,
) => {
    const [time, setTime] = useState(() => formatDate(dayjs(), format))

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(formatDate(dayjs(), format))
        }, interval)

        return () => clearInterval(timer)
    }, [format, interval])

    return time
}

/**
 * Hook for relative time updates
 */
export const useRelativeTime = (date: DateInput, interval: number = 60000) => {
    const [relativeTime, setRelativeTime] = useState(() => formatRelative(date))

    useEffect(() => {
        const timer = setInterval(() => {
            setRelativeTime(formatRelative(date))
        }, interval)

        return () => clearInterval(timer)
    }, [date, interval])

    return relativeTime
}

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Basic usage
import { dateFormatter, DateFormatType, formatDate, formatVietnamese } from './utils/dateFormatter';

// Format với enum
const formattedDate = formatDate(new Date(), DateFormatType.DATE_TIME);
// Result: "25/12/2024 10:30:15"

// Format Vietnamese
const vnDate = formatVietnamese(new Date());
// Result: "Thứ Ba, 25 tháng 12 năm 2024"

// Relative time
const relative = dateFormatter.fromNow('2024-12-20');
// Result: "5 ngày trước"

// Custom format
const custom = dateFormatter.formatCustom(new Date(), 'DD-MM-YYYY [lúc] HH:mm');
// Result: "25-12-2024 lúc 10:30"

// Parse custom format
const parsed = dateFormatter.parseCustom('25-12-2024', 'DD-MM-YYYY');

// Validation
if (isValidDate(someDate)) {
  // Process date
}

// Date operations
const tomorrow = addDays(new Date(), 1);
const isDateToday = isToday(someDate);

// React hooks usage
const LiveClock = () => {
  const currentTime = useLiveTime(DateFormatType.TIME_ONLY);
  return <div>{currentTime}</div>;
};

const RelativeTimeDisplay = ({ date }) => {
  const relative = useRelativeTime(date);
  return <span>{relative}</span>;
};
*/
