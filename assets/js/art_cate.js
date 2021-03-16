$(function () {
  // 初始化文章类别列表
  artCateInitList();
  // 给添加类别按钮注册点击事件
  $('#btn-addCate').on('click', function (e) {
    let indexAdd = null;
    e.preventDefault();
    // 设置弹出层并保存弹出层索引
    indexAdd = layui.layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章类别',
      content: `
      <form class="layui-form">
        <!-- 分类名称区 -->
        <div class="layui-form-item">
          <label class="layui-form-label">分类名称</label>
          <div class="layui-input-block">
            <input type="text" name="name" required lay-verify="required" placeholder="请输入分类名称" autocomplete="off"
              class="layui-input">
          </div>
        </div>
        <!-- 分类别名区 -->
        <div class="layui-form-item">
          <label class="layui-form-label">分类别名</label>
          <div class="layui-input-block">
            <input type="text" name="alias" required lay-verify="required" placeholder="请输入分类别名" autocomplete="off"
              class="layui-input">
          </div>
        </div>
        <!-- 底部按钮区 -->
        <div class="layui-form-item">
          <div class="layui-input-block">
            <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
          </div>
        </div>
      </form>`
    });
    // 给弹出层中的表单添加按钮注册提交事件(事件委托)
    $('body').on('submit', '.layui-form', function (e) {
      e.preventDefault();
      $.ajax({
        method: 'POST',
        url: '/my/article/addcates',
        data: $(this).serialize(),
        success: function (res) {
          if (res.status !== 0) {
            return layui.layer.msg('新增文章分类失败');
          }
          else {
            layui.layer.msg('新增文章分类成功');
            // 重新渲染文章分类列表
            artCateInitList();
            // 关闭弹出层
            layui.layer.close(indexAdd);
          }
        }
      })
    })
  });
  // 给编辑按钮注册点击事件
  $('body').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    // 从自定义属性中获取用户id
    let id = $(this).attr('data-Id');
    // 设置弹出层并保存弹出层索引
    let indexEdit = null;
    indexEdit = layui.layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章类别',
      content: `
      <form class="layui-form">
        <!-- 分类名称区 -->
        <div class="layui-form-item">
          <label class="layui-form-label">分类名称</label>
          <div class="layui-input-block">
            <input id='ipt-name' type="text" name="name" required lay-verify="required" placeholder="请输入分类名称" autocomplete="off"
              class="layui-input">
          </div>
        </div>
        <!-- 分类别名区 -->
        <div class="layui-form-item">
          <label class="layui-form-label">分类别名</label>
          <div class="layui-input-block">
            <input id='ipt-alias' type="text" name="alias" required lay-verify="required" placeholder="请输入分类别名" autocomplete="off"
              class="layui-input">
          </div>
        </div>
        <!-- 底部按钮区 -->
        <div class="layui-form-item">
          <div class="layui-input-block">
            <button id='btn-affirm' class="layui-btn" lay-submit lay-filter="formDemo">确认修改</button>
          </div>
        </div>
      </form>`
    });
    // 将表单中的数据渲染到弹出层中
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        if (res.status !== 0) {
          layui.layer.msg('获取文章数据失败');
        }
        else {
          $('#ipt-name').prop('value', res.data.name);
          $('#ipt-alias').prop('value', res.data.alias);
        }
      }
    })
    // 给确认修改按钮注册点击事件
    $('#btn-affirm').on('click', function (e) {
      e.preventDefault();
      $.ajax({
        method: 'POST',
        url: '/my/article/updatecate',
        data: {
          Id: id,
          name: $('#ipt-name').prop('value'),
          alias: $('#ipt-alias').prop('value')
        },
        success: function (res) {
          if (res.status !== 0) {
            return layui.layer.msg('更新分类失败') && layui.layer.close(indexEdit);
          }
          else {
            // 关闭弹出层
            layui.layer.close(indexEdit);
            // 重新渲染文章类别列表
            artCateInitList()
            // 提示信息
            layui.layer.msg('更新分类成功');
          }
        }
      })
    })
  })
  // 给删除按钮注册点击事件
  $('body').on('click', '.btn-del', function (e) {
    // 从自定义属性中获取用户id
    let id = $(this).attr('data-Id');
    // 设置弹出层
    layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      // 发起请求删除文章类别
      $.ajax({
        method: 'POST',
        url: '/my/article/deletecate/' + id,
        data: {
          id: id
        },
        success: function (res) {
          if (res.status !== 0) {
            layui.layer.msg('删除文章类别失败');
          }
          else {
            // 重新渲染文章类别列表
            artCateInitList();
            layui.layer.msg('删除文章类别成功');
          }
        }
      })
      // 关闭弹出层
      layui.layer.close(index);
    });

  })
})
// 初始化文章类别列表函数
function artCateInitList() {
  $.ajax({
    method: 'GET',
    url: '/my/article/cates',
    data: {},
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取文章类别列表失败');
      }
      else {
        // 渲染文章类别列表
        let arr = [];
        $(res.data).each(function (index, item) {
          arr.push(`
          <tr>
            <td>${item.name}</td>
            <td>${item.alias}</td>
            <td>
              <button data-id=${item.Id} type="button" class="layui-btn layui-btn-xs btn-edit">编辑</button>
              <button data-id=${item.Id} type="button" class="layui-btn layui-btn-xs layui-btn-danger btn-del">删除</button>
            </td>
          </tr>`)
        });
        $('#art_list').empty().append(arr);
      }
    }
  })
}