import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IColumn, DetailsList, Selection } from '@fluentui/react';
import NameColumn from './managementExp/TrialIdColumn';
import { expformatTimestamp } from '../../static/function';
import { MAXSCREENCOLUMNWIDHT, MINSCREENCOLUMNWIDHT } from './managementExp/experimentConst';

function ExperimentsList(props){

    const { source } = props;
    const [selectedIds, setSelectedIds] = useState([] as number[]); // 假设 project id 是 number 类型
    console.info(selectedIds);
    const columns: IColumn[] = [
        {
            name: 'Name',
            key: 'experimentName',
            fieldName: 'experimentName', // required!
            minWidth: MINSCREENCOLUMNWIDHT,
            maxWidth: MAXSCREENCOLUMNWIDHT,
            isResizable: true,
            data: 'number',
            onRender: (item: any): React.ReactNode => <div>{item.experimentName}</div>
        },
        {
            name: 'ID',
            key: 'id',
            fieldName: 'id',
            minWidth: MINSCREENCOLUMNWIDHT,
            maxWidth: MAXSCREENCOLUMNWIDHT,
            isResizable: true,
            className: 'tableHead leftTitle',
            data: 'string',
            onRender: (item: any): React.ReactNode => <NameColumn port={item.port} status={item.status} id={item.id} />
        },
        {
            name: 'Status',
            key: 'status',
            fieldName: 'status',
            minWidth: MINSCREENCOLUMNWIDHT,
            maxWidth: MAXSCREENCOLUMNWIDHT,
            isResizable: true,
            onRender: (item: any): React.ReactNode => <div className={`${item.status} commonStyle`}>{item.status}</div>
        },
        {
            name: 'Port',
            key: 'port',
            fieldName: 'port',
            minWidth: MINSCREENCOLUMNWIDHT - 15,
            maxWidth: MAXSCREENCOLUMNWIDHT - 30,
            isResizable: true,
            data: 'number',
            onRender: (item: any): React.ReactNode => (
                <div className={item.status === 'STOPPED' ? 'gray-port' : ''}>
                    {item.port !== undefined ? item.port : '--'}
                </div>
            )
        },
        {
            name: 'Platform',
            key: 'platform',
            fieldName: 'platform',
            minWidth: MINSCREENCOLUMNWIDHT - 15,
            maxWidth: MAXSCREENCOLUMNWIDHT - 30,
            isResizable: true,
            data: 'string',
            onRender: (item: any): React.ReactNode => <div className='commonStyle'>{item.platform}</div>
        },
        {
            name: 'Start time',
            key: 'startTime',
            fieldName: 'startTime',
            minWidth: MINSCREENCOLUMNWIDHT + 15,
            maxWidth: MAXSCREENCOLUMNWIDHT + 30,
            isResizable: true,
            data: 'number',
            onRender: (item: any): React.ReactNode => <div>{expformatTimestamp(item.startTime)}</div>
        },
        {
            name: 'End time',
            key: 'endTime',
            fieldName: 'endTime',
            minWidth: MINSCREENCOLUMNWIDHT + 15,
            maxWidth: MAXSCREENCOLUMNWIDHT + 30,
            isResizable: true,
            data: 'number',
            onRender: (item: any): React.ReactNode => <div>{expformatTimestamp(item.endTime)}</div>
        }
    ];

    const selection = new Selection({
        onSelectionChanged: () => setSelectedIds(selection.getSelection().map(s => (s as any).project_id)),
    });

    return(
        <DetailsList
            columns={columns}
            items={source}
            setKey='set'
            compact={true}
            selection={selection}
            selectionPreservedOnEmptyClick={false} // 设成false是不是只能点CheckBox才能选中？
            selectionMode={0} // close selector function
            className='succTable'
        />
    );
}

ExperimentsList.propTypes = {
    source: PropTypes.array
};

export default ExperimentsList;