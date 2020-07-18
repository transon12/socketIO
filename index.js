var express = require("express");
var app = express();
app.use(express.static("./puplic"));
app.set("view engine", "ejs");
app.set("views", "./views")


var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);
io.on("connection", function(socket) {
    var user = [];
    console.log("co ng vua ket noi" + socket.id);
    socket.on("disconnect", function() {
        console.log(socket.id + " vua ngat ket noi");
    })
    socket.on("Client-send-data", function(data) {
        if (user) {
            if ((user.indexOf(data) >= 0)) {
                socket.emit("server-send-register-fail");
            } else {
                user.push(data);
                socket.UserName = data
                socket.emit("server-send-register-success", data);
                io.sockets.emit("server-send-list-user", user)
            }
        }
    })
    socket.on("Client-send-logout", function() {
        user.splice(
            user.indexOf(socket.UserName), 1
        )
        socket.broadcast.emit("server-send-list-user", user)
    })

})

app.get("/", function(req, res) {
    res.render("trangchu");
})