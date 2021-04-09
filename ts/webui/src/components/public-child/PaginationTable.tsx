import * as React from 'react';
import { DetailsList, Dropdown, Icon, IDetailsListProps, IDropdownOption, IStackTokens, Stack, Selection } from '@fluentui/react';
import ReactPaginate from 'react-paginate';

interface PaginationTableState {
    itemsPerPage: number;
    currentPage: number;
    itemsOnPage: any[]; // this needs to be stored in state to prevent re-rendering
    selectedRowIds: string[];
}

interface OOP extends IDetailsListProps{
    selectedRowIds: string[];
}

const horizontalGapStackTokens: IStackTokens = {
    childrenGap: 20,
    padding: 10
};

function _currentTableOffset(perPage: number, currentPage: number, source: any[]): number {
    return perPage === -1 ? 0 : Math.min(currentPage, Math.floor((source.length - 1) / perPage)) * perPage;
}

function _obtainPaginationSlice(perPage: number, currentPage: number, source: any[]): any[] {
    if (perPage === -1) {
        return source;
    } else {
        const offset = _currentTableOffset(perPage, currentPage, source);
        return source.slice(offset, offset + perPage);
    }
}

class PaginationTable extends React.PureComponent<OOP, PaginationTableState> {
    private _selection: Selection;

    constructor(props: OOP) {
        super(props);
        this.state = {
            itemsPerPage: 20,
            currentPage: 0,
            itemsOnPage: [],
            selectedRowIds: []
        };

        this._selection = new Selection({
            onSelectionChanged: (): void => {
                console.info(this._selection.getSelection()); // eslint-disable-line
                this.setState({
                    selectedRowIds: this._selection.getSelection().map(s => (s as any).id)
                });
            }
        });
    }

    private _onItemsPerPageSelect(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void {
        if (item !== undefined) {
            const { items } = this.props;
            // use current offset to calculate the next `current_page`
            const currentOffset = _currentTableOffset(this.state.itemsPerPage, this.state.currentPage, items);
            const itemsPerPage = item.key as number;
            const currentPage = Math.floor(currentOffset / itemsPerPage);
            this.setState({
                itemsPerPage: itemsPerPage,
                currentPage: currentPage,
                itemsOnPage: _obtainPaginationSlice(itemsPerPage, currentPage, this.props.items)
            });
        }
    }

    private _onPageSelect(event: any): void {
        const currentPage = event.selected;
        this.setState({
            currentPage: currentPage,
            itemsOnPage: _obtainPaginationSlice(this.state.itemsPerPage, currentPage, this.props.items)
        });
    }

    componentDidUpdate(prevProps: IDetailsListProps): void {
        if (prevProps.items !== this.props.items) {
            this.setState({
                itemsOnPage: _obtainPaginationSlice(this.state.itemsPerPage, this.state.currentPage, this.props.items)
            });
        }
    }

    render(): React.ReactNode {
        const { itemsPerPage, itemsOnPage } = this.state;
        const detailListProps = {
            ...this.props,
            items: itemsOnPage
        };
        const itemsCount = this.props.items.length;
        const pageCount = itemsPerPage === -1 ? 1 : Math.ceil(itemsCount / itemsPerPage);
        const perPageOptions = [
            { key: 10, text: '10 items per page' },
            { key: 20, text: '20 items per page' },
            { key: 50, text: '50 items per page' },
            { key: -1, text: 'All items' }
        ];
        return (
            <div>
                <DetailsList {...detailListProps} />
                <Stack
                    horizontal
                    horizontalAlign='end'
                    verticalAlign='baseline'
                    styles={{ root: { padding: 10 } }}
                    tokens={horizontalGapStackTokens}
                >
                    <Dropdown
                        selectedKey={itemsPerPage}
                        options={perPageOptions}
                        onChange={this._onItemsPerPageSelect.bind(this)}
                        styles={{ dropdown: { width: 150 } }}
                    />
                    <ReactPaginate
                        previousLabel={<Icon aria-hidden={true} iconName='ChevronLeft' />}
                        nextLabel={<Icon aria-hidden={true} iconName='ChevronRight' />}
                        breakLabel={'...'}
                        breakClassName={'break'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={2}
                        onPageChange={this._onPageSelect.bind(this)}
                        containerClassName={itemsCount === 0 ? 'pagination hidden' : 'pagination'}
                        subContainerClassName={'pages pagination'}
                        disableInitialCallback={false}
                        activeClassName={'active'}
                    />
                </Stack>
            </div>
        );
    }
}

export default PaginationTable;
