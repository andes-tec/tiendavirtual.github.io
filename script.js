const PRODUCTOS_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vT01W_sdVzCDrkICZ_oMsrvOfj2_nT5xFAH-RWqrVESTv99pUQd9U7EUOZIEmJQ7O2Q9GH6wW_xMHng/pub?gid=0&single=true&output=csv";
const APPS_SCRIPT_PEDIDOS_URL="https://script.google.com/macros/s/AKfycbzZe6FTw16uxzEyvFH7r8ie5CjDRUGDEcmzvJwGUNC-g_dOMikKfep_zubZeGGSSqGCXg/exec";
const WHATSAPP_NUMBER="5493875048697";
const ADEREZOS_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vT01W_sdVzCDrkICZ_oMsrvOfj2_nT5xFAH-RWqrVESTv99pUQd9U7EUOZIEmJQ7O2Q9GH6wW_xMHng/pub?gid=248250282&single=true&output=csv";
const ALIAS_TRANSFERENCIA="sandwich.sofi.mp";
let productos=[],carrito=[],currentCategory="all",currentSlide=0,slideInterval,aderezosDisponibles=["Mayonesa","Mostaza","Ketcup","Barbacoa"],isSubmitting=false,currentLang="es";
let currentDisplayedOrder = null;
let isAllOrdersModalOpen = false;
let currentProductDetailId = null;

// Diccionario de respaldo para descripciones de productos (solo si no existe descripcion_en)
const productDescTranslations = {
  "Pan de campo, milanesa de pollo, lechuga, tomate y mayonesa.": "Country bread, chicken milanesa, lettuce, tomato and mayonnaise.",
};

function getProductDescription(prod) {
  if (currentLang === "es") return prod.descripcion || "";
  if (prod.descripcion_en && prod.descripcion_en.trim() !== "") return prod.descripcion_en;
  if (productDescTranslations[prod.descripcion]) return productDescTranslations[prod.descripcion];
  return prod.descripcion || "";
}

