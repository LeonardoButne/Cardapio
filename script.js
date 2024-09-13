const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-item")
const carTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn =document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const adressInput = document.getElementById("address")
const adressWarn = document.getElementById("address-warm")


let cart = []



// Abrir o modal do carrinho

cartBtn.addEventListener("click", function() {
    updateCartModal()
    cartModal.style.display = "flex"
})

// Fechar o modal ao clicar fora

cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

// Fechar com botao

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// Adicionar items no carrinho

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-card-btn")
    // console.log(parentButton)
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})

//funcao para adicionar no carrinho

function addToCart(name, price){

    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1
        
    }else{
        cart.push({
            name, 
            price,
            quantity: 1,
        })
    }
    updateCartModal()
}

// Actualizar o carrinho

function updateCartModal(){
    cartItemsContainer.innerHTML = ""
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML = `
            <div class = "flex items-center justify-between">
                <div>
                    <p class = "font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class = "font-medium mt-2">MZN ${item.price.toFixed(2)}</p>
                </div>
                
                <div>
                    <button class = "remove-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    carTotal.textContent = total.toLocaleString("pt-mz", {
        style: "currency",
        currency: "MZN"
    });

    cartCounter.innerText = cart.length
}



// Remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)

    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index]

        if(item.quantity > 1){
            item.quantity -= 1
            updateCartModal()
            return;
        }else{
            cart.splice(index, 1)
            updateCartModal()
        }
    }
}

adressInput.addEventListener("input", function(event){
    let inputValue = event.target.value

    if(inputValue !== ""){
        adressInput.classList.remove("border-red-500")
        adressWarn.classList.add("hidden")
    }


})

// Finalizar pedido
checkoutBtn.addEventListener("click", function(){
    if(cart.length === 0) return

    if(adressInput.value === ""){
        adressWarn.classList.remove("hidden")
        adressInput.classList.add("border-red-500")
        return
    }

    // Enviar para a API do whatsApp

    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade: (${item.quantity}) Preço: (${item.price}) | `
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "+258878727900"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`, "_blank")
    
    cart = []
    updateCartModal()

})

function checkRestaurantOpen(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 9 && hora < 17 
}

const spanItem = document.getElementById("date-span")

const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}