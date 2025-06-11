import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx'
import { Section } from '../constants'

const highlightHtmlToDocxRuns = (html: string) => {
    const parts = html.split(/(<mark>.*?<\/mark>)/g)
    return parts.map((part) => {
        if (part.startsWith('<mark>') && part.endsWith('</mark>')) {
            return new TextRun({ text: part.replace(/<\/?mark>/g, ''), highlight: 'yellow' })
        }
        return new TextRun(part.replace(/<\/?[^>]+(>|$)/g, ''))
    })
}

export const generateDocxFile = async (sections: Section[]): Promise<string> => {
    const doc = new Document({
        sections: [
            {
                children: sections
                    .map((sec, i) => [
                        new Paragraph({
                            text: `${i + 1}. ${sec.title}`,
                            heading: HeadingLevel.HEADING_2,
                        }),
                        ...sec.content.split('\n').map(
                            (line) =>
                                new Paragraph({
                                    children: highlightHtmlToDocxRuns(line),
                                    spacing: { after: 120 },
                                }),
                        ),
                    ])
                    .flat(),
            },
        ],
    })

    const blob = await Packer.toBlob(doc)
    return URL.createObjectURL(blob)
}
