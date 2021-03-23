import * as React from 'react';
// import { Stack, Icon, Dropdown, DefaultButton } from '@fluentui/react';
// import '../static/style/logPath.scss';

interface AdvancedSearchProps {
    onHideDialog: () => void;
}

interface AdvancedSearchState {
    flag: boolean;
}

class AdvancedSearch extends React.Component<AdvancedSearchProps, AdvancedSearchState> {

    constructor(props) {
        super(props);
        this.state = {
            flag: true
        };
    }

    render(): React.ReactNode {
        const {flag} = this.state;
        return (
            <div>AdvancedSearch {flag}</div>
        );
    }

    private findBestTrials(): void {
        console.info('333');
    }
}

export default AdvancedSearch;
