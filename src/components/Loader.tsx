import ReactLoading from 'react-loading';
import '../css/Loader.scss'

const Loader = () => {
    return (
        <div className='loader-container'><ReactLoading type='spokes' color='black' height={'10%'} width={'10%'} /></div>
    )
}

export default Loader;