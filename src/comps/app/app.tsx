import {Types} from '../../utils/types'
import React, {useState, useEffect, createContext, useRef} from 'react'
import {BrowserRouter, Routes, Route,} from 'react-router-dom';
import MainPage from "../mainPage/mainPage";
import Header from "../header/header";
import apiService from '../../utils/apiRequest';
import InnerPage from "../inner/inner";
import PaymentPage from "../payment/payment";
import TestComp from "../testComp";
import OtherPage from "../other/other";
import ServicePage from "../service/service";
import InsertCoinPage from '../insertCoin/insertCoin';
import KioskNumberPage from '../kioskNumber/kioskNumber';

const LangContext = createContext(null);
export {LangContext}

const App: React.FC<any> = (props) => {


    const urlParam = new URLSearchParams(window.location.search);


    let [token, setToken] = useState(null);
    const [lang, setLang] = useState('KH');
    const [langs, setLangs] = useState(null);
    const [params, setParams] = useState(null);
    const [langKit, setLangKit] = useState(null);
    const [kioskNumber, setKioskNumber] = useState(null);
    const [coinProps, setCoinProps] = useState(null);
    const [frontline, setFrontline] = useState(null);
    const [innerProps, setInnerProps] = useState(null);
    const [otherProps, setOtherProps] = useState(null);
    const [paymentProps, setPaymentProps] = useState(null);

    let isVertical: string;
    if (urlParam.has('vertical')) {
        isVertical = urlParam.get('vertical');
    } else {
        isVertical = '0';
    }

    useEffect(() => {
        if (!token) {
            if (urlParam.has('token_key')) {
                setToken(urlParam.get('token_key'));
            } else {
                apiService.authRequest.then(sid => {
                    setToken(sid);
                });
            }
        }
    }, [])

    useEffect(() => {
        console.log('token heere hook')
        if (token) {
            apiService.statusRequest(lang, token).then((data: any) => {
                if (data.data.data.active) {
                    setKioskNumber(data.data.data.kiosk);
                    apiService.frontlineRequest(lang, token).then(frontline => {
                        setFrontline(frontline);
                        fillFrontlineProps(frontline);
                        if (!langs) {
                            fillLangs();
                        }
                    })
                } else {
                    console.log('error!')
                }
            });
        }
    }, [token, langKit]);

    useEffect(()=>{
        if (langs) {
            setLangKit(langs[lang])
        }
    }, [langs]);

    const fillFrontlineProps = (frontline: any) => {

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
        innerIds.forEach((id: string) => {
            apiService.svcRequest(lang, token, id).then(res => {
                tempInnerProps = {...tempInnerProps, [id]: res};
                if (Object.keys(tempInnerProps).length === innerIds.length) {
                    setInnerProps(tempInnerProps);
                }
            });
        });

        let tempOtherProps = {};
        otherIds.forEach((id) => {
            apiService.otherRequest(token).then(res => {
                tempOtherProps = {...tempOtherProps, [id]: res};
                if (Object.keys(tempOtherProps).length === otherIds.length) {
                    let paymentProps = {};
                    const otherArrayOfObjects = Object.values(tempOtherProps)
                    const otherArray = otherArrayOfObjects[0];
                    // @ts-ignore
                    otherArray.forEach(obj => {
                        const services = obj.services
                        if (!services) {
                            return
                        }
                        services.forEach((service: any) => {
                            paymentProps = {...paymentProps, [service.id]: service}
                        })
                        setPaymentProps(paymentProps);
                    })
                    setOtherProps(tempOtherProps);
                }
            });
        });
    }

    const fillLangs = () => {
        let langsStore = {};
        ['KH', 'EN', 'CH'].forEach(lang => {
            apiService.langsRequest(lang, token).then(res => {
                langsStore = {...langsStore, [lang]: res};
                if (Object.keys(langsStore).length === 3) {
                    // console.log(langsStore)
                    setLangs(langsStore);

                }
            });
        });
    }

    const changeLanguage = (lang: string) => {
        setLang(lang);
        if (langs) {
            setLangKit(langs[lang])
        }
    }

    return <LangContext.Provider value={{lang, setLang, token, langKit, paymentProps, setPaymentProps, isVertical}}>
        <BrowserRouter>
            <Header changeLanguage={changeLanguage} logo_phrase={langKit?.logo_phrase || 'raw'} hotline={langKit?.hotline || 'hotline'}/>
            <Routes>
                <Route path='/' element={<MainPage frontline={frontline}/>}/>
                <Route path='/inner' element={<InnerPage innerProps={innerProps}/>}/>
                <Route path='/other' element={<OtherPage otherProps={otherProps}/>}/>
                <Route path='/payment' element={<PaymentPage paymentProps={paymentProps} setCoinProps={setCoinProps}/>}/>
                <Route path='/service' element={<ServicePage props={props}/>}/>
                <Route path='/insert_coin' element={<InsertCoinPage coinProps={coinProps}/>}/>
                <Route path='/*' element={<TestComp/>}/>
            </Routes>
            {/*<KioskNumberPage kioskNumber={kioskNumber}/>*/}
        </BrowserRouter>
    </LangContext.Provider>
};


export default App;