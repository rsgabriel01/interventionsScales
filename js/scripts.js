//#region Definitions
let inLoading = false;
let scaleInWindow = 1;

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

let modalInsertIntervention = document.getElementById(
  "modalInsertIntervention"
);
let modalQuestionYesNo = document.getElementById("modalQuestionYesNo");

let formInserIntervention = document.getElementById("formInserIntervention");

const fields = document.querySelectorAll("[required]");

const spansError = document.querySelectorAll("span.error");

let textQuestionYesNo = document.getElementById("textQuestionYesNo");

let inputLogin = document.getElementById("inputLogin");
let inputPassword = document.getElementById("inputPassword");
let txtAreaObservation = document.getElementById("txtAreaObservation");

let btnIntervention = document.getElementById("btnIntervention");
let btnSaveIntervention = document.getElementById("btnSaveIntervention");
let btnCancelIntervention = document.getElementById("btnCancelIntervention");
let btnScaleIn = document.getElementById("btnScaleIn");
let btnScaleOut = document.getElementById("btnScaleOut");
let btnQuestionNo = document.getElementById("btnQuestionNo");
let btnQuestionYes = document.getElementById("btnQuestionYes");

let xCloseModalInsertIntervention = document.getElementById(
  "xCloseModalInsertIntervention"
);
let xCloseModalQuestionYesNo = document.getElementById(
  "xCloseModalQuestionYesNo"
);

//#endregion

//#region Renders

//#region Alter Title
function alterTitleScale(scale) {
  let titleBalanca = document.getElementById("title-balanca");

  if (scale == 1) {
    titleBalanca.innerHTML = "BALANÇA DE ENTRADA";
  } else if (scale == 2) {
    titleBalanca.innerHTML = "BALANÇA DE SAÍDA";
  }
}
//#endregion

//#region Timer Last Interventions
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

//#endregion

//#endregion

//#region Load timer Scales
window.onload = getLastIntervention(1);

setInterval(() => {
  getLastIntervention(scaleInWindow);
}, 600000);
//#endregion

//#region Loadings
function loading(estado) {
  if (estado === "inicio") {
    inLoading = true;
    body.classList.add("loading");
  } else if (estado === "fim") {
    inLoading = false;
    body.classList.remove("loading");
  }
}

function loadingSaveIntervention(estado) {
  if (estado === "inicio") {
    inLoading = true;
    btnSaveIntervention.classList.add("saveInterventionLoading");
  } else if (estado === "fim") {
    inLoading = false;
    btnSaveIntervention.classList.remove("saveInterventionLoading");
  }
}
//#endregion

//#region Ajax Conections

