const inputQuantity = document.querySelector('.input-quantity')
const btnIncrement = document.querySelector('#increment')
const btndecrement = document.querySelector('#decrement')

let valueByDeFault = parseInt(inputQuantity.value)

btnIncrement.addEventListener('click', ()=>{
    valueByDeFault +=1
    inputQuantity.value = valueByDeFault
})

btndecrement.addEventListener('click', ()=>{
    if(valueByDeFault > 1){
    valueByDeFault -=1
    inputQuantity.value = valueByDeFault}
})