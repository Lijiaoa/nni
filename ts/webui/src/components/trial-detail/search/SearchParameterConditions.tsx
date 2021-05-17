import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Stack, PrimaryButton, Dropdown, IDropdownOption } from '@fluentui/react';
import { trialJobStatus } from '../../../static/const';
import { searchConditonsGap } from '../../modals/ChildrenGap';

// This file is for filtering trial parameters and trial status

function SearchParameterConditions(props): any {
    const { parameter, searchFilter, changeSearchFilterList, updatePage, setSearchInputVal } = props;
    const isStatus = parameter === 'StatusNNI';
    const [operatorVal, setOperatorVal] = useState(getInputsVal()[1]);
    const [trialStatus, setTrialStatus] = useState(getInputsVal()[0]);
    const [firstInputVal, setFirstInputVal] = useState(getInputsVal()[0]);
    const [secondInputVal, setSecondInputVal] = useState(getInputsVal()[2]);
    const operatorList = isStatus ? ['=', '≠'] : ['between', '>', '<', '=', '≠'];

    function _updateSearchFilterType(_event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void {
        if (item !== undefined) {
            const value = item.key.toString();
            setOperatorVal(value);
        }
    }

    function getInputsVal(): string[] {
        const str: string[] = [];
        if (searchFilter.length > 0) {
            const filterElement = searchFilter.find(ele => ele.name === parameter);
            if (filterElement !== undefined) {
                str.push(filterElement.value1, filterElement.operator, filterElement.value2);
            } else {
                str.push('', `${isStatus ? '=' : 'between'}`, '');
            }
        } else {
            str.push('', `${isStatus ? '=' : 'between'}`, '');
        }

        return str;
    }

    function _updateTrialStatusDropdown(
        _event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption | undefined
    ): void {
        if (item !== undefined) {
            const value = item.key.toString();
            setTrialStatus(value);
            // Status also store in first Input val
            setFirstInputVal(value);
        }
    }

    function _updateFirstInputVal(ev: React.ChangeEvent<HTMLInputElement>): void {
        setFirstInputVal(ev.target.value);
    }

    function _updateSecondInputVal(ev: React.ChangeEvent<HTMLInputElement>): void {
        setSecondInputVal(ev.target.value);
    }
    function getFiterConditionString(searchFilter): string {
        let str = '';
        searchFilter.forEach(item => {
            const filterName = item.name === 'StatusNNI' ? 'Status' : item.name;
            if (item.operator === '') {
                str = str + `${filterName}:${item.value1}; `;
            } else if (item.operator === 'between') {
                str = str + `${filterName}:[${item.value1},${item.value2}]; `;
            } else if (item.operator === '=') {
                str = str + `${filterName}:${item.value1}; `;
            } else {
                // > <
                str = str + `${filterName}${item.operator}${item.value1}; `;
            }
        });
        return str;
    }

    // 点击 apply 按钮
    function apply(): void {
        const { searchFilter } = props;
        const temp = JSON.parse(JSON.stringify(searchFilter));
        // 先找有没有这个条件存在
        const find = temp.filter(item => item.name === parameter);
        if (find.length > 0) {
            // 条件存在，覆盖值
            temp.forEach(item => {
                if (item.name === parameter) {
                    item.operator = operatorVal;
                    item.value1 = firstInputVal;
                    item.value2 = secondInputVal;
                }
            });
        } else {
            // 不存在这个条件，直接push进去
            temp.push({
                name: parameter,
                operator: operatorVal,
                value1: firstInputVal,
                value2: secondInputVal
            });
        }
        console.info(temp);
        setSearchInputVal(getFiterConditionString(temp));
        changeSearchFilterList(temp);
        updatePage();
    }

    return (
        // for trial parameters & Status
        <Stack horizontal className='filterConditions' tokens={searchConditonsGap}>
            <Dropdown
                selectedKey={operatorVal}
                options={operatorList.map(item => ({
                    key: item,
                    text: item
                }))}
                onChange={_updateSearchFilterType}
                className='btn-vertical-middle'
                styles={{ root: { width: 100 } }}
            />
            {isStatus ? (
                <Dropdown
                    selectedKey={trialStatus}
                    options={trialJobStatus.map(item => ({
                        key: item,
                        text: item
                    }))}
                    onChange={_updateTrialStatusDropdown}
                    className='btn-vertical-middle'
                    styles={{ root: { width: 160 } }}
                />
            ) : (
                <React.Fragment>
                    {operatorVal === 'between' ? (
                        <div>
                            <input
                                type='text'
                                className='input input-padding'
                                placeholder='xxx'
                                onChange={_updateFirstInputVal}
                                value={firstInputVal}
                            />
                            <span className='and'>and</span>
                            <input
                                type='text'
                                className='input input-padding'
                                placeholder='xxx'
                                onChange={_updateSecondInputVal}
                                value={secondInputVal}
                            />
                        </div>
                    ) : (
                        <input
                            type='text'
                            className='input input-padding'
                            placeholder='xxx'
                            onChange={_updateFirstInputVal}
                            value={firstInputVal}
                        />
                    )}
                </React.Fragment>
            )}
            <PrimaryButton text='Apply' className='btn-vertical-middle' onClick={apply} />
        </Stack>
    );
}

SearchParameterConditions.propTypes = {
    parameter: PropTypes.string,
    searchFilter: PropTypes.array,
    setSearchInputVal: PropTypes.func,
    changeSearchFilterList: PropTypes.func,
    updatePage: PropTypes.func
};

export default SearchParameterConditions;
