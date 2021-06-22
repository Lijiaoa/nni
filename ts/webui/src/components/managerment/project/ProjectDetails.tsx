import React from 'react';
import { Stack } from '@fluentui/react';
import MetricGraph from './MetricGraph';
import ProjectExperimentDetails from './ProjectExperimentDetails';
import {Settings} from '../../buttons/Icon';
import '../../../static/style/experiment/experiment.scss';
import '../../../static/style/experiment/project.scss';

function ProjectDetails(): any {

    return (
        <Stack className='nni' style={{ minHeight: window.innerHeight }}>
            <Stack className='contentBox'>
                {/* 56px: navBarHeight; 48: marginTop & Bottom */}
                <Stack className='content' styles={{ root: { minHeight: window.innerHeight - 104 } }}>
                        <Stack className='box project'>
                            <Stack className='project-details' gap={24}>
                                <Stack className='basic relative' horizontal>
                                    <p>Project</p>
                                    <div className='absoluteRight'>{Settings}</div>
                                </Stack>
                                <div className='basic'>
                                    <p>Project name</p>
                                    <div className='ellipsis'>Project1</div>
                                </div>
                                <div className='basic'>
                                    <p>Created time</p>
                                    <div className='ellipsis'>Tue Jun 22 2021 10:36:18</div>
                                </div>
                                <div className='basic'>
                                    <p>Experiments</p>
                                    <div className='ellipsis'>5</div>
                                </div>
                                <div className='basic'>
                                    <p>Description</p>
                                    <div>ProjectA is for mnist experiment list.ProjectA is for mnist experiment list.ProjectA is for mnist experiment list</div>
                                </div>
                            </Stack>
                            <div className='project-graph'><MetricGraph/></div>
                            <div className='project-list'>
                                <h1>All experiments in Project1</h1>
                                <ProjectExperimentDetails />
                            </div>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
    );
}

export default ProjectDetails;
