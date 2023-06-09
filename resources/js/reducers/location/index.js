const initialState = {
    refresh: false,
    history: [],
    previous: {
        module: null,
        action: null,
        params: {}
    },
    current: {
        module: null,
        action: null,
        params: {}
    }
};

export default function locationReducer(state = initialState, action) {
    switch (action.type) {
        case 'location/refresh': {
            return {
                ...state,
                refresh: true
            }
        }
        case 'location/stop-refresh': {
            return {
                ...state,
                refresh: false
            }
        }
        case 'location/update': {

            const payload = {...state.current, ...action.payload};

            return {
                ...state,
                previous: {
                    ...state.current
                },
                current: {
                    ...payload
                }
            }
        }
        default:
            // If this reducer doesn't recognize the action type, or doesn't
            // care about this specific action, return the existing state unchanged
            return state;
    }
}
