import React, { useState, useCallback } from 'react';
import { Stack, TextField, PrimaryButton, DefaultButton } from '@fluentui/react';
import { ExperimentsManager } from '../../../static/model/experimentsManager';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { errorBadge, completed } from '../../buttons/Icon';
import ExperimentsList from '../ExperimentList';

async function NewProjectModal(props): Promise<Element> {
    const { visible, source, updateTableSource } = props;
    const [firstTextFieldValue, setFirstTextFieldValue] = useState('');

    const onChangeFirstTextFieldValue = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setFirstTextFieldValue(newValue || '');
        },
        [],
    );

    const EXPERIMENTMANAGER = new ExperimentsManager();
    await EXPERIMENTMANAGER.init();
    const result = EXPERIMENTMANAGER.getExperimentList();

    // 点 save btn 之后，吧数据加进页面
    function newProjectFunction() {
        //  拿到name,description,experimentlist
        console.info('log');
        const a = '新加的数据对象';
        // 拼接上 source
        updateTableSource();
    }

    return (
        <Stack>
            <Dialog
                hidden={!visible} // required field!
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: 'Customized trial setting',
                    subText: 'You can submit a customized trial.'
                }}
                modalProps={{
                    isBlocking: false,
                    styles: { main: { maxWidth: 450 } }
                }}
            >
                <TextField
                    label='New project'
                    value={firstTextFieldValue}
                    onChange={onChangeFirstTextFieldValue}
                // styles={textFieldStyles}
                />
                <TextField label='Description(optional)' multiline autoAdjustHeight />
                <TextField
                    label='Experiments'
                    value={firstTextFieldValue}
                    onChange={onChangeFirstTextFieldValue}
                // styles={textFieldStyles}
                />
                {/* experiment list */}
                {/* 这个source 是实验们的集合 */}
                <ExperimentsList source={result} />
                <DialogFooter>
                    {/* <PrimaryButton text='Submit' onClick={this.addNewTrial} /> */}
                    <DefaultButton text='Save' onClick={newProjectFunction} />
                </DialogFooter>
            </Dialog>

            {/* clone: prompt succeed or failed */}
            <Dialog
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
            </Dialog>

        </Stack>
    );
}
export default NewProjectModal;
