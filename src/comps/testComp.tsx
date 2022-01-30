import React, {useContext} from "react";


const TestComp: React.FC<any> = (props) => {
    return <div className="">
        {String(window.location)}
    </div>
};

export default TestComp;