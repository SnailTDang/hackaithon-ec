import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Tesseract from 'tesseract.js'
import ContractReviewVisualizer from '../components/molecules/ContractReviewVisualizer'
import mammoth from 'mammoth'
import axios from 'axios'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import 'pdfjs-dist/build/pdf.worker'
import toast, { Toaster } from 'react-hot-toast'

const Index = () => {
    const lcmChecklistTemp =
        '1. Thông tin cơ bản. 1.1. Xác minh danh tính và tư cách pháp lý của các bên tham gia hợp đồng. 1.2. Kiểm tra ngày ký kết và thời hạn hiệu lực của hợp đồng. 1.3. Đảm bảo hợp đồng có đầy đủ chữ ký và con dấu (nếu cần). 2. Điều khoản hợp đồng. 2.1. Kiểm tra tính rõ ràng và đầy đủ của các điều khoản chính (quyền, nghĩa vụ, trách nhiệm). 2.2. Đánh giá các điều khoản về thanh toán, phương thức và thời hạn thanh toán. 2.3. Kiểm tra điều khoản về bảo mật thông tin và quyền sở hữu trí tuệ. 3. Tuân thủ pháp luật. 3.1. Đảm bảo hợp đồng tuân thủ các quy định pháp lý hiện hành. 3.2. Kiểm tra các điều khoản về giải quyết tranh chấp (trọng tài, tòa án). 3.3. Xác minh các điều khoản về chấm dứt hợp đồng và hậu quả pháp lý. 4. Rủi ro và trách nhiệm. 4.1. Đánh giá các điều khoản về bồi thường thiệt hại và trách nhiệm pháp lý. 4.2. Kiểm tra các điều khoản về trường hợp bất khả kháng. 4.3. Xác định các rủi ro tiềm ẩn và biện pháp giảm thiểu. 5. Phụ lục và tài liệu đi kèm. 5.1. Kiểm tra các phụ lục hợp đồng có đầy đủ và chính xác không. 5.2. Đảm bảo các tài liệu tham chiếu trong hợp đồng được đính kèm đầy đủ. 5.3. Xác minh các điều kiện sửa đổi hợp đồng'

    const contractImportantTextTemp =
        '{"Contract No": "Contract Number", "Scope of Agreement": {"Party A": "Company A agrees to provide software services to Party B for a period of 12 months", "Start Date": "January 1, 2025", "End Date": "December 31, 2025"}, "Contract Value and Payment Method": {"Total Contract Value": "100,000 USD", "Payment Installments": {"First Installment": "30,000 USD, payable on the contract signing date", "Second Installment": "40,000 USD, payable on July 1, 2025", "Third Installment": "30,000 USD, payable on December 1, 2025"}, "Payment Method": "[Bank Transfer or Other Agreed Method]"}, "Rights and Obligations of the Parties": {"Party A\'s Obligations": ["Provide the agreed software services, ensuring quality and timely delivery", "Provide technical support for the duration of the agreement"], "Party B\'s Obligations": ["Make full and timely payments as stipulated", "Provide necessary information for Party A to implement the services"]}, "General Provisions": {"Adherence to Terms": "Both parties commit to strictly adhering to the terms of this agreement", "Dispute Resolution": "In case of disputes, the parties shall first attempt resolution through negotiation. If no agreement is reached, disputes shall be settled according to applicable laws", "Effective Date": "Date of signing"}}'

    const lcmChecklistResultsTemp =
        '{\n "Intellectual Property Ownership": "This information is not explicitly mentioned in the provided contract.",\n "Party B\'s Obligations": "This information is not explicitly mentioned in the provided contract.",\n "Total Contract Value": "This information is not explicitly mentioned in the provided contract."\n}'

    const apiKey = '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'
    const [image, setImage] = useState<string | null>(null)
    const [lcmChecklist, setLcmChecklist] = useState('')
    const [contractText, setContractText] = useState('')
    const [contractImportantText, setContractImportantText] = useState()
    const [lcmChecklistResults, setLcmChecklistResults] = useState()

    const showToast = (message: string) => toast.success(message)

    const { getRootProps: getLcmRootProps, getInputProps: getLcmInputProps } = useDropzone({
        accept: {
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        }, // Chỉ nhận file `.docx`
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0]
            extractTextFromLcm(file)
        },
    })

    const extractTextFromLcm = async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        const { value: text } = await mammoth.extractRawText({ arrayBuffer })

        setLcmChecklist(text) // Lưu nội dung vào state
    }
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
        },
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0]
            if (file.type.includes('image')) {
                setImage(URL.createObjectURL(file))
                extractTextFromImage(file)
            } else if (file.type === 'application/pdf') {
                extractTextFromPdf(file)
            } else if (file.name.endsWith('.docx')) {
                extractTextFromDocx(file)
            }
        },
    })

    const extractTextFromImage = async (file) => {
        const {
            data: { text },
        } = await Tesseract.recognize(file, 'eng')

        setContractText(text)
    }

    const extractTextFromDocx = async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        const { value: text } = await mammoth.extractRawText({ arrayBuffer })

        setContractText(text)
    }

    const extractTextFromPdf = async (file) => {
        const reader = new FileReader()
        reader.onload = async (e) => {
            if (!e.target || !(e.target.result instanceof ArrayBuffer)) {
                console.error('FileReader result is not an ArrayBuffer')
                return
            }
            const pdfData = new Uint8Array(e.target.result)
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise

            let extractedText = ''

            for (let i = 0; i < pdf.numPages; i++) {
                const page = await pdf.getPage(i + 1)
                const textContent = await page.getTextContent()
                extractedText += textContent.items.map((item) => item.str).join(' ') + '\n'
            }

            setContractText(extractedText) // Hiển thị văn bản đã trích xuất
        }
        reader.readAsArrayBuffer(file)
    }

    useEffect(() => {
        if (!contractText) return // Tránh gọi API nếu contractText rỗng

        const extractContractInfo = async () => {
            try {
                const response = await axios.post(
                    'https://openrouter.ai/api/v1/chat/completions',
                    {
                        model: 'openai/gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'user',
                                content: `Trích xuất các thông tin quan trọng từ hợp đồng sau: \n${contractText}\n Thông tin cần trích xuất: điều khoản chung, quyền và nghĩa vụ của các bên, điều khoản thanh toán, điều khoản về sở hữu trí tuệ, điều khoản bảo mật, điều khoản về chấm dứt hợp đồng, điều khoản về giải quyết tranh chấp. Trích xuất ra định dạng JSON.`,
                            },
                        ],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    },
                )

                try {
                    const jsonContent = JSON.parse(response.data.choices[0].message.content)
                    // const jsonContent = JSON.parse(contractImportantTextTemp);

                    setContractImportantText(jsonContent)
                    showToast('Contract analyzed')

                    // console.info("contract important-request: ", `Trích xuất các thông tin quan trọng từ hợp đồng sau: \n${contractText}\n Thông tin cần trích xuất: điều khoản chung, quyền và nghĩa vụ của các bên, điều khoản thanh toán, điều khoản về sở hữu trí tuệ, điều khoản bảo mật, điều khoản về chấm dứt hợp đồng, điều khoản về giải quyết tranh chấp. Trích xuất ra định dạng JSON.`)
                    // console.info("contract important-response: ", jsonContent)
                } catch (error) {
                    console.error('Cannot convert to JSON:', error)
                }
            } catch (error) {
                console.error('Error extracting important contract information:', error)
            }
        }

        extractContractInfo().catch(console.error)
    }, [contractText])

    useEffect(() => {
        if (!contractImportantText || !lcmChecklist) return // Tránh gọi API nếu contractImportantText và lcmChecklist rỗng

        const extractContractInfo = async () => {
            // content: `Đây là nội dung hợp đồng có định dạng JSON: \n${JSON.stringify(contractImportantText)}\n Đây là checklist kiểm tra hợp đồng: \n${lcmChecklist}\n Hãy đối chiếu nội dung hợp đồng với checklist kiểm tra hợp đồng. Trích xuất các key-value trong hợp đồng không đáp ứng checklist và trả về dưới dạng JSON phẳng.`,

            try {
                const response = await axios.post(
                    'https://openrouter.ai/api/v1/chat/completions',
                    {
                        model: 'openai/gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'user',
                                content: `Đây là nội dung hợp đồng có định dạng JSON: \n${JSON.stringify(
                                    contractImportantText,
                                )}\n Đây là checklist kiểm tra hợp đồng: \n${lcmChecklist}\n Hãy đối chiếu nội dung hợp đồng với checklist kiểm tra hợp đồng. Trích xuất các key-value trong hợp đồng không đáp ứng checklist và trả về dưới dạng JSON.`,
                            },
                        ],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    },
                )

                try {
                    const jsonContent = JSON.parse(response.data.choices[0].message.content)
                    // const jsonContent = JSON.parse(lcmChecklistResultsTemp);

                    setLcmChecklistResults(jsonContent)
                    showToast('Checked against LCM checklist')

                    console.info(
                        'Results check witd LCM Checklist-request: ',
                        `Đây là nội dung hợp đồng có định dạng JSON: \n${JSON.stringify(
                            contractImportantText,
                        )}\n Đây là checklist kiểm tra hợp đồng: \n${lcmChecklist}\n Hãy đối chiếu nội dung hợp đồng với checklist kiểm tra hợp đồng. Trích xuất các key-value trong hợp đồng không đáp ứng checklist và trả về dưới dạng JSON phẳng.`,
                    )
                    console.info('Results check witd LCM Checklist-response: ', jsonContent)
                } catch (error) {
                    console.error('Cannot convert to JSON:', error)
                }
            } catch (error) {
                console.error('Error when comparing contract terms with LCM checklist:', error)
            }
        }

        extractContractInfo().catch(console.error)
    }, [contractImportantText, lcmChecklist])

    useEffect(() => {
        axios
            .post('/api/hello')
            .then((res) => {
                console.info(res.data.message)
            })
            .catch((err) => {
                alert(err)
            })
    }, [])

    return (
        <div>
            <Toaster />

            <div className="header">
                <h2>Intelligent Contract Data Extraction & Review</h2>
            </div>

            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drop Contract files here or click to select files (.docx, .pdf, image)</p>
            </div>

            <div>
                {/* {image &&
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={image} alt="Uploaded" className="preview" />
                    </div>
                } */}

                {contractText && (
                    <div className="result">
                        <h2>Extract Contract Information:</h2>
                        <p>{contractText}</p>
                    </div>
                )}
            </div>

            <div {...getLcmRootProps()} className="dropzone-lcm">
                <input {...getLcmInputProps()} />
                <p>Drop LCM Checklist file here or click to select the file (.docx)</p>
            </div>

            <div>
                {lcmChecklist && (
                    <div className="result">
                        <h2>LCM Checklist:</h2>
                        <p>{lcmChecklist}</p>
                    </div>
                )}
            </div>

            <div>
                {lcmChecklistResults && (
                    <div className="result">
                        <h2>Results Compared With LCM Checklist:</h2>
                        <ContractReviewVisualizer
                            data={contractImportantText}
                            lcmChecklistResults={lcmChecklistResults}
                        />
                    </div>
                )}
            </div>

            <style jsx>{`
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 20px;
                }
                .dropzone {
                    border: 2px dashed #cccccc;
                    padding: 20px;
                    cursor: pointer;
                    text-align: center;
                }
                .dropzone-lcm {
                    margin-top: 20px;
                    border: 2px dashed #cccccc;
                    padding: 20px;
                    cursor: pointer;
                    text-align: center;
                }
                .preview {
                    margin-top: 20px;
                    max-width: 30%;
                    height: auto;
                }
                .result {
                    margin-top: 20px;
                    background: #f8f8f8;
                    padding: 20px;
                    border-radius: 5px;
                }
                .header {
                    margin-bottom: 20px;
                    background: #f8f8f8;
                    padding: 10px;
                    border-radius: 5px;
                    text-align: center;
                    /* width: 100%; */
                }
            `}</style>
        </div>
    )
}

export default Index
