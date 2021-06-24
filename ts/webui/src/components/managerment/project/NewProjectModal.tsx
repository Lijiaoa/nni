import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Stack, TextField, SearchBox, PrimaryButton, IStackTokens } from '@fluentui/react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import ExperimentsList from '../ExperimentList';
import {exp} from './experiment'; // 实验列表

const projectTokens: IStackTokens = {
    childrenGap: 18
};

function NewProjectModal(props): JSX.Element {
    const { visible, tableSource, closeModel, updateTableSource, title } = props;
    const [firstTextFieldValue, setFirstTextFieldValue] = useState(''); // project name
    const [description, setDescription] = useState(''); // description value
    const [chooseTrials, setChooseTrials] = useState([] as string[]);
    function changeSelectedTrials(val: string[]): void{
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
        if(title !== 'New project'){
            closeModel();
        }else{
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
        
        closeModel();
        setChooseTrials([]);
    }
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
                    title: title
                }}
                onDismiss={closeModel}
                minWidth='40%'
            >
                <Stack tokens={projectTokens}>

                    <TextField
                        label={title !== 'New project' ? 'Project name' : title}
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
                    <div className='addExpCount'>
                        Experiments
                        {
                            chooseTrials.length !== 0
                            ?
                            <span>{chooseTrials.length}</span>
                            :
                            null
                        }
                    </div>
                    <SearchBox
                        styles={{root: {width: 250}}}
                        placeholder='Search'
                        // onEscape={this.setOriginSource.bind(this)}
                        // onClear={this.setOriginSource.bind(this)}
                        // onChange={this.searchNameAndId.bind(this)}
                    />
                    {/* experiment list */}
                    {/* 这个source 是实验们的集合 */}
                    <ExperimentsList
                        source={exp}
                        changeChooseTrials={changeSelectedTrials}
                        chooseTrials={chooseTrials}
                    />
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
    title: PropTypes.string,
    tableSource: PropTypes.array,
    closeModel: PropTypes.func,
    updateTableSource: PropTypes.func
};

export default NewProjectModal;
