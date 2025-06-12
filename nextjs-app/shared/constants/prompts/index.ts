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

const keywordMapping = {
    'Non-Solicitation': [
        'No Poaching',
        'Client/Employee Non-Solicit',
        'Không lôi kéo',
        'Không dụ dỗ nhân viên/khách hàng',
        'tuyển dụng',
        'solicit',
        'poaching',
        'employee',
        'staff',
        'personnel',
    ],
    'Non-Compete': [
        'Restrictive Covenant',
        'Competition Ban',
        'Cam kết không cạnh tranh',
        'Điều khoản hạn chế cạnh tranh',
        'compete',
        'competition',
        'restrictive',
        'covenant',
        'ban',
        'prohibition',
    ],
    Confidentiality: [
        'Confidential',
        'Confidential Information',
        'Disclosure',
        'Bảo mật',
        'Thông tin mật',
        'Cam kết bảo mật',
        'không tiết lộ',
        'confidentiality',
        'non-disclosure',
        'proprietary',
        'secret',
        'private',
    ],
    'Export Control': [
        'Trade Compliance',
        'Export Restrictions',
        'Kiểm soát xuất khẩu',
        'Tuân thủ thương mại quốc tế',
        'Tuân thủ cấm vận',
        'export control',
        'trade',
        'compliance',
        'sanctions',
        'embargo',
    ],
    'Performance Bond': [
        'Surety Bond',
        'Guarantee',
        'Security Deposit',
        'Bảo lãnh thực hiện hợp đồng',
        'Tiền bảo đảm',
        'performance bond',
        'surety',
        'guarantee',
        'security',
        'deposit',
        'bond',
    ],
    Insurance: [
        'Liability Insurance',
        'Coverage',
        'Indemnity',
        'Bảo hiểm trách nhiệm',
        'Bồi thường',
        'Phạm vi bảo hiểm',
        'insurance',
        'liability',
        'coverage',
        'indemnity',
        'compensation',
    ],
    Publicity: [
        'Name',
        'Use of Name',
        'Logo',
        'Brand',
        'Marketing',
        'Promotional material',
        'Publicity',
        'Public disclosure',
        'Public release',
        'Announcement',
        'Trademark',
        'Tên',
        'Biểu tượng',
        'Nhãn hiệu',
        'Quảng cáo',
        'Tiếp thị',
        'Công khai',
        'publicity',
        'marketing',
        'promotional',
        'brand',
        'logo',
        'trademark',
    ],
    'Business Continuity': [
        'Disaster recovery',
        'Business Continuity',
        'Incident response',
        'contingency plan',
        'BCP',
        'Resiliency',
        'Business Continuity Policy',
        'Business Impact Analysis',
        'Risk Assessment',
        'Resilience',
        'BIA',
        'RA',
        'MTPD',
        'Kế hoạch duy trì hoạt động',
        'Phục hồi sau thảm họa',
        'continuity',
        'disaster',
        'recovery',
        'incident',
    ],
    'ESG Term': [
        'Sustainability',
        'CSR',
        'ESG',
        'Sustainability procurement',
        'Environmental',
        'social',
        'governance',
        'Corporate social Responsibility',
        'EcoVadis',
        'ETHICS',
        'Anti-Corruption',
        'Anti-Bribery',
        'Bribery and Corruption Policy',
        'No Facilitation Payments',
        'Gifts and Hospitality Policy',
        'Code of Ethics',
        'Whistleblower Protection',
        'Conflict of Interest',
        'Fraud Prevention',
        'Third-Party Due Diligence',
        'Điều khoản ESG',
        'Chống tham nhũng',
        'Chống hối lộ',
        'Phòng chống gian lận',
        'Xung đột lợi ích',
        'Quy tắc đạo đức',
        'sustainability',
        'environmental',
        'social',
        'governance',
        'ethics',
        'corruption',
        'bribery',
        'fraud',
        'conflict',
    ],
}

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

