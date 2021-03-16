$(function () {
  // 自定义密码校验规则
  layui.form.verify({
    // 密码长度规则
    pwd: function (value) {
      const reg = /^[\S]{6,12}$/;
      if (!reg.test(value)) {
        return '密码长度必须在6到12位之间，且不能出现空格'
      }
    },
    // 密码重复规则
    samePwd: function (value) {
      if (value === $('#oldPwd').prop('value')) {
        // 清空新密码输入框
        return $('#rePwd').prop('value', '') && $('#newPwd').prop('value', '') && '您设置的新密码与原密码重复,请重新输入!';
      }
    },
    // 新密码确认规则
    sameNewPwd: function (value) {
      if (value !== $('#newPwd').prop('value')) {
        return $('#rePwd').prop('value', '') && '两次密码输入不一致,请重新输入'
      }
    }
  })
  // 为修改密码按钮注册点击事件
  $('#btn-rePwd').on('click', function (e) {
    // 阻止默认事件
    e.preventDefault();
    // 修改用户密码
    if ($('#oldPwd').prop('value') && $('#newPwd').prop('value') && $('#rePwd').prop('value')) {
      setTimeout(function () {
        resetPassword();
      }, 1000)
    }
  });
})
// 修改用户密码
function resetPassword() {
  $.ajax({
    method: 'POST',
    url: '/my/updatepwd',
    data: {
      oldPwd: $('#oldPwd').prop('value'),
      newPwd: $('#newPwd').prop('value')
    },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('修改密码失败');
      }
      else {
        // 清空表单
        $('.layui-form')[0].reset();
        layui.layer.msg('修改成功');
      }
    }
  });
}