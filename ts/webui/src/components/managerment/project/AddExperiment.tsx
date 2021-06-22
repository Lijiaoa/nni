import React, { useState } from 'react';
import { TextField } from '@fluentui/react';
import ExperimentsList from '../ExperimentList';
import {exp} from './experiment'; // 实验列表
import '../../../static/style/experiment/experiment.scss';
import '../../../static/style/experiment/project.scss';

// 在 project 具体的实验详情表格里, 点 add, 弹出这个窗口
function AddExperiment(): any {
    
    const [chooseTrials, setChooseTrials] = useState([] as string[]);
    const [expListString, setExpListString] = useState(chooseTrials.join(','));

    return (
        <div>
            <TextField
                label='Experiments'
                value={expListString}
            />
            <ExperimentsList
                source={exp} 
                changeChooseTrials={() => setChooseTrials}
                setExpListString={setExpListString}
            />
        </div>
    );
}

export default AddExperiment;
