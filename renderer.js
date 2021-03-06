// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process. var alertOnlineStatus = function() {

const fs = require('fs');
const { ipcRenderer: ipcR, remote } = require('electron')
const { Menu, MenuItem } = remote
const menu = new Menu();

let editor = document.getElementById('txtEditor');
let isChange = true;
let dbclick = true;

document.title = "无标题 - 记事本";
//监听是否输入信息
txtEditor.oninput = (e) => {
    ipcR.send('rendOperation', 'false');
    isChange = false;
};
//监听主进程
ipcR.on('operation', function (event, arg) {
    switch (arg) {
        case 'del':
            document.getElementById('txtEditor').value = ""
            break;
        case 'godbclick':
            dbclick = true;
            break;
    }
});

//右击菜单(remote)
menu.append(new MenuItem({ label: "撤销", role: "undo" }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: '剪切', role: 'cut' }))
menu.append(new MenuItem({ label: '复制', role: 'copy' }))
menu.append(new MenuItem({ label: '粘贴', role: 'paste' }))

window.addEventListener('contextmenu', function (e) {
    e.preventDefault()
    menu.popup({ window: remote.getCurrentWindow() })
}, false)

//新建
ipcR.on('new-file', function (event, arg) {
    editor.value = "";
    document.title = "无标题 - 记事本";
})
//打开
ipcR.on('open-file', function (event, path) {
    const text = readText(path);
    editor.value = text;
    document.title = "记事本 - " + path;
}) 
//保存
ipcR.on('saved-file', function (event, path) {
    isChange = true;
    writeText(path, editor.value);
    document.title = "记事本 - " + path;
})
//读文件
function readText(file) {
    return fs.readFileSync(file, 'utf-8');
}
//写文件
function writeText(file, text) {
    fs.writeFileSync(file, text);
}
//双击打开文件
editor.addEventListener('dblclick',function(){
    if (dbclick) {
        ipcR.send('rendOperation', 'dbopenfile')
    }
    dbclick = false;
})
//外部拖拽
editor.addEventListener('drop',function(e){
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    if (isChange) {
        document.title = "记事本 - " + file.path;
        ipcR.send('drag-file', file.path)
        fs.readFile(file.path, 'utf-8', function (err, data) {
            editor.value = data;
        });
    } else {
        ipcR.send('drag-new-file', file.path)
    }
    isChange = true;
})
