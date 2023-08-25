//---------------------------------------------1. DECLARACIONES DE LAS CONSTANTES
const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const fragmento = document.createDocumentFragment();
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;

//------------------------------------------2. SE CREA EL CARRITO VACÍO
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

//------------------------------------------3. EVENTO ON CLICK
cards.addEventListener('click', e => {
    addCarrito(e);
});

//------------------------------------------4. AGREGAR DATOS AL JSON
const fetchData = async () => {
    try {
        const res = await fetch('api.json');
        const data = await res.json();
        console.log(data);
        mostrarProductos(data);
    } catch (error) {
        console.log(error);
    }
};
//-------------------------------------------5. METODO MOSTRAR PRODUCTOS
const mostrarProductos = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title;
        templateCard.querySelector('p').textContent = producto.precio;
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl);
        templateCard.querySelector('.btn-dark').dataset.id = producto.id;
        const clone = templateCard.cloneNode(true);
        fragmento.appendChild(clone);
    });

    cards.appendChild(fragmento);
};

//---------------------------------------6. METODO ADD CARRITO
const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
};

//---------------------------------------------------7. METODO INICIALIZAR EL CARRITO
const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: parseFloat(objeto.querySelector('p').textContent),
        cantidad: 1
    };

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    //Agregamos producto al carrito ... spread operator
    carrito[producto.id] = { ...producto };
    mostrarCarrito();
};

//---------------------------------8. MOSTRAR CARRITO
const mostrarCarrito = () => {
    items.innerHTML = '';
    let indice = 1; // Variable para llevar la cuenta de los elementos en el carrito
    Object.values(carrito).forEach(producto => {
        const cloneCarrito = document.importNode(templateCarrito, true).querySelector('tr');
        cloneCarrito.querySelector('th').textContent = indice++;
        cloneCarrito.querySelectorAll('td')[0].textContent = producto.title;
        cloneCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        cloneCarrito.querySelector('.btn-info').dataset.id = producto.id;
        cloneCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        cloneCarrito.querySelector('span').textContent = (producto.cantidad * producto.precio).toFixed(2);
        fragmento.appendChild(cloneCarrito);
    });
    items.appendChild(fragmento);
    mostrarFooter();
};

//----------------------------------------------------------9. METODO MOSTRAR FOOTER
const mostrarFooter = () => {
    footer.innerHTML = '';
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!!</th>
        `;
    } else {
        const cloneFooter = templateFooter.cloneNode(true);
        footer.appendChild(cloneFooter);
    }
};

// Llama a mostrarFooter al cargar la página para que el footer inicial se muestre correctamente
mostrarFooter();
