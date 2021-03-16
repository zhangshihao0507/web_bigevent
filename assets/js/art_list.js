$(function () {
  // 定义一个查询参数对象,将来请求数据的时候,需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, //页码值,用于显示第几页的数据
    pagesize: 2, //每页显示多少条数据
    cate_id: '', //文章分类的id
    state: '' //文章的发布状态
  }
  // 初始化文章列表数据
  initTable();
  // 初始化下拉菜单选项数据
  initCate();
  // 给表单注册提交事件
  $('#form-search').on('submit', function (e) {
    // 阻止默认提交行为
    e.preventDefault();
    // 更新查询参数对象
    q.cate_id = $('cate').prop('value');
    q.state = $('state').prop('value');
    // 根据新的查询参数发起请求来重新渲染文章列表
    initTable();
  })
  // 定义初始化文章列表函数
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('获取文章列表失败');
        }
        else {
          // 渲染文章列表
          let arr = [];
          $(res.data).each(function (index, item) {
            arr.push(`
            <tr>
              <td>${item.title}</td>
              <td>${item.cate_name}</td>
              <td>${timeFormat(item.pub_date)}</td>
              <td>${item.state}</td>
            <td>
              <button data-id=${item.Id} type="button" class="layui-btn layui-btn-xs">编辑</button>
              <button data-id=${item.Id} type="button" class="layui-btn layui-btn-xs layui-btn-danger">删除</button>
            </td>
          </tr>`);
          });
          $('tbody').empty().append(arr);
          // 文章列表渲染完成后开始渲染底部分页
          renderPage(res.total);
          layui.layer.msg('获取文章列表成功');
        }
      }
    })
  }
  //定义格式化时间的函数
  function timeFormat(str) {
    const timeStr = new Date(str);
    const y = timeStr.getFullYear();
    const m = getDou(timeStr.getMonth() + 1);
    const d = getDou(timeStr.getDate());
    const h = getDou(timeStr.getHours());
    const min = getDou(timeStr.getMinutes());
    const s = getDou(timeStr.getSeconds());
    return `${y}-${m}-${d} ${h}-${min}-${s}`;
  }
  // 定义补零函数
  function getDou(n) {
    return n < 10 ? '0' + n : n
  }
  // 定义初始化下拉菜单选项数据的函数
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
  }
  // 定义渲染分页的函数
  function renderPage(total) {
    layui.laypage.render({
      elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize,//每页显示的条数
      curr: q.pagenum//当前页
    });
  }
});


