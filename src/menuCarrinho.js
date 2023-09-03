import { catalogo, salvarLocalStorage, lerLocalStorage } from "./utilidades";

const idsProdutoCarrinhoComQuantidade = lerLocalStorage('carrinho') ?? {};

function abrirCarrinho() {
  document.getElementById("carrinho").classList.remove("right-[-360px]");
  document.getElementById("carrinho").classList.add("right-[0px]");
}

function fecharCarrinho() {
  document.getElementById("carrinho").classList.remove("right-[0px]");
  document.getElementById("carrinho").classList.add("right-[-360px]");
}

function irParaCheckout() {
  if(Object.keys(idsProdutoCarrinhoComQuantidade).length === 0) {
    return;
  }
  window.location.href = "./checkout.html";
}

export function inicializarCarrinho() {
  const botaoFecharCarrinho = document.getElementById("fechar-carrinho");
  const botaoAbrirCarrinho = document.getElementById("abrir-carrinho");
  const botaoIrParaCheckout = document.getElementById("finalizar-compra")

  botaoFecharCarrinho.addEventListener("click", fecharCarrinho);
  botaoAbrirCarrinho.addEventListener("click", abrirCarrinho);
  botaoIrParaCheckout.addEventListener("click", irParaCheckout);
}

function removerDoCarrinho(idProduto) {
  delete idsProdutoCarrinhoComQuantidade[idProduto];
  salvarLocalStorage('carrinho', idsProdutoCarrinhoComQuantidade);
  atualizarPrecoCarrinho();
  renderizarProdutosCarrinho();
}

function incrementarQuantidadeProduto(idProduto) {
  idsProdutoCarrinhoComQuantidade[idProduto]++;
  salvarLocalStorage('carrinho', idsProdutoCarrinhoComQuantidade);
  atualizarPrecoCarrinho();
  atualizarQuantidade(idProduto);
}
function decrementarQuantidadeProduto(idProduto) {
  if(idsProdutoCarrinhoComQuantidade[idProduto] === 1) {
    removerDoCarrinho(idProduto);
    return;
  }
  idsProdutoCarrinhoComQuantidade[idProduto]--;
  salvarLocalStorage('carrinho', idsProdutoCarrinhoComQuantidade);
  atualizarPrecoCarrinho();
  atualizarQuantidade(idProduto);
}

function atualizarQuantidade(idProduto) {
  document.getElementById(`quantidade-${idProduto}`).innerText =
    idsProdutoCarrinhoComQuantidade[idProduto];
}

function desenharProduto(idProduto) {
  const produto = catalogo.find((p) => p.id === idProduto);
  const containerProdutosCarrinho =
    document.getElementById("produtos-carrinho");

  const elementoArticle = document.createElement('article');
  const articleClasses = ['flex', 'bg-slate-100', 'rounded-lg', 'p-1', 'relative'];
  for (const articleClass of articleClasses) {
    elementoArticle.classList.add(articleClass);
  }

  const cardProdutoCarrinho = `<button id="remover-item-${produto.id}" class="text-xl absolute top-0 right-2">
      <i class="fa-regular fa-circle-xmark text-cyan-700 hover:text-cyan-900"></i>
    </button>
    <img src="./assets/img/${produto.imagem}" alt="Carrinho: ${
    produto.nome
  }" class="h-24 rounded-lg">
    <div class="p-2 flex flex-col justify-between">
      <p class="text-slate-900 text-sm">${produto.nome}</p>
      <p class="text-slate-400 text-xs">Tamanho M</p>
      <p class="text-green-700 text-lg">$${produto.preco}</p>
    </div>
    <div class="flex text-slate-950 items-end absolute bottom-0 right-2 text-lg">
      <button id='decrementar-produto-${produto.id}'>-</button>
      <p id='quantidade-${produto.id}' class="ml-2">${
    idsProdutoCarrinhoComQuantidade[produto.id]
  }</p>
      <button class="ml-2" id='incrementar-produto-${produto.id}'>+</button>
    </div>`;

  elementoArticle.innerHTML = cardProdutoCarrinho;

  containerProdutosCarrinho.appendChild(elementoArticle);

  document
    .getElementById(`decrementar-produto-${produto.id}`)
    .addEventListener("click", () => decrementarQuantidadeProduto(produto.id));

    document
    .getElementById(`incrementar-produto-${produto.id}`)
    .addEventListener("click", () => incrementarQuantidadeProduto(produto.id));

    document
    .getElementById(`remover-item-${produto.id}`)
    .addEventListener("click", () => removerDoCarrinho(produto.id));
}

export function renderizarProdutosCarrinho() {
  const containerProdutosCarrinho =
    document.getElementById("produtos-carrinho");
    containerProdutosCarrinho.innerHTML = "";

  for(const idProduto in idsProdutoCarrinhoComQuantidade) {
    desenharProduto(idProduto);
  }  
}

export function adicionarAoCarrinho(idProduto) {
  if (idProduto in idsProdutoCarrinhoComQuantidade) {
    incrementarQuantidadeProduto(idProduto);

    return;
  }
  idsProdutoCarrinhoComQuantidade[idProduto] = 1;
  salvarLocalStorage('carrinho', idsProdutoCarrinhoComQuantidade);
  desenharProduto(idProduto);
  atualizarPrecoCarrinho();
}

export function atualizarPrecoCarrinho() {
  const precoCarrinho = document.getElementById("preco-total");
  let precoTotalCarrinho = 0;
  for (const idProdutoNoCarrinho in idsProdutoCarrinhoComQuantidade) {
    precoTotalCarrinho +=
      catalogo.find((p) => p.id === idProdutoNoCarrinho).preco *
      idsProdutoCarrinhoComQuantidade[idProdutoNoCarrinho];
  }
  precoCarrinho.innerText = `Total: $${precoTotalCarrinho}`;
}