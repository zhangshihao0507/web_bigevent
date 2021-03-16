$(function () {
  // 获取用户基本信息
  getUserInfo();
  // 设置昵称验证规则
  layui.form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1~6个字符之间';
      }
    }
  });
  // 注册修改按钮点击事件
  $('#btn-set').on('click', function (e) {
    // 阻止默认行为
    e.preventDefault();
    setUserInfo();
    // 重新渲染用户头像
    window.parent.getUserInfo();
  });
  // 注册重置按钮点击事件
  $('#btn-reset').on('click', function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault();
    getUserInfo();
    // 重新渲染用户头像
    window.parent.getUserInfo();
  })
})

// 获取用户信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败!');
      }
      else {
        const id = res.data.id;
        const username = res.data.username;
        const nickname = res.data.nickname;
        const email = res.data.email;
        $('#ipt-id').prop('value', id);
        $('#ipt-username').prop('value', username);
        $('#ipt-nickname').prop('value', nickname);
        $('#ipt-email').prop('value', email);
      }
    }
  })
}
// 重置用户信息
function setUserInfo() {
  $.ajax({
    method: 'POST',
    url: '/my/userinfo',
    data: {
      id: $('#ipt-id').prop('value'),
      nickname: $('#ipt-nickname').prop('value'),
      email: $('#ipt-email').prop('value')
    },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('修改信息失败！');
      }
      else {
        layui.layer.msg('修改信息成功！');
      }
    }
  })
}