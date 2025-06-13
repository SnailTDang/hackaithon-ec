import React from 'react'
import Template from './Template'
import { useDetectContract } from './module/useDetectContract'

const DetectNDAPageTemplate = (props) => {
    const dependecies = useDetectContract()
    return <Template {...dependecies} {...props} />
}
export default DetectNDAPageTemplate
