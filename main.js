import { renderizarCatalogo } from "./src/cardproduto";
import { incializarFiltros } from "./src/filtrosCatalogo";
import { atualizarPrecoCarrinho, inicializarCarrinho, renderizarProdutosCarrinho } from "./src/menuCarrinho";


renderizarCatalogo();
inicializarCarrinho();
renderizarProdutosCarrinho();
atualizarPrecoCarrinho();
incializarFiltros();