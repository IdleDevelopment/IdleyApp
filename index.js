$.getJSON('https://my.idley.gg/api/getUserServers?access_token=trwfxsy6sa6bzwcyjzyucwkj2wzzeiu2zopq139q', function(data) {
    data.servers.forEach(element => {
        $("#servers").append("<a class=\"panel-block is-active\">"+element.name+"</a>")
    });
})
