import React, { useState } from 'react';
import { Stack } from '@fluentui/react';
import MetricGraph from './MetricGraph';
import ProjectExperimentDetails from './ProjectExperimentDetails';
import NewProjectModal from './NewProjectModal';
import {Settings} from '../../buttons/Icon';
import '../../../static/style/experiment/experiment.scss';
import '../../../static/style/experiment/project.scss';

function ProjectDetails(): any {

    const [visible, setVisible] = useState(false);
    function editProject() {
        setVisible(true);
    }
    function closeEdit() {
        setVisible(false);
    }
    return (
        <Stack className='nni' style={{ minHeight: window.innerHeight }}>
            <Stack className='contentBox'>
                {/* 56px: navBarHeight; 48: marginTop & Bottom */}
                <Stack className='content' styles={{ root: { minHeight: window.innerHeight - 104 } }}>
                        <Stack className='box project'>
                            <Stack className='project-details' gap={24}>
                                <Stack className='basic relative' horizontal>
                                    <h1>Project</h1>
                                    <div className='absoluteRight cursor' onClick={editProject}>{Settings}</div>
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
                                <div className='basic special'>
                                    <p>Description</p>
                                    <div>Project1 is for mnist experiment list.ProjectA is for mnist experiment list.ProjectA is for mnist experiment list</div>
                                </div>
                            </Stack>
                            <div className='project-graph'><MetricGraph/></div>
                            <Stack gap={20} className='project-list'>
                                <h1>All experiments in Project1</h1>
                                <ProjectExperimentDetails />
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
                {/* new project modal */}
                <NewProjectModal
                    visible={visible}
                    title='Project setting'
                    tableSource={[]}
                    // updateTableSource={setTableSource}
                    closeModel={closeEdit}
                />
            </Stack>
    );
}

export default ProjectDetails;
