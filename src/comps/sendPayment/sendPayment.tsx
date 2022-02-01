import React, {useContext, useEffect, useState} from "react";
import apiService from "../../utils/apiRequest";
import {LangContext} from "../app/app";
import {useNavigate} from "react-router";
import backIcon from '../../img/arrow-back-icon.svg'
import menuIcon from '../../img/menu-icon.svg'
import $ from "jquery";
import apiRequest from "../../utils/apiRequest";

const SendPaymentPage: React.FC<any> = ({setCoinProps, params}) => {

    const HOST = process.env.REACT_APP_API_HOST;
    const context = useContext(LangContext);
    const {lang, langKit, paymentProps, setPaymentProps} = context;

    let svc = null;
    let token: string;
    let pay_id: string;
    const navigate = useNavigate();

    const urlParam = new URLSearchParams(window.location.search);
    pay_id = urlParam.get('pay_id');
    token = urlParam.get('token_key');
    apiRequest.paymentRequest(lang, token, pay_id).then(data => {
        console.log(params);
        apiRequest.trxRequest(token, {
            service: pay_id,
            url_ok: HOST + "/ok?transction_code=%transaction_code%&vertical=0",
            url_fail: HOST + "/fail?transction_code=%transaction_code%&vertical=0",
            currency: data.currency_id,
            sum: 0, // ????????????????????????????????????
            redirect: false,
            params: params,
            goods: []
        }).then(res => {
            console.log(res)
            if(res.data.status === 'OK') {
                apiRequest.insertCoinRequest(token, res.data.data.transaction_code).then(data => {
                    console.log(data)
                    setCoinProps(data)
                }).then(()=> {
                    const path = '/insert_coin?token_key=' + token + '&trx=' + res.data.data.transaction_code + '&vertical=0'
                    navigate(path)
                })

            }
        })
    })


    return <>

    </>
};

export default SendPaymentPage;