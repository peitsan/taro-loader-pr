import react, { useState, FC } from 'react'
import Taro from '@tarojs/taro'
import { IData } from '../../types/projectType'
import ProjectItem from '../projectItem'

interface IType {
    data: IData[]
}

export const ProjectLists: FC<IType> = ({ data }: IType) => {
    return (
        <>
            {
                data ? data.map((item, index) => <ProjectItem key={`projectItem-${index}`} fatherProject={item.fatherProject} sonProject={item.sonProject} />) : null
            }
        </>
    )
}