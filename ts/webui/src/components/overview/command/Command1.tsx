import React from 'react';
import { EXPERIMENT } from '../../../static/datamodel';
import { rightEidtParam } from '../count/commonStyle';
import '../../../static/style/overview/command.scss';

export const Command1 = (): any => {
    const tuner = EXPERIMENT.profile.params.tuner;
    const advisor = EXPERIMENT.profile.params.advisor;
    const assessor = EXPERIMENT.profile.params.assessor;
    const title: string[] = [];
    const builtinName: string[] = [];
    if (tuner !== undefined) {
        title.push('Tuner');
        if (tuner.builtinTunerName !== undefined) {
            builtinName.push(tuner.builtinTunerName);
        }
        if (tuner.className !== undefined) {
            builtinName.push(tuner.className);
        }
    }

    if (advisor !== undefined) {
        title.push('Advisor');
        if (advisor.builtinAdvisorName !== undefined) {
            builtinName.push(advisor.builtinAdvisorName);
        }
        if (advisor.className !== undefined) {
            builtinName.push(advisor.className);
        }
    }

    if (assessor !== undefined) {
        title.push('Assessor');
        if (assessor.builtinAssessorName !== undefined) {
            builtinName.push(assessor.builtinAssessorName);
        }
        if (assessor.className !== undefined) {
            builtinName.push(assessor.className);
        }
    }

    return (
        <div className='basic' style={rightEidtParam}>
            <div>
                <p className='command'>Training platform</p>
                <div className='ellipsis'>{EXPERIMENT.profile.params.trainingServicePlatform}</div>
                <p className='lineMargin'>{title.join('/')}</p>
                <div className='ellipsis'>{builtinName.join('/')}</div>
            </div>
        </div>
    );
};
