import {Types} from '../../utils/types'
import React, {useState, useEffect, createContext} from 'react'
import {BrowserRouter, Routes, Route,} from 'react-router-dom';
import MainPage from "../mainPage/mainPage";
import Header from "../header/header";
import apiService from '../../utils/apiRequest';
import InnerPage from "../inner/inner";
import PaymentPage from "../payment/payment";
import TestComp from "../testComp";
import OtherPage from "../other/other";
import ServicePage from "../service/service";
import SendPaymentPage from "../sendPayment/sendPayment";
import InsertCoinPage from '../insertCoin/insertCoin';

const LangContext = createContext(null);
export {LangContext}

const App: React.FC<any> = (props) => {


    const urlParam = new URLSearchParams(window.location.search);


    let [token, setToken] = useState(null);
    const [lang, setLang] = useState('KH');
    const [langs, setLangs] = useState(null);
    const [params, setParams] = useState(null);
    const [langKit, setLangKit] = useState(null);
    const [coinProps, setCoinProps] = useState(null);
    const [frontline, setFrontline] = useState(null);
    const [innerProps, setInnerProps] = useState(null);
    const [otherProps, setOtherProps] = useState(null);
    const [paymentProps, setPaymentProps] = useState(null);

    let isVertical: string;
    let terminalID: string;

    // console.log('start app', paymentProps);

    if (urlParam.has('vertical')) {
        isVertical = urlParam.get('vertical');
    } else {
        isVertical = '0';
    }


    if (!token) {
        if (urlParam.has('token_key')) {
            // console.log('set token')
            setToken(urlParam.get('token_key'));
        } else {
            // console.log('ask token')
            apiService.authRequest.then(sid => {
                // console.log('set token', sid)
                setToken(sid);

            });
        }
    }


    const fillFrontlineProps = () => {

        let paymentIds: Array<string> = [];
        let otherIds: Array<string> = [];
        let innerIds: Array<string> = [];

        frontline.forEach((ar: Array<{ page: string, id: number, params?: { pay_id: string } }>) => {
            ar.forEach(obj => {
                if (obj.page === 'inner') {
                    innerIds.push('' + obj.id)
                }
                if (obj.page === 'payment') {
                    paymentIds.push('' + obj.params.pay_id)
                }
                if (obj.page === 'other') {
                    otherIds.push('' + obj.id)
                }
            })
        })

        let tempInnerProps = {};
        innerIds.forEach((id, index) => {
            apiService.svcRequest(lang, token, id).then(res => {
                tempInnerProps = {...tempInnerProps, [id]: res};
                if (Object.keys(tempInnerProps).length === innerIds.length) {
                    setInnerProps(tempInnerProps);
                }
            });
        });

        let tempPaymentProps = {};
        paymentIds.forEach((pay_id, index) => {
            // if(paymentProps[pay_id]) {continue};
            apiService.paymentRequest(lang, token, pay_id).then(res => {
                tempPaymentProps = {...tempPaymentProps, [pay_id]: res};
                if (Object.keys(tempPaymentProps).length === paymentIds.length) {
                    setPaymentProps(tempPaymentProps);
                }
            });
        });

        let tempOtherProps = {};
        otherIds.forEach((id, index) => {
            apiService.otherRequest(token).then(res => {
                tempOtherProps = {...tempOtherProps, [id]: res};
                if (Object.keys(tempOtherProps).length === otherIds.length) {
                    setOtherProps(tempOtherProps);
                }
            });
        });
    }

    const fillLangs = () => {
        let langsAr = {};
        ['KH', 'EN', 'CH'].forEach(lang => {
            apiService.langsRequest(lang, token).then(res => {
                langsAr = {...langsAr, [lang]: res};
                if (Object.keys(langsAr).length === 3) {
                    setLangs(langsAr);
                }
            });
        });
    }

    useEffect(() => {
        if (token) {
            console.log('token UE')
            apiService.frontlineRequest(lang, token).then(frontline => setFrontline(frontline));
            fillLangs();
        }
    }, [token, lang]);

    // useEffect(() => {
    //     if (frontline) {
    //         console.log('frontline UE')
    //         fillFrontlineProps();
    //     }
    // }, [frontline]);

    useEffect(() => {
        if (langs) {
            console.log('langs UE')
            setLangKit(langs[lang])
        }
    }, [lang, langs]);

    useEffect(() => {
        if (frontline) {
            console.log('frontline UE')
            fillFrontlineProps();
        }
    }, [frontline]);

    return <LangContext.Provider value={{lang, setLang, token, langKit, paymentProps, setPaymentProps, isVertical}}>
        <BrowserRouter>
            <Header logo_phrase={langKit?.logo_phrase || 'raw'} hotline={langKit?.hotline || 'hotline'}/>
            <Routes>
                <Route path='/' element={<MainPage fillFrontlineProps={fillFrontlineProps} frontline={frontline}/>}/>
                <Route path='/inner' element={<InnerPage innerProps={innerProps}/>}/>
                <Route path='/other' element={<OtherPage otherProps={otherProps}/>}/>
                <Route path='/payment' element={<PaymentPage paymentProps={paymentProps} setCoinProps={setCoinProps}/>}/>
                <Route path='/service' element={<ServicePage props={props}/>}/>
                <Route path='/send_payment' element={<SendPaymentPage params={params} setCoinProps={setCoinProps}/>}/>
                <Route path='/insert_coin' element={<InsertCoinPage coinProps={coinProps}/>}/>
                <Route path='/*' element={<TestComp/>}/>
            </Routes>

        </BrowserRouter>
    </LangContext.Provider>

};


export default App;