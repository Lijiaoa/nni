import React from 'react';
import {
	DefaultButton,
	IColumn,
	Dropdown,
	Icon,
	PrimaryButton,
	Selection,
	SelectionMode,
	Stack,
	StackItem,
	TooltipHost,
	DirectionalHint,
	Checkbox,
	CommandBarButton
} from '@fluentui/react';
import { EXPERIMENT, TRIALS } from '../../static/datamodel';
import { TOOLTIP_BACKGROUND_COLOR } from '../../static/const';
import { convertDuration, formatTimestamp, copyAndSort } from '../../static/function';
import { TableObj, SortInfo } from '../../static/interface';
import '../../static/style/search.scss';
import '../../static/style/tableStatus.css';
import '../../static/style/logPath.scss';
import '../../static/style/table.scss';
import '../../static/style/button.scss';
import '../../static/style/openRow.scss';
import '../../static/style/pagination.scss';
import '../../static/style/overview/overviewTitle.scss';
import { blocked, copy, LineChart, tableListIcon } from '../buttons/Icon';
import ChangeColumnComponent from '../modals/ChangeColumnComponent';
import Compare from '../modals/Compare';
import Customize from '../modals/CustomizedTrial';
import KillJob from '../modals/Killjob';
// import { AdvancedSearch } from '../modals/AdvancedSearch';
import ExpandableDetails from '../public-child/ExpandableDetails';
import PaginationTable from '../public-child/PaginationTable';
import CopyButton from '../public-child/CopyButton';
import { Trial } from '../../static/model/trial';
import { Cancel } from '../buttons/Icon';
require('echarts/lib/chart/line');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

type SearchOptionType = 'id' | 'trialnum' | 'status' | 'parameters';
// const searchOptionLiterals = {
//     id: 'ID',
//     trialnum: 'Trial No.',
//     status: 'Status',
//     parameters: 'Parameters'
// };

const defaultDisplayedColumns = [ 'sequenceId', 'id', 'duration', 'status', 'latestAccuracy' ];

