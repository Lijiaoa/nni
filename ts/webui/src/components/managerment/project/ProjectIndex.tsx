import React, { useState } from 'react';
import { Stack, SearchBox, DefaultButton, DetailsList, IColumn, Selection, PrimaryButton } from '@fluentui/react';
import { TitleContext } from '../../overview/TitleContext';
import { Title } from '../../overview/Title';
import NewProjectModal from './NewProjectModal';
import { expformatTimestamp } from '../../../static/function';
// fack data
// import { data } from './project';
import '../../../static/style/experiment/experiment.scss';
import '../../../static/style/experiment/project.scss';

interface Project {
    projectId: number;
    projectName: string;
    labels: string[];
    experiments: string[];
    description: string;
    createTime: number;
}

function ProjectIndex(): any {

    // const [tableSource, setTableSource] = useState(data); // 测试有数据的project
    const [tableSource, setTableSource] = useState([] as Project[]); // 测试 null project
    console.info(tableSource);
    const [visible, setVisible] = useState(false);
    const [deleteProjectIds, setdeleteProjectIds] = useState([] as number[]); // 假设 project id 是 number 类型

    const columns: IColumn[] = [
        {
            name: 'Name',
            key: 'projectName',
            fieldName: 'projectName', // required!
            minWidth: 240,
            maxWidth: 300,
            isResizable: true,
            data: 'string',
            onRender: (item: any): React.ReactNode => 
            <div className='ellipsis idCopy'>
                <a
                    href='project/details'
                    className='link toAnotherExp idColor'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    {item.projectName}
                </a>
            </div>
        },
        {
            name: 'Experiments',
            key: 'experiments',
            fieldName: 'experiments',
            minWidth: 230,
            maxWidth: 300,
            isResizable: true,
            data: 'number',
            onRender: (item: any): React.ReactNode => <div className='succeed-padding'>{item.experiments.length}</div>
        },
        {
            name: 'Description',
            key: 'description',
            fieldName: 'description',
            minWidth: 350,
            maxWidth: 400,
            isResizable: true,
            data: 'string',
            onRender: (item: any): React.ReactNode => <div className='succeed-padding'>{item.description}</div>
        },
        {
            name: 'CreatedTime',
            key: 'createTime',
            fieldName: 'createTime',
            minWidth: 160,
            maxWidth: 270,
            isResizable: true,
            data: 'number',
            onRender: (item: any): React.ReactNode => (
                <div className='durationsty succeed-padding'>
                    <div>{expformatTimestamp(item.createTime)}</div>
                </div>
            )
        }
    ];

    function removeFromArray(original, remove): any {
        return original.filter(value => !remove.includes(value.projectId));
    }

    function deleteProject(): void {
        let result = JSON.parse(JSON.stringify(tableSource));
        if (deleteProjectIds !== undefined ) {
            result = removeFromArray(tableSource, deleteProjectIds);
        }

        setTableSource(result);
    }

    // 打开new project modal
    function newProject(): void {
        setVisible(true);
    }

    // 在 project 列表里做选择
    const selection = new Selection({
        onSelectionChanged: (): void => setdeleteProjectIds(selection.getSelection().map(s => (s as any).projectId)),
    });

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
                                <div className='search'>
                                    <SearchBox
                                        className='search-input'
                                        placeholder='Search the experiment by name or ID'
                                        // onEscape={this.setOriginSource.bind(this)}
                                        // onClear={this.setOriginSource.bind(this)}
                                        // onChange={this.searchNameAndId.bind(this)}
                                    />
                                </div>
                                <Stack horizontal className='position'>
                                    <PrimaryButton
                                        onClick={newProject}
                                        text='New project'
                                    />
                                    <DefaultButton
                                        onClick={deleteProject}
                                        text='Delete'
                                        className='deleteProject'
                                    />
                                </Stack>
                                {/* project list */}
                                <Stack>
                                {
                                    tableSource.length === 0
                                    ?
                                    <div className='noProject'>No projects yet.</div>
                                    :
                                    <DetailsList
                                        columns={columns}
                                        items={tableSource}
                                        setKey='set'
                                        compact={true}
                                        selection={selection}
                                        // selectionPreservedOnEmptyClick={false} // 设成false是不是只能点CheckBox才能选中？
                                        className='succTable'
                                    />
                                }
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
                {/* new project modal */}
                <NewProjectModal visible={visible} tableSource={tableSource} updateTableSource={setTableSource} closeModel={(): void => setVisible(false)}/>
            </Stack>
    );
}

export default ProjectIndex;
