import { useDispatch } from 'react-redux';
import { cancelSvg } from '../../assets/assets';
import './InfoModal.css';
import { toggleModal } from '../../redux/actions/modalAction';

const InfoModal = () => {
    const dispatch = useDispatch();

    const closeModal = () => {
        dispatch(toggleModal(false));
    }

    return (
        <div className="info-modal__container">
            <div className="info-modal__body">
                <div className="info-modal__head">
                    <div className="info-modal__title">How is this scored?</div>
                    <div className="info-modal__close" >
                        <img src={cancelSvg} alt="close" onClick={closeModal} />
                    </div>
                </div>
                <div className="info-modal__body-content">
                    The term compliance is reports completed by companies to comply with laws and regulations set by government bodies. Compliance reports are reports which have a detailed.
                    The term compliance is reports completed by companies to comply with laws and regulations set by government bodies. Compliance reports are reports which have a detailed.
                    <br />
                    The term compliance is reports completed by companies to comply with laws and regulations set by government bodies. Compliance reports are reports which have a detailed.
                    <br />
                    The term compliance is reports completed by companies to comply with laws and regulations set by government bodies. Compliance reports are reports which have a detailed.
                    <br />
                    The term compliance is reports completed by companies to comply with laws and regulations set by government bodies. Compliance reports are reports which have a detailed.
                </div>
                <div className="info-modal__foot">
                    <div className="info-modal__button" onClick={closeModal}>Got it</div>
                </div>
            </div>
        </div>
    )
}

export default InfoModal;
