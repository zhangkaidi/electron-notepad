// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process. var alertOnlineStatus = function() {
const { ipcRenderer:ipcR,remote} = require('electron')

const fs = require('fs');


let editor = document.getElementById('txtEditor');
document.title = "无标题 - 记事本";


txtEditor.oninput = (e) => {
    ipcR.send('rendO', 'false');
};

ipcR.on('operation', function (event, arg) {
    switch (arg) {
        case 'del':
            document.getElementById('txtEditor').value = ""
            break;
        case 'time':
            console.log('time')
            break;
    }
});

//右击
window.addEventListener('contextmenu', function (e) {
    ipcR.send('show-context-menu')
})

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
    writeText(path, editor.value);
    document.title = "记事本 - " + path;
})


//读取文本文件
function readText(file) {
    return fs.readFileSync(file, 'utf-8');
}

//写文本文件
function writeText(file, text) {
    fs.writeFileSync(file, text);
}