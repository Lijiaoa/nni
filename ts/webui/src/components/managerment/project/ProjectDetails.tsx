import React from 'react';
import { Stack } from '@fluentui/react';
import { TitleContext } from '../../overview/TitleContext';
import { Title } from '../../overview/Title';
import '../../../static/style/experiment/experiment.scss';
import '../../../static/style/experiment/project.scss';

function ProjectDetails(): any {

    return (
        <Stack className='nni' style={{ minHeight: window.innerHeight }}>
                <Stack className='contentBox expBackground'>
                    {/* 56px: navBarHeight; 48: marginTop & Bottom */}
                    <Stack className='content add' styles={{ root: { minHeight: window.innerHeight - 104 } }}>
                        <Stack className='experimentList'>
                            <TitleContext.Provider value={{ text: 'All project', icon: 'CustomList' }}>
                                <Title />
                            </TitleContext.Provider>
                            <Stack className='box'>
                                Hello world
                                </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
    );
}

export default ProjectDetails;
