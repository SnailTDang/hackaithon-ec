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
Ví dụ:
[
  {"title":"Non-Solicitation","content":"Không đề cập"},
  ...
  {"title":"ESG Term","content":"Không đề cập"}
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

export const API_KEY = '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'

export interface Section {
    title: string
    content: string
}
