import { TOGGLE_MODAL } from "./actionTypes"

const toggleModal = (modalState: boolean) => {
    return {
        type: TOGGLE_MODAL,
        payload: modalState
    }
}

export { toggleModal };
