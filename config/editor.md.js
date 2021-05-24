const defaultConfig = {
  width: "100%",
  height: 450,
  path: "/static/editormd/lib/",
  // theme: "dark", // toolbar
  // previewTheme: "dark", // editor
  // editorTheme: "pastel-on-dark", // previewer
  // markdown: "默认填充内容",
  // lineWrapping: false, // 编辑框不换行 默认true
  // codeFold: true, // 代码折叠
  placeholder: "", // default
  // syncScrolling: true, // (default)true -> bisync, false -> disabled, "single" -> Only editor area sync
  saveHTMLToTextarea: true, // 保存 HTML 到 Textarea
  toolbarAutoFixed: false, // toolbar自动吸顶
  // searchReplace: true,
  watch: false, // 实时预览
  lineNumbers: false, // 行号显示
  // htmlDecode: "style,script,iframe|on*", // 开启 HTML 标签解析，为了安全性，默认不开启
  // toolbar: true, //工具栏
  // previewCodeHighlight: true, // 预览 HTML 的代码块高亮，默认开启
  // emoji: true,
  taskList: true,
  tocm: true, // Using [TOCM]
  tex: true, // 开启科学公式TeX语言支持，默认关闭
  flowChart: true, // 开启流程图支持，默认关闭
  sequenceDiagram: true, // 开启时序/序列图支持，默认关闭,
  // dialogLockScreen: false,      // 设置弹出层对话框不锁屏，全局通用，默认为true
  // dialogShowMask: false,        // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
  // dialogDraggable: false,       // 设置弹出层对话框不可拖动，全局通用，默认为true
  // dialogMaskOpacity: 0.4,       // 设置透明遮罩层的透明度，全局通用，默认值为0.1
  // dialogMaskBgColor: "#000",    // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
  // imageUpload: false,
  // imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
  // imageUploadURL: "./php/upload.php",
  // onload: function() {
  // this.fullscreen();
  // this.unwatch();
  // this.watch().fullscreen();
  // this.setMarkdown("#PHP");
  // this.width("100%");
  // this.height(480);
  // this.resize("100%", 640);
  // },
  toolbarIcons: function() {
    // Using "||" set icons align right.
    // full config
    // -----------
    // "undo","redo","|","bold","del","italic","quote",
    // "ucwords","uppercase","lowercase","h1","h2","h3",
    // "h4","h5","|","list-ul","list-ol","hr","|","link",
    // "reference-link","image","code","preformatted-text",
    // "code-block","table","datetime","emoji","html-entities",
    // "pagebreak","goto-line","watch","preview","fullscreen",
    // "clear","search","help","info"
    const left = [
      "undo",
      "redo",
      "|",
      "bold",
      "del",
      "italic",
      "quote",
      "list-ul",
      "list-ol",
      "hr",
      "|",
      "h1",
      "h2",
      "h3",
      "|",
      "link",
      "image",
      "code-block",
      "table",
    ];
    const right = ["watch", "preview", "fullscreen", "clear", "search"];
    return [...left, "||", ...right];
  },
};
const viewerConfig = {
  // markdown: markdown, //+ "\r\n" + $("#append-test").text(),
  // htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
  // htmlDecode: "style,script,iframe", // you can filter tags decode
  // toc             : false,
  //   tocm: true, // Using [TOCM]
  //   tocContainer: "#custom-toc-container", // 自定义 ToC 容器层
  // gfm             : false,
  // tocDropdown     : true,
  markdownSourceCode: false, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
  // emoji: true,
  taskList: true,
  tex: true, // 默认不解析
  flowChart: true, // 默认不解析
  sequenceDiagram: true, // 默认不解析
};
export { defaultConfig, viewerConfig };
