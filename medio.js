window.onload = function () {
  
  document.body.style.backgroundColor = "#000"; 

  const gameContainer = document.getElementById("game-container");
  const playerButton = document.getElementById("play-music");
  const lblResposta = document.getElementById("lbl-resposta");
  const resposta = document.getElementById("resposta");
  const btnResposta = document.getElementById("btn-resposta");

 

      setTimeout(() => {
        
        playerButton.classList.remove("hidden");
        resposta.classList.remove("hidden");
        lblResposta.classList.remove("hidden");
        btnResposta.classList.remove("hidden");

  }, 1000);
};



let player;
let trackName;
let pontos = 0;
let contador_musicas = 0;
var erros = 0;

function atualizarPontuacao() {
    const pontuacaoElement = document.getElementById("pontuacao");
    pontuacaoElement.innerText = pontos;
}

function decrementarPontos() {
    pontos -= 5;
    if (pontos < 0) {
        pontos = 0;  
    }
    atualizarPontuacao();
}

function reiniciarJogo() {
    alert("Você errou 3 vezes e perdeu o jogo!");
    window.location.href = "index.html"; 
}

window.onSpotifyWebPlaybackSDKReady = () => {

  const token ="BQCn96dxJ_XEGhQ6iI7vch5v0UZ8cMm24Xo1d7aRdEKqZDw4zGEgGPnsqDYy5HTmQnkYLiNvQ3JBS9KioOTMlQXg8_PGHni5At2ED_mUKR6nzPIgcQhl_cwmzOfkKkP6tDZXHRfRIasiKOuZKVoYzchZFOOXBA3J2XVWM2mTiPT5AovoTQ1fzZWmviZ9JhU5VuoDQgmA4nZlYmWmnK67hfMC4p0z"
    player = new Spotify.Player({
    name: "Web Playback SDK Quick Start Player",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    const connect_to_device = () => {
      let album_uri = "spotify:playlist:2F7LkPbQlqD2QGSxNBZKq9"
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: "PUT",
        body: JSON.stringify({
          context_uri: album_uri,
          play: false,
        }),
        headers: new Headers({
            "Authorization": "Bearer " + token,
        }),
    }).then(response => console.log(response))
    .then(data => {
    
      player.addListener('player_state_changed', ({
        track_window
      }) => {
        trackName = track_window.current_track.name;
        trackName = trackName.toLowerCase();
        console.log('Current Track:', trackName);
      });})}
    connect_to_device();
  });


document.getElementById("play-music").addEventListener('click', () => {
  if (!player.paused) {
      decrementarPontos();
  }
  player.togglePlay();
  setTimeout(() => {
      player.pause();
  }, 40000);
});
  
document.getElementById("btn-resposta").addEventListener('click', (event) => {
  event.preventDefault();
  let respostaElement = document.getElementById("resposta");
  let resposta = respostaElement.value;
  resposta = resposta.toLowerCase();
  if (resposta == trackName) {
      alert("Você Acertou, Parabéns!");
      pontos += 10;
      atualizarPontuacao();
      contador_musicas++;
     

      
      if (contador_musicas === 5) {
        alert('PARABÉNS, Você finalizou o jogo!!!');
        var v_pontuacao = JSON.parse(localStorage.getItem('pontos_jogador')) || [];
        v_pontuacao.push(pontos);
        localStorage.setItem('pontos_jogador', JSON.stringify(v_pontuacao));
        
       
        window.location.href = "nivel.html";
      }
      
      
      player.nextTrack();
      
      setTimeout(() => {
          player.pause();
      }, 10000);
      document.getElementById('resposta').value=''; 
      
      document.getElementById("resposta").reset();
  } else {
      document.getElementById('resposta').value=''; 
      alert("Você errou, tente novamente!");
      erros++;
      decrementarPontos();  
      if (erros === 3) {
          var v_pontuacao = JSON.parse(localStorage.getItem('pontos_jogador')) || [];
          v_pontuacao.push(pontos);
          localStorage.setItem('pontos_jogador', JSON.stringify(v_pontuacao));
          reiniciarJogo();
      }
  }
});

player.connect();
};