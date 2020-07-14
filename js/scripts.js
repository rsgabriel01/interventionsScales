let segundos;
let minutos;
let horas;
let dias;

let diasElement = document.getElementById("dias");
let horasElement = document.getElementById("horas");
let minutosElement = document.getElementById("minutos");
let segundosElement = document.getElementById("segundos");
let recordeElement = document.getElementById("recorde");
let body = document.querySelector("body");
console.log(body);

function alterTitleScale(scale) {
  let titleBalanca = document.getElementById("title-balanca");

  if (scale == 1) {
    titleBalanca.innerHTML = "BALANÇA DE ENTRADA";
  } else if (scale == 2) {
    titleBalanca.innerHTML = "BALANÇA DE SAÍDA";
  }
}

function loading(estado) {
  if (estado === "inicio") {
    body.classList.add("loading");
  } else if (estado === "fim") {
    body.classList.remove("loading");
  }
}

async function getLastIntervention(scale) {
  loading("inicio");

  await $.ajax({
    method: "GET",
    url: `https://intervencaobalancas.herokuapp.com/api/interventions/last/${scale}`,
    success: function (data) {
      console.log(data);
      segundos = data.tempLastIntervention.seconds;
      minutos = data.tempLastIntervention.minutes;
      horas = data.tempLastIntervention.hours;
      dias = data.tempLastIntervention.days;
      recordeElement.innerHTML = `Nosso recorde é: ${data.recorde}`;
      alterTitleScale(scale);
      console.log(scale);

      loading("fim");
    },
    error: function (request, status, error) {
      console.log(request.responseJSON);
      console.log(status);
      console.log(error);
      loading("fim");
    },
  });
}

window.onload = getLastIntervention(1);

/*Count Timer*/
setInterval(() => {
  segundos++;

  if (segundos == 60) {
    segundos = 0;
    minutos++;
  }

  if (minutos == 60) {
    minutos = 0;
    horas++;
  }

  if (horas == 24) {
    horas = 0;
    dias++;
  }

  if (segundos.toString().length < 2) {
    segundosElement.innerHTML = "0" + segundos.toString();
  } else {
    segundosElement.innerHTML = segundos;
  }

  if (minutos.toString().length < 2) {
    minutosElement.innerHTML = "0" + minutos.toString();
  } else {
    minutosElement.innerHTML = minutos;
  }

  if (horas.toString().length < 2) {
    horasElement.innerHTML = "0" + horas.toString();
  } else {
    horasElement.innerHTML = horas;
  }

  if (dias.toString().length < 2) {
    diasElement.innerHTML = "0" + dias.toString();
  } else {
    diasElement.innerHTML = dias;
  }
}, 1000);
/*************/

/*Modal Insert Intervention*/

let modal = document.getElementById("myModal");

let intervencaoBtn = document.getElementById("btn-intervencao");

let closeModal = document.getElementById("closeModal");

let cancelInterventionBtn = document.getElementById("cancelIntervention");

intervencaoBtn.onclick = function () {
  modal.style.display = "block";
};

closeModal.onclick = function () {
  if (verificaCamposVazios() == true) {
    modal.style.display = "none";
    limpaCampos();
  } else {
    console.log("algum campo preenchido");
  }
};

cancelInterventionBtn.onclick = function () {
  if (verificaCamposVazios() == true) {
    modal.style.display = "none";
    limpaCampos();
  } else {
    console.log("algum campo preenchido");
  }
};

window.onclick = function (event) {
  if (event.target == modal) {
    if (verificaCamposVazios() == true) {
      modal.style.display = "none";
      limpaCampos();
    } else {
      console.log("algum campo preenchido");
    }
  }
};

/**************************/

/* Limpa campos */
function limpaCampos() {
  const fields = document.querySelectorAll("[required]");

  for (field of fields) {
    field.value = "";
  }
}

function verificaCamposVazios() {
  const fields = document.querySelectorAll("[required]");

  for (field of fields) {
    if (field.value == "" || field.value == null) {
      return true;
    } else {
      return false;
    }
  }
}

/****************/
