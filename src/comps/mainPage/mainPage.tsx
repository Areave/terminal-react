import React, {useContext} from "react";
import {LangContext} from "../app/app";
import {useNavigate} from 'react-router-dom'
import PaymentButton from "../paymentButton/paymentButton";
import Loader from "../loader/loader";
import {object} from "prop-types";

const MainPage: React.FC<any> = ({frontline, fillFrontlineProps}) => {
    const context = useContext(LangContext);
    const {token, isVertical} = context;
    const navigate = useNavigate();

    // console.log(frontline)


    if (!frontline) return <Loader></Loader>;
    return <div className="main">
        <div className="container">
            <div className="buttons-grid">
                <div className="buttons-grid__row">
                    {frontline && frontline[0].map((object: any, index: number) => {
                            const params = object.params ? Object.entries(object.params).map(([key, value]) => key + '=' + value + '&') : '';
                            const pathToNavigate = '/' + object.page + '?' + params + 'vertical=' + isVertical + '&token_key=' + token;
                            const disabled = object.hasOwnProperty('enabled') ? !object.enabled : false;
                            return <div key={index} className="buttons-grid__col buttons-grid__col-3">
                                <button className={'payment-button ' + object.color}
                                        disabled={disabled}
                                        onClick={() => navigate(pathToNavigate)}>
                                    <img src={object.logo} alt="internet"/>
                                    <span className="title">{object.name}</span>
                                </button>
                            </div>
                        }
                    )}
                </div>

                <div className="buttons-grid__row">
                    <div className="buttons-grid__col buttons-grid__col-3">
                        {frontline && frontline[1].map((object: any, index: number) => {
                                const params = object.params ? Object.entries(object.params).map(([key, value]) => key + '=' + value + '&') : '';
                                const pathToNavigate = '/' + object.page + '?' + params + 'vertical=' + isVertical + '&token_key=' + token;
                                const disabled = object.hasOwnProperty('enabled') ? !object.enabled : false;
                                return <button key={index} className={'payment-button ' + object.color}
                                               disabled={disabled}
                                               onClick={() => navigate(pathToNavigate)}>
                                    <img src={object.logo} alt="internet"/>
                                    <span className="title">{object.name}</span>
                                </button>
                            }
                        )}
                    </div>

                    {frontline && frontline[2].map((data: any, index: number) => {
                            const params = data.params ? Object.entries(data.params).map(([key, value]) => key + '=' + value + '&') : '';
                            const pathToNavigate = '/' + data.page + '?' + params + 'vertical=' + isVertical + '&token_key=' + token;
                            return <div key={index} className="buttons-grid__col buttons-grid__col-3">
                                <button className={'payment-button button--large ' + data.color}
                                        onClick={() => navigate(pathToNavigate)}>
                                    <img src={data.logo} alt={data.name}/>
                                    <span className="title">{data.name}</span>
                                </button>
                            </div>
                        }
                    )}
                </div>

                <div className="buttons-grid__row">
                    {frontline && frontline[3].map((paymentObject: any, index: number) => {
                        // paymentObject.enabled = false;
                            return <div key={index} className="buttons-grid__col buttons-grid__col-6">
                                <PaymentButton paymentObject={paymentObject}/>
                            </div>
                        }
                    )}
                </div>
            </div>
        </div>
    </div>

};

export default MainPage;