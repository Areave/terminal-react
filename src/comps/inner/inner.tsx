import React, {useContext, useEffect, useState} from "react";
import ToolPanel from "../toolPanel/toolPanel";
import PaymentButton from "../paymentButton/paymentButton";

const InnerPage: React.FC<any> = ({innerProps}) => {

    const urlParam = new URLSearchParams(window.location.search);
    let id: string = urlParam.get('id');

    if (!innerProps) {
        return null
    }

    const svc = innerProps[id];

    return <div className="main">
        <div className="container">
            <div>
                <div className="buttons-grid">
                    <div className="buttons-grid__row">
                        {svc && Object.values(svc).map((paymentObject: { color: string, id: number, name: string, logo: string }, index: number) => {
                            return <div key={index} className="buttons-grid__col buttons-grid__col-6">
                                <PaymentButton paymentObject={paymentObject} parentId={id}/>
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <ToolPanel rightPanelEnable={false}/>
        </div>
    </div>
};

export default InnerPage;