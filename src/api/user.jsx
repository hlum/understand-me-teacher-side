/**
 * UserデータをLollipopサーバーに保存する(新規ユーザーのみ）
 * @param {string} id - Firebase AuthのUUID
 * @param {string} email - Email アドレス
 * @param {string} photoURL - Profile写真
 * @param {string} apiKey - 教師専用のAPIKEY
 */

const saveUser = async (id,email, photoURL, apiKey) => {
    const endpoint = `${import.meta.env.VITE_API_ENDPOINT}//user/register_teacher.php`;
    try {
        const body = JSON.stringify({
            id: id,
            email: email,
            role: 'teacher',
            photoURL: photoURL
        })
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: body
        })

        const result = await response.json();

        if(result.status === 'success') {
            console.log('User保存成功。')
        } else {
            console.error('User保存失敗。詳細：', result.message);
        }
    } catch (error) {
        console.error('ユーザー保存に失敗しました。', error);
        throw error;
    }
}

/**
 * Userのデータがすでに保存されているかどうか
 * @param {string} userID - UserのAuthDataのUUID
 * @returns {Promise<boolean>} - 既存のユーザーデータがあるかどうか
 */
const userAlreadyExistsInDB = async (userID) => {
    const baseURL = `${import.meta.env.VITE_API_ENDPOINT}/user/get_user.php`;
    const API_KEY = import.meta.env.VITE_API_KEY;
    // Query params
    const params = new URLSearchParams({ id: userID});
    const endpoint = `${baseURL}?${params.toString()}`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': API_KEY
            }
        })

        const result = await response.json();
        return result.status === 'success' && result.data;

    }catch (error) {
        console.error('ユーザーが既に保存されているかのチェックに失敗。詳細：', error);
        return false;
    }
}


export { saveUser , userAlreadyExistsInDB };