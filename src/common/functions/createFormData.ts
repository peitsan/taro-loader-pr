// 手动拼接FormData字符串，可自行补充修改
const boundary = `----WebKitFormBoundarynm3UoySB07YZETSw`;
export function createFormData(params) {
  let result = '';
  for (const i in params) {
    result += `\r\n--${boundary}`;
    if (i === 'files') {
      result += `\r\nContent-Disposition: form-data; name="${i}"; filename="${params['fileName']}"`;
      result += `\r\nContent-Type: ${params[i]?.type}`;
      result += '\r\n';
      result += '\r\n';
    } else {
      result += `\r\nContent-Disposition: form-data; name="${i}"`;
      result += '\r\n';
      result += `\r\n${params[i]}`;
    }
  }
  // 如果obj不为空，则最后一行加上boundary
  if (result) {
    result += `\r\n--${boundary}--`;
  }
  return result;
}

export function getCaption(str, code) {
  //截取某字符后的字符串
  const index = str.lastIndexOf(code);
  str = str.substring(index + 1, str.length);
  return str;
}

export function fileToUrl(files) {
  if (!files || !files?.length) return [];
  let temp = files.map(item => {
    return item.url;
  });
  return temp;
}

export function urlToFile(URL) {
  if (!URL || !URL?.length) return [];
  let temp = URL.map(url => {
    let item = { url };
    return item;
  });
  return temp;
}
