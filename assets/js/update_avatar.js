$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image');
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  };
  // 1.3 创建裁剪区域
  $image.cropper(options);
  // 给上传按钮注册点击事件
  $('#btn-changePic').on('click', function () {
    $('#btn-changeFile').click();
  })
  // 给文件选择框注册change事件,监听选择文件变化
  $('#btn-changeFile').on('change', function (e) {
    if (e.target.files.length == 0) {
      return layui.layer.msg('请选择图片');
    }
    else {
      // 1. 拿到用户选择的文件
      var file = e.target.files[0];
      // 2. 将文件，转化为路径
      var imgURL = URL.createObjectURL(file);
      // 3. 重新初始化裁剪区域
      $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
    }
  })
  // 给确定按钮注册点击事件,将图片上传至服务器
  $('#btn-uploadPic').on('click', function (e) {
    e.preventDefault();
    // 将图片格式化为64base的字符串
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('头像上传失败');
        }
        else {
          layui.layer.msg('头像上传成功');
          // 调用父页面的方法来重新渲染头像
          window.parent.getUserInfo();
        }
      }
    })
  })
})