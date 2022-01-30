import React, {useContext, useEffect, useState} from "react";
import apiService from "../../utils/apiRequest";
import {LangContext} from "../app/app";
import {useNavigate} from "react-router";
import backIcon from '../../img/arrow-back-icon.svg'
import menuIcon from '../../img/menu-icon.svg'
import $ from "jquery";

const InnerPage: React.FC<any> = ({innerProps}) => {

    console.log('innerProps', innerProps)


    const context = useContext(LangContext);
    const {lang, langKit, paymentProps, setPaymentProps, isVertical} = context;

    const urlParam = new URLSearchParams(window.location.search);
    let svc = null;
    let token: string = urlParam.get('token_key');;
    let id: string = urlParam.get('id');;
    const navigate = useNavigate();

    if(!innerProps) return null;

    if (innerProps) {
        // if (innerProps[id]) {
        //     svc = innerProps[id];
        // } else {
        //
        // }
        svc = innerProps[id];

        if(!svc) return null;

        // console.log(svc)
        let extraPaymentIds: Array<any> = [];


        Object.keys(svc).forEach(pay_id => {
            if(paymentProps) {
                if(!paymentProps[pay_id]) {
                    extraPaymentIds.push(pay_id);
                } else if (paymentProps[pay_id]) {
                    // console.log('here!', pay_id)
                }
            }

        })
        // console.log(extraPaymentIds)

        let extraPaymentProps: Object = {}
        extraPaymentIds.forEach(pay_id => {
            apiService.paymentRequest(lang, token, pay_id,).then(res => {
                extraPaymentProps = {...extraPaymentProps, [pay_id]: res}

                if(Object.keys(extraPaymentProps).length === extraPaymentIds.length) {
                    // console.log('set paymentsProps! add', extraPaymentProps, paymentProps)
                    setPaymentProps({...paymentProps, ...extraPaymentProps})
                }

            })
        })
    }




    return <>
        <div>
            <div className="buttons-grid">
                <div className="buttons-grid__row">
                    {svc && Object.values(svc).map((obj: { color: string, id: number, name: string, logo: string }, index: number) => {
                        return <div key={index} className="buttons-grid__col buttons-grid__col-6">
                            <button className={'payment-button button-centered ' + obj.color}
                                    onClick={() => navigate('/payment?pay_id=' + obj.id + '&id=' + id + '&vertical=' + isVertical + '&token_key=' + token)}>
                                <img src={obj.logo} alt={obj.name}/></button>
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
    </>
};

export default InnerPage;