// funcionalidade da sidebar
function showoptions() {
  const select = document.querySelector(".contatos");
  select.classList.remove("escondido");
}

function hideoptions() {
  const select = document.querySelector(".contatos");
  select.classList.add("escondido");
}

function contactselect(element) {
  const before = document.querySelector(".check");
  if (before) {
    before.remove();
  }

  const verify = element.querySelector(".check");

  if (!verify) {
    element.innerHTML += `<ion-icon name="checkmark-sharp"class="check"></ion-icon>`;
  }
}

function choosevisibility(status) {
  const beforevisibility = document.querySelector(".visibility");

  if (beforevisibility) {
    beforevisibility.remove();
  }

  const visibility = status.querySelector(".visibility");

  if (!visibility) {
    status.innerHTML += `<ion-icon name="checkmark-sharp"class="visibility"></ion-icon>`;
  }
}

document.querySelector(".contatos").addEventListener("click", (event) => {
  // Verifica se o clique foi diretamente na área escura da .contatos
  if (event.target === event.currentTarget) {
    hideoptions();
  }
});

// função qeu mostra as mensagens na tela
let infomensagem = [];
function renderizarmensagens() {
  const localdasmensagens = document.querySelector(".conversas");
  localdasmensagens.innerHTML = "";

  for (let i = 0; i < infomensagem.length; i++) {
    const tipodamensagem = infomensagem[i].type;

    let classetipo = "";
    switch (tipodamensagem) {
      case "status":
        classetipo = "status-message";
        break;
      case "private_message":
        classetipo = "private-message";
        break;
      default:
        classetipo = "";
    }

    localdasmensagens.innerHTML += `
    <li class="conversa_1 ${classetipo}"}>
          <p class="data">(${infomensagem[i].time})</p>
          <p class="nome">${infomensagem[i].from}</p>
          <p class="texto">${infomensagem[i].text}</p>
        </li>`;
  }
}

// função para buscar mensagens
function buscarmensagens() {
  axios
    .get(
      "https://mock-api.driven.com.br/api/v6/uol/messages/e349da6b-112a-48f4-8ca5-f82af4953adb"
    )
    .then((resposta) => {
      infomensagem = resposta.data;
      renderizarmensagens();
      atualizarSidebarUsuarios();
    })
    .catch(() => {
      alert("infelizmente não deu certo!");
    });
}

buscarmensagens();

// função para add usuarios na sidebar
function atualizarSidebarUsuarios() {
  const usuariosUnicos = new Set();
  infomensagem.forEach((mensagem) => {
    if (mensagem.type !== "status") {
      usuariosUnicos.add(mensagem.from);
    }
  });

  const listaPessoas = document.querySelector(".pessoas");
  listaPessoas.innerHTML = `
    <div class="titulo">
      <p>Escolha um contato para <br />enviar mensagem:</p>
    </div>
    <div class="todos" onclick="contactselect(this)">
      <ion-icon name="people"></ion-icon>
      <p>Todos</p>
    </div>
  `;

  usuariosUnicos.forEach((usuario) => {
    listaPessoas.innerHTML += `
      <div class="Joao" onclick="contactselect(this)">
        <ion-icon name="person-circle"></ion-icon>
        <p>${usuario}</p>
      </div>
    `;
  });
}

// função que permite inserir e validar nome de usuário
function inserirnomedeusuario() {
  nomedeusuario = prompt("Qual o seu nome?");
  if (!nomedeusuario || nomedeusuario.trim() === "") {
    alert("insira um nome de usúario válido");
    inserirnomedeusuario();
  }
  const nomeenviarservidor = {
    name: nomedeusuario,
  };
  const requisicao = axios
    .post(
      "https://mock-api.driven.com.br/api/v6/uol/participants/e349da6b-112a-48f4-8ca5-f82af4953adb",
      nomeenviarservidor
    )
    .then(() => {
      alert("Nome enviado com sucesso para o server");
    })
    .catch(() => {
      alert("Não deu certo!");
    });
}

inserirnomedeusuario();

// função para manter online no servidor
const manteronline = setInterval(() => {
  const verificar = {
    name: nomedeusuario,
  };
  axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status/e349da6b-112a-48f4-8ca5-f82af4953adb",
    verificar
  );
}, 5000);

// Função que permite enviar menssagens
function addmensagem() {
  const input = document.querySelector(".inputmensagem");
  const novamensagem = {
    from: nomedeusuario,
    to: "Todos",
    text: input.value,
    type: "message",
  };

  axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages/e349da6b-112a-48f4-8ca5-f82af4953adb",
    novamensagem
  );
  input.value = "";
  renderizarmensagens();
}
