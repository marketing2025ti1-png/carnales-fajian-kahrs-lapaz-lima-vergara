document.addEventListener('DOMContentLoaded', () => {
    const PRODUCTS = [
        { id:'p-muzza', type:'pizza', name:'Pizza Muzzarella', desc:'Salsa de tomate, mozzarella, orégano', price:350, img:'https://i.pinimg.com/736x/95/8d/d7/958dd73752f745a76dd78a3aca76f1a1.jpg' },
        { id:'p-napo', type:'pizza', name:'Pizza Napolitana', desc:'Tomate, mozzarella, tomate en rodaja, ajo', price:420, img:'https://i.pinimg.com/736x/2b/db/d4/2bdbd4b9a187d87baf00296db340dc82.jpg' },
        { id:'p-pepper', type:'pizza', name:'Pizza Pepperoni', desc:'Mozzarella y pepperoni clásico', price:470, img:'https://i.pinimg.com/1200x/15/86/a5/1586a5182490ef2e686e1b59f1afd29f.jpg' },
        { id:'p-veg', type:'pizza', name:'Pizza Vegetariana', desc:'Variedad de vegetales asados y queso', price:430, img:'https://i.pinimg.com/736x/21/91/e5/2191e515446593df2f92e81c914b3f0a.jpg' },
        { id:'p-fug', type:'pizza', name:'Fugazza', desc:'Cebolla, aceitunas y mucho queso', price:380, img:'https://images.unsplash.com/photo-1604908177522-0b7f2d1a6c4f?q=80&w=800&auto=format&fit=crop' }
    ];
    const DRINKS = [
        { id:'d-coca500', type:'drink', name:'Coca-Cola 500ml', price:120, img:'https://i.pinimg.com/1200x/f0/56/c6/f056c68cf3fe941b4eeefc384156d14e.jpg' },
        { id:'d-cocazero', type:'drink', name:'Coca-Cola Zero 500ml', price:120, img:'https://i.pinimg.com/736x/3e/e1/01/3ee101662e7cf7c3d3a358c5fea49da4.jpg' },
        { id:'d-other', type:'drink', name:'Otra Bebida', price:120, img:'https://i.pinimg.com/736x/3b/86/c9/3b86c92ca43dd80aee709518d85601b9.jpg' }
    ];

    const productsEl = document.getElementById('products');
    const drinksEl   = document.getElementById('drinks');
    const cartCount  = document.getElementById('cartCount');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartItems  = document.getElementById('cartItems');
    const cartTotalEl= document.getElementById('cartTotal');
    const promoOverlay = document.getElementById('promoOverlay');

    let CART = JSON.parse(localStorage.getItem('cart_minimal_pizza')||'{}');

    const money = u => u.toLocaleString('es-UY', {style:'currency', currency:'UYU'});

    function renderCards(list, container){
        container.innerHTML='';
        list.forEach(p=>{
            const div=document.createElement('div');
            div.className='card';
            div.innerHTML=`
                <img src="${p.img}" alt="${p.name}">
                <h3>${p.name}</h3>
                <div class="desc">${p.desc||''}</div>
                <div class="actions">
                    <div class="price">${money(p.price)}</div>
                    <div style="display:flex;gap:8px;">
                        <button class="btn ghost" data-action="viewDetails" data-id="${p.id}">Ver</button>
                        <button class="btn" data-action="addToCart" data-id="${p.id}">Agregar</button>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    function saveCart(){ localStorage.setItem('cart_minimal_pizza', JSON.stringify(CART)); updateCartUI(); }

    function addToCart(id, qty=1){
        const all=PRODUCTS.concat(DRINKS);
        const prod=all.find(p=>p.id===id);
        if(!prod) return;
        CART[id]?CART[id].qty+=qty:CART[id]={...prod, qty};
        saveCart(); openCart();
    }
    
    // 🆕 NUEVA FUNCIÓN: Eliminar o decrementar un ítem del carrito
    function removeFromCart(id, qty=1){
        if(!CART[id]) return;

        CART[id].qty -= qty; // Decrementa la cantidad

        if(CART[id].qty <= 0){
            delete CART[id]; // Si la cantidad es 0 o menos, elimina el ítem
        }
        saveCart();
    }

    function updateCartUI(){
        cartItems.innerHTML='';
        const itemsArr=Object.values(CART).filter(i=>i && !i.id?.startsWith('_'));
        let total=0;
        
        itemsArr.forEach(it=>{
            const div=document.createElement('div');
            div.className='cart-item';
            
            // 🆕 Botón "Sacar" añadido a la estructura HTML del ítem
            div.innerHTML=`
                <img src="${it.img}" alt="${it.name}">
                <div class="item-details">
                    <strong>${it.name}</strong> 
                    <p>${money(it.price)} x${it.qty}</p>
                </div>
                <button 
                    class="btn-remove" 
                    data-action="removeFromCart" 
                    data-id="${it.id}">
                    -1
                </button>
            `;
            cartItems.appendChild(div);
            total+=it.price*it.qty;
        });
        
        cartTotalEl.textContent=money(total);
        cartCount.textContent=itemsArr.reduce((s,it)=>s+it.qty,0);
    }

    function openCart(){ cartDrawer.style.display='block'; updateCartUI(); }
    function closeCart(){ cartDrawer.style.display='none'; }

    document.addEventListener('click', e=>{
        if(e.target.dataset.action==='addToCart') addToCart(e.target.dataset.id);
        
        // 🆕 Manejador para el botón "Sacar"
        if(e.target.dataset.action==='removeFromCart') removeFromCart(e.target.dataset.id);
        
        if(e.target.id==='openCart') openCart();
        if(e.target.id==='closeCart') closeCart();
        if(e.target.id==='searchBtn'){
            const q=document.getElementById('search').value.toLowerCase();
            renderCards(PRODUCTS.filter(p=>(p.name+p.desc).toLowerCase().includes(q)), productsEl);
            renderCards(DRINKS.filter(d=>d.name.toLowerCase().includes(q)), drinksEl);
        }
    });

    renderCards(PRODUCTS, productsEl);
    renderCards(DRINKS, drinksEl);
    updateCartUI();
});