var cvs = document.getElementById('map');
var ctx = cvs.getContext('2d');
var gameController = new GameController(cvs);
var lastDirection = -1; //переменная хранит в себе значение текущего направления игрока
var blockSizeX, blockSizeY;
var icons = gameController.icons;
var ctlProgress = document.getElementById('progressBar');
var logBox = document.getElementById('log');

var setUI = setTimeout(function () {
	if (gameController.user.id !== gameController.game.owner.id) {
		document.getElementById('btnStart').classList.add('hidden');
		document.getElementById('btnStop').classList.add('hidden');
		document.getElementById('btnCancel').classList.add('hidden');
	}
}, 1000);


//Handlers-------------------------------------------------------------------------

function start() {
	gameController.start();
};

function stop() {
	gameController.stop();
};

function reconnect() {
	gameController.reconnect();
};

function cancel() {
	gameController.cancel();
};

function leave() {
	gameController.leave();
};

function join() {
	gameController.join();
};

function exit() {
	gameController.disconnect();
	jsHelper.setNewPageUrl('index.html');
};

//Moving---------------------------------------------------------------------------

document.addEventListener('keydown', movePlayer);

function movePlayer (event) {
	var event = event || window.event;
		
	var keyCode = event.keyCode;
	if (keyCode) {
		var direction = jsHelper.getDirection(keyCode);
            
		if (direction > -1 && direction != lastDirection) {
			gameController.movePlayer(direction);
			lastDirection = direction;
		}
	}		
};//.throttle(100);

//---------------------------------------------------------------------------------



//Score----------------------------------------------------------------------------

var showScore = setInterval(function () {
	if (gameController.game != null) {
		refreshScoreData(gameController.game.team1Stats, gameController.game.team2Stats);
	}
}, 100);

function refreshScoreData(team1, team2) {
	if (team1) {
		document.getElementById('ftName').innerText = team1.name;
		document.getElementById('ftScore').innerText = team1.coinsCollected || 0;
		document.getElementById('ftLifes').innerText = team1.currentLives;
	}
	
	if (team2) {
		document.getElementById('stName').innerText = team2.name;
		document.getElementById('stScore').innerText = team2.coinsCollected || 0;
		document.getElementById('stLifes').innerText = team2.currentLives || 0;
	}
};

//---------------------------------------------------------------------------------



//Map Showing----------------------------------------------------------------------

function displayMap (map) {
	blockSizeX = cvs.clientWidth / map.width;
	blockSizeY = cvs.clientHeight / map.height;
	
	if (map != null) {
		for (var i = 0; i < map.cells.length; i++) {
			var cell = map.cells[i];
			if (cell !== GameApi.MapCellType.wall) {
				var x = parseInt(i/map.height);
				var y = i - x * map.height;
				displayCell(x, y, cell);
			}
		}
	}
};
	
 function displayCell (x, y, type) {
		var x = x * blockSizeX;
		var y = y * blockSizeY;
		
		var img = defineCellType(type);
		if (img != null) {
			ctx.drawImage(img, x, y, blockSizeX, blockSizeY);
        }
 };
	
function displayPlayers (players) {
	for (var i = 0; i < players.length; i++) {
		var p = players[i];
		var x = p.location.x * blockSizeX;
		var y = p.location.y * blockSizeY;
		ctx.drawImage(p.icon, x, y, blockSizeX, blockSizeY)
	}
};
	
function defineCellType (type) {
	switch(type) {
		case GameApi.MapCellType.empty:
		default:
			return icons.empty || null;
		case GameApi.MapCellType.wall:
			return icons.wall || null;
		case GameApi.MapCellType.coin:
			return icons.coin || null;
		case GameApi.MapCellType.life:
			return icons.life || null;
		case GameApi.MapCellType.swtch:
			return icons.switch || null;
		case GameApi.MapCellType.thiefRespawn:
			return icons.empty || null;
		case GameApi.MapCellType.policeRespawn:
			return icons.empty || null;
		case 7:
			return icons.police || null; //полицейский
		case 8:
			return icons.thief || null; //вор
	}
};
	
gameController.displayMap = displayMap;
gameController.displayPlayers = displayPlayers;

//---------------------------------------------------------------------------------



//Loging and progress bar---------------------------------------------------------

function incrementProgress () {
	var percent = gameController.remainingSwitchTime * 100 / gameController.game.switchTimeout + '%';
	ctlProgress.style.width = percent;
	gameController.remainingSwitchTime += 100;
};

function log(message) {
	if (message) {
		logBox.textContent += message + '\r';
	}
};

gameController.incrementProgress = incrementProgress;
gameController.log = log;

//---------------------------------------------------------------------------------