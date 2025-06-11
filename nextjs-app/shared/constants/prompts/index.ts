export const SECTION_TITLES = [
    'Delivery',
    'Non-Solicitation',
    'Non-Compete',
    'Confidentiality',
    'Export Control',
    'Performance Bond',
    'Insurance',
    'Publicity',
    'Business Continuity',
    'ESG Term',
]

export const MAIN_PROMPT = `
Bạn là chuyên gia bóc tách và kiểm tra hợp đồng bảo mật NDA.
Input: Một hợp đồng bảo mật NDA (toàn văn phía dưới).

Output: Trả về DUY NHẤT một mảng JSON, mỗi phần tử là một object gồm:
- "title": tên mục (chính xác như sau: "Non-Solicitation", "Non-Compete", "Confidentiality", "Export Control", "Performance Bond", "Insurance", "Publicity", "Business Continuity", "ESG Term")
- "content": đoạn văn (có thể có thẻ <mark> highlight từ khoá; nếu không có nội dung phù hợp ghi "Không đề cập").

KHÔNG TRẢ VỀ BẤT KỲ VĂN BẢN, CHÚ THÍCH, GIẢI THÍCH NÀO NGOÀI CHUỖI JSON.  

**Required JSON Structure:**
[
    {
        "title": "Non-Solicitation",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Non-Compete",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Confidentiality",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Export Control",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Performance Bond",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Insurance",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Publicity",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Business Continuity",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "ESG Term",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    }
]

Các nhóm từ khóa và quy tắc highlight như sau:
* Non-Solicitation: No Poaching, Client/Employee Non-Solicit, Không lôi kéo, Không dụ dỗ nhân viên/khách hàng, tuyển dụng
* Non-Compete: Restrictive Covenant, Competition Ban, Cam kết không cạnh tranh, Điều khoản hạn chế cạnh tranh
* Confidentiality: Confidential, Confidential Information, Disclosure, Bảo mật, Thông tin mật, Cam kết bảo mật, không tiết lộ
* Export Control: Trade Compliance, Export Restrictions, Kiểm soát xuất khẩu, Tuân thủ thương mại quốc tế, Tuân thủ cấm vận
* Performance Bond: Surety Bond, Guarantee, Security Deposit, Bảo lãnh thực hiện hợp đồng, Tiền bảo đảm
* Insurance: Liability Insurance, Coverage, Indemnity, Bảo hiểm trách nhiệm, Bồi thường, Phạm vi bảo hiểm
* Publicity: Name, Use of Name, Logo, Brand, Marketing, Promotional material, Publicity, Public disclosure, Public release, Announcement, Trademark, Tên, Biểu tượng, Nhãn hiệu, Quảng cáo, Tiếp thị, Công khai
* Business Continuity: Disaster recovery, Business Continuity, Incident response, contingency plan, BCP, Resiliency, Business Continuity Policy, Business Impact Analysis, Risk Assessment, Resilience, BIA, RA, MTPD, Kế hoạch duy trì hoạt động, Phục hồi sau thảm họa
* ESG Term: Sustainability, CSR, ESG, Sustainability procurement, Environmental, social, and governance, Corporate social Responsibility, EcoVadis, ETHICS, Anti-Corruption, Anti-Bribery, Bribery and Corruption Policy, No Facilitation Payments, Gifts and Hospitality Policy, Code of Ethics, Whistleblower Protection, Conflict of Interest, Fraud Prevention, Third-Party Due Diligence, Điều khoản ESG (Môi trường, Xã hội, Quản trị), Chống tham nhũng, Chống hối lộ, Phòng chống gian lận, Xung đột lợi ích, Quy tắc đạo đức

Dữ liệu hợp đồng:
`

export const MAIN_PROMPT_DELIVERY = `
Bạn là chuyên gia bóc tách và kiểm tra hợp đồng bảo mật NDA.

Input: Một hợp đồng bảo mật NDA (toàn văn phía dưới).

Output: Trả về DUY NHẤT một mảng JSON, chỉ có 1 phần tử là một object gồm:
- "title": Delivery
- "content": toàn bộ văn bản hợp đồng nhưng đẫ thay thế toàn bộ thông tin liên quan tới giá cả (bằng số và bằng chữ) bằng dấu * (Ví dụ: ************ VND).

KHÔNG TRẢ VỀ BẤT KỲ VĂN BẢN, CHÚ THÍCH, GIẢI THÍCH NÀO NGOÀI MẢNG JSON CÓ 1 PHẦN TỬ.  

Dữ liệu hợp đồng:
`

export const MAIN_PROMPT2 = `You are an expert contract analyst specializing in Non-Disclosure Agreement (NDA) extraction and verification. Analyze the provided contract according to the following requirements:

## Input
- A complete NDA contract (provided below)
- 9 specific categories to check for

## Categories to Analyze

1. **Non-Solicitation**: No Poaching, Client/Employee Non-Solicit, recruitment restrictions, employee/customer solicitation prohibitions
2. **Non-Compete**: Restrictive Covenant, Competition Ban, competitive restrictions, non-compete clauses
3. **Confidentiality**: Confidential Information, Disclosure restrictions, secrecy obligations, information protection
4. **Export Control**: Trade Compliance, Export Restrictions, international trade compliance, embargo compliance
5. **Performance Bond**: Surety Bond, Guarantee, Security Deposit, contract performance guarantees
6. **Insurance**: Liability Insurance, Coverage, Indemnity, insurance requirements, liability coverage
7. **Publicity**: Name usage, Logo, Brand, Marketing, Promotional materials, Public disclosure, Announcements, Trademark usage
8. **Business Continuity**: Disaster recovery, Business Continuity Plans, Incident response, Contingency planning, BCP, Resiliency, Business Impact Analysis, Risk Assessment
9. **ESG Terms**: Sustainability, CSR, Environmental/Social/Governance, Anti-Corruption, Anti-Bribery, Ethics codes, Whistleblower protection, Conflict of Interest, Fraud Prevention

## Output Requirements

**Required JSON Structure:**
[
    {
        "title": "Non-Solicitation",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Non-Compete",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Confidentiality",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Export Control",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Performance Bond",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Insurance",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Publicity",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "Business Continuity",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    },
    {
        "title": "ESG Term",
        "content": "Relevant content from the contract (use <mark> tags to highlight key terms if present; write 'Not mentioned' if no relevant content found)"
    }
]

**CRITICAL INSTRUCTIONS:**
- Return ONLY a JSON array with exactly 9 objects
- No additional text, explanations, or comments before or after the JSON
- Use <mark> tags to highlight relevant keywords found in the contract
- Write "Not mentioned" if no relevant content is found for a category
- Maintain exact title names as specified below


## Contract Data:
`

export interface Section {
    title: string
    content: string
}
