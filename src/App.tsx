import { useSelector } from 'react-redux';
import _ from 'lodash';
import './App.css';
import Performance from './components/performance/Performance';
import InfoModal from './components/infoModal/InfoModal';

function App() {
  const { openModal } = useSelector((state: { modalReducer: { openModal: boolean } }) => state.modalReducer);
  return (
    <div className='widget-app'>
      <Performance />
      {
        openModal && (
          <InfoModal />
        )
      }
    </div>
  )
}

export default App