export const buildPromptChecklist = (checklistTable: string, contractText: string): string => {
    return `# KIỂM TRA HỢP ĐỒNG PHÁP LÝ

## VAI TRÒ
Bạn là chuyên gia phân tích hợp đồng pháp lý với nhiều năm kinh nghiệm trong việc đối chiếu và đánh giá các điều khoản hợp đồng.

## NHIỆM VỤ CHÍNH
Đối chiếu hợp đồng được cung cấp với checklist tiêu chuẩn và trả về **DUY NHẤT** một mảng JSON theo cấu trúc được quy định.

## CẤU TRÚC JSON YÊU CẦU
Mỗi phần tử trong mảng JSON phải có đúng cấu trúc sau:

\`\`\`json
{
  "item": "Tên mục kiểm tra",
  "standard": "Tiêu chuẩn yêu cầu", 
  "frequency": "Yes|No",
  "found_text": "Đoạn văn bản liên quan trong hợp đồng hoặc 'Không tìm thấy trong hợp đồng.'",
  "review_result": "OK|NOK|Null",
  "suggest": "Phân tích cụ thể và gợi ý chỉnh sửa"
}
\`\`\`

## QUY TẮC ĐÁNH GIÁ

### 1. Khi Frequency = "Yes" (BẮT BUỘC phải có):
- **Không có trong hợp đồng**: review_result = "NOK", suggest = "Bổ sung điều khoản này vào hợp đồng: [mô tả cụ thể]"
- **Có nhưng không đúng tiêu chuẩn**: review_result = "NOK", suggest = "Chỉnh sửa cho đúng tiêu chuẩn: [ghi rõ nội dung cần sửa]"
- **Có và đúng tiêu chuẩn**: review_result = "OK", suggest = ""

### 2. Khi Frequency = "No" (KHÔNG bắt buộc):
- **Không có trong hợp đồng**: review_result = "Null", suggest = ""
- **Có trong hợp đồng**: Nếu đúng ngữ nghĩa: review_result = "OK", Nếu sai ngữ nghĩa: review_result = "NOK" + gợi ý sửa

### 3. Khi Standard = "Not mentioned" (KHÔNG được phép có):
- **Tìm thấy trong hợp đồng**: review_result = "NOK", suggest = "Xóa/loại bỏ điều khoản này khỏi hợp đồng"
- **Không tìm thấy**: review_result = "OK" hoặc "Null", suggest = ""

## YÊU CẦU BẮT BUỘC
- Trường "found_text": Phải trích dẫn CHÍNH XÁC đoạn văn bản từ hợp đồng
- Trường "suggest": Phải PHÂN TÍCH CỤ THỂ vì sao đạt/không đạt
- Khi review_result = "NOK": BẮT BUỘC phải có suggest cụ thể

## ĐẦU RA CUỐI CÙNG
Trả về DUY NHẤT mảng JSON đúng cấu trúc trên. KHÔNG giải thích, bình luận hay thêm bất kỳ nội dung nào khác.

## CHECKLIST ĐÁNH GIÁ
${checklistTable}

## NỘI DUNG HỢP ĐỒNG CẦN KIỂM TRA
${contractText}`
}

export const buildPromptDetectContract = (contractText: string): string => {
    const keywordsSection = Object.entries(keywordMapping)
        .map(([category, keywords]) => `* ${category}: ${keywords.join(', ')}`)
        .join('\n')
    return `# BÓC TÁCH NỘI DUNG HỢP ĐỒNG NDA

## VAI TRÒ
Bạn là chuyên gia bóc tách và kiểm tra hợp đồng bảo mật NDA với khả năng phân tích và phân loại nội dung chính xác.

## NHIỆM VỤ
Phân tích hợp đồng NDA được cung cấp và trích xuất nội dung liên quan đến 9 mục chính.

## CẤU TRÚC JSON YÊU CẦU
Trả về DUY NHẤT một mảng JSON với cấu trúc sau:

\`\`\`json
[
    {
        "title": "Non-Solicitation",
        "content": "Nội dung liên quan (sử dụng <mark> để highlight từ khóa; ghi 'Không đề cập' nếu không tìm thấy)"
    },
    {
        "title": "Non-Compete", 
        "content": "Nội dung liên quan (sử dụng <mark> để highlight từ khóa; ghi 'Không đề cập' nếu không tìm thấy)"
    },
    {
        "title": "Confidentiality",
        "content": "Nội dung liên quan (sử dụng <mark> để highlight từ khóa; ghi 'Không đề cập' nếu không tìm thấy)"
    },
    {
        "title": "Export Control",
        "content": "Nội dung liên quan (sử dụng <mark> để highlight từ khóa; ghi 'Không đề cập' nếu không tìm thấy)"
    },
    {
        "title": "Performance Bond",
        "content": "Nội dung liên quan (sử dụng <mark> để highlight từ khóa; ghi 'Không đề cập' nếu không tìm thấy)"
    },
    {
        "title": "Insurance",
        "content": "Nội dung liên quan (sử dụng <mark> để highlight từ khóa; ghi 'Không đề cập' nếu không tìm thấy)"
    },
    {
        "title": "Publicity",
        "content": "Nội dung liên quan (sử dụng <mark> để highlight từ khóa; ghi 'Không đề cập' nếu không tìm thấy)"
    },
    {
        "title": "Business Continuity",
        "content": "Nội dung liên quan (sử dụng <mark> để highlight từ khóa; ghi 'Không đề cập' nếu không tìm thấy)"
    },
    {
        "title": "ESG Term",
        "content": "Nội dung liên quan (sử dụng <mark> để highlight từ khóa; ghi 'Không đề cập' nếu không tìm thấy)"
    }
]
\`\`\`

## QUY TẮC XỬ LÝ

### 1. Trích xuất nội dung:
- Tìm kiếm đoạn văn bản trong hợp đồng có liên quan đến từng mục
- Trích xuất toàn bộ câu/đoạn văn có ý nghĩa, không cắt xén
- Ưu tiên nội dung chi tiết và đầy đủ nhất

### 2. Highlight từ khóa:
- Sử dụng thẻ \`<mark>\` để bao quanh các từ khóa quan trọng
- Chỉ highlight những từ khóa thực sự xuất hiện trong văn bản gốc
- Không tự thêm từ khóa không có trong hợp đồng

### 3. Xử lý trường hợp không tìm thấy:
- Nếu không có nội dung liên quan: ghi chính xác "Không đề cập"
- Không được bỏ trống hoặc ghi null

### 4. Độ chính xác:
- Nội dung phải trích xuất chính xác từ hợp đồng gốc
- Không paraphrase hoặc tóm tắt
- Giữ nguyên ngôn ngữ gốc (tiếng Việt hoặc tiếng Anh)

## TỪ KHÓA THAM KHẢO CHO TỪNG MỤC
${keywordsSection}

## YÊU CẦU ĐẦU RA
- Trả về DUY NHẤT mảng JSON theo cấu trúc trên
- KHÔNG thêm bất kỳ văn bản, chú thích, giải thích nào khác
- JSON phải valid và có thể parse được
- Đảm bảo có đủ 9 phần tử với đúng thứ tự title

## NỘI DUNG HỢP ĐỒNG CẦN PHÂN TÍCH
${contractText}`
}

