/* eslint-disable @typescript-eslint/no-explicit-any */
import { SECTION_TITLES, Section } from '../constants'

const extractJsonFromText = (content: string) => {
    const match = content.match(/\[\s*{[\s\S]*?}\s*\]/)
    if (match) {
        try {
            return JSON.parse(match[0])
        } catch {
            return null
        }
    }
    return null
}

const normalizeSections = (rawSections: any): Section[] => {
    return SECTION_TITLES.map((title) => {
        const found =
            Array.isArray(rawSections) &&
            rawSections.find(
                (item: any) => (item.title || '').trim().toLowerCase() === title.toLowerCase(),
            )
        return {
            title,
            content: found && found.content ? found.content : 'Không đề cập',
        }
    })
}

// Robust parser, always tries to get a valid 10-section array regardless of AI output format
export const tryNormalizeSections = (input: any): Section[] | null => {
    // Nếu đã là mảng object (model trả về array)
    if (Array.isArray(input)) {
        return normalizeSections(input)
    }

    // Nếu là object {title, content} duy nhất
    if (typeof input === 'object' && input !== null && input.title && input.content) {
        return normalizeSections([input])
    }

    // Nếu là string
    if (typeof input === 'string') {
        try {
            const parsed = input.trim()
            if (parsed.startsWith('[')) {
                const arr = JSON.parse(parsed)
                if (Array.isArray(arr)) return normalizeSections(arr)
            }
            const obj = JSON.parse(parsed)
            if (Array.isArray(obj)) return normalizeSections(obj)
            if (typeof obj === 'string') {
                const obj2 = JSON.parse(obj)
                if (Array.isArray(obj2)) return normalizeSections(obj2)
            }
        } catch {
            //
        }

        // Nếu thất bại, thử extract từ text bằng regex
        const extracted = extractJsonFromText(input)
        if (extracted) return normalizeSections(extracted)
    }

    return null
}
