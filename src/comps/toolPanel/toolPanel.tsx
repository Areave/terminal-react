import React, {useContext, useEffect, useState} from "react";
import apiService from "../../utils/apiRequest";
import {LangContext} from "../app/app";
import {useNavigate} from "react-router";
import backIcon from '../../img/arrow-back-icon.svg'
import menuIcon from '../../img/menu-icon.svg'
import moneyIcon from '../../img/arrow-forward-icon.svg'


const ToolPanel: React.FC<any> = ({rightPanelEnable}) => {

    const urlParam = new URLSearchParams(window.location.search);
    const context = useContext(LangContext);
    const token = urlParam.get('token_key');
    const {langKit} = context;
    const pay_id = urlParam.get('pay_id');
    const navigate = useNavigate();
    // const svc = paymentProps ? paymentProps[pay_id] : null;
    // console.log(svc);


    return <div className="tools-panel">
        <div className="tools-panel__left">
            <button className="tool-button menu-color" onClick={() => {
                navigate(-1)
            }}>
                <img src={backIcon} alt="money"/>
                <span className="title">{langKit ? langKit.back : 'Back'}</span>
            </button>
            <button className="tool-button menu-color"
                    onClick={() => navigate('/' + '?token_key=' + token)}>
                <img src={menuIcon} alt="money"/>
                <span className="title">{langKit ? langKit.menu : 'Menu'}</span>
            </button>
        </div>

        {rightPanelEnable && <div className="tools-panel__right">
            <button className="tool-button confirm-color continue" style={{display: 'none'}}>
                <img src={moneyIcon} alt="money"/>
                <span className="title">{langKit ? langKit.continue : 'Continue'}</span>
            </button>
        </div>}

    </div>

};

export default ToolPanel;