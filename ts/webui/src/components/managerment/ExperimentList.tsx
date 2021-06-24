import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IColumn, DetailsList, Selection } from '@fluentui/react';

function ExperimentsList(props): any{

    const { source, changeChooseTrials, chooseTrials } = props;
    const [trials, setTrials] = useState(chooseTrials);
    console.info(trials);
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
            minWidth: 110,
            maxWidth: 158,
            isResizable: true,
            className: 'tableHead leftTitle',
            data: 'string',
            onRender: (item: any): React.ReactNode => <div>{item.id}</div>
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
            setTrials(idarr);
            changeChooseTrials(idarr);
        }
    });

    return(
        <DetailsList
            columns={columns}
            items={source}
            setKey='set'
            compact={true}
            selection={selection}
            selectionPreservedOnEmptyClick={false} // 设成false是不是只能点CheckBox才能选中？
            className='succTable'
        />
    );
}

ExperimentsList.propTypes = {
    source: PropTypes.array,
    changeChooseTrials: PropTypes.func,
    setExpListString: PropTypes.func,
    chooseTrials: PropTypes.array
};

export default ExperimentsList;