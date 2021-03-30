import * as React from 'react';
// import { Stack, Pivot, PivotItem } from '@fluentui/react';
import { TRIALS } from '../static/datamodel';
import { AppContext } from '../App';
// import DefaultPoint from './trial-detail/DefaultMetricPoint';
// import Duration from './trial-detail/Duration';
// import Para from './trial-detail/Para';
// import Intermediate from './trial-detail/Intermediate';
import TableList from './trial-detail/TableList';
import '../static/style/search.scss';

interface TrialDetailState {
    whichChart: string;
}

class TrialsDetail extends React.Component<{}, TrialDetailState> {
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;
    public interAccuracy = 0;
    public interAllTableList = 2;

    public tableList!: TableList | null;
    public searchInput!: HTMLInputElement | null;

    constructor(props) {
        super(props);
        this.state = {
            whichChart: 'Default metric'
        };
    }

    handleWhichTabs = (item: any): void => {
        this.setState({ whichChart: item.props.headerText });
    };

    render(): React.ReactNode {
        // const { whichChart } = this.state;
        const source = TRIALS.toArray();
        // const trialIds = TRIALS.toArray().map(trial => trial.id);
        console.info(source);
        return (
            <AppContext.Consumer>
                {(_value): React.ReactNode => (
                    <React.Fragment>
                        
                        {/* trial table list */}
                        <div className='detailTable' style={{ marginTop: 10 }}>
                            <TableList
                                tableSource={source}
                                trialsUpdateBroadcast={this.context.trialsUpdateBroadcast}
                            />
                        </div>
                    </React.Fragment>
                )}
            </AppContext.Consumer>
        );
    }
}

export default TrialsDetail;
