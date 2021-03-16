// 每次调用$.get(),$.post(),$.ajax()的时候，会先调用ajaxPrefilter这个函数,在这个函数中，可以拿到我们给Ajax提供的配置对象

$.ajaxPrefilter(function (options) {
  // 在发起真正的Ajax请求之前,统一拼接请求的根路径
  // options.url = 'http://ajax.frontend.itheima.net' + options.url;
  options.url = 'http://127.0.0.1:3007' + options.url;
  // 为那些有权限的接口统一设置:
  // 请求头(以/my/字段开头的接口)
  // complete回调函数
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  // 全局统一配置complete回调函数
  // 无论成功与否,都会执行 complete 回调函数
  // 在complete回调函数中,可以通过res.responseJSON拿到服务器响应回来的数据
  options.complete = function (res) {
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 强制清空token
      localStorage.removeItem('token');
      // 强制跳转到登录界面
      location.href = '/login.html';
    }
  }
})