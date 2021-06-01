import React, { useState } from 'react';
import { Stack, SearchBox, DefaultButton, DetailsList, IColumn, Selection } from '@fluentui/react';
import { Hearder } from '../managementExp/Header';
import { TitleContext } from '../../overview/TitleContext';
import { Title } from '../../overview/Title';
import NewProjectModal from './NewProjectModal';
import { convertDuration } from '../../../static/function';
// fack data
import { data } from './project';

function ProjectIndex(): any {

    const [tableSource, setTableSource] = useState(data);
    const [visible, setVisible] = useState(false);
    const [deleteProjectIds, setdeleteProjectIds] = useState([] as number[]); // 假设 project id 是 number 类型

    const columns: IColumn[] = [
        {
            name: 'Name',
            key: 'project_name',
            fieldName: 'project_name', // required!
            minWidth: 60,
            maxWidth: 80,
            isResizable: true,
            data: 'string',
            onRender: (item: any): React.ReactNode => <div className='succeed-padding'>{item.project_name}</div>
        },
        {
            name: 'Experiments',
            key: 'experiments',
            fieldName: 'experiments',
            minWidth: 90,
            maxWidth: 100,
            isResizable: true,
            data: 'number',
            onRender: (item: any): React.ReactNode => <div className='succeed-padding'>{item.experiments.length}</div>
        },
        {
            name: 'Description',
            key: 'description',
            fieldName: 'description',
            minWidth: 90,
            maxWidth: 100,
            isResizable: true,
            data: 'string',
            onRender: (item: any): React.ReactNode => <div className='succeed-padding'>{item.description}</div>
        },
        {
            name: 'Created_time',
            key: 'create_time',
            fieldName: 'create_time',
            minWidth: 70,
            maxWidth: 120,
            isResizable: true,
            data: 'number',
            onRender: (item: any): React.ReactNode => (
                <div className='durationsty succeed-padding'>
                    <div>{convertDuration(item.create_time)}</div>
                </div>
            )
        }
    ];

    function deleteProject(): void {
        let result = JSON.parse(JSON.stringify(tableSource));

        if (deleteProjectIds !== undefined ) {
            deleteProjectIds.forEach(item => {
                result = tableSource.filter(item => item.project_id.toString() !== item.toString());
            });
        }

        setTableSource(result);
    }

    // 打开new project modal
    function newProject(): void {
        setVisible(true);
    }

    const selection = new Selection({
        onSelectionChanged: () => setdeleteProjectIds(selection.getSelection().map(s => (s as any).project_id)),
    });

    return (
        <Stack className='nni' style={{ minHeight: window.innerHeight }}>
                <Hearder />
                <Stack className='contentBox expBackground'>
                    {/* 56px: navBarHeight; 48: marginTop & Bottom */}
                    <Stack className='content' styles={{ root: { minHeight: window.innerHeight - 104 } }}>
                        <Stack className='experimentList'>
                            <TitleContext.Provider value={{ text: 'All project', icon: 'CustomList' }}>
                                <Title />
                            </TitleContext.Provider>
                            <Stack className='box' horizontal>
                                <div className='search'>
                                    <SearchBox
                                        className='search-input'
                                        placeholder='Search the experiment by name or ID'
                                        // onEscape={this.setOriginSource.bind(this)}
                                        // onClear={this.setOriginSource.bind(this)}
                                        // onChange={this.searchNameAndId.bind(this)}
                                    />
                                </div>
                                <Stack horizontal>
                                    <DefaultButton
                                        onClick={newProject}
                                        text='New project'
                                    />
                                    <DefaultButton
                                        onClick={deleteProject}
                                        text='Delete'
                                    />
                                </Stack>
                                {/* project list */}
                                <Stack>
                                {
                                    data.length === 0
                                    ?
                                    <div>No projects yet.</div>
                                    :
                                    <DetailsList
                                        columns={columns}
                                        items={tableSource}
                                        setKey='set'
                                        compact={true}
                                        selection={selection}
                                        selectionPreservedOnEmptyClick={false} // 设成false是不是只能点CheckBox才能选中？
                                        selectionMode={0} // close selector function
                                        className='succTable'
                                    />
                                }
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
                {/* new project modal */}
                <NewProjectModal visible={visible} source={tableSource} updateTableSource={setTableSource}/>
            </Stack>
    );
}

export default ProjectIndex;
