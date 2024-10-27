import EncryptedStorage from "react-native-encrypted-storage";

export const trackScreen = async (app_id: string, screen_name: string, ) => {
    try{
        const access_token = await EncryptedStorage.getItem('access_token');
        if (!access_token) {
            throw new Error('Access token not found');
        }
        const response = await fetch('https://backend.appstorys.com/api/v1/users/track-screen/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify({
                app_id,
                screen_name
            }),
        });
        if(!response.ok){
            throw new Error('Something went wrong');
        }
        const data = await response.json();
        return data.campaigns || [];
    } catch (error) {
        console.error('Error in trackScreen', error);
        return [];
    };
};