import { TOGGLE_MODAL } from "../actions/actionTypes";

const initialState: { openModal: boolean } = {
    openModal: false
}

const modalReducer = (state = initialState, action: { type: string, payload: boolean }) => {
    switch(action.type) {
        case TOGGLE_MODAL: {
            return {
                ...state,
                openModal: action.payload
            }
        }
        default: {
            return state;
        }
    }
}

export default modalReducer;
