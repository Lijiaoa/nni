import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Stack, TextField, PrimaryButton, IStackTokens } from '@fluentui/react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
// import { errorBadge, completed } from '../../buttons/Icon';
import ExperimentsList from '../ExperimentList';
import {exp} from './experiment'; // 实验列表

const projectTokens: IStackTokens = {
    childrenGap: 18
};

function NewProjectModal(props): JSX.Element {
    const { visible, tableSource, closeModel, updateTableSource } = props;
    const [firstTextFieldValue, setFirstTextFieldValue] = useState(''); // project name
    const [description, setDescription] = useState(''); // description value
    const [chooseTrials, setChooseTrials] = useState([] as string[]);
    const [expListString, setExpListString] = useState(chooseTrials.join(','));
    function choseTrials(val: string[]): void{
        setChooseTrials(val);
    }
    const onChangeFirstTextFieldValue = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setFirstTextFieldValue(newValue || '');
        },
        [],
    );
    const onChangeDescriptionValue = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDescription(newValue || '');
        },
        [],
    );

    // 点 save btn 之后，吧数据加进页面
    function newProjectFunction(): void {
        //  拿到name,description,experimentlist
        const id = Math.random().toString(32).substr(2);
        tableSource.push({
            projectId: id,
            projectName: firstTextFieldValue,
            experiments: chooseTrials,
            description: description,
            labels: [],
            createTime: +new Date()
        });
        updateTableSource(tableSource);
        // 清空之前的选择
        setFirstTextFieldValue('');
        setDescription('');
        setChooseTrials([]);
        setExpListString('');

        closeModel();
        // const a = '新加的数据对象';
        // 拼接上 source
        // updateTableSource();
    }

    return (
        <Stack>
            <Dialog
                hidden={!visible} // required field!
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: 'New project'
                }}
                // modalProps={{
                //     isBlocking: false,
                //     styles: { main: { minWidth: '60%' } }
                // }}
                minWidth='35%'
            >
                <Stack tokens={projectTokens}>

                <TextField
                    label='New project'
                    value={firstTextFieldValue}
                    onChange={onChangeFirstTextFieldValue}
                    // styles={textFieldStyles}
                    />
                <TextField
                    label='Description(optional)'
                    multiline
                    autoAdjustHeight
                    value={description}
                    onChange={onChangeDescriptionValue}
                />
                <TextField
                    label='Experiments'
                    value={expListString}
                    // onChange={onChangeE}
                // styles={textFieldStyles}
                />
                {/* experiment list */}
                {/* 这个source 是实验们的集合 */}
                <ExperimentsList source={exp}  changeChooseTrials={choseTrials} setExpListString={setExpListString}/>
                </Stack>
                <DialogFooter>
                    {/* <PrimaryButton text='Submit' onClick={this.addNewTrial} /> */}
                    <PrimaryButton text='Save' onClick={newProjectFunction} />
                </DialogFooter>
            </Dialog>

            {/* clone: prompt succeed or failed */}
            {/* <Dialog
                hidden={!isShowSubmitSucceed}
                onDismiss={this.closeSucceedHint}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: (
                        <div className='icon-color'>
                            {completed}
                            <b>Submit successfully</b>
                        </div>
                    ),
                    closeButtonAriaLabel: 'Close',
                    subText: `You can find your customized trial by Trial No.${customID}`
                }}
                modalProps={{
                    isBlocking: false,
                    styles: { main: { minWidth: 500 } }
                }}
            >
                <DialogFooter>
                    <PrimaryButton onClick={this.closeSucceedHint} text='OK' />
                </DialogFooter>
            </Dialog>

            <Dialog
                hidden={!isShowSubmitFailed}
                onDismiss={this.closeSucceedHint}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: <div className='icon-error'>{errorBadge}Submit Failed</div>,
                    closeButtonAriaLabel: 'Close',
                    subText: 'Unknown error.'
                }}
                modalProps={{
                    isBlocking: false,
                    styles: { main: { minWidth: 500 } }
                }}
            >
                <DialogFooter>
                    <PrimaryButton onClick={this.closeFailedHint} text='OK' />
                </DialogFooter>
            </Dialog> */}

        </Stack>
    );
}

NewProjectModal.propTypes = {
    visible: PropTypes.bool,
    tableSource: PropTypes.array,
    closeModel: PropTypes.func,
    updateTableSource: PropTypes.func
};

export default NewProjectModal;
