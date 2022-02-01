import React, {useContext, useEffect, useState} from "react";
import apiService from "../../utils/apiRequest";
import {LangContext} from "../app/app";
import {useNavigate} from "react-router";
import backIcon from '../../img/arrow-back-icon.svg'
import menuIcon from '../../img/menu-icon.svg'
import $ from "jquery";
import apiRequest from "../../utils/apiRequest";
import moneyIcon from "../../img/arrow-forward-icon.svg";
import ToolPanel from "../toolPanel/toolPanel";


const InsertCoinPage: React.FC<any> = ({coinProps}) => {


    const HOST = process.env.REACT_APP_API_HOST;
    const context = useContext(LangContext);
    const {lang, langKit, paymentProps, setPaymentProps} = context;
    // console.log(langKit);
    const {data} = coinProps;
    // const {inserted_amount,entered_amount,service_warning_head, service_warning_text,service_charge,service_accepted} = coinProps;
    const navigate = useNavigate();
    const {inserted_amount, entered_amount, service_warning_head, service_warning_text, service_charge, service_accepted} = langKit

    // let svc = null;
    // let token: string;
    // let pay_id: string;
    // const navigate = useNavigate();
    //
    const urlParam = new URLSearchParams(window.location.search);
    // pay_id = urlParam.get('pay_id');
    const token = urlParam.get('token_key');
    // const transaction_code = urlParam.get('transaction_code');

    console.log('insertCoinProps', coinProps)


    const jqueryCode = () => {
        var refreshInterval = 1000;
        var errorInterval = 10000;
        var httpTimeout = 10000;

        function poll() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', window.location + "&json=1");
            xhr.timeout = httpTimeout;
            xhr.send();
            xhr.onload = function () {
                if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
                    document.querySelector(".status_text p").innerHTML = "ERROR " + xhr.status + ": " + xhr.statusText + ", retrying in 10 seconds";
                    document.querySelector(".status_text .loader").className = 'loader off';
                    setTimeout(poll, errorInterval);
                } else { // если всё прошло гладко, выводим результат
                    console.log(xhr.response);
                    var resp = JSON.parse(xhr.response);

                    if (resp.status == 'OPERATION_PARAMS_FAILED') {
                        history.back();
                        return;
                    }

                    document.querySelector(".status_text p").innerHTML = resp.status_text;
                    document.querySelector(".money").innerHTML = resp.money.money;
                    document.querySelector(".sum").innerHTML = resp.money.sum;
                    document.querySelector(".commission").innerHTML = resp.money.commission;
                    document.querySelector(".status_text .loader").className = 'loader off';
                    setTimeout(poll, refreshInterval);
                }
            };
            // @ts-ignore
            xhr.timeout = function () {
                document.querySelector(".status_text p").innerHTML = "Request error, retrying in 10 seconds";
                document.querySelector(".status_text .loader").className = 'loader off';
                setTimeout(poll, errorInterval);
                return false;
            };
            xhr.onerror = function () {
                document.querySelector(".status_text p").innerHTML = "Request error, retrying in 10 seconds";
                document.querySelector(".status_text .loader").className = 'loader off';
                setTimeout(poll, errorInterval);
                return false;
            };
            document.querySelector(".status_text .loader").className = 'loader on';
        }

        setTimeout(poll, refreshInterval)
    }

    useEffect(() => {
        jqueryCode()
    })


    return <div className="main">
        <div className="container">

            <div className="enter-payment-info">
                <div className="enter-payment-info__left">
                </div>

                {/*<check if="{{ @_GET.vertical }}">*/}
                {/*    <false>*/}
                {/*        <div className="enter-payment-info__left">*/}
                {/*            <!--leave it empty-->*/}
                {/*        </div>*/}
                {/*    </false>*/}
                {/*</check>*/}

                <div className="enter-area">
                    <div className="insert-money__frame">
                        <div className="personal-account">{data.data.params ? data.data.params.account : ''}</div>

                        <div className="amount-table">
                            <div className="row main-row">
                                <div className="cell">{inserted_amount}</div>
                                <div className="cell money">{data.data.money.money}</div>
                            </div>
                            <div className="row">
                                <div className="cell">{entered_amount}</div>
                                <div className="cell sum">{data.data.money.sum}</div>
                            </div>
                            <div className="row">
                                <div className="cell">{service_charge}</div>
                                <div className="cell commission">{data.data.money.commission}</div>
                            </div>
                        </div>

                        <div className="service-charge-icon">
                            <div className="icon">%</div>
                            <div className="title">{service_charge}</div>
                        </div>

                        <div className="message status_text" style={{position: 'relative'}}>
                            <div className="loader">
                                <div className="loader__element"></div>
                            </div>
                            <p>{data.data.status_text}</p>
                        </div>

                        <div className="warning">
                            <div className="icon">!</div>
                            <div className="title">
                                <div>{service_warning_head}</div>
                                <div>{service_warning_text}</div>
                            </div>
                        </div>

                        <p className="text-center pt-10">{service_accepted}</p>
                    </div>
                </div>

                <div className="enter-payment-info__right">

                </div>

            </div>


        </div>

        <ToolPanel rightPanelEnable={false}/>
    </div>
};

export default InsertCoinPage;