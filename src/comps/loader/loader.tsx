import React from 'react'
import './loader.scss'

const Loader: React.FC = () => {

    return <div className="main">
            <div className="container">
                <div className='loaderWrapper'>
                    <span className='round--loader'></span>
                </div>
            </div>
        </div>
}

export default Loader;