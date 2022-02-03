import React, {useContext} from "react";
import {useNavigate} from "react-router";
import {LangContext} from '../app/app'
import Loader from "../loader/loader";



const PaymentButton: React.FC<any> = ({parentId, paymentObject}) => {

    const context = useContext(LangContext)
    const urlParam = new URLSearchParams(window.location.search);


    let token: string;
    if (urlParam.has('token_key')) {
        token = urlParam.get('token_key');
    } else {
        token = context.token;
    }
    let isVertical: string;
    if (urlParam.has('vertical')) {
        isVertical = urlParam.get('vertical');
    } else {
        isVertical = context.isVertical;
    }

    if (!paymentObject) return <Loader></Loader>;

    const navigate = useNavigate();
    const parentIdParam = parentId ? '&id=' + parentId : '';
    const payId = paymentObject.params ? paymentObject.params.pay_id : paymentObject.id;
    const pathToNavigate = '/payment?pay_id=' + payId + parentIdParam + '&vertical=' + isVertical + '&token_key=' + token;

    return <button className={'payment-button button-centered ' + paymentObject.color}
                   // disabled={paymentObject.enabled ? !paymentObject.enabled : false}
                   disabled={true}
                   onClick={() => navigate(pathToNavigate)}>
        <img src={paymentObject.logo} alt={paymentObject.name}/></button>
};

export default PaymentButton;