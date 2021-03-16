$(function () {
  // 先在本地存储中寻找上一个登录的用户
  $('#login-username').prop('value', localStorage.getItem('username') || '')
  // 登录div和注册div切换
  $('#link-login').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });
  $('#link-reg').on('click', function () {
    $('.reg-box').hide();
    $('.login-box').show();
  });
  // 自定义表单验证规则
  layui.form.verify({
    pwd: [
      /^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {
      if ($('#reg-pwd').prop('value') != value) {
        return ('两次密码不一致!');
      }
    }
  });
  // 监听表单的提交事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/reguser',
      data: {
        username: $('#reg-username').prop('value'),
        password: $('#reg-pwd').prop('value')
      },
      success: function (res) {
        if (res.status !== 0) {
          layui.layer.msg(res.message);
        }
        else {
          layui.layer.msg('注册成功,请登录');
          // 注册成功自动跳转到登录界面
          setTimeout(function () {
            // 自动填写登录界面的用户名
            $('#login-username').prop('value', $('#reg-username').prop('value'));
            $('#login-pwd').prop('value', '');
            // 自动跳转至登录界面
            $('#link-reg').click();
            // 清空注册表单
            $('#reg-username').prop('value', '');
            $('#reg-pwd').prop('value', '');
            $('#reg-repwd').prop('value', '');
          }, 1000)
        }
      }
    })
  });
  // 监听表单的登录事件
  $('#form-login').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      // 快速获取表单中的所有数据可以使用serialize函数
      // username: $('#login-username').prop('value'),
      // password: $('#login-pwd').prop('value')
      success: function (res) {
        if (res.status !== 0) {
          $('#login-pwd').prop('value', '');
          return layui.layer.msg(res.message);
        }
        else {
          layui.layer.msg('登录成功！');
          // 清空登录表单
          $('#login-username').prop('value', '');
          $('#login-pwd').prop('value', '');
          // 本地存储token令牌的值
          localStorage.setItem('token', res.token);
          location.href = '/index.html';
        }
      }
    })
  })
})