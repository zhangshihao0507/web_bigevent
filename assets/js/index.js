$(function () {
  // 获取用户基本信息
  getUserInfo();
  // 设置退出提示框
  $('#btn-loginout').on('click', function () {
    // 提示用户是否退出登录
    layui.layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
      // 清空用户的token
      localStorage.removeItem('token');
      // 跳转至登录页面
      location.href = '/login.html';
      // 关闭confirm询问框
      layer.close(index);
    });
  })

})

// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg(res.message);
      }
      else {
        // 渲染用户头像
        renderAvatar(res.data);
      }
    }
  })
}

function renderAvatar(user) {
  const name = user.nickname || user.username;
  localStorage.setItem('username', user.username);
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
  if (user.user_pic) {
    // 如果用户有头像,则设置为选择的图片
    $('.layui-nav-img').prop('src', user.user_pic).show();
    // 隐藏文本头像
    $('.text-avatar').hide();
  } else {
    // 如果没有头像,则设置为默认的文本头像
    $('.text-avatar').html(name[0].toUpperCase()).show();
    // 隐藏图片头像
    $('.layui-nav-img').hide();
  }
}