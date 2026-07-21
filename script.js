let segundos = 0, minutos = 0, horas = 0;
let intervalo;

function iniciar() {
  clearInterval(intervalo);
  intervalo = setInterval(timer, 1000);
}

function pausar() {
  clearInterval(intervalo);
}

function reiniciar() {
  clearInterval(intervalo);
  segundos = 0; minutos = 0; horas = 0;
  document.getElementById('display').innerText = "00:00:00";
}

function timer() {
  segundos++;
  if (segundos == 60) { segundos = 0; minutos++; }
  if (minutos == 60) { minutos = 0; horas++; }
  
  let h = horas < 10 ? "0" + horas : horas;
  let m = minutos < 10 ? "0" + minutos : minutos;
  let s = segundos < 10 ? "0" + segundos : segundos;
  
  document.getElementById('display').innerText = `${h}:${m}:${s}`;
}
