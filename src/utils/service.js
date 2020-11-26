let SERVICEURL ={}
if(process.env.NODE_ENV.toLowerCase()==="development"){
    SERVICEURL.api = "http://192.168.13.216:7001"
    // SERVICEURL.api = "https://yw.chinatiye.cn",
    // SERVICEURL.api = "http://192.168.17.109:7001",
    SERVICEURL.upload = 'http://192.168.17.82:9090'
}else{
    SERVICEURL.api = "https://yw.chinatiye.cn", // 在生产环境下的服务器地址
    SERVICEURL.upload = 'http://192.168.17.82:9090'

}
export default SERVICEURL