const TRANSLATIONS={
es:{tagline:"Los Mejores Sandwiches · Envios a domicilio",btnUltimoPedido:"📋 Ultimo pedido",btnMisPedidos:"📜 Mis pedidos",productosLabel:"productos",verCarrito:"Ver carrito",cargandoProductos:"Cargando productos...",footerTagline:"Los mejores sandwiches de la ciudad.",footerHorario:"Horarios",footerLunesVier:"Lun - Vie: 11:00 - 22:00",footerSabDom:"Sab - Dom: 12:00 - 23:00",footerEnvioMin:"🛵 Envio minimo: $500",footerSeguinos:"Seguinos",footerSeguro:"Pedidos 100% seguros · Recibilos en tu domicilio",tuCarrito:"Tu carrito",total:"Total",finalizarPedido:"Finalizar pedido",datosPedido:"Datos del pedido",secDatosCliente:"Datos del cliente",labelNombre:"Nombre completo *",placeholderNombre:"Ej: Ana Gonzalez",labelTelefono:"Telefono *",placeholderTelefono:"11 2345 6789",secTipoPedido:"Como lo recibis?",aDomicilio:"A domicilio",enLocal:"Consumo en local",labelDireccion:"Direccion de envio *",placeholderDireccion:"Calle, numero, ciudad",labelMesa:"Numero de mesa *",placeholderMesa:"Ej: Mesa 5",secAderezos:"Aderezos adicionales",opcional:"opcional",secMetodoPago:"Metodo de pago",efectivo:"Efectivo (contra entrega)",transferencia:"Transferencia bancaria",aliasParaTransferir:"Alias para transferir:",copiar:"Copiar",secNotas:"Notas / Instrucciones",placeholderNotas:"Ej: sin cebolla, timbre, etc.",confirmarPedido:"Confirmar pedido y enviar",detallePedido:"Detalle del pedido",repetirPedido:"🔄 Repetir este pedido",historialPedidos:"Historial de pedidos",agregarCarrito:"Agregar al carrito",preparandoPedido:"✨ Preparando tu pedido! ✨",redirigendoWhatsapp:"En unos segundos te llevaremos a WhatsApp para confirmar...",todosBtn:"🛍️ Todos",carritoVacio:"🛒 El carrito esta vacio.",productoAgregado:"agregado",productoEliminado:"Producto eliminado",sinPedidos:"No hay pedidos previos",agregarProductos:"Agrega productos",aliasCop:"Alias copiado",enviandoMsg:"⏳ Enviando...",pedidoEnviado:"✅ Pedido enviado. Abriendo WhatsApp...",errorEnvio:"Error al enviar el pedido. Intenta de nuevo.",nombreReq:"Por favor ingresa tu nombre",telefonoReq:"Ingresa un telefono valido",direccionReq:"La direccion de envio es requerida",mesaReq:"Indica el numero de mesa",carritoVacioSend:"El carrito esta vacio",
fecha:"📅 Fecha",cliente:"👤 Cliente",telefono:"📞 Teléfono",ubicacion:"📍 Ubicación",pago:"💳 Pago",aderezos:"🥫 Aderezos",sinAderezosExtra:"Sin aderezos extra",totalLabel:"Total",productosHeader:"🛍️ Productos"},
en:{tagline:"Best Sandwiches · Home delivery",btnUltimoPedido:"📋 Last order",btnMisPedidos:"📜 My orders",productosLabel:"items",verCarrito:"View cart",cargandoProductos:"Loading products...",footerTagline:"The best sandwiches in town.",footerHorario:"Hours",footerLunesVier:"Mon - Fri: 11:00 - 22:00",footerSabDom:"Sat - Sun: 12:00 - 23:00",footerEnvioMin:"🛵 Min. delivery: $500",footerSeguinos:"Follow us",footerSeguro:"100% secure orders · Get them at your door",tuCarrito:"Your cart",total:"Total",finalizarPedido:"Checkout",datosPedido:"Order details",secDatosCliente:"Customer info",labelNombre:"Full name *",placeholderNombre:"Ex: John Smith",labelTelefono:"Phone *",placeholderTelefono:"555 123 4567",secTipoPedido:"How do you want it?",aDomicilio:"Home delivery",enLocal:"Dine in",labelDireccion:"Delivery address *",placeholderDireccion:"Street, number, city",labelMesa:"Table number *",placeholderMesa:"Ex: Table 5",secAderezos:"Extra sauces",opcional:"optional",secMetodoPago:"Payment method",efectivo:"Cash on delivery",transferencia:"Bank transfer",aliasParaTransferir:"Transfer alias:",copiar:"Copy",secNotas:"Notes / Instructions",placeholderNotas:"Ex: no onion, ring the bell, etc.",confirmarPedido:"Confirm & send order",detallePedido:"Order detail",repetirPedido:"🔄 Repeat this order",historialPedidos:"Order history",agregarCarrito:"Add to cart",preparandoPedido:"✨ Preparing your order! ✨",redirigendoWhatsapp:"In a few seconds we'll open WhatsApp...",todosBtn:"🛍️ All",carritoVacio:"🛒 Your cart is empty.",productoAgregado:"added",productoEliminado:"Item removed",sinPedidos:"No previous orders",agregarProductos:"Add items first",aliasCop:"Alias copied",enviandoMsg:"⏳ Sending...",pedidoEnviado:"✅ Order sent. Opening WhatsApp...",errorEnvio:"Error sending order. Please try again.",nombreReq:"Please enter your name",telefonoReq:"Enter a valid phone number",direccionReq:"Delivery address is required",mesaReq:"Please indicate the table number",carritoVacioSend:"Your cart is empty",
fecha:"📅 Date",cliente:"👤 Customer",telefono:"📞 Phone",ubicacion:"📍 Location",pago:"💳 Payment",aderezos:"🥫 Sauces",sinAderezosExtra:"No extra sauces",totalLabel:"Total",productosHeader:"🛍️ Products"}
};
function t(k){return TRANSLATIONS[currentLang][k]||TRANSLATIONS.es[k]||k;}
function applyLang(lang){
  currentLang=lang;
  document.getElementById("htmlRoot").lang=lang;
  document.getElementById("langES").classList.toggle("active",lang==="es");
  document.getElementById("langEN").classList.toggle("active",lang==="en");
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k=el.dataset.i18n;
    if(el.tagName==="INPUT"||el.tagName==="TEXTAREA")el.placeholder=t(k);
    else el.textContent=t(k);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
    el.placeholder=t(el.dataset.i18nPlaceholder);
  });
  refreshUILang();
  localStorage.setItem("sofi_lang",lang);
}

function refreshUILang(){
  renderCategorias();
  renderProductos();
  const cartModal = document.getElementById("cartModal");
  if(cartModal.classList.contains("active")) renderCartModal();
  const orderDetailModal = document.getElementById("orderDetailModal");
  if(orderDetailModal.classList.contains("active") && currentDisplayedOrder){
    mostrarDetallePedido(currentDisplayedOrder, true);
  }
  if(isAllOrdersModalOpen){
    mostrarHistorialCompleto();
  }
  const productModal = document.getElementById("productDetailModal");
  if(productModal.classList.contains("active") && currentProductDetailId){
    const prod = productos.find(p => p.id == currentProductDetailId);
    if(prod) actualizarDescripcionProductoModal(prod);
  }
  // Actualizar barra de notificaciones al cambiar idioma
  cargarYMostrarNotificaciones();
}

