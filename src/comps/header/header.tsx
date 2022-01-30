import React, {useContext} from "react";
// import './style.scss';
import {LangContext} from "../app/app";
import Logo from '../../img/logotypes/u-pay-text-logo.svg'
import cambodjiyaFlag from '../../img/flag-cambodia.svg';
import chinaFlag from '../../img/flag-china.svg';
import ukFlag from '../../img/flag-uk.svg';
import helpIco from '../../img/help-icon.svg';
import {useNavigate} from "react-router";
import token from "../../utils/token";
import apiService from "../../utils/apiRequest";


const Header: React.FC<any> = ({logo_phrase, hotline}) => {

    const context = useContext(LangContext);
    const {token} = context;
    const navigate = useNavigate();
    const {lang, setLang} = useContext(LangContext);
    let count = 0;
    console.log('render Header');
    let timeout: any;

    const counter = ()=>{
        timeout && clearTimeout(timeout);
        timeout = setTimeout(()=>{
            count = 0;
        }, 2000);
        count +=1;
        console.log(count);
        if (count === 5) {
            navigate('/service?token_key=' + token);
            apiService.serviceRequest(lang, token);
        }
    }

    return <header>
        <div className="container">
            <div className="header-inner">
                <div className="logotype-area">
                    <div className="logotype">
                        <img src={Logo} alt="u-pay"/>
                    </div>
                    <div dangerouslySetInnerHTML={{__html: logo_phrase}} className="logotype-phrase"
                         id="logotype-phrase">
                    </div>
                </div>
                <div className="switch-language">
                    {/*camboja*/}
                    <button className="lang ca" onClick={() => setLang('KH')}>
                        <span className="lang-flag"><img src={cambodjiyaFlag} alt="cambodia"/></span>
                        <span className="title">ប្រទេសកម្ពុជា</span>
                    </button>
                    {/*eng*/}
                    <button className="lang" onClick={() => setLang('EN')}>
                        <span className="lang-flag"><img src={ukFlag} alt="english"/></span>
                        <span className="title">English</span>
                    </button>
                    {/*china*/}
                        <button className="lang ch" onClick={() => {
                            setLang('CH');
                            counter();
                        }}>
                        <span className="lang-flag"><img src={chinaFlag} alt="chinese"/></span>
                        <span className="title">中国人</span>
                    </button>
                </div>
                <div className="phones-area">
                    <div className="phones">
                        {hotline}: <br/>
                        096 815 7388 <br/>
                        096 466 3333
                    </div>
                    <div className="help-icon">
                        <img src={helpIco} alt="chinese"/>
                        <div className="title">info</div>
                    </div>
                </div>
            </div>

        </div>
    </header>
};

export default Header;