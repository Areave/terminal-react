import React, {useContext, useEffect, useState} from "react";
import apiService from "../../utils/apiRequest";
import {LangContext} from "../app/app";
import {useNavigate} from "react-router";
import backIcon from '../../img/arrow-back-icon.svg'
import menuIcon from '../../img/menu-icon.svg'

const ServicePage: React.FC<any> = ({props}) => {


    const context = useContext(LangContext);
    const {lang, langKit, paymentProps, setPaymentProps} = context;

    let svc = null;
    let token: string;
    let id: string;
    const navigate = useNavigate();

    return <>

    </>
};

export default ServicePage;