const oldPrompt = `
    Bạn là chuyên gia kiểm tra hợp đồng pháp lý.
    Nhiệm vụ: Đối chiếu hợp đồng với checklist dưới đây và trả về duy nhất một mảng JSON.
    **Yêu cầu về JSON**:
    Mỗi phần tử (item) là một object với các trường như sau:

    {
      "item": "",
      "standard": "",
      "frequency": "Yes|No",
      "found_text": "",                  // Đoạn văn bản liên quan nhất trong hợp đồng. Nếu không có, ghi rõ "Không tìm thấy trong hợp đồng."
      "review_result": "OK|NOK|Null",    // Đánh giá kết quả kiểm tra
      "suggest": ""                      // Phân tích rõ vì sao đạt/không đạt và gợi ý chỉnh sửa, ví dụ: “Đầy đủ tên, địa chỉ, người đại diện của các bên.”, “Thiếu quy định xác nhận lại bằng văn bản nếu tiết lộ miệng. thêm thông tin”
    }

    **Tiêu chí đánh giá:**
    1. Nếu Frequency = Yes (bắt buộc phải có):
       - Nếu không có trong hợp đồng: review_result = "NOK", suggest = "Bổ sung điều khoản này vào hợp đồng."
       - Nếu có nhưng không khớp Standard terms & conditions: review_result = "NOK", suggest = "Chỉnh sửa cho đúng: ..." (ghi cụ thể theo thực tế)
       - Nếu có và khớp: review_result = "OK", suggest = ""
    2. Nếu Frequency = No (không bắt buộc):
       - Nếu không có trong hợp đồng: review_result = Null, suggest = ""
       - Nếu có: so khớp ngữ nghĩa. Nếu khớp: "OK", nếu không: "NOK" (và suggest)
    3. Nếu Standard terms & conditions = "Not mentioned":
       - Nếu tìm thấy trong hợp đồng: review_result = "NOK", suggest = "Xoá/loại bỏ điều khoản này khỏi hợp đồng."
       - Nếu không thấy: review_result = "OK" hoặc Null (tuỳ frequency), suggest = ""

    **Bắt buộc:**
    - "found_text" phải lấy đúng đoạn văn bản thực tế trong hợp đồng, ưu tiên đầy đủ nhất.
    - "suggest" phải viết rõ vì sao lại đánh giá như vậy, sát với thực tế từng case (ví dụ: “Chỉ giới hạn tiết lộ cho người đã ký NDA, chưa đề cập trường hợp bắt buộc theo luật.”, “Điều khoản hiệu lực rõ ràng, đáp ứng yêu cầu checklist.” v.v.).
    - Nếu NOK thì bắt buộc phải có suggest thực tế, cụ thể (nếu là thiếu thì ghi rõ cần bổ sung điều khoản nào, nếu lệch ngữ nghĩa thì ghi rõ nên chỉnh gì).

    **Trả về**: Chỉ duy nhất một mảng JSON đúng structure trên. Không giải thích gì thêm ngoài JSON.

    Checklist:

    Nội dung hợp đồng:
    `

export interface Section {
    title: string
    content: string
}
