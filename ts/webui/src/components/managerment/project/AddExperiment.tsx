import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Stack, SearchBox, PrimaryButton, IStackTokens } from '@fluentui/react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import ExperimentsList from '../ExperimentList';
import '../../../static/style/experiment/experiment.scss';
import '../../../static/style/experiment/project.scss';
const projectTokens: IStackTokens = {
    childrenGap: 18
};

// 在 project 具体的实验详情表格里, 点 add, 弹出这个窗口
function AddExperiment(props): any {
    const { changeDetailTableList } = props;
    const [chooseTrials, setChooseTrials] = useState(['ER45Gh', 'CCC666', 'XXX7878']);
    const { visible, tableSource, closeModel } = props;

    // 点 save btn 之后，吧数据加进页面
    function newProjectFunction(): void {
        const item = [
            {
                name: 'Example mnist',
                id: 'ER45Gh',
                status: 'SUCCEEDED',
                metric: 0.987778,
                platform: 'local',
                tuner: 'TPE',
                Label: [],
                duration: '30min'
            },
            {
                name: 'Example mnist1',
                id: 'CCC666',
                status: 'STOPPED',
                metric: 1000,
                platform: 'local',
                tuner: 'TPE',
                Label: [],
                duration: '1h 30min'
            },
            {
                name: 'Example mnist2',
                id: 'XXX7878',
                status: 'SUCCEEDED',
                metric: 0.0565656,
                platform: 'local',
                tuner: 'TPE',
                Label: [],
                duration: '2h 30min'
            },
            {
                name: 'Example mnist3',
                id: 'PLMNB7',
                status: 'SUCCEEDED',
                metric: 0.987778,
                platform: 'local',
                tuner: 'TPE',
                Label: [],
                duration: '20min'
            },
            {
                name: 'Example mnist4',
                id: 'IOUPPP',
                status: 'RUNNING',
                metric: 0.111111,
                platform: 'AML',
                tuner: 'Assessor',
                Label: [],
                duration: '80min'
            },
            {
                name: 'Example mnist5',
                id: 'MNINs5',
                label: ['xxx'],
                status: 'FAILED',
                metric: 0.1,
                platform: 'local',
                tuner: 'TPE',
                duration: '9min'
            },
            {
                name: 'Example mnist6',
                id: 'MNINs6',
                label: ['xxx'],
                status: 'FAILED',
                metric: 0.9,
                platform: 'local',
                tuner: 'TPE',
                duration: '10min'
            }
        ];
        changeDetailTableList(item);

        closeModel();
    }
    return (
        <Stack>
            <Dialog
                hidden={!visible} // required field!
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: 'Add experiments',
                    closeButtonAriaLabel: 'Close'

                }}
                onDismiss={closeModel}
                minWidth='35%'
                // dialogContentProps={{
                //     title: (
                //         <div className='icon-color'>
                //             {completed}
                //             <b>Submit successfully</b>
                //         </div>
                //     ),
                //     subText: `You can find your customized trial by Trial No.${customID}`
                // }}
            >
                <Stack tokens={projectTokens}>
                    <div className='addExpCount'>
                        Experiments
                        <span>5</span>
                    </div>
                    <Stack horizontal className='position'>
                        <SearchBox
                            styles={{root: {width: 250}}}
                            placeholder='Search'
                            // onEscape={this.setOriginSource.bind(this)}
                            // onClear={this.setOriginSource.bind(this)}
                            // onChange={this.searchNameAndId.bind(this)}
                        />
                        <PrimaryButton text='New' className='absoluteRight'/>
                    </Stack>
                    <ExperimentsList
                        source={tableSource}
                        chooseTrials={chooseTrials}
                        changeChooseTrials={() => setChooseTrials}
                    />
                    <DialogFooter>
                        {/* <PrimaryButton text='Submit' onClick={this.addNewTrial} /> */}
                        <PrimaryButton text='Save' onClick={newProjectFunction} />
                    </DialogFooter>
                </Stack>
            </Dialog>
        </Stack>
    );
}

AddExperiment.propTypes = {
    visible: PropTypes.bool,
    tableSource: PropTypes.array,
    closeModel: PropTypes.func,
    updateTableSource: PropTypes.func,
    changeDetailTableList: PropTypes.func
};

export default AddExperiment;
