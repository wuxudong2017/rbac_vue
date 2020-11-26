import Cookies from 'js-cookie'
const AdminToken = "EGG-SESSION"
export function getToken(){
    return  Cookies.get(AdminToken)
}
export function setToke(d){
    return Cookies.set(AdminToken,d)
}
export function removeToken(){
    return Cookies.remove(AdminToken)
}