// funcionalidade da sidebar
function showoptions() {
  const select = document.querySelector(".contatos");
  select.classList.remove("escondido");
}

function hideoptions() {
  const select = document.querySelector(".contatos");
  select.classList.add("escondido");
}
// função seleção de contato
let nomedestinatario = "";
function contactselect(element) {
  const before = document.querySelector(".check");
  if (before) {
    before.remove();
  }

  const verify = element.querySelector(".check");

  if (!verify) {
    element.innerHTML += `<ion-icon name="checkmark-sharp"class="check"></ion-icon>`;
  }
  const paragrafo = element.querySelector("p");
  if (paragrafo) {
    nomedestinatario = paragrafo.textContent;
  }
}
// função status privado ou público
let typemenssagem = "";
function choosevisibility(status) {
  const beforevisibility = document.querySelector(".visibility");

  if (beforevisibility) {
    beforevisibility.remove();
  }

  const visibility = status.querySelector(".visibility");

  if (!visibility) {
    status.innerHTML += `<ion-icon name="checkmark-sharp"class="visibility"></ion-icon>`;
  }
  const type = status.querySelector("p");
  if (type) {
    typemenssagem = type.textContent;
  }
}
// função para esconder sidebar
document.querySelector(".contatos").addEventListener("click", (event) => {
  // Verifica se o clique foi diretamente na área escura da .contatos
  if (event.target === event.currentTarget) {
    hideoptions();
  }
});

// função que mostra as mensagens na tela
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

const autualizarmensagens = setInterval(() => {
  axios
    .get(
      "https://mock-api.driven.com.br/api/v6/uol/messages/e349da6b-112a-48f4-8ca5-f82af4953adb"
    )
    .then((resposta) => {
      infomensagem = resposta.data;
      renderizarmensagens();
    });
}, 3000);

// função para add usuarios ativos na sidebar
let arraydeusuariosativos = [];
function atualizarSidebarUsuarios() {
  axios
    .get(
      "https://mock-api.driven.com.br/api/v6/uol/participants/e349da6b-112a-48f4-8ca5-f82af4953adb"
    )
    .then((res) => {
      arraydeusuariosativos = res.data;
      atualizarhtml();
    })
    .catch(() => {
      alert("não deu certo bebe!");
    });
}

function atualizarhtml() {
  const usuariosunicos = document.querySelector(".pessoas");
  usuariosunicos.innerHTML = `
          <div class="titulo">
            <p>Escolha um contato para <br />enviar mensagem:</p>
          </div>
          <div class="todos" onclick="contactselect(this)">
            <ion-icon name="people"></ion-icon>
            <p>todos</p>
          </div>`;
  for (let i = 0; i < arraydeusuariosativos.length; i++) {
    usuariosunicos.innerHTML += `
     <div class="Joao" onclick="contactselect(this)">
        <ion-icon name="person-circle"></ion-icon>
        <p>${arraydeusuariosativos[i].name}</p>
      </div>
   `;
  }
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
      alert("SUCESSO!!!");
    })
    .catch(() => {
      alert("ERRO!!");
    });
}

inserirnomedeusuario();
setInterval(atualizarSidebarUsuarios, 10000);
atualizarSidebarUsuarios();

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
  let escolhertipodamensagem =
    typemenssagem === "Reservadamente" ? "private_message" : "message";
  const input = document.querySelector(".inputmensagem");

  if (!nomedestinatario || nomedestinatario.trim() === "") {
    alert("Selecione um destinatário antes de enviar a mensagem!");
    return;
  }

  const novamensagem = {
    from: nomedeusuario,
    to: nomedestinatario,
    text: input.value,
    type: escolhertipodamensagem,
  };

  axios
    .post(
      "https://mock-api.driven.com.br/api/v6/uol/messages/e349da6b-112a-48f4-8ca5-f82af4953adb",
      novamensagem
    )
    .then(() => {
      input.value = "";
      buscarmensagens();
    });
}
