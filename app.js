//. app.js

var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    ejs = require( 'ejs' ),
    app = express();
var http = require( 'http' ).createServer( app );
var io = require( 'socket.io' ).listen( http );

var settings = require( './settings' );

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( express.Router() );
app.use( express.static( __dirname + '/public' ) );

app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

app.get( '/client', function( req, res ){
  var room = req.query.room;
  if( !room ){ room = settings.defaultroom; }
  res.render( 'client', { room: room } );
});

app.get( '/share', function( req, res ){
  var room = req.query.room;
  if( !room ){ room = settings.defaultroom; }
  res.render( 'share', { room: room } );
});

app.get( '/admin', function( req, res ){
  var room = req.query.room;
  if( !room ){ room = settings.defaultroom; }
  res.render( 'admin', { room: room } );
});


app.post( '/setcookie', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var value = req.body.value;
  //console.log( 'value = ' + value );
  res.setHeader( 'Set-Cookie', value );

  res.write( JSON.stringify( { status: true }, 2, null ) );
  res.end();
});


//. socket.io
//. https://qiita.com/uranesu/items/8ee0dbe4e472f9fffa49
//io.sockets.on( 'connection', function( socket ){
io.on( 'connection', function( socket ){
  socket.on( 'init_admin', function( msg ){
    console.log( 'init_admin', msg );
    msg.socket_id = socket.id;
    var room = msg.room ? msg.room : settings.defaultroom;
    socket.join( room );
    io.to(room).emit( 'init_admin_view', msg );
  });

  socket.on( 'init_share', function( msg ){
    console.log( 'init_share', msg );
    msg.socket_id = socket.id;
    var room = msg.room ? msg.room : settings.defaultroom;
    socket.join( room );
    io.to(room).emit( 'init_share_view', msg );
  });

  socket.on( 'init_client', function( msg ){
    console.log( 'init_client', msg );
    msg.socket_id = socket.id;
    var room = msg.room ? msg.room : settings.defaultroom;
    socket.join( room );
    io.to(room).emit( 'init_client_view', msg );
  });

  socket.on( 'msg_admin', function( msg ){
    console.log( 'msg_admin', msg );
    msg.socket_id = socket.id;
    var room = msg.room ? msg.room : settings.defaultroom;
    io.to(room).emit( 'msg_admin_view', msg );
  });

  socket.on( 'msg_share', function( msg ){
    console.log( 'msg_share', msg );
    msg.socket_id = socket.id;
    var room = msg.room ? msg.room : settings.defaultroom;
    io.to(room).emit( 'msg_ahare_view', msg );
  });

  socket.on( 'msg_client', function( msg ){
    console.log( 'msg_client', msg );
    msg.socket_id = socket.id;
    var room = msg.room ? msg.room : settings.defaultroom;
    io.to(room).emit( 'msg_client_view', msg );
  });
});


function timestamp2datetime( ts ){
  if( ts ){
    var dt = new Date( ts );
    var yyyy = dt.getFullYear();
    var mm = dt.getMonth() + 1;
    var dd = dt.getDate();
    var hh = dt.getHours();
    var nn = dt.getMinutes();
    var ss = dt.getSeconds();
    var datetime = yyyy + '-' + ( mm < 10 ? '0' : '' ) + mm + '-' + ( dd < 10 ? '0' : '' ) + dd
      + ' ' + ( hh < 10 ? '0' : '' ) + hh + ':' + ( nn < 10 ? '0' : '' ) + nn + ':' + ( ss < 10 ? '0' : '' ) + ss;
    return datetime;
  }else{
    return "";
  }
}


//app.listen( appEnv.port );
var port = process.env.PORT || 8080;
http.listen( port );
console.log( "server starting on " + port + " ..." );
