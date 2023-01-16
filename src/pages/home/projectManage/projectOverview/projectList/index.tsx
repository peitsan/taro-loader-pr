import react, { useState } from 'react'
import Taro from '@tarojs/taro'
import { AtAccordion, AtList, AtListItem } from 'taro-ui'
import style from './index.module.less'

const ProjectList = () => {
    const [open, setOpen] = useState(false);
    return (
        <AtAccordion
            title='项目1'
            open={open}
            onClick={() => setOpen(e => !e)}
            className={style.item}
        >
            <AtList hasBorder>
                <AtListItem
                    hasBorder={true}
                    title='子项目1'
                />
                <AtListItem
                    hasBorder={true}
                    title='子项目2'
                />
            </AtList>
        </AtAccordion>
    )
}

export default ProjectList