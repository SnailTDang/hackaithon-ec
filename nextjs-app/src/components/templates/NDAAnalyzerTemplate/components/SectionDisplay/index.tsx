/* eslint-disable prettier/prettier */
import React from 'react'
import { Section } from '../../modules/constants'
import styles from '../../styles/NDAAnalyzer.module.css'

interface SectionDisplayProps {
    sections: Section[]
}

export default function SectionDisplay({ sections }: SectionDisplayProps) {
    return (
        <div style={{ marginTop: 32 }}>
            <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>
                Kết quả bóc tách NDA
            </h2>
            {sections.map((sec, idx) => (
                <div key={idx} className={styles.section}>
                    <div className={styles.sectionTitle}>
                        {idx + 1}. {sec.title}
                    </div>
                    <div
                        className={styles.sectionContent}
                        style={{ wordBreak: 'break-word' }}
                        dangerouslySetInnerHTML={{ __html: sec.content }}
                    />
                </div>
            ))}
        </div>
    )
}
