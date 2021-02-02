import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stack, Panel, StackItem, PrimaryButton, DetailsList, IColumn, IconButton } from '@fluentui/react';
import DialogDetail from './DialogDetail';
import { caclMonacoEditorHeight } from '../../../static/function';
import '../../../static/style/tensorboard.scss';

function Tensorboard(props): any {

    const { onHideDialog, trialIDs } = props;
    const [deleteIDs, setDeleteIDs] = useState([] as string[]);
    const [trialCount, setTrialCount] = useState(trialIDs.length - deleteIDs.length);
    const [source, setSource] = useState([]);
    const [dialogContent, setDialogContent] = useState(''); // trial tensorboard api error
    const [visibleDialog, setVisibleDialog] = useState(false);

    const columns: IColumn[] = [
        {
            name: 'ID',
            key: 'id',
            fieldName: 'id',
            minWidth: 60,
            maxWidth: 120,
            isResizable: true,
            className: 'tableHead leftTitle',
            data: 'string',
            onRender: (item: any): React.ReactNode => <div className='succeed-padding'>{item.id}</div>
        },
        {
            name: 'Operation',
            key: '_operation',
            fieldName: 'operation',
            minWidth: 90,
            maxWidth: 90,
            isResizable: true,
            className: 'detail-table',
            onRender: _renderOperationColumn
        }
    ];

    useEffect(() => {
        const realIDs = trialIDs.filter(item => !(deleteIDs.includes(item)));
        setSource(realIDs.map(id => ({ id })));
    }, [trialCount]); // trialCount发生改变时触发页面更新

    // const { experiment, expDrawerHeight } = state;
    const tableHeight = caclMonacoEditorHeight(window.innerHeight);

    function _renderOperationColumn(record: any): React.ReactNode {
        return (
            <Stack className='operationBtn' horizontal>
                <IconButton
                    iconProps={{ iconName: 'OpenInNewWindow' }}
                    title="open"
                    onClick={(): Promise<void> => openTrialTensorboard(record.id)}
                />
                <IconButton
                    iconProps={{ iconName: 'Delete' }}
                    title="delete"
                    onClick={(): Promise<void> => deleteOneTrialTensorboard(record.id)}
                />
            </Stack>
        );
    }

    async function openTrialTensorboard(id: string): Promise<void> {
        console.info(id);
        // 查看tensorboard成功的demo
        if(id === 'RZnms'){
            window.open('https://developer.microsoft.com/en-us/fluentui#/components/ComboBox');
        }
        // tensorboard正在启动状态
        if(id === 'd9P3u'){
            setDialogContent(`This trial's tensorboard is not ready and current status is 'download data'.`);
            setVisibleDialog(true);
        }
        // tensorboard api发生某些问题
        if(id === 'vh6bg'){
            setDialogContent(`Met some error...`);
            setVisibleDialog(true);
        }
    }

    async function deleteOneTrialTensorboard(id: string): Promise<void> {
        // stopped trial tensorboard succeed
        if(id === 'uwY2R'){
            const a = deleteIDs;
            a.push(id);
            setDeleteIDs(a);
            setTrialCount(trialIDs.length - a.length);
            setDialogContent(`Had stopped trial ${id} tensorboard`);
        }
        // api 
        if(id === 'PZxMv'){
            setDialogContent(`api error, failed to stop ${id} tensorboard`);
        }
        setVisibleDialog(true);

    }

    /**
     * 	1. Start new tensorboard
            Request: POST /api/v1/tensorboard
            Parameters:
            {
                "trials": "trialId1, trialId2"
            }
            Response if success:
            Status:201
            {
            tensorboardId: "id"
            }
            Response if failed:
            Status 400
            {
            Message:"error message"
            }

     */
    return (
        <Panel isOpen={true} hasCloseButton={false} isLightDismiss={true} onLightDismissClick={onHideDialog}>
            <div className='panel'>
                <div className='panelName'>
                    <span>Tensorboard</span>
                    <span className='circle'>{trialCount}</span>
                </div>
                <DetailsList
                    columns={columns}
                    items={source}
                    setKey='set'
                    compact={true}
                    selectionMode={0}
                    className='succTable'
                    styles={{ root: { height: tableHeight } }}
                />
                <Stack horizontal className='buttons'>
                    <StackItem grow={12} className='close'>
                        <PrimaryButton text='Close' onClick={onHideDialog} />
                    </StackItem>
                </Stack>
            </div>
            {visibleDialog &&
                <DialogDetail
                    visible={visibleDialog}
                    message={dialogContent}
                    func={setVisibleDialog}
                />}
        </Panel>
    );
}

Tensorboard.propTypes = {
    trialIDs: PropTypes.array,
    onHideDialog: PropTypes.func
};

export default Tensorboard;
