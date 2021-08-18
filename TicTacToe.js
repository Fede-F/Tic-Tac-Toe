//Function Factory de casillero
const tileFactory = (tile, mark) => {
    return { tile, mark };
};

//Function Factory de jugadores
const playerFactory = (nombre, CPU, CPU_diff, mark) => {
    return { nombre, CPU, CPU_diff, mark };
};

const gameBoard = (() => {
    //Array de dos dimensiones
    let tiles_position = [];
    let player1, player2, current_player, winner_Player;


    const create_board = (reset_game) => {
        //Si se elige reiniciar el juego se borran los botones y el array
        if (reset_game) {
            winner_Player = '';
            displayController.delete_tiles();
            //Deshabilita el label de winner
            displayController.player_winner_label(null, false);
            tiles_position = [];
            current_player = null;
        }
        //Se obtiene el container donde se van a mostrar el tablero
        const tablero = document.getElementById('Tablero');
        let button_element;
        let tile_name;
        let tile_num = 0;
        //Crea botones para cada casillero del juego en [i][j] dimensiones
        for (var i = 0; i < 3; i++) {
            tiles_position.push([]);
            for (var j = 0; j < 3; j++) {
                //Asigno el nombre a cada casillero
                tile_name = 'tile_' + tile_num.toString();

                //Creo el objeto con sus propiedades
                const tile = tileFactory(tile_name, null);
                //Se agrega al array
                tiles_position[i].push(tile);

                //Si se reinicia el juego, que no vuelva a generar los botones
                button_element = `<button type="button" id="${tile_name}" class="tile_button" onclick="gameBoard.tile_check(id)"></button>`;
                // Agrega el elemento creado al div
                tablero.innerHTML += button_element;
                tile_num++;
            }
        }
    };


    //En el caso de que se elija jugar con la PC
    const vsPC_submit = () => {
        [player1_name, player2_name] = displayController.playerName_Controller(true);
        player1 = playerFactory(player1_name, false, null, "X");
        const cpu_Diff = displayController.cpu_diff_Selection();
        player2 = playerFactory(player2_name, true, cpu_Diff, "O");
    }


    //En el caso de que se elija jugar vs Player.Se guarda el nombre de los jugadores cuando se presiona el boton Comenzar
    const vsPlayer_submit = () => {
        [player1_name, player2_name] = displayController.playerName_Controller(false);
        player1 = playerFactory(player1_name, false, null, "X");
        player2 = playerFactory(player2_name, false, null, "O");
    };


    //Cambia al jugador siguiente
    const player_turn = (player) => {
        let next_player;
        if (player === player1) next_player = player2;
        else if (player === player2) next_player = player1;
        current_player = next_player;
    };


    //Funcion que se activa cuando se presiona el boton de un casillero
    const tile_check = (tile_name) => {
        for (var i = 0; i < tiles_position.length; i++)
            for (var j = 0; j < tiles_position.length; j++)
                if (tiles_position[i][j].tile === tile_name) {
                    if (tiles_position[i][j].mark == null) {
                        if (current_player == null) current_player = player1;
                        //Marca el casillero
                        tiles_position[i][j].mark = current_player.mark;
                        displayController.show_marks(tile_name, current_player.mark)
                        //Se chequea si se cumple la condicion de victoria
                        winCondition_verify(current_player.nombre);
                        player_turn(current_player);
                        break;
                    }
                }
        if (current_player.CPU) pc_moves();
    };


    const pc_moves = () => {
        if (winner_Player === '') {
            if (current_player.CPU_diff === "medium") {
                random_number = Math.floor(Math.random() * 9);
                random_tile_name = 'tile_' + random_number.toString();
                tile_check(random_tile_name);
            }
            else if(current_player.CPU_diff === "hard"){
                console.log("En progreso");


            }
        }

    };


    //Verifica si se consigue 3 casilleros seguidos para ganar
    const winCondition_verify = (player) => {
        let mark = "", prev_mark = "", tile_pos = "", tile_pos1 = "", tile_pos2 = "", cont = 0;
        //Chequeo de filas
        for (var i = 0; i < tiles_position.length; i++) {
            mark = prev_mark = "", tile_pos = "", tile_pos1 = "", tile_pos2 = "", cont = 0;
            for (var j = 0; j < tiles_position.length; j++) {
                mark = tiles_position[i][j].mark;
                tile_pos = tiles_position[i][j].tile;
                if (mark != null && mark == prev_mark) {
                    if (cont == 1) tile_pos2 = tiles_position[i][j - 2].tile;
                    cont++;
                    if (cont == 2) {
                        winning_payer(player, tile_pos, tile_pos1, tile_pos2);
                        break;
                    }
                } else cont = 0;
                prev_mark = mark;
                tile_pos1 = tile_pos;
            }
        }
        mark = prev_mark = "", tile_pos = "", tile_pos1 = "", tile_pos2 = "", cont = 0;
        //Chequeo de columnas
        for (var j = 0; j < tiles_position.length; j++) {
            mark = prev_mark = ""; cont = 0;
            for (var i = 0; i < tiles_position.length; i++) {
                mark = tiles_position[i][j].mark;
                tile_pos = tiles_position[i][j].tile;
                if (mark != null && mark == prev_mark) {
                    if (cont == 1) tile_pos2 = tiles_position[i - 2][j].tile;

                    cont++;
                    if (cont == 2) {
                        winning_payer(player, tile_pos, tile_pos1, tile_pos2);
                        break;
                    }
                } else cont = 0;
                prev_mark = mark;
                tile_pos1 = tile_pos;
            }
        }
        mark = prev_mark = "", tile_pos = "", tile_pos1 = "", tile_pos2 = "", cont = 0;
        //Chequeo de diagonales
        if (tiles_position[0][0].mark != null && tiles_position[0][0].mark == tiles_position[1][1].mark && tiles_position[1][1].mark == tiles_position[2][2].mark) {
            tile_pos = tiles_position[0][0].tile;
            tile_pos1 = tiles_position[1][1].tile;
            tile_pos2 = tiles_position[2][2].tile;
            winning_payer(player, tile_pos, tile_pos1, tile_pos2);
        }
        else if (tiles_position[0][2].mark != null && tiles_position[0][2].mark == tiles_position[1][1].mark && tiles_position[1][1].mark == tiles_position[2][0].mark) {
            tile_pos = tiles_position[0][2].tile;
            tile_pos1 = tiles_position[1][1].tile;
            tile_pos2 = tiles_position[2][0].tile;
            winning_payer(player, tile_pos, tile_pos1, tile_pos2);
        }
        else { mark = prev_mark = ""; cont = 0; }

    };

    //Accion cuando gana un jugador
    const winning_payer = (player_name, tile_pos, tile_pos1, tile_pos2) => {
        winner_Player = player_name;
        //Se inhabilitan los bontones despues de ganar
        displayController.disable_buttons(true, tile_pos, tile_pos1, tile_pos2);
        displayController.player_winner_label(player_name, true);
    };

    return {
        vsPC_submit,
        vsPlayer_submit,
        create_board,
        tile_check,
    };
})();

