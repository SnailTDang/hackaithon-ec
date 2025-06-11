import React from 'react'
import { useNDAAnalyzerTemplate } from './modules/useNDAAnalyzerTemplate'
import Template from './Template'

export const NDAAnalyzerTemplate = (props) => {
    const dependencies = useNDAAnalyzerTemplate()
    return <Template {...dependencies} />
}
