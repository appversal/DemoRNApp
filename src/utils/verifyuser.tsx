import EncryptedStorage from 'react-native-encrypted-storage';
import { UserData } from '../sdk';

interface Attributes {
    [key: string]: any;
}

export const verifyUser = async (user_id: string, campaigns: any[], attributes?: Attributes): Promise<UserData | undefined> => {
    try{
        if (!campaigns || campaigns.length == 0) {
            console.log('No campaigns found');
            return;
        }
        const app_id = await EncryptedStorage.getItem('app_id');
        const access_token = await EncryptedStorage.getItem('access_token');

        const bodyData: any = {
            user_id : user_id,
            app_id : app_id,
            campaign_list : campaigns,
        };

        if (attributes) {
            bodyData.attributes = attributes;
        }

        const response = await fetch('https://backend.appstorys.com/api/v1/users/track-user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify(bodyData),
        });

        if(!response.ok){
            console.error('Something went wrong');
        }
        const data = await response.json();
        user_id = data.user_id;
        campaigns = data.campaigns;

        return { user_id, campaigns };
        } catch (error) {
            console.error('Error in trackUser', error);
            return { user_id, campaigns };
        }
    };
