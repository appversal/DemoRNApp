import EncryptedStorage from "react-native-encrypted-storage"

export const verifyAccount = async (account_id: string, app_id: string) => {
    try{
        await EncryptedStorage.setItem('app_id', app_id);
        const response = await fetch('https://backend.appstorys.com/api/v1/admins/validate-account/',{
            method: 'POST',
            body: JSON.stringify({
                account_id,
                app_id
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        if (response.ok){
            const data = await response.json()
            const { access_token, refresh_token } = data

            if(access_token && refresh_token){
                await EncryptedStorage.setItem('access_token', access_token)
                await EncryptedStorage.setItem('refresh_token', refresh_token)
            }
        };

    } catch (error) {
        console.log(error)
    }
};