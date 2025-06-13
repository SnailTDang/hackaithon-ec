import React from 'react'
import { Template } from './Template'
import { useNDAChecklist } from './modules/useNDAChecklist'
// import { useNDAChecklist } from './modules/useNDAChecklist'

export const NDAChecklistTemplate = (props) => {
    const dependencies = useNDAChecklist()
    return <Template {...dependencies} {...props} />
}
