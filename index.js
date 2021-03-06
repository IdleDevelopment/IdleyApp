var userData
var authToken

const ipc = require("electron").ipcRenderer

ipc.send("init","webcontents")

ipc.on("auth", function(e,a){

    authToken = a
    $.getJSON('https://my.idley.gg/api/getUserServers?access_token='+authToken, function(data) {
    userData = data;
    if(data.error === undefined){
        data.servers.forEach(element => {
            $("#servers").append("<a class=\"panel-block is-active\" href=\"javascript:loadServerManagePage('"+element.id+"')\">"+element.name+"</a>")
        });
    } else {
        if(data.error === "invalid_auth"){
            alert("You have to login to the app again.")
        }
    }
})

})

function loadPteroManagePage(server_id){

    ipc.send("loadPtero",{
        server_id:server_id,
        userData: userData
    })

}

function loadServerManagePage(server_id){

    const server = userData.servers.find(x => x.id === server_id);
    $("body").html(`
    <section class="hero is-link">
            <div class="hero-body">
                <p class="title">
                Idley App
                </p>
                <p class="subtitle">
                Server Management: ${server.name}
                </p>
            </div>
        </section>
        <div class="container" style="max-width: 1200px;">
        <div class="container" style="width: 100%; margin: auto;">
            <div class="box" style="width: 27%; margin-left: 5%; margin-top: 10px; display: inline-block;">
                <p class="title">CPU</p>
                <p>${server.cpu}%</p>
            </div>
            <div class="box" style="width: 27%; margin-left: 4%; display: inline-block;">
                <p class="title">Disk</p>
                <p>${server.disk}MB</p>
            </div>
            <div class="box" style="width: 27%; margin-left: 4%; display: inline-block;">
                <p class="title">Memory</p>
                <p>${server.memory}MB</p>
            </div>
        </div>
        <form class="box" style="width: 50%; margin-left: 5%; display: inline-block;">
            <div class="field">
                <label class="label">Change Server CPU</label>
                <div class="control">
                    <input class="input" id="newcpu" type="text" placeholder="New CPU" value="${server.cpu}">
                </div>
            </div>

            <div class="field">
                <label class="label">Change Memory</label>
                <div class="control">
                    <input class="input" id="newmemory" type="text" placeholder="New Memory" value="${server.memory}">
                </div>
            </div>

            <div class="field">
                <label class="label">Change Server Disk</label>
                <div class="control">
                    <input class="input" id="newdisk" type="text" placeholder="New Server Disk" value="${server.disk}">
                </div>
            </div>

            <div class="field is-grouped">
                <div class="control">
                    <button class="button is-link" type="button" onclick="updateServerSpecs('${server_id}')">Submit</button>
                </div>
            </div>
        </form>
        <div class="card" style="display: inline-block; width: 35%; vertical-align: top; margin-right: 5%; float: right;">
            <header class="card-header">
              <p class="card-header-title">
                Manage
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                You can reinstall, change version of your server, or access console, file manager and sftp credentials.
              </div>
            </div>
            <footer class="card-footer">
              <a href="javascript:loadPteroManagePage('${server_id}')" class="card-footer-item">Manage at Control Panel</a>
            </footer>
          </div>
        </div>
    `)
    console.log(server)

}

function updateServerSpecs(server_id){

    var http = new XMLHttpRequest();
    var url = 'https://my.idley.gg/api/updateServer?access_token='+authToken;
    var params = `server_id=${server_id}&cpu=${$("#newcpu").val()}&disk=${$("#newdisk").val()}&memory=${$("#newmemory").val()}`;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var resp = JSON.parse(http.responseText)
            if(resp.status === "OK"){
                alert("Server successfully updated.")
                $.getJSON('https://my.idley.gg/api/getUserServers?access_token='+authToken, function(data) {
                    userData = data;
                    if(data.error === undefined){
                        loadServerManagePage(server_id)
                    } else {
                        if(data.error === "invalid_auth"){
                            alert("You have to login to the app again.")
                        }
                    }
                });
            } else {
                alert(resp.error)
            }
        }
    }
    http.send(params);

}