function _inferColumnTitle(columnKey: string): string {
	if (columnKey === 'sequenceId') {
		return 'Trial No.';
	} else if (columnKey === 'id') {
		return 'ID';
	} else if (columnKey === 'intermediateCount') {
		return 'Intermediate results (#)';
	} else if (columnKey === 'message') {
		return 'Message';
	} else if (columnKey.startsWith('space/')) {
		return columnKey.split('/', 2)[1] + ' (space)';
	} else if (columnKey === 'latestAccuracy') {
		return 'Default metric'; // to align with the original design
	} else if (columnKey.startsWith('metric/')) {
		return columnKey.split('/', 2)[1] + ' (metric)';
	} else if (columnKey.startsWith('_')) {
		return columnKey;
	} else {
		// camel case to verbose form
		const withSpace = columnKey.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`);
		return withSpace.charAt(0).toUpperCase() + withSpace.slice(1);
	}
}

interface TableListProps {
	tableSource: TableObj[];
	trialsUpdateBroadcast: number;
}

interface SearchItems {
	id: number;
	isChecked: boolean;
	name: string;
	operator: string;
	value: string; // 先按string
}

interface TableListState {
	displayedItems: any[];
	displayedColumns: string[];
	columns: IColumn[];
	searchType: SearchOptionType;
	searchText: string;
	selectedRowIds: string[];
	customizeColumnsDialogVisible: boolean;
	compareDialogVisible: boolean;
	advancedSearchDialogVisible: boolean;
	intermediateDialogTrial: TableObj | undefined;
	copiedTrialId: string | undefined;
	sortInfo: SortInfo;
	searchItems: Array<SearchItems>;
	isVisbleSearchCard: boolean;
}

class TableList extends React.Component<TableListProps, TableListState> {
	private _selection: Selection;
	private _expandedTrialIds: Set<string>;

	constructor(props: TableListProps) {
		super(props);

		this.state = {
			displayedItems: [],
			displayedColumns:
				localStorage.getItem('columns') !== null
					? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						JSON.parse(localStorage.getItem('columns')!)
					: defaultDisplayedColumns,
			columns: [],
			searchType: 'id',
			searchText: '',
			customizeColumnsDialogVisible: false,
			compareDialogVisible: false,
			advancedSearchDialogVisible: false,
			selectedRowIds: [],
			intermediateDialogTrial: undefined,
			copiedTrialId: undefined,
			sortInfo: { field: '', isDescend: true },
			searchItems: [],
			isVisbleSearchCard: false
		};

		this._selection = new Selection({
			onSelectionChanged: (): void => {
				this.setState({
					selectedRowIds: this._selection.getSelection().map(s => (s as any).id)
				});
			}
		});

		this._expandedTrialIds = new Set<string>();
	}

	/* Search related methods */

	// This functions as the filter for the final trials displayed in the current table
	private _filterTrials(trials: TableObj[]): TableObj[] {
		const { searchText } = this.state;
		// const { searchText, searchType } = this.state;
		// search a trial by Trial No. | Trial ID | Parameters | Status
		let searchFilter = (_: TableObj): boolean => true; // eslint-disable-line no-unused-vars
		if (searchText.trim()) {
			searchFilter = (trial): boolean =>
				trial.id.toUpperCase().includes(searchText.toUpperCase()) ||
				trial.sequenceId.toString() === searchText ||
				trial.status.toUpperCase().includes(searchText.toUpperCase());
		}
		return trials.filter(searchFilter);
	}

	// private _updateSearchFilterType(_event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void {
	//     if (item !== undefined) {
	//         const value = item.key.toString();
	//         if (searchOptionLiterals.hasOwnProperty(value)) {
	//             this.setState({ searchType: value as SearchOptionType }, this._updateTableSource);
	//         }
	//     }
	// }

	private _updateSearchText(ev: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({ searchText: ev.target.value }, this._updateTableSource);
	}

	/* Table basic function related methods */

	private _onColumnClick(ev: React.MouseEvent<HTMLElement>, column: IColumn): void {
		// handle the click events on table header (do sorting)
		const { columns } = this.state;
		const newColumns: IColumn[] = columns.slice();
		const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
		const isSortedDescending = !currColumn.isSortedDescending;
		this.setState(
			{
				sortInfo: { field: column.key, isDescend: isSortedDescending }
			},
			this._updateTableSource
		);
	}

	private _trialsToTableItems(trials: TableObj[]): any[] {
		// TODO: use search space and metrics space from TRIALS will cause update issues.
		const searchSpace = TRIALS.inferredSearchSpace(EXPERIMENT.searchSpaceNew);
		const metricSpace = TRIALS.inferredMetricSpace();
		const items = trials.map(trial => {
			const ret = {
				sequenceId: trial.sequenceId,
				id: trial.id,
				startTime: (trial as Trial).info.startTime, // FIXME: why do we need info here?
				endTime: (trial as Trial).info.endTime,
				duration: trial.duration,
				status: trial.status,
				message: (trial as Trial).info.message || '--',
				intermediateCount: trial.intermediates.length,
				_expandDetails: this._expandedTrialIds.has(trial.id) // hidden field names should start with `_`
			};
			for (const [ k, v ] of trial.parameters(searchSpace)) {
				ret[`space/${k.baseName}`] = v;
			}
			for (const [ k, v ] of trial.metrics(metricSpace)) {
				ret[`metric/${k.baseName}`] = v;
			}
			ret['latestAccuracy'] = (trial as Trial).latestAccuracy;
			ret['_formattedLatestAccuracy'] = (trial as Trial).formatLatestAccuracy();
			return ret;
		});

		const { sortInfo } = this.state;
		if (sortInfo.field !== '') {
			return copyAndSort(items, sortInfo.field, sortInfo.isDescend);
		} else {
			return items;
		}
	}

	private _buildColumnsFromTableItems(tableItems: any[]): IColumn[] {
		// extra column, for a icon to expand the trial details panel
		const columns: IColumn[] = [
			{
				key: '_expand',
				name: '',
				onRender: (item): any => {
					return (
						<Icon
							aria-hidden={true}
							iconName="ChevronRight"
							className="cursor"
							styles={{
								root: {
									transition: 'all 0.2s',
									transform: `rotate(${item._expandDetails ? 90 : 0}deg)`
								}
							}}
							onClick={(event): void => {
								event.stopPropagation();
								const newItem: any = { ...item, _expandDetails: !item._expandDetails };
								if (newItem._expandDetails) {
									// preserve to be restored when refreshed
									this._expandedTrialIds.add(newItem.id);
								} else {
									this._expandedTrialIds.delete(newItem.id);
								}
								const newItems = this.state.displayedItems.map(
									item => (item.id === newItem.id ? newItem : item)
								);
								this.setState({
									displayedItems: newItems
								});
							}}
							onMouseDown={(e): void => {
								e.stopPropagation();
							}}
							onMouseUp={(e): void => {
								e.stopPropagation();
							}}
						/>
					);
				},
				fieldName: 'expand',
				isResizable: false,
				minWidth: 20,
				maxWidth: 20
			}
		];
		// looking at the first row only for now
		for (const k of Object.keys(tableItems[0])) {
			if (k === 'metric/default') {
				// FIXME: default metric is hacked as latestAccuracy currently
				continue;
			}
			const columnTitle = _inferColumnTitle(k);
			// TODO: add blacklist
			// 0.85: tableWidth / screen
			const widths = window.innerWidth * 0.85;
			columns.push({
				name: columnTitle,
				key: k,
				fieldName: k,
				minWidth: widths * 0.12,
				maxWidth: widths * 0.19,
				isResizable: true,
				onColumnClick: this._onColumnClick.bind(this),
				...k === 'status' && {
					// color status
					onRender: (record): React.ReactNode => (
						<span className={`${record.status} commonStyle`}>{record.status}</span>
					)
				},
				...k === 'message' && {
					onRender: (record): React.ReactNode =>
						record.message.length > 15 ? (
							<TooltipHost
								content={record.message}
								directionalHint={DirectionalHint.bottomCenter}
								tooltipProps={{
									calloutProps: {
										styles: {
											beak: { background: TOOLTIP_BACKGROUND_COLOR },
											beakCurtain: { background: TOOLTIP_BACKGROUND_COLOR },
											calloutMain: { background: TOOLTIP_BACKGROUND_COLOR }
										}
									}
								}}
							>
								<div>{record.message}</div>
							</TooltipHost>
						) : (
							<div>{record.message}</div>
						)
				},
				...(k.startsWith('metric/') || k.startsWith('space/')) && {
					// show tooltip
					onRender: (record): React.ReactNode => (
						<TooltipHost
							content={record[k]}
							directionalHint={DirectionalHint.bottomCenter}
							tooltipProps={{
								calloutProps: {
									styles: {
										beak: { background: TOOLTIP_BACKGROUND_COLOR },
										beakCurtain: { background: TOOLTIP_BACKGROUND_COLOR },
										calloutMain: { background: TOOLTIP_BACKGROUND_COLOR }
									}
								}
							}}
						>
							<div className="ellipsis">{record[k]}</div>
						</TooltipHost>
					)
				},
				...k === 'latestAccuracy' && {
					// FIXME: this is ad-hoc
					onRender: (record): React.ReactNode => (
						<TooltipHost
							content={record._formattedLatestAccuracy}
							directionalHint={DirectionalHint.bottomCenter}
							tooltipProps={{
								calloutProps: {
									styles: {
										beak: { background: TOOLTIP_BACKGROUND_COLOR },
										beakCurtain: { background: TOOLTIP_BACKGROUND_COLOR },
										calloutMain: { background: TOOLTIP_BACKGROUND_COLOR }
									}
								}
							}}
						>
							<div className="ellipsis">{record._formattedLatestAccuracy}</div>
						</TooltipHost>
					)
				},
				...[ 'startTime', 'endTime' ].includes(k) && {
					onRender: (record): React.ReactNode => <span>{formatTimestamp(record[k], '--')}</span>
				},
				...k === 'duration' && {
					onRender: (record): React.ReactNode => (
						<span className="durationsty">{convertDuration(record[k])}</span>
					)
				},
				...k === 'id' && {
					onRender: (record): React.ReactNode => (
						<Stack horizontal className="idCopy">
							<div>{record.id}</div>
							<CopyButton value={record.id} />
						</Stack>
					)
				}
			});
		}
		// operations column
		columns.push(
			{
				name: 'Operation',
				key: '_operation',
				fieldName: 'operation',
				minWidth: 150,
				maxWidth: 160,
				isResizable: true,
				className: 'detail-table',
				onRender: this._renderOperationColumn.bind(this)
			},
			{
				name: 'setting', // add/remove columns setting
				key: '_setting',
				fieldName: '',
				isIconOnly: true,
				iconName: 'Settings',
				minWidth: 20,
				maxWidth: 20,
				isResizable: false,
				onColumnClick: (): void => this.setState({ customizeColumnsDialogVisible: true })
			}
		);

		const { sortInfo } = this.state;
		for (const column of columns) {
			if (column.key === sortInfo.field) {
				column.isSorted = true;
				column.isSortedDescending = sortInfo.isDescend;
			} else {
				column.isSorted = false;
				column.isSortedDescending = true;
			}
		}
		return columns;
	}

	private _updateTableSource(): void {
		// call this method when trials or the computation of trial filter has changed
		const items = this._trialsToTableItems(this._filterTrials(this.props.tableSource));
		if (items.length > 0) {
			const columns = this._buildColumnsFromTableItems(items);
			this.setState({
				displayedItems: items,
				columns: columns
			});
		} else {
			this.setState({
				displayedItems: [],
				columns: []
			});
		}
	}

	private _updateDisplayedColumns(displayedColumns: string[]): void {
		this.setState({
			displayedColumns: displayedColumns
		});
	}

	private _renderOperationColumn(record: any): React.ReactNode {
		const runningTrial: boolean = [ 'RUNNING', 'UNKNOWN' ].includes(record.status) ? false : true;
		const disabledAddCustomizedTrial = [ 'DONE', 'ERROR', 'STOPPED' ].includes(EXPERIMENT.status);
		return (
			<Stack className="detail-button" horizontal>
				<PrimaryButton
					className="detail-button-operation"
					title="Intermediate"
					onClick={(): void => {
						const { tableSource } = this.props;
						const trial = tableSource.find(trial => trial.id === record.id) as TableObj;
						this.setState({ intermediateDialogTrial: trial });
					}}
				>
					{LineChart}
				</PrimaryButton>
				{runningTrial ? (
					<PrimaryButton className="detail-button-operation" disabled={true} title="kill">
						{blocked}
					</PrimaryButton>
				) : (
					<KillJob trial={record} />
				)}
				<PrimaryButton
					className="detail-button-operation"
					title="Customized trial"
					onClick={(): void => {
						this.setState({ copiedTrialId: record.id });
					}}
					disabled={disabledAddCustomizedTrial}
				>
					{copy}
				</PrimaryButton>
			</Stack>
		);
	}

	private searchFun = (): void => {
		// advancedSearchDialogVisible
		this.setState({ advancedSearchDialogVisible: true });
	};

	private _onChange = (ev: React.FormEvent<HTMLElement>, isChecked: boolean): void => {
		console.info(`The option has been changed to ${isChecked}.`);
	};

	componentDidUpdate(prevProps: TableListProps): void {
		if (this.props.tableSource !== prevProps.tableSource) {
			this._updateTableSource();
		}
	}

	componentDidMount(): void {
		this._updateTableSource();
	}

	private parametersType = (): Map<string, string | number> => {
		const { displayedItems } = this.state;
		// 抽出space名字
		const map = new Map();
		if (displayedItems.length !== 0) {
			const allSearchSpaceColumn = Object.keys(displayedItems[0]).filter(item => item.startsWith('space/'));
			allSearchSpaceColumn.forEach(item => {
				map.set(item, typeof displayedItems[0][item]);
			});
		}
		return map;
	};

	render(): React.ReactNode {
		const {
			displayedItems,
			columns,
			// searchType,
			customizeColumnsDialogVisible,
			compareDialogVisible,
			// advancedSearchDialogVisible,
			displayedColumns,
			selectedRowIds,
			intermediateDialogTrial,
			copiedTrialId,
			searchItems,
			isVisbleSearchCard
		} = this.state;

		console.info(displayedItems);
		// 抽出space名字
		const allSearchSpaceColumn =
			displayedItems.length !== 0
				? Object.keys(displayedItems[0]!).filter(item => item.startsWith('space/'))
				: [];
		return (
			<div id="tableList" className="tablelist-position">
				<Stack horizontal className="panelTitle" style={{ marginTop: 10 }}>
					<span style={{ marginRight: 12 }}>{tableListIcon}</span>
					<span>Trial jobs</span>
				</Stack>
				<Stack horizontal className="allList">
					<StackItem grow={50}>
						<DefaultButton
							text="Compare"
							className="allList-compare"
							onClick={(): void => {
								this.setState({ compareDialogVisible: true });
							}}
							disabled={selectedRowIds.length === 0}
						/>
					</StackItem>
					<StackItem grow={50}>
						<Stack horizontal horizontalAlign="end" className="allList">
							<input
								type="text"
								className="allList-search-input"
								placeholder="Find matching trials"
								onChange={this._updateSearchText.bind(this)}
								style={{ width: 230 }}
							/>
							<DefaultButton
								text="Advanced search"
								className="allList-advance"
								onClick={(): void => {
									this.setState({ isVisbleSearchCard: true });
								}}
							/>
						</Stack>
					</StackItem>
				</Stack>
				<div className={`search-card ${!isVisbleSearchCard ? 'search-card-hidden' : ''}`}>
					{searchItems.map(item => {
						return (
							<Stack key={`${item.id} ui`} horizontal className="search-row gap-margin-bottom">
								<Checkbox
									className="checkbox"
									checked={item.isChecked}
									onChange={(ev, checked): void => {
										const { searchItems } = this.state;
										const result = [
											...searchItems.slice(0, item.id),
											{ ...searchItems[item.id], isChecked: !!checked },
											...searchItems.slice(item.id + 1)
										];
										this.setState({ searchItems: result });
									}}
								/>
								<Dropdown
									options={allSearchSpaceColumn.map(index => ({
										key: index,
										text: index
									}))}
									key={`${item.id} first`.toString()}
									selectedKey={item.name}
									onChange={(_ev, some): void => {
										const { searchItems } = this.state;
										const result = [
											...searchItems.slice(0, item.id),
											{ ...searchItems[item.id], name: some!.text },
											...searchItems.slice(item.id + 1)
										];
										this.setState({ searchItems: result });
									}}
									styles={{ root: { width: 180 } }}
									className="gap-margin-left"
								/>
								<Dropdown
									options={[ '>', '=', '<' ].map(index => ({
										key: index,
										text: index
									}))}
									key={item.id}
									selectedKey={item.operator}
									className="gap-margin-left"
									onChange={(_ev, some): void => {
										const { searchItems } = this.state;
										const result = [
											...searchItems.slice(0, item.id),
											{ ...searchItems[item.id], operator: some!.text },
											...searchItems.slice(item.id + 1)
										];
										this.setState({ searchItems: result });
									}}
									styles={{ root: { width: 80 } }}
								/>
								<input
									type="text"
									name={`${item.id} input`}
									defaultValue={item.value}
									className="input-height gap-margin-left"
									onChange={(event): void => {
										const { value } = event.target;
										const { searchItems } = this.state;
										const result = [
											...searchItems.slice(0, item.id),
											{ ...searchItems[item.id], value: value },
											...searchItems.slice(item.id + 1)
										];
										this.setState({ searchItems: result });
									}}
								/>
								<span
									className="del-search cursor gap-margin-left"
									onClick={(): void => {
										const { searchItems } = this.state;
										if (searchItems.length === 1) {
											this.setState({ searchItems: [] });
										} else {
											this.setState({
												searchItems: [
													...searchItems.slice(0, item.id),
													...searchItems.slice(item.id + 1)
												]
											});
										}
									}}
								>
									{Cancel}
								</span>
							</Stack>
						);
					})}
					<Stack horizontal className="advanced-btns">
						<StackItem grow={50}>
							<CommandBarButton
								iconProps={{ iconName: 'Add' }}
								text="Add filter"
								className="allList-advance"
								onClick={(): void => {
									const { searchItems } = this.state;
									let index;
									if (searchItems.length === 0) {
										index = 0;
									} else {
										index = searchItems[searchItems.length - 1].id + 1;
									}
									this.setState({
										searchItems: [
											...searchItems,
											{ id: index, isChecked: false, name: '', value: '', operator: '' }
										]
									});
									console.info(searchItems);
								}}
							/>
						</StackItem>
						<StackItem grow={50}>
							<DefaultButton
								text="Confirm search"
								className="allList-advance gap-margin-left"
								onClick={(): void => {
                                    // let searchFilter = (_: TableObj): boolean => true; // eslint-disable-line no-unused-vars
									// 根据是否check决定条件，根据超参名字确定数据类型，转换类型，条件连起来，筛选数据
									// 如果同一个name进行多次filter，如果是不同的操作符，都是条件，相同的操作符，数据集取最大集
									const relation = this.parametersType();
                                    console.info(relation.get('space/conv_size'));
									const { searchItems } = this.state;
                                    console.info(searchItems);
                                    // let realfilter;
									// searchItems.forEach(item => {
									// 	if (item.isChecked && item.name !== '' && item.value !== '' && item.operator !== '') {
									// 		if (relation.get(item.name) === 'number') {
                                    //             item.value = JSON.parse(item.value);
                                    //             // if(item.operator === '='){
									// 			// 	const searchFilter = (trial): boolean =>
									// 			// 		trial[item.name] === item.value

                                    //             // }
									// 			// return trials.filter(searchFilter);
                                    //         }
                                    //         realfilter.push(item);
                                    //         console.info(realfilter);
									// 	}
									// });

									this.setState({ isVisbleSearchCard: false });
								}}
							/>
						</StackItem>
					</Stack>
				</div>

				{columns &&
				displayedItems && (
					<PaginationTable
						columns={columns.filter(
							column =>
								displayedColumns.includes(column.key) ||
								[ '_expand', '_operation', '_setting' ].includes(column.key)
						)}
						items={displayedItems}
						compact={true}
						selection={this._selection}
						selectionMode={SelectionMode.multiple}
						selectionPreservedOnEmptyClick={true}
						onRenderRow={(props): any => {
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							return <ExpandableDetails detailsProps={props!} isExpand={props!.item._expandDetails} />;
						}}
					/>
				)}
				{compareDialogVisible && (
					<Compare
						title="Compare trials"
						showDetails={true}
						trials={this.props.tableSource.filter(trial => selectedRowIds.includes(trial.id))}
						onHideDialog={(): void => {
							this.setState({ compareDialogVisible: false });
						}}
					/>
				)}
				{intermediateDialogTrial !== undefined && (
					<Compare
						title="Intermediate results"
						showDetails={false}
						trials={[ intermediateDialogTrial ]}
						onHideDialog={(): void => {
							this.setState({ intermediateDialogTrial: undefined });
						}}
					/>
				)}
				{customizeColumnsDialogVisible && (
					<ChangeColumnComponent
						selectedColumns={displayedColumns}
						allColumns={columns
							.filter(column => !column.key.startsWith('_'))
							.map(column => ({ key: column.key, name: column.name }))}
						onSelectedChange={this._updateDisplayedColumns.bind(this)}
						onHideDialog={(): void => {
							this.setState({ customizeColumnsDialogVisible: false });
						}}
					/>
				)}
				{/* Clone a trial and customize a set of new parameters */}
				{/* visible is done inside because prompt is needed even when the dialog is closed */}
				<Customize
					visible={copiedTrialId !== undefined}
					copyTrialId={copiedTrialId || ''}
					closeCustomizeModal={(): void => {
						this.setState({ copiedTrialId: undefined });
					}}
				/>
			</div>
		);
	}
}

export default TableList;
