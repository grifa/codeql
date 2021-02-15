import * as React from 'react';
import { connect, useDispatch } from 'react-redux';
import * as rt from '@reduxjs/toolkit';

const toolkitAction = rt.createAction('toolkitAction', (x) => {
    return {
        toolkitValue: x
    }
});
const toolkitReducer = rt.createReducer({}, builder => {
    builder
        .addCase(toolkitAction, (state, action) => {
            return {
                value: action.payload.toolkitValue,
                ...state
            };
        })
        .addCase(asyncAction.fulfilled, (state, action) => {
            return {
                asyncValue: action.payload.x,
                ...state
            };
        });
});

function manualAction(x) {
    return {
        type: 'manualAction',
        payload: x
    }
}
function manualReducer(state, action) {
    switch (action.type) {
        case 'manualAction': {
            return { ...state, manualValue: action.payload };
        }
    }
    return state;
}
const asyncAction = rt.createAsyncThunk('asyncAction', (x) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ x });
        }, 10)
    });
});

const store = rt.createStore(rt.combineReducers({
    toolkit: toolkitReducer,
    manual: manualReducer,
}));

function MyComponent(props) {
    let dispatch = useDispatch();
    const clickHandler = React.useCallback(() => {
        props.toolkitAction(source());
        props.manualAction(source()); // not currently propagated as functions are not type-tracked
        dispatch(manualAction(source()));
        dispatch(asyncAction(source()));
    });

    sink(props.propFromToolkitAction); // NOT OK
    sink(props.propFromManualAction); // NOT OK
    sink(props.propFromAsync); // NOT OK

    return <button onClick={{clickHandler}}/>
}

function mapStateToProps(state) {
    return {
        propFromToolkitAction: state.toolkit.value,
        propFromAsync: state.toolkit.asyncValue,
        propFromManualAction: state.manual.manualValue
    }
}

const mapDispatchToProps = { toolkitAction, manualAction };

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(MyComponent);