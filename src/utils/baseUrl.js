export function baseUrl() {
  return "https://patent1.oss-cn-shenzhen.aliyuncs.com/"
  // return "https://x-patent.oss-cn-shenzhen.aliyuncs.com/"
}

export function uploadFileUrl(){
  // const baseUrl = "http://120.76.247.78:8781"
  const baseUrl  = "http://8.129.8.125:8080"
  return baseUrl+"/api/v1/file/upload_file"
}