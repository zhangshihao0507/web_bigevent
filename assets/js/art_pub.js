$(function () {
  // 初始化文章类别选项
  initCate();
  // 初始化富文本编辑器
  initEditor();
  // 初始化裁剪区域
  initCropper();
  // 给选择封面按钮注册点击事件
  $('#btn-select').on('click', function () {
    $('#ipt-file').click();
  })
  // 给文件选择框按钮注册change事件
  $('#ipt-file').on('change', function (e) {
    // 拿到用户选择的文件
    var file = e.target.files[0];
    if (file.length === 0) {
      return
    }
    else {
      // 根据选择的文件，创建一个对应的 URL 地址:
      var newImgURL = URL.createObjectURL(file);
      // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域:
      $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
    }
  })
  // 定义文章的发布状态
  var art_state = '已发布';
  // 给存为草稿按钮注册点击事件
  $('#btnSave2').on('click', function () {
    art_state = '存为草稿';
  })
  // 给发布按钮注册点击事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault();
    // 基于表单快速创建FormData对象
    const fd = new FormData($('#form-pub')[0]);
    // 将发布状态添加到fd中
    fd.append('state', art_state);
    // 将裁剪好的文章封面,输出为一个文件对象
    $('#image')
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 将文件对象添加到fd中
        fd.append('cover_img', blob);
      })
    // 发布文章
    pulishArticle(fd);
  })


  // 定义初始化文章类别的函数
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      data: {},
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('获取文章类别失败');
        }
        else {
          let arr = [];
          $(res.data).each(function (index, item) {
            arr.push(`<option value="${item.Id}">${item.name}</option>`);
          })
          $('#cate').append(arr);
          // 通知layui重新渲染表单
          layui.form.render();
        }
      }
    })
  };
  // 定义初始化裁剪区域的函数
  function initCropper() {
    // 初始化图片裁剪器
    var $image = $('#image');
    // 裁剪选项
    var options = {
      aspectRatio: 400 / 280,
      preview: '.img-preview'
    };
    // 初始化裁剪区域
    $image.cropper(options);
  }
  // 定义发布文章的函数
  function pulishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 如果向服务器提交的是FormData类型的数据,必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('文章发布失败');
        }
        else {
          layui.layer.msg('文章发布成功');
          // 跳转至文章列表页面
          location.href = '/article/art_list.html';
        }
      }
    })
  }
})