function getFormattedDateTime(){const n=new Date();return new Intl.DateTimeFormat("es-AR",{timeZone:"America/Argentina/Buenos_Aires",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(n).replace(/\//g,"/");}
function showToast(msg,duration=3000){const el=document.getElementById("toastMessage");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),duration);}
function escapeHtml(s){if(!s)return"";return s.replace(/[&<>]/g,m=>m==="&"?"&amp;":m==="<"?"&lt;":"&gt;");}
function showLoading(show){document.getElementById("loadingOverlay").style.display=show?"flex":"none";}
function setFieldError(id,msg){const el=document.getElementById(id);if(el){el.textContent=msg;}}
function clearErrors(){["errorNombre","errorTelefono","errorDireccion","errorMesa"].forEach(id=>setFieldError(id,""));}

function saveCart(){localStorage.setItem("tienda_cart",JSON.stringify(carrito));}
function loadCart(){const s=localStorage.getItem("tienda_cart");if(s)try{carrito=JSON.parse(s);updateCartUI();}catch(e){}}
function updateCartUI(){
  const tot=carrito.reduce((s,i)=>s+i.cantidad,0);
  const price=carrito.reduce((s,i)=>s+i.precio*i.cantidad,0);
  document.getElementById("cartCount").textContent=tot;
  document.getElementById("cartTotal").innerHTML="$"+price.toFixed(2);
  document.getElementById("floatingCartCount").textContent=tot;
  saveCart();
}
function addToCart(productId,delta=1){
  const prod=productos.find(p=>p.id==productId);if(!prod)return;
  const ex=carrito.find(i=>i.id==productId);
  if(ex){const nq=ex.cantidad+delta;if(nq<=0)carrito=carrito.filter(i=>i.id!=productId);else ex.cantidad=nq;}
  else if(delta>0)carrito.push({id:prod.id,nombre:prod.nombre,precio:prod.precio,cantidad:1});
  updateCartUI();
  if(delta>0)showToast("➕ "+prod.nombre+" "+t("productoAgregado"));
  if(document.getElementById("cartModal").classList.contains("active"))renderCartModal();
}
function removeFromCart(id){carrito=carrito.filter(i=>i.id!=id);updateCartUI();renderCartModal();showToast(t("productoEliminado"));}
function renderCartModal(){
  const c=document.getElementById("cartItemsList"),mt=document.getElementById("modalCartTotal");
  if(!carrito.length){c.innerHTML='<div class="empty-cart">'+t("carritoVacio")+'</div>';mt.textContent="$0";return;}
  let html="",total=0;
  carrito.forEach(item=>{
    const sub=item.precio*item.cantidad;total+=sub;
    html+=`<div class="cart-item" data-id="${item.id}"><div><strong>${escapeHtml(item.nombre)}</strong><br><small>$${item.precio.toFixed(2)} c/u</small></div><div class="cart-item-actions"><button class="qty-btn decr">-</button><span class="cart-item-qty">${item.cantidad}</span><button class="qty-btn incr">+</button><button class="remove-item">🗑️</button></div></div>`;
  });
  c.innerHTML=html;mt.textContent="$"+total.toFixed(2);
  c.querySelectorAll(".cart-item").forEach(el=>{
    const id=el.dataset.id;
    el.querySelector(".decr").onclick=()=>addToCart(id,-1);
    el.querySelector(".incr").onclick=()=>addToCart(id,1);
    el.querySelector(".remove-item").onclick=()=>removeFromCart(id);
  });
}

// ---------- NOTIFICACIONES BILINGÜES ----------
function cargarYMostrarNotificaciones() {
  const container = document.getElementById("infoBarTrack");
  if (!container) return;
  // Recolectar textos según el idioma actual
  const notificacionesSet = new Set();
  productos.forEach(prod => {
    let texto = "";
    if (currentLang === "es") {
      texto = prod.notificacion || "";
    } else {
      texto = prod.notificacion_en || prod.notificacion || ""; // fallback al español si no tiene inglés
    }
    if (texto && texto.trim() !== "") {
      notificacionesSet.add(texto.trim());
    }
  });
  let notificacionesArray = Array.from(notificacionesSet);
  if (notificacionesArray.length === 0) {
    // Textos por defecto bilingües
    if (currentLang === "es") {
      notificacionesArray = ["📞 WhatsApp: 3875048697", "🕒 Horario: 11 a 22hs", "🚚 Envío mínimo $500"];
    } else {
      notificacionesArray = ["📞 WhatsApp: 3875048697", "🕒 Hours: 11am to 10pm", "🚚 Min. delivery $500"];
    }
  }
  // Duplicar para efecto infinito
  const notificacionesDuplicadas = [...notificacionesArray, ...notificacionesArray];
  const html = notificacionesDuplicadas.map(texto => `<span>${escapeHtml(texto)}</span>`).join("");
  container.innerHTML = html;
}

async function cargarProductos(){
  try{
    const resp=await fetch(PRODUCTOS_CSV_URL);const csvText=await resp.text();
    const rows=csvText.split(/\r?\n/);if(rows.length<2)throw new Error("CSV vacio");
    const headers=rows[0].split(",").map(h=>h.trim().toLowerCase());
    productos=[];
    for(let i=1;i<rows.length;i++){
      if(!rows[i].trim())continue;
      let vals=[],inside=false,val="";
      for(let ch of rows[i]){if(ch==='"')inside=!inside;else if(ch===","&&!inside){vals.push(val.trim());val="";}else val+=ch;}
      vals.push(val.trim());
      const obj={};headers.forEach((h,idx)=>{obj[h]=vals[idx]||"";});
      if(obj.activo&&obj.activo.toUpperCase()!=="TRUE")continue;
      const desc_es = obj.descripcion || "";
      const desc_en = obj.descripcion_en || "";
      const notif_es = obj.notificacion || "";
      const notif_en = obj.notificacion_en || "";
      productos.push({
        id:obj.id,
        nombre:obj.nombre,
        descripcion:desc_es,
        descripcion_en:desc_en,
        notificacion:notif_es,
        notificacion_en:notif_en,
        precio:parseFloat(obj.precio)||0,
        categoria:obj.categoria||"General",
        imagen:obj.imagen_url||"https://placehold.co/400x400?text=Producto"
      });
    }
    renderCategorias();renderProductos();
    cargarYMostrarNotificaciones();
  }catch(err){console.error(err);document.getElementById("productsContainer").innerHTML='<div class="loading">❌ Error cargando productos.</div>';}
}

function renderCategorias(){
  const cats=[...new Set(productos.map(p=>p.categoria))];
  let html=`<button class="cat-btn ${currentCategory==="all"?"active":""}" data-cat="all">${t("todosBtn")}</button>`;
  cats.forEach(c=>{html+=`<button class="cat-btn ${currentCategory===c?"active":""}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`;});
  document.getElementById("categoriesContainer").innerHTML=html;
  document.querySelectorAll(".cat-btn").forEach(btn=>{btn.addEventListener("click",()=>{currentCategory=btn.dataset.cat;renderCategorias();renderProductos();});});
}

function renderProductos(){
  const filtered=currentCategory==="all"?productos:productos.filter(p=>p.categoria===currentCategory);
  const container=document.getElementById("productsContainer");
  if(!filtered.length){container.innerHTML='<div class="loading">📦 No hay productos.</div>';return;}
  let html="";
  filtered.forEach(p=>{
    html+=`<div class="product-card" data-id="${p.id}">
      <div class="product-img-wrap">
        <img class="product-img" src="${escapeHtml(p.imagen)}" alt="${escapeHtml(p.nombre)}" loading="lazy" onerror="this.src='https://placehold.co/400x400?text=Error'">
        <div class="product-view-badge">🔍</div>
      </div>
      <div class="product-info">
        <div class="product-title">${escapeHtml(p.nombre)}</div>
        <div class="product-price">$${p.precio.toFixed(2)}</div>
        <button class="add-to-cart" data-id="${p.id}">🛒 ${t("agregarCarrito")}</button>
      </div>
    </div>`;
  });
  container.innerHTML=html;
  container.querySelectorAll(".product-card").forEach(card=>{
    card.addEventListener("click",e=>{
      if(!e.target.classList.contains("add-to-cart"))abrirDetalleProducto(card.dataset.id);
    });
  });
  container.querySelectorAll(".add-to-cart").forEach(btn=>{
    btn.addEventListener("click",e=>{e.stopPropagation();addToCart(btn.dataset.id,1);});
  });
}

function actualizarDescripcionProductoModal(prod){
  const descElement = document.getElementById("pdDesc");
  if(descElement){
    descElement.textContent = getProductDescription(prod);
  }
}

function abrirDetalleProducto(id){
  const p=productos.find(x=>x.id==id);if(!p)return;
  currentProductDetailId = id;
  document.getElementById("pdImg").src=p.imagen;
  document.getElementById("pdImg").alt=p.nombre;
  document.getElementById("pdNombre").textContent=p.nombre;
  document.getElementById("pdDesc").textContent = getProductDescription(p);
  document.getElementById("pdPrecio").textContent="$"+p.precio.toFixed(2);
  document.getElementById("pdCategoria").textContent=p.categoria;
  document.getElementById("pdAddBtn").dataset.id=id;
  document.getElementById("productDetailModal").classList.add("active");
}

function initSlider(){
  const track=document.getElementById("sliderTrack");
  const cont=document.getElementById("sliderContainer");
  const slides=document.querySelectorAll(".slider-slide");
  if(!slides.length)return;
  let idx=0;
  function updateSlider(){track.style.transform=`translateX(-${idx*100}%)`;}
  function goTo(i){idx=(i+slides.length)%slides.length;updateSlider();updateDots();}
  function startAuto(){if(slideInterval)clearInterval(slideInterval);slideInterval=setInterval(()=>goTo(idx+1),5000);}
  function resetAuto(){clearInterval(slideInterval);startAuto();}
  document.getElementById("sliderPrev").onclick=()=>{goTo(idx-1);resetAuto();};
  document.getElementById("sliderNext").onclick=()=>{goTo(idx+1);resetAuto();};
  const dotsC=document.getElementById("sliderDots");dotsC.innerHTML="";
  slides.forEach((_,i)=>{const d=document.createElement("div");d.className="slider-dot"+(i===0?" active":"");d.onclick=()=>{goTo(i);resetAuto();};dotsC.appendChild(d);});
  function updateDots(){document.querySelectorAll(".slider-dot").forEach((d,i)=>d.classList.toggle("active",i===idx));}
  let tx=0,ty=0;
  cont.addEventListener("touchstart",e=>{tx=e.changedTouches[0].clientX;ty=e.changedTouches[0].clientY;},{passive:true});
  cont.addEventListener("touchend",e=>{
    const dx=e.changedTouches[0].clientX-tx;const dy=e.changedTouches[0].clientY-ty;
    if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>40){if(dx<0)goTo(idx+1);else goTo(idx-1);resetAuto();}
  },{passive:true});
  startAuto();
}

async function cargarAderezos(){
  try{
    const resp=await fetch(ADEREZOS_CSV_URL);const csvText=await resp.text();
    const rows=csvText.split(/\r?\n/);if(rows.length<2)throw new Error();
    const headers=rows[0].split(",").map(h=>h.trim().toLowerCase());
    const col=headers.includes("nombre")?"nombre":headers.includes("aderezo")?"aderezo":headers[0];
    let arr=[];
    for(let i=1;i<rows.length;i++){
      if(!rows[i].trim())continue;
      let vals=[],inside=false,val="";
      for(let ch of rows[i]){if(ch==='"')inside=!inside;else if(ch===","&&!inside){vals.push(val.trim());val="";}else val+=ch;}
      vals.push(val.trim());
      const obj={};headers.forEach((h,idx)=>{obj[h]=vals[idx]||"";});
      if(obj[col])arr.push(obj[col]);
    }
    if(arr.length)aderezosDisponibles=arr;
  }catch(e){console.warn("Usando aderezos por defecto");}
  renderAderezosCheckboxes();
}

function renderAderezosCheckboxes(){
  const c=document.getElementById("aderezosCheckboxes");if(!c)return;
  c.innerHTML=aderezosDisponibles.map(ad=>`<label><input type="checkbox" name="aderezo" value="${escapeHtml(ad)}"> ${escapeHtml(ad)}</label>`).join("");
}

function initFormDinamico(){
  const radioTipo=document.querySelectorAll('input[name="tipoPedido"]');
  const dirG=document.getElementById("direccionGroup");
  const mesaG=document.getElementById("mesaGroup");
  const radioPago=document.querySelectorAll('input[name="pago"]');
  const aliasInfo=document.getElementById("aliasInfo");
  function toggleTipo(){
    const esDom=document.querySelector('input[name="tipoPedido"]:checked').value==="domicilio";
    dirG.style.display=esDom?"block":"none";mesaG.style.display=esDom?"none":"block";
    document.getElementById("customerAddress").required=esDom;document.getElementById("mesaNumber").required=!esDom;
  }
  function togglePago(){aliasInfo.style.display=document.querySelector('input[name="pago"]:checked').value==="transferencia"?"block":"none";}
  radioTipo.forEach(r=>r.addEventListener("change",toggleTipo));
  radioPago.forEach(r=>r.addEventListener("change",togglePago));
  toggleTipo();togglePago();
  document.getElementById("copyAliasBtn")?.addEventListener("click",()=>{navigator.clipboard.writeText(ALIAS_TRANSFERENCIA);showToast(t("aliasCop"));});
}

function guardarPedidoEnHistorial(p){
  let h=localStorage.getItem("historial_pedidos");h=h?JSON.parse(h):[];h.unshift(p);if(h.length>50)h=h.slice(0,50);
  localStorage.setItem("historial_pedidos",JSON.stringify(h));
  document.getElementById("lastOrderBtn").style.display="inline-flex";
  document.getElementById("allOrdersBtn").style.display="inline-flex";
}

function mostrarDetallePedido(pedido,permitirRepetir=true){
  currentDisplayedOrder = pedido;
  const c=document.getElementById("orderDetailContent");
  let pHtml='<ul class="pedido-productos">';
  pedido.productos.forEach(p=>{pHtml+=`<li><span>${escapeHtml(p.nombre)} x${p.cantidad}</span><span>$${(p.precio*p.cantidad).toFixed(2)}</span></li>`;});
  pHtml+='</ul>';
  let locStr = "";
  if(pedido.tipo==="domicilio") locStr = `📍 ${pedido.direccion}`;
  else locStr = `🍽️ ${t("enLocal")}: ${pedido.mesa}`;
  let pagoStr = "";
  if(pedido.pago==="transferencia") pagoStr = `🏦 ${t("transferencia")} (Alias: ${ALIAS_TRANSFERENCIA})`;
  else pagoStr = `💵 ${t("efectivo")}`;
  const adStr = pedido.aderezos && pedido.aderezos.length ? `🥫 ${pedido.aderezos.join(", ")}` : `🥫 ${t("sinAderezosExtra")}`;
  c.innerHTML = `<div class="pedido-info">
    <p><strong>${t("fecha")}:</strong> ${escapeHtml(pedido.fecha)}</p>
    <p><strong>${t("cliente")}:</strong> ${escapeHtml(pedido.cliente)}</p>
    <p><strong>${t("telefono")}:</strong> ${escapeHtml(pedido.telefono)}</p>
    <p><strong>${t("ubicacion")}:</strong> ${escapeHtml(locStr)}</p>
    <p><strong>${t("pago")}:</strong> ${pagoStr}</p>
    <p>${adStr}</p>${pedido.notas?`<p><strong>📝 ${t("secNotas")}:</strong> ${escapeHtml(pedido.notas)}</p>`:""}
  </div><strong>${t("productosHeader")}:</strong>${pHtml}<div style="text-align:right;margin-top:1rem;"><strong>${t("totalLabel")}: $${pedido.total.toFixed(2)}</strong></div>`;
  document.getElementById("orderDetailModal").classList.add("active");
  const btn=document.getElementById("reorderFromDetailBtn");
  if(btn){btn.onclick=()=>rearmarCarritoDesdePedido(pedido);btn.style.display=permitirRepetir?"block":"none";}
}

function mostrarHistorialCompleto(){
  const raw=localStorage.getItem("historial_pedidos");if(!raw){showToast(t("sinPedidos"));return;}
  const pedidos=JSON.parse(raw);if(!pedidos.length){showToast(t("sinPedidos"));return;}
  const c=document.getElementById("ordersList");
  c.innerHTML=pedidos.map((ped,idx)=>`<div class="order-card" data-index="${idx}">
    <h4>📅 ${ped.fecha}</h4>
    <p>💰 ${t("totalLabel")}: $${ped.total.toFixed(2)} · 🧾 ${ped.productos.length} ${t("productosLabel")}</p>
    <p>${ped.tipo==="domicilio"?t("aDomicilio"):t("enLocal")} · ${ped.pago==="transferencia"?t("transferencia"):t("efectivo")}</p>
  </div>`).join("");
  c.querySelectorAll(".order-card").forEach(card=>{card.addEventListener("click",()=>{mostrarDetallePedido(pedidos[card.dataset.index],true);document.getElementById("allOrdersModal").classList.remove("active");});});
  document.getElementById("allOrdersModal").classList.add("active");
  isAllOrdersModalOpen = true;
}

function rearmarCarritoDesdePedido(pedido){
  carrito=[];
  pedido.productos.forEach(prod=>{const pa=productos.find(p=>p.id==prod.id);if(pa)carrito.push({id:pa.id,nombre:pa.nombre,precio:pa.precio,cantidad:prod.cantidad});});
  updateCartUI();showToast("🔄 Carrito armado con el pedido");document.getElementById("orderDetailModal").classList.remove("active");
}

async function finalizarPedido(clienteData,tipoPedido,direccionOmesa,aderezosSeleccionados,metodoPago,notas){
  if(!carrito.length){showToast(t("carritoVacioSend"));return false;}
  const total=carrito.reduce((s,i)=>s+i.precio*i.cantidad,0);
  const productosTexto=carrito.map(i=>`${i.nombre} x${i.cantidad} = $${(i.precio*i.cantidad).toFixed(2)}`).join(" | ");
  const fechaHora=getFormattedDateTime();
  showLoading(true);
  const orderData={fecha_hora:fechaHora,cliente_nombre:clienteData.nombre,cliente_telefono:clienteData.telefono,tipo_pedido:tipoPedido,ubicacion:direccionOmesa,aderezos:aderezosSeleccionados.join(", "),metodo_pago:metodoPago,notas:notas,productos:productosTexto,total:total.toFixed(2),estado:"Pendiente"};
  try{await fetch(APPS_SCRIPT_PEDIDOS_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(orderData)});}
  catch(err){console.error(err);showToast(t("errorEnvio"));showLoading(false);return false;}
  let adStr=aderezosSeleccionados.length?`🥫 Aderezos: ${aderezosSeleccionados.join(", ")}`:"🥫 Sin aderezos extra";
  let locStr=tipoPedido==="domicilio"?`📍 Direccion: ${direccionOmesa}`:`🍽️ Mesa: ${direccionOmesa}`;
  let pagoStr=metodoPago==="transferencia"?`🏦 Transferencia (Alias: ${ALIAS_TRANSFERENCIA})`:"💵 Efectivo";
  let msg=`🛍️ *NUEVO PEDIDO*%0A📅 ${fechaHora}%0A👤 ${clienteData.nombre}%0A📞 ${clienteData.telefono}%0A${locStr}%0A${adStr}%0A${pagoStr}%0A────────────────%0A`;
  carrito.forEach(i=>{msg+=`• ${i.nombre} x${i.cantidad} = $${(i.precio*i.cantidad).toFixed(2)}%0A`;});
  msg+=`────────────────%0A💰 *Total: $${total.toFixed(2)}*%0A📝 Notas: ${notas||"Ninguna"}%0A✅ ¡Gracias!`;
  const pedidoGuardado={fecha:fechaHora,cliente:clienteData.nombre,telefono:clienteData.telefono,tipo:tipoPedido,direccion:tipoPedido==="domicilio"?direccionOmesa:"",mesa:tipoPedido==="local"?direccionOmesa:"",aderezos:aderezosSeleccionados,pago:metodoPago,notas:notas,productos:carrito.map(i=>({id:i.id,nombre:i.nombre,precio:i.precio,cantidad:i.cantidad})),total:total};
  guardarPedidoEnHistorial(pedidoGuardado);
  carrito=[];updateCartUI();showLoading(false);window.scrollTo({top:0,behavior:"smooth"});showToast(t("pedidoEnviado"));
  const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  const w=window.open(url,"_blank");
  if(!w||w.closed||typeof w.closed==="undefined"){
    setTimeout(()=>{const toast=document.getElementById("toastMessage");if(toast){toast.innerHTML=`⚠️ El navegador bloqueo la ventana. <a href="${url}" target="_blank" style="color:white;text-decoration:underline">Abrir WhatsApp</a>`;setTimeout(()=>{toast.innerHTML="✅ Pedido enviado. ¡Gracias!";},8000);}},500);
  }
  return true;
}