//#region Get Last Intervention
async function getLastIntervention(scale) {
  loading("inicio");

  await $.ajax({
    method: "GET",
    url: `https://intervencaobalancas.herokuapp.com/api/interventions/last/${scale}`,
    success: function (data) {
      // console.log(data);
      segundos = data.tempLastIntervention.seconds;
      minutos = data.tempLastIntervention.minutes;
      horas = data.tempLastIntervention.hours;
      dias = data.tempLastIntervention.days;
      recordeElement.innerHTML = `Nosso recorde é: ${data.recorde}`;
      alterTitleScale(scale);
      // console.log(scale);

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
//#endregion

//#region Insert Intervention
async function insertIntervention(login, password, scale, observation) {
  inputLogin.style = "";
  inputPassword.style = "";
  txtAreaObservation.style = "";

  loading("inicio");

  let data = {
    login: login,
    password: password,
    scale: scale,
    observation: observation,
  };

  await $.ajax({
    method: "POST",
    url: `https://intervencaobalancas.herokuapp.com/api/interventions/create`,
    data,
    success: function (data) {
      // console.log(data);
      loading("fim");
      sucessNotification("Intervenção informada com sucesso.");
      closeModalInsertIntervention("postSave");
    },
    error: function (request, status, error) {
      const attentionMessage = request.responseJSON.attention;

      if (attentionMessage) {
        if (
          attentionMessage ==
          "A senha digitada está incorreta. Tente novamente."
        ) {
          inputPassword.style = "border-bottom: 1px solid red";
          warningNotification(attentionMessage);
        } else if (
          attentionMessage ==
          "O usuário informado não existe. Por favor verifique."
        ) {
          inputLogin.style = "border-bottom: 1px solid red";
          warningNotification(attentionMessage);
        }
      } else {
        errorNotification(`
        Request Error - 
        Status Code: ${request.status};
        StatusText: ${request.statusText};
        Response Text: ${request.responseText};`);
      }
      loading("fim");
    },
  });
}
//#endregion

//#endregion

//#region Alter Page Scale

btnScaleIn.addEventListener("click", () => {
  scaleInWindow = 1;
  getLastIntervention(1);
});

btnScaleOut.addEventListener("click", () => {
  scaleInWindow = 2;
  getLastIntervention(2);
});

//#endregion

//#region Modal Insert Intervention

btnIntervention.onclick = function () {
  modalInsertIntervention.style.display = "block";
  inactiveSpanError(spansError, fields);
};

function closeModalInsertIntervention(type) {
  if (type == "postSave") {
    // console.log("close postSave");
    modalInsertIntervention.style.display = "none";
    clearFields();
    getLastIntervention(scaleInWindow);
  } else if (type == "noSave") {
    // console.log("close noSave");
    modalInsertIntervention.style.display = "none";
    clearFields();
  }
}

xCloseModalInsertIntervention.addEventListener("click", () => {
  if (verifyEmptyFields() == true) {
    closeModalInsertIntervention("noSave");
  } else {
    modalQuestionYesNo.style.display = "block";

    textQuestionYesNo.innerText =
      "Voce tem certeza que deseja cancelar essa operação?";

    btnQuestionNo.onclick = () => {
      closeModalQuestionYesNo();
    };

    btnQuestionYes.onclick = () => {
      closeModalQuestionYesNo();
      closeModalInsertIntervention("noSave");
    };
  }
});

btnCancelIntervention.addEventListener("click", () => {
  if (verifyEmptyFields() == true) {
    closeModalInsertIntervention("noSave");
  } else {
    // console.log("else");

    modalQuestionYesNo.style.display = "block";

    textQuestionYesNo.innerText =
      "Voce tem certeza que deseja cancelar essa operação?";

    btnQuestionNo.onclick = () => {
      closeModalQuestionYesNo();
    };

    btnQuestionYes.onclick = () => {
      closeModalQuestionYesNo();
      closeModalInsertIntervention("noSave");
    };
  }
});

//#region Clear Fields
function clearFields() {
  for (field of fields) {
    field.value = "";
  }
}

function verifyEmptyFields() {
  for (field of fields) {
    if (field.value == "" || field.value == null) {
      return true;
    } else {
      return false;
    }
  }
}
//#endregion

//#region Save Intervention

formInserIntervention.addEventListener("submit", (event) => {
  event.preventDefault();

  let login = inputLogin.value;
  let password = inputPassword.value;
  let observation = txtAreaObservation.value;
  let scale = scaleInWindow;

  modalQuestionYesNo.style.display = "block";

  textQuestionYesNo.innerText =
    "Voce tem certeza que deseja SALVAR essa operação?";

  btnQuestionNo.onclick = () => {
    closeModalQuestionYesNo();
  };

  btnQuestionYes.onclick = async () => {
    closeModalQuestionYesNo();
    await insertIntervention(login, password, scale, observation);
    closeModalInsertIntervention("postSave");
  };

  //
});
//#endregion

//#endregion

//#region Modal Question Yes or Nor

function closeModalQuestionYesNo() {
  modalQuestionYesNo.style.display = "none";
}

xCloseModalQuestionYesNo.onclick = () => {
  closeModalQuestionYesNo();
};

//#endregion

//#region Notifications

function sucessNotification(text) {
  Toastify({
    text: `
    <i class="fas fa-check-circle fa-lg"></i>
    ${text}
    `,
    duration: 4000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    backgroundColor: "#73a34f",
    stopOnFocus: true, // Prevents dismissing of toast on hover
    onClick: function () {}, // Callback after click
  }).showToast();
}

function warningNotification(text) {
  Toastify({
    text: `
    <i class="fas fa-exclamation-circle fa-lg"></i>
    ${text}
    `,
    duration: 4000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    backgroundColor: "#babd25", //#babd25 #d5d821
    stopOnFocus: true, // Prevents dismissing of toast on hover
    onClick: function () {}, // Callback after click
  }).showToast();
}

function errorNotification(text) {
  Toastify({
    text: `
    <i class="fas fa-exclamation-triangle fa-lg"></i>
    Ops, algo deu errado.
    ${text}
    `,
    duration: 0,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    backgroundColor: "#751a20",
    stopOnFocus: true, // Prevents dismissing of toast on hover
    onClick: function () {}, // Callback after click
  }).showToast();
}

//#endregion

//#region Custom Error Messages
function ValidateField(field) {
  // logica para verificar se existem erros
  function verifyErrors() {
    let foundError = false;

    for (let error in field.validity) {
      // se não for customError
      // então verifica se tem erro
      if (field.validity[error] && !field.validity.valid) {
        // console.log(field.validity);

        foundError = error;
      }
    }
    return foundError;
  }

  function customMessage(typeError) {
    // console.log(typeError);
    const messages = {
      text: {
        valueMissing: "Por favor, preencha este campo.",
      },
      password: {
        valueMissing: "Por favor, preencha este campo.",
        tooShort:
          "Este campo precisa ter no minimo 8 e no máximo 16 caracateres.",
        tooLong: "Este campo pode ter no máximo 16 caracateres.",
      },
      textarea: {
        valueMissing: "Por favor, preencha este campo.",
        tooLong: "Este campo pode ter no máximo 230 caracateres.",
      },
    };

    return messages[field.type][typeError];
  }

  function setCustomMessage(message) {
    const spanError = field.parentNode.querySelector("span.error");

    if (message) {
      spanError.classList.add("active");
      spanError.innerHTML = message;
      field.style = "border-bottom: 1px solid red";
    } else {
      spanError.classList.remove("active");
      spanError.innerHTML = "";
      field.style = "";
    }
  }

  return function () {
    const error = verifyErrors();

    if (error) {
      const message = customMessage(error);
      console.log(error);

      if (error == "valueMissing") {
        field.classList.remove("error");
      } else {
        field.classList.add("error");
      }
      setCustomMessage(message);
    } else {
      field.classList.remove("error");
      setCustomMessage();
    }
  };
}

function customValidation(event) {
  const field = event.target;
  const validation = ValidateField(field);

  validation();
}

for (field of fields) {
  field.addEventListener("invalid", (event) => {
    // eliminar o bubble
    event.preventDefault();

    customValidation(event);
  });
  field.addEventListener("blur", customValidation);
}

function inactiveSpanError(spans, fields) {
  for (const spanError of spans) {
    spanError.classList.remove("active");
    spanError.innerHTML = "";
    console.log(spanError);
  }
  for (const fieldError of fields) {
    fieldError.style = "";
  }
}
//#endregion
