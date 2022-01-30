import React, {useCallback, useContext, useEffect, useState} from "react";
import apiService from "../../utils/apiRequest";
import {LangContext} from "../app/app";
import {useNavigate} from "react-router";
import backIcon from '../../img/arrow-back-icon.svg'
import menuIcon from '../../img/menu-icon.svg'
import moneyIcon from '../../img/arrow-forward-icon.svg'
import $ from 'jquery'
import './payment_ui.js'

const PaymentPage: React.FC<any> = ({paymentProps, setParams}) => {

    const urlParam = new URLSearchParams(window.location.search);
    const context = useContext(LangContext);
    const token = urlParam.get('token_key');
    const {lang, langKit, setPaymentProps} = context;
    const pay_id = urlParam.get('pay_id');
    const navigate = useNavigate();
    const svc = paymentProps ? paymentProps[pay_id] : null;

    console.log('render payment')
    console.log(svc, paymentProps);




    // @ts-ignore
    const jqueryCode = () => {
        $(".mask-input").each(function (i, b) {
            // console.log(b, i);
            // console.log('jquery!')
            if (!$(b).hasClass("dropdown")) {
                (function (b) {
                    if (i == 0) {
                        $(b).addClass('selected');
                    }
                    b.onclick = function (e) {
                        $(".mask-input.selected").each(function (_, el) {
                            $(el).removeClass('selected');
                        })
                        $(b).addClass('selected');
                    }
                    var mask = b.getAttribute("data-placeholder");
                    var optional = 0;
                    var masked = false;
                    // @ts-ignore
                    for (var c in mask) {
                        c = mask[c];
                        switch (c) {
                            case "[":
                                masked = true;
                                break;
                            case "]":
                                masked = false;
                                break;
                            default:
                                if (!masked) {
                                    b.innerHTML += "<m>" + c + "</m>"
                                } else {
                                    // @ts-ignore
                                    if (c == 9) {
                                        optional++;
                                    }
                                    b.innerHTML += "<c data-mask=" + c + " class=empty>" + c + "</c>"
                                }
                                // @ts-ignore
                                b.value = c;
                        }
                    }
                    // @ts-ignore
                    b.position = 0;
                    // @ts-ignore
                    b.chars = b.querySelectorAll("c");
                    // @ts-ignore
                    b.onkey = function (key) {
                        // console.log(b, this);
                        // @ts-ignore

                        if (key != 'C' && b.position < b.chars.length) {
                            // @ts-ignore
                            b.chars[b.position].innerHTML = key;
                            // @ts-ignore
                            b.chars[b.position].className = 'ok';
                            // @ts-ignore
                            b.position++;
                            // @ts-ignore
                        } else if (key == 'C' && b.position > 0) {
                            // @ts-ignore
                            b.position--;
                            // @ts-ignore
                            b.chars[b.position].innerHTML = b.chars[b.position].getAttribute("data-mask");
                            // @ts-ignore
                            b.chars[b.position].className = 'empty';
                        }
                        // @ts-ignore
                        if (b.position >= (b.chars.length - optional)) {
                            b.className = "mask-input selected done";

                            if (document.querySelectorAll(".mask-input").length == document.querySelectorAll(".mask-input.done").length) {
                                // @ts-ignore
                                document.querySelector('.continue').style.display = 'block';
                            }
                        } else {
                            // @ts-ignore
                            document.querySelector('.continue').style.display = 'none';
                            b.className = "mask-input selected";
                        }
                    }
                })(b);
            } else {
                (function (b) {
                    b.onclick = function (e) {
                        $(".mask-input.selected").each(function (_, el) {
                            $(el).removeClass('selected');
                        })
                        $(b).addClass('selected');
                    }
                    $(b).find(".value").click(function (v) {
                        // console.log($(b).find(".text"))
                        $(b).find(".text").data('value', $(this).data('value'));
                        $(b).find(".text").text($(this).text());

                        v.stopPropagation();
                        if (document.querySelectorAll(".mask-input").length == document.querySelectorAll(".mask-input.done").length) {
                            // @ts-ignore
                            document.querySelector('.continue').style.display = 'block';
                        }
                        $(b).removeClass('selected').addClass('done');
                        $(b).next().addClass('selected');
                        return false;
                    })
                })(b);
            }
        });

        $(".digit-button").each(function (_, b) {
            b.onclick = function () {
                // @ts-ignore
                document.querySelector(".mask-input.selected").onkey($(b).data("key"));
                return false;
            }
        });
        // @ts-ignore
        document.querySelector('.continue').onclick = function (e) {
            // @ts-ignore
            var params = [];
            var i = 0;
            $(".mask-input.done").each(function (_, t) {
                var text = '';
                if (!$(t).hasClass("dropdown")) {
                    for (var c in t.children) {
                        if (!t.children.hasOwnProperty(c))
                            continue;
                        // @ts-ignore
                        c = t.children[c]
                        // @ts-ignore
                        if (c.className == 'ok') {
                            // @ts-ignore
                            text += c.innerHTML;
                        }
                    }
                } else {
                    text = $(t).data('value');
                }
                params.push({name: $(t).data("name"), value: text});
                i++;
            })
            // @ts-ignore
            console.log('params', params);
            // @ts-ignore
            setParams(params);
            var continueLink = '/send_payment?token_key=' + token + '&pay_id=' + pay_id + '&params=';
            // @ts-ignore
            // window.location = continueLink + encodeURIComponent(JSON.stringify(params));
            navigate(continueLink + encodeURIComponent(JSON.stringify(params)));
        }
    }

    useEffect(()=>{
        if(svc) {
            console.log('svc Hook', svc)
            jqueryCode();
            // console.log(svc.parameters)

        }
    }, [svc]);



    if(!svc) {
        apiService.paymentRequest(lang, token, pay_id).then(res => {
            console.log('custom set!!!')
            setPaymentProps({...paymentProps, [pay_id]: res})
        });
    }

    if(!svc) return null;

    return <>
        <div className="enter-payment-info">

            <div className="enter-payment-info__left">
                {svc && svc.parameters.map((paramsObj: { display_name: string, is_required: number }, index: number) => {
                        if (paramsObj.is_required === 0) {
                            return null;
                        } else {
                            return <div key={index} className="input-title">{paramsObj.display_name}</div>
                        }
                    }
                )}
                <div className="payment-purpose">
                    <div className="title">Your payment</div>
                    <button className={`payment-button button-centered ${svc.color}`} disabled>
                        <img src={svc.logo} alt={svc.name}/></button>
                </div>
            </div>

            <div className="enter-area">
                {svc && svc.parameters.map((paramsObj: any, index: number) => {
                    if (paramsObj.is_required === 0) {
                        return null;
                    } else {
                        if (!!paramsObj.allowed_values.length) {
                            return <div key={index} className="mask-input dropdown" data-placeholder={paramsObj.mask}
                                        data-name={paramsObj.name}>
                                <span className="text">-- Click to select --</span>
                                <div key={index}>
                                    {paramsObj.allowed_values.map((value: any) => {
                                        return <div className="value" data-value={value.value}>{value.name}</div>
                                    })}
                                </div>
                            </div>
                        } else {
                            return <div key={index} className="mask-input" data-placeholder={paramsObj.mask}
                                        data-name={paramsObj.name}></div>
                        }
                    }
                })}
                <div className="digits-grid">
                    <button className="digit-button" data-key="1"><span>1</span></button>
                    <button className="digit-button" data-key="2"><span>2</span></button>
                    <button className="digit-button" data-key="3"><span>3</span></button>
                    <button className="digit-button" data-key="4"><span>4</span></button>
                    <button className="digit-button" data-key="5"><span>5</span></button>
                    <button className="digit-button" data-key="6"><span>6</span></button>
                    <button className="digit-button" data-key="7"><span>7</span></button>
                    <button className="digit-button" data-key="8"><span>8</span></button>
                    <button className="digit-button" data-key="9"><span>9</span></button>
                    <button className="digit-button green" data-key="C"><span>C</span></button>
                    <button className="digit-button" data-key="0"><span>0</span></button>
                    {/*<button class="digit-button"><span>.</span></button>*/}
                </div>
            </div>
            <div className="tools-panel">
                <div className="tools-panel__left">
                    <button className="tool-button menu-color" onClick={() => {
                        navigate(-1)
                    }}>
                        <img src={backIcon} alt="money"/>
                        <span className="title">Back</span>
                    </button>
                    <button className="tool-button menu-color"
                            onClick={() => navigate('/' + '?token_key=' + token)}>
                        <img src={menuIcon} alt="money"/>
                        <span className="title">Menu</span>
                    </button>

                </div>

                <div className="tools-panel__right">
                    <button className="tool-button confirm-color continue" style={{display: 'none'}}>
                        <img src={moneyIcon} alt="money"/>
                        <span className="title">Continue</span>
                    </button>
                </div>
            </div>
        </div>
        <script>

        </script>
        <script src="./payment_ui.js"></script>
    </>
};

export default PaymentPage;