const displayController = (() => {

    const playerName_request = (state) => {
        const playerName_modal = document.getElementById("playersName_modal");
        playerName_modal.style.display = state;
        gameBoard.create_board(true);
    };


    const cpu_diff_Selection = () => {
        if (document.getElementById('medium_diff').checked)
            return "medium";
        else if (document.getElementById('hard_diff').checked)
            return "hard";

    };


    const playerName_Controller = (cpu_player) => {
        if (cpu_player) {
            player1_name = "player1";
            player2_name = "PC";
            playerName_request("none")
            return [player1_name, player2_name]
        }
        else {
            playerNames = document.forms['players_name'];
            player1_name = playerNames['player1_name'].value;
            player2_name = playerNames['player2_name'].value;
            if (player1_name !== '' && player2_name !== '') {
                if (player1_name == player2_name) {
                    player1_name = player1_name + '-1'
                    player2_name = player2_name + '-2'
                }
                playerName_request("none")
                return [player1_name, player2_name]
            }
            else alert("Los campos no pueden estar vacios");
        }
    };


    const show_marks = (id, mark) => {
        const tiles = document.getElementById(`${id}`);
        tiles.innerHTML = `${mark}`
    };


    const disable_buttons = (state, tile, tile1, tile2) => {
        const tile_button = document.getElementsByClassName("tile_button");
        for (let i = 0; i < tile_button.length; i++) {
            tile_button[i].disabled = state;
        }
        tiles_winners(tile, tile1, tile2);
    };


    const tiles_winners = (tile, tile1, tile2) => {
        if (tile != null && tile1 != null && tile2 != null)
            document.getElementById(`${tile}`).style.color = "#fefefe";
        document.getElementById(`${tile}`).style.fontSize = "80px";
        document.getElementById(`${tile1}`).style.color = "#fefefe";
        document.getElementById(`${tile1}`).style.fontSize = "80px";
        document.getElementById(`${tile2}`).style.color = "#fefefe";
        document.getElementById(`${tile2}`).style.fontSize = "80px";
    };


    const player_winner_label = (player, state) => {
        player_winner = document.getElementById("winner");
        if (state)
            player_winner.innerHTML = "¡¡Ganador: " + player + "!!";
        else player_winner.innerHTML = "";
    };


    const delete_tiles = () => {
        let tiles_Elements = document.querySelectorAll(".tile_button");
        if (tiles_Elements.length > 0) {
            for (var i = 0; i < tiles_Elements.length; i++) {
                tiles_Elements[i].remove();
            }
        }
    };

    return {
        playerName_Controller,
        playerName_request,
        cpu_diff_Selection,
        show_marks,
        disable_buttons,
        player_winner_label,
        delete_tiles
    };
})();


displayController.playerName_request("block");
gameBoard.create_board(false);




