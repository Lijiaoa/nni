import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import { Stack, SearchBox, IColumn, DetailsList, Selection, DefaultButton, PrimaryButton } from '@fluentui/react';
import AddExperiment from './AddExperiment';
import { exp } from './experiment';
import '../../../static/style/experiment/experiment.scss';
import '../../../static/style/experiment/project.scss';

/** 
 * 
 * Name
 * ID
 * Status
 * Best metric
 * Duration
 * Training platform
 * Tuner
 * Label
*/
function ProjectExperimentDetails(_props): any{

    const [selectedIds, setSelectedIds] = useState([] as string[]);
    const [visible, setVisible] = useState(false);
    console.info(selectedIds);
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
        }
    ];

    const [detailsItem, setDetailsItem] = useState(item);
    const changeitem = useCallback(
        (value: any) => {
            setDetailsItem(value);
        },
        [],
    );
    const columns: IColumn[] = [
        {
            name: 'Name',
            key: 'name',
            fieldName: 'name',
            minWidth: 110,
            maxWidth: 164,
            isResizable: true,
            onRender: (item: any): React.ReactNode => <div>{item.name}</div>
        },
        {
            name: 'ID',
            key: 'id',
            fieldName: 'id',
            minWidth: 90,
            maxWidth: 140,
            isResizable: true,
            className: 'tableHead leftTitle',
            data: 'string',
            onRender: (item: any): React.ReactNode => <div>{item.id}</div>
        },
        {
            name: 'Status',
            key: 'status',
            fieldName: 'status',
            minWidth: 90,
            maxWidth: 138,
            isResizable: true,
            className: 'tableHead leftTitle',
            data: 'string',
            onRender: (item: any): React.ReactNode => <div>{item.status}</div>
        },
        {
            name: 'Best metric',
            key: 'metric',
            fieldName: 'metric',
            minWidth: 120,
            maxWidth: 170,
            isResizable: true,
            className: 'tableHead leftTitle',
            data: 'number',
            onRender: (item: any): React.ReactNode => <div>{item.metric}</div>
        },
        {
            name: 'Duration',
            key: 'duration',
            fieldName: 'duration',
            minWidth: 110,
            maxWidth: 158,
            isResizable: true,
            className: 'tableHead leftTitle',
            data: 'number',
            onRender: (item: any): React.ReactNode => <div>{item.duration}</div>
        },
        {
            name: 'Training platform',
            key: 'platform',
            fieldName: 'platform',
            minWidth: 130,
            maxWidth: 160,
            isResizable: true,
            className: 'tableHead leftTitle',
            data: 'string',
            onRender: (item: any): React.ReactNode => <div>{item.platform}</div>
        },
        {
            name: 'Tuner',
            key: 'tuner',
            fieldName: 'tuner',
            minWidth: 110,
            maxWidth: 158,
            isResizable: true,
            className: 'tableHead leftTitle',
            data: 'string',
            onRender: (item: any): React.ReactNode => <div>{item.tuner}</div>
        },
        {
            name: 'Label',
            key: 'label',
            fieldName: 'label',
            minWidth: 97,
            maxWidth: 159,
            isResizable: true,
            data: 'string',
            onRender: (): React.ReactNode => (
                <div>
                    label1;label2
                </div>
            )
        }
    ];

    const selection = new Selection({
        onSelectionChanged: (): void => {
            const idarr = selection.getSelection().map(s => (s as any).id);
            setSelectedIds(idarr);
        }
    });

    function AddExperimentToProject (): void{
        setVisible(true);
    }

    function removeFromArray(original, remove): any {
        return original.filter(value => !remove.includes(value.id));
    }

    function deleteExperiment(): void{
        let result = JSON.parse(JSON.stringify(detailsItem));
        if (selectedIds !== undefined ) {
            result = removeFromArray(detailsItem, selectedIds);
        }

        changeitem(result);
    }

    return(
        <React.Fragment>
            <SearchBox
                styles={{root: {width: 330}}}
                placeholder='Search the experiment by name or ID'
                // onEscape={this.setOriginSource.bind(this)}
                // onClear={this.setOriginSource.bind(this)}
                // onChange={this.searchNameAndId.bind(this)}
            />
            <Stack horizontal className='position'>
                <PrimaryButton
                    onClick={AddExperimentToProject}
                    text='Add'
                />
                <DefaultButton
                    onClick={deleteExperiment}
                    text='Remove'
                    className='remove'
                    />
                <DefaultButton
                    onClick={deleteExperiment}
                    text='Delete'
                    className='deleteProject'
                />
            </Stack>
            <DetailsList
                columns={columns}
                items={detailsItem}
                setKey='set'
                compact={true}
                selection={selection}
                selectionPreservedOnEmptyClick={true}
                className='succTable'
            />
            {/* add experiment into this project model */}
            <AddExperiment
                visible={visible}
                closeModel={(): void => setVisible(false)}
                tableSource={exp}
                changeDetailTableList={changeitem}
            />
        </React.Fragment>
    );
}

ProjectExperimentDetails.propTypes = {
    source: PropTypes.array,
    changeChooseTrials: PropTypes.func,
    setExpListString: PropTypes.func
};

export default ProjectExperimentDetails;
