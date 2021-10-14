export default function getAuthheader() {
    const key = window.sessionStorage.getItem('key');
    return {headers: {'Authorization': `Token ${JSON.parse(key).key}` }}
}