function initEventos(){
  const cartModal=document.getElementById("cartModal");
  const checkoutModal=document.getElementById("checkoutModal");
  const orderDetailModal=document.getElementById("orderDetailModal");
  const allOrdersModal=document.getElementById("allOrdersModal");
  const productDetailModal=document.getElementById("productDetailModal");
  document.getElementById("viewCartBtn").onclick=()=>{renderCartModal();cartModal.classList.add("active");};
  document.getElementById("closeCartModalBtn").onclick=()=>cartModal.classList.remove("active");
  document.getElementById("checkoutBtn").onclick=()=>{if(!carrito.length)showToast(t("agregarProductos"));else checkoutModal.classList.add("active");};
  document.getElementById("closeCheckoutModalBtn").onclick=()=>checkoutModal.classList.remove("active");
  document.getElementById("closeOrderDetailBtn").onclick=()=>{orderDetailModal.classList.remove("active"); currentDisplayedOrder = null;};
  document.getElementById("closeAllOrdersBtn").onclick=()=>{allOrdersModal.classList.remove("active"); isAllOrdersModalOpen = false;};
  document.getElementById("closeProductDetailBtn").onclick=()=>{productDetailModal.classList.remove("active"); currentProductDetailId = null;};
  document.getElementById("pdAddBtn").onclick=function(){addToCart(this.dataset.id,1);productDetailModal.classList.remove("active"); currentProductDetailId = null;};
  window.onclick=e=>{[cartModal,checkoutModal,orderDetailModal,allOrdersModal,productDetailModal].forEach(m=>{if(e.target===m){m.classList.remove("active"); if(m===orderDetailModal) currentDisplayedOrder=null; if(m===allOrdersModal) isAllOrdersModalOpen=false; if(m===productDetailModal) currentProductDetailId=null;}});};
  document.getElementById("lastOrderBtn").onclick=()=>{const h=localStorage.getItem("historial_pedidos");if(h){const arr=JSON.parse(h);if(arr.length){mostrarDetallePedido(arr[0],true);return;}}showToast(t("sinPedidos"));};
  document.getElementById("allOrdersBtn").onclick=()=>mostrarHistorialCompleto();
  document.getElementById("langToggleBtn").onclick=()=>applyLang(currentLang==="es"?"en":"es");
  const floatBtn=document.getElementById("floatingCartBtn");floatBtn.onclick=()=>{renderCartModal();cartModal.classList.add("active");};
  const form=document.getElementById("checkoutForm");
  const submitBtn=document.getElementById("submitOrderBtn");
  form.onsubmit=async e=>{
    e.preventDefault();
    if(isSubmitting){showToast("Ya estamos procesando tu pedido...");return;}
    clearErrors();
    let valid=true;
    const nombre=document.getElementById("customerName").value.trim();
    const telefono=document.getElementById("customerPhone").value.trim();
    if(!nombre){setFieldError("errorNombre",t("nombreReq"));document.getElementById("customerName").classList.add("error");valid=false;}
    if(!telefono){setFieldError("errorTelefono",t("telefonoReq"));document.getElementById("customerPhone").classList.add("error");valid=false;}
    const tipoPedido=document.querySelector('input[name="tipoPedido"]:checked').value;
    let direccionOmesa="";
    if(tipoPedido==="domicilio"){
      direccionOmesa=document.getElementById("customerAddress").value.trim();
      if(!direccionOmesa){setFieldError("errorDireccion",t("direccionReq"));document.getElementById("customerAddress").classList.add("error");valid=false;}
    }else{
      direccionOmesa=document.getElementById("mesaNumber").value.trim();
      if(!direccionOmesa){setFieldError("errorMesa",t("mesaReq"));document.getElementById("mesaNumber").classList.add("error");valid=false;}
    }
    if(!valid)return;
    const aderezos=Array.from(document.querySelectorAll('input[name="aderezo"]:checked')).map(cb=>cb.value);
    const metodoPago=document.querySelector('input[name="pago"]:checked').value;
    const notas=document.getElementById("orderNotes").value.trim();
    isSubmitting=true;const origText=submitBtn.innerHTML;submitBtn.disabled=true;submitBtn.innerHTML=t("enviandoMsg");
    ["customerName","customerPhone","customerAddress","mesaNumber"].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove("error");});
    try{
      await finalizarPedido({nombre,telefono},tipoPedido,direccionOmesa,aderezos,metodoPago,notas);
      document.getElementById("checkoutModal").classList.remove("active");
      form.reset();document.querySelector('input[name="tipoPedido"][value="domicilio"]').checked=true;
      document.querySelector('input[name="pago"][value="efectivo"]').checked=true;
      initFormDinamico();clearErrors();
    }catch(err){console.error(err);showToast(t("errorEnvio"));}
    finally{setTimeout(()=>{submitBtn.disabled=false;submitBtn.innerHTML=origText;isSubmitting=false;},3000);}
  };
}

async function init(){
  const savedLang=localStorage.getItem("sofi_lang")||"es";
  currentLang=savedLang;
  loadCart();
  await cargarProductos();
  await cargarAderezos();
  initSlider();initFormDinamico();initEventos();
  applyLang(savedLang);
  const h=localStorage.getItem("historial_pedidos");
  if(h&&JSON.parse(h).length){document.getElementById("lastOrderBtn").style.display="inline-flex";document.getElementById("allOrdersBtn").style.display="inline-flex";}
}
init();