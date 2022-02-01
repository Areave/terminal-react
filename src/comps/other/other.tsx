import React, {useContext, useEffect, useState} from "react";
import apiService from "../../utils/apiRequest";
import {LangContext} from "../app/app";
import {useNavigate} from "react-router";
import backIcon from '../../img/arrow-back-icon.svg'
import menuIcon from '../../img/menu-icon.svg'
import moneyIcon from '../../img/arrow-forward-icon.svg'


const OtherPage: React.FC<any> = ({otherProps}) => {

    const urlParam = new URLSearchParams(window.location.search);
    const context = useContext(LangContext);
    const token = urlParam.get('token_key');
    const {langKit, isVertical} = context;
    const id = urlParam.get('d');
    const navigate = useNavigate();
    const svc = otherProps ? otherProps['OTHER'] : null;
    console.log(svc);

    if (!svc) return <div></div>;

    return <div className="main">
        <div className="container">
            <div className="buttons-grid">
                <div className="buttons-grid__row">
                    {svc && svc.map((el: any, index: number) => {
                        const params = 'id=' + el.id + '&';
                        const pathToNavigate = '/' + 'inner' + '?' + params + 'vertical=' + isVertical + '&token_key=' + token;
                        return <div key={index} className="buttons-grid__col buttons-grid__col-3">
                            <button className={`payment-button ${el.color}`}
                                    onClick={() => navigate(pathToNavigate)}>
                                <img src={el.logo} alt="internet"/>
                                <span className="title">{el.name}</span>
                            </button>
                        </div>
                    })}
                </div>
            </div>

        </div>
        <div className="tools-panel">
            <div className="tools-panel__left">
                <button className="tool-button menu-color" onClick={() => {
                    navigate(-1)
                }}>
                    <img src={backIcon} alt="money"/>
                    <span className="title">{langKit ? langKit.back : 'back'}</span>
                </button>
                <button className="tool-button menu-color"
                        onClick={() => navigate('/' + '?token_key=' + token)}>
                    <img src={menuIcon} alt="money"/>
                    <span className="title">{langKit ? langKit.menu : 'menu'}</span>
                </button>
            </div>
        </div>
    </div>
};

export default OtherPage;