const request = async (url: string, method: string, bodyContent?: any): Promise<any> => {
    try {
        let options: RequestInit = {
            method,
            credentials: 'include',
        };

        if (bodyContent instanceof FormData) {
            options.body = bodyContent;
        } else {
            options.headers = {
                'Content-Type': 'application/json'
            };
            options.body = JSON.stringify(bodyContent);
        }

        const response = await fetch(path + url, options);

        let sentResponse: {
            ok: boolean;
            status: number;
            message: string;
            data: any;
        } = {
            ok: response.ok,
            status: response.status,
            message: response.statusText,
            data: null
        };

        if (response.ok) {
            sentResponse.data = await response.json();
        } else {
            sentResponse.message = await response.text(); 
        }

        return sentResponse;
    } catch (error) {
        console.error('Request failed:', error);
        return {
            ok: false,
            status: 500,
            message: 'Error request',
            data: null
        };
    }
};

const path = 'http://localhost:6053/api';

export default request;