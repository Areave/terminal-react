import axios from 'axios';

const endPoint = process.env.REACT_APP_API_ENDPOINT;
const timeout = process.env.REACT_APP_API_TIMEOUT;

const getApiServiceInstance = () => {

    const axiosInstance = axios.create({});
    const axiosConfig: any = {
        timeout: timeout,
        header: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }

    const apiRequest = (route: string, token: string, data?: any) => {
        return axios.post(endPoint + route + '?sid=' + token, data, axiosConfig)
    }

    const authRequest = apiRequest('make_auth', '0', {login: "200_hoz", password: "200_hoz"})
            .then(res => res.data.data.session_key);


    const langsRequest = (lang: string, sid: string) => {
        return axios.post(endPoint + 'get_kiosk_translation' + '?sid=' + sid,
            {
                language: lang,
                keys: [
                    'logo_phrase',
                    'hotline',
                    'other',
                    'ok_msg',
                    'fail_msg',
                    'back',
                    'menu',
                    'inserted_amount',
                    'entered_amount',
                    'service_charge',
                    'service_charge',
                    'service_warning_head',
                    'service_warning_text',
                    'service_accepted',]
            }).then(res => res.data.data)
    }

    const frontlineRequest = (lang: string, token: string) => {
        return apiRequest('get_kiosk_frontline_services', token, {
            language: lang
        }).then((data: any) => data.data.data);
    }

    const svcRequest = (lang: string, token: string, id: string) => {
        return apiRequest('get_kiosk_services', token, {
            language: lang,
            category_id: id
        }).then((data: any) => {
            let newData: any = {};
            data.data.data.forEach((obj: { id: string }) => {
                let key = obj.id;
                newData[key] = obj;
            });
            return newData;
        })
    }

    const paymentRequest = (lang: string, token: string, pay_id: string) => {
        return apiRequest('get_kiosk_service_params', token, {
            language: lang,
            service: pay_id
        }).then(data => data.data.data[0]);
    }

    const otherRequest = (token: string) => {
        return apiRequest('get_kiosk_categories_and_services', token).then(data => data.data.data);
    }

    const serviceRequest = (lang: string, token: string) => {
        return apiRequest('open_terminal_collection', token, {
            language: lang
        })
    }

    const trxRequest = (token: string, data: any) => {
        return axios.post(endPoint + 'open_kiosk_transaction' + '?sid=' + token, data, axiosConfig)
    }

    const insertCoinRequest = (token: string, transaction_code: string) => {
        return apiRequest('get_kiosk_transaction_status', token, {transaction_code})
    };

    const statusRequest = (lang: string, token: string) => {
        return apiRequest('get_kiosk_status', token, {
            language: lang
        })
    };


    return {
        authRequest,
        langsRequest,
        frontlineRequest,
        svcRequest,
        paymentRequest,
        otherRequest,
        serviceRequest,
        trxRequest,
        insertCoinRequest,
        statusRequest
    }
}

export default getApiServiceInstance();