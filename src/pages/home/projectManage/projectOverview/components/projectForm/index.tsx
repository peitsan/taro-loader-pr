import React, { FC, useState } from 'react'
import {
    Picker,
} from '@tarojs/components'
import {
    AtForm,
    AtList,
    AtListItem,
    AtButton,
    AtToast,
    AtInput,
    AtMessage
} from 'taro-ui'
import Taro from '@tarojs/taro'
import styles from './index.module.less'
import httpUtil from '@/utils/httpUtil'

// 定义 interface 用于请求成功关闭上一层的 modal
interface IProps {
    handleReq: Function
}

export const ProjectForm: FC<IProps> = ({ handleReq }: IProps) => {
    const pickerRange = ['规模以下', '规模以上'];
    const [picker, setPicker] = useState('规模以上');
    const [name, setName] = useState<string>('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    // 放置用户频繁点击
    let timer: NodeJS.Timer;
    const submit = () => {
        if (picker !== '' && name !== '') {
            if (timer) clearTimeout(timer)
            timer = setTimeout(async () => {
                const scope = pickerRange.indexOf(picker);
                setLoading(true);
                try {
                    const res = await httpUtil.fatherProjectNewAdd({
                        scope,
                        name
                    });
                    if (res.code === 200) {
                        // @ts-ignore
                        Taro.atMessage({ message: '消息通知', type: 'success' });
                        setName('') // 重置
                        // 隐藏上一级的modal
                        handleReq();
                    }
                } finally { }
            }, 500)
        } else setShow(true);
    }
    return (
        <AtForm
            onSubmit={submit}
        >
            <Picker mode="selector"
                range={pickerRange}
                onChange={(e) => { setPicker(pickerRange[e.detail.value]) }}>
                <AtList>
                    <AtListItem
                        title='规模选择'
                        extraText={picker}
                    />
                </AtList>
            </Picker>
            <AtInput
                placeholder='请输入项目名称'
                value={String(name)}
                onChange={(e) => { setName(String(e)) }}
                name='name'
                title='项目名称'
                focus
            />
            <AtButton
                loading={loading}
                type='primary'
                formType='submit'
            >
                确定
            </AtButton>
            <AtToast text='请填写完整' isOpened={show}></AtToast>
            <AtMessage />
        </AtForm>
    )
}