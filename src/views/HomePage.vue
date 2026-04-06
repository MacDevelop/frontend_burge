<template>
  <div class="client-view">
    <!-- HERO SECTION -->
    <section id="inicio" class="hero">
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="badge"><i class="fas fa-fire"></i> Sabor alemán & artesanal</div>
          <h1>La mejor <span>BurgerHeim</span> de tu vida</h1>
          <p>
            Carne angus, pan artesano, recetas con esencia europea y ese toque único que te hará
            volver por más. ¡En el corazón de Sucre!
          </p>
          <div class="btn-group">
            <button class="btn" @click="scrollToMenu">
              <i class="fas fa-utensils"></i> Ver menú
            </button>
            <button class="btn btn-outline" @click="scrollToContact">
              <i class="fas fa-motorcycle"></i> Pedido a domicilio
            </button>
          </div>
        </div>
        <div class="hero-img">
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=450&fit=crop"
            alt="BurgerHeim Hero"
          />
        </div>
      </div>
    </section>

    <!-- SECCIÓN DE CARACTERÍSTICAS -->
    <section class="features">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <i class="fas fa-leaf"></i>
            <h3>Ingredientes Frescos</h3>
            <p>Seleccionamos los mejores productos locales de Sucre para garantizar sabor y calidad.</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-truck-fast"></i>
            <h3>Delivery Rápido</h3>
            <p>Recibe tu pedido en menos de 30 minutos, ¡caliente y fresco en tu domicilio!</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-star"></i>
            <h3>Receta Secreta</h3>
            <p>Salsas y adobos exclusivos que solo encontrarás en BurgerHeim en Sucre.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- MENÚ COMPLETO -->
    <section id="menu" class="menu-section">
      <div class="container">
        <h2 class="section-title">🍔 Nuestro Menú</h2>
        <div class="category-tabs">
          <button
            v-for="cat in menuCategories"
            :key="cat"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
            class="category-btn"
          >
            {{ cat }}
          </button>
        </div>
        <div class="menu-grid">
          <div v-for="product in filteredProducts" :key="product.id" class="menu-card">
            <div class="menu-card-img">
              <img
                :src="product.urlImagen"
                :alt="product.nombre"
              />
            </div>
            <div class="menu-card-content">
              <h3>{{ product.nombre }}</h3>
              <p>{{ product.descripcion }}</p>
              <div class="price-order">
                <span class="price">Bs{{ (Number(product.precioUnitario) || 0).toFixed(2) }}</span>
                <button class="add-to-cart" @click="addToCart(product)">
                  <i class="fas fa-shopping-cart"></i> Pedir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NOSOTROS -->
    <section id="nosotros" class="about">
      <div class="container about-content">
        <div class="about-text">
          <h2><span style="color: #ff7e05">Sabor</span> que nace del fuego</h2>
          <p>
            En <strong>BurgerHeim</strong> llevamos más de 10 años perfeccionando la parrilla con
            influencia germana. Nuestras carnes son seleccionadas a mano, los panes se hornean cada
            mañana y nuestras salsas son recetas secretas familiares.
          </p>
          <p>
            Todo comenzó en un pequeño local de Berlín, y hoy traemos a <strong>Sucre, Bolivia</strong> la auténtica
            experiencia de una hamburguesa artesanal. Ambiente urbano, música en vivo los fines de
            semana y el aroma irresistible de una hamburguesa recién hecha en la calle Junín.
          </p>
          <div class="stats">
            <div class="stat"><span>10+</span><br />Años de experiencia</div>
            <div class="stat"><span>50k+</span><br />Clientes felices</div>
            <div class="stat"><span>15+</span><br />Variedades</div>
          </div>
        </div>
        <div class="about-img">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=400&fit=crop"
            alt="Nuestra cocina"
          />
        </div>
      </div>
    </section>

    <!-- TESTIMONIOS -->
    <section class="testimonials">
      <div class="container">
        <h2 class="section-title">⭐ Clientes felices</h2>
        <div class="testi-cards">
          <div class="testi">
            <i class="fas fa-quote-left"></i>
            <p>
              "La mejor hamburguesa que he probado en años. La carne jugosa y el pan crujiente son
              perfectos. Volveré sin dudar."
            </p>
            <div class="stars">★★★★★</div>
            <h4>— Laura G.</h4>
          </div>
          <div class="testi">
            <i class="fas fa-quote-left"></i>
            <p>
              "El ambiente es increíble, atención rápida y las papas con queso son adictivas.
              Recomiendo la Diabla Picante."
            </p>
            <div class="stars">★★★★★</div>
            <h4>— Martín R.</h4>
          </div>
          <div class="testi">
            <i class="fas fa-quote-left"></i>
            <p>
              "Precio justo, calidad excelente. Además tienen opciones vegetarianas muy sabrosas.
              10/10."
            </p>
            <div class="stars">★★★★☆</div>
            <h4>— Sofía L.</h4>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACTO -->
    <section id="contacto" class="contact">
      <div class="container contact-grid">
        <div class="contact-info">
          <h2 style="font-size: 2rem; margin-bottom: 1rem">📍 BurgerHeim</h2>
          <p><i class="fas fa-map-marker-alt"></i> Junín # 913, Sucre, Bolivia</p>
          <p><i class="fas fa-phone-alt"></i> 70299540</p>
          <p><i class="far fa-clock"></i> Lun - Dom: 12pm a 12am <span class="badge-status">(Cerrado ahora)</span></p>
          <div class="services-info">
            <p><i class="fas fa-store"></i> Servicios: Para llevar · Consumo en el local · Recogida en el establecimiento</p>
          </div>
          <div class="social-links" style="margin-top: 2rem">
            <a href="https://instagram.com/brugerheim24" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="https://wa.me/59170299540" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp"></i></a>
            <a href="#"><i class="fab fa-tiktok"></i></a>
          </div>
        </div>
        <div class="contact-form">
          <h3>¿Tienes alguna consulta?</h3>
          <br>
          <form @submit.prevent="submitContact">
            <input type="text" v-model="contactForm.name" placeholder="Nombre completo" required />
            <input
              type="email"
              v-model="contactForm.email"
              placeholder="Correo electrónico"
              required
            />
            <input type="tel" v-model="contactForm.phone" placeholder="Teléfono" />
            <textarea
              v-model="contactForm.message"
              rows="4"
              placeholder="Tu mensaje..."
              required
            ></textarea>
            <button type="submit" class="btn" style="width: 100%">
              Enviar mensaje <i class="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- MAPA REAL: Calle Junín, Sucre -->
    <section class="map">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1897.7314435640218!2d-65.25987832511298!3d-19.042788635700366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93fcf35f0a3c9e0f%3A0x2f6b1b3f6b7b6b7b!2sJun%C3%ADn%2C%20Sucre%2C%20Bolivia!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
        width="100%"
        height="300"
        style="border: 0"
        :allowfullscreen="true"
        loading="lazy"
      >
      </iframe>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Definición de tipos (Product)
interface Product {
  id: number
  nombre: string
  precioUnitario: number
  idCategoria: number
  descripcion: string
  urlImagen: string
  stock: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaEliminacion: Date | null
}

// Datos de productos con imágenes REALES de Unsplash
const products = ref<Product[]>([
  {
    id: 1,
    nombre: 'Smash Doble',
    precioUnitario: 12.9,
    idCategoria: 1,
    descripcion: 'Doble carne, queso cheddar, cebolla caramelizada y salsa BBQ.',
    urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUiFfdfUHyBpIoF9C6m82uLsLcLcb08k2l8g&s',
    stock: 50,
    fechaCreacion: new Date(),
    fechaModificacion: new Date(),
    fechaEliminacion: null,
  },
  {
    id: 2,
    nombre: 'Bacon Cheese',
    precioUnitario: 13.5,
    idCategoria: 1,
    descripcion: 'Tocineta ahumada, queso fundido, salsa de la casa y pepinillos.',
    urlImagen: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300&h=200&fit=crop',
    stock: 50,
    fechaCreacion: new Date(),
    fechaModificacion: new Date(),
    fechaEliminacion: null,
  },
  {
    id: 3,
    nombre: 'Veggie Crunch',
    precioUnitario: 11.9,
    idCategoria: 4,
    descripcion: 'Proteína de lentejas, aguacate, lechuga fresca y mayonesa de chipotle.',
    urlImagen: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=300&h=200&fit=crop',
    stock: 50,
    fechaCreacion: new Date(),
    fechaModificacion: new Date(),
    fechaEliminacion: null,
  },
  {
    id: 4,
    nombre: 'Diabla Picante',
    precioUnitario: 13.2,
    idCategoria: 2,
    descripcion: 'Jalapeños, salsa chipotle, pepper jack, cebolla morada.',
    urlImagen: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&h=200&fit=crop',
    stock: 50,
    fechaCreacion: new Date(),
    fechaModificacion: new Date(),
    fechaEliminacion: null,
  },
  {
    id: 5,
    nombre: 'Queso Fundido',
    precioUnitario: 14.5,
    idCategoria: 2,
    descripcion: 'Triple queso, cheddar, mozzarella, gouda y bacon bits.',
    urlImagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop',
    stock: 50,
    fechaCreacion: new Date(),
    fechaModificacion: new Date(),
    fechaEliminacion: null,
  },
  {
    id: 6,
    nombre: 'Chicken Crispy',
    precioUnitario: 11.9,
    idCategoria: 3,
    descripcion: 'Pechuga empanizada, salsa ranch, repollo y toque cítrico.',
    urlImagen: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300&h=200&fit=crop',
    stock: 50,
    fechaCreacion: new Date(),
    fechaModificacion: new Date(),
    fechaEliminacion: null,
  },
  {
    id: 7,
    nombre: 'Papas Deluxe',
    precioUnitario: 5.9,
    idCategoria: 5,
    descripcion: 'Papas rústicas con queso derretido y bacon.',
    urlImagen: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=300&h=200&fit=crop',
    stock: 50,
    fechaCreacion: new Date(),
    fechaModificacion: new Date(),
    fechaEliminacion: null,
  },
  {
    id: 8,
    nombre: 'Milkshake Oreo',
    precioUnitario: 6.5,
    idCategoria: 6,
    descripcion: 'Helado artesanal, trozos de galleta y crema batida.',
    urlImagen: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=300&h=200&fit=crop',
    stock: 50,
    fechaCreacion: new Date(),
    fechaModificacion: new Date(),
    fechaEliminacion: null,
  },
])

const menuCategories = [
  'Todos',
  'Clásicas',
  'Especiales',
  'Vegetariano',
  'Pollos',
  'Acompañantes',
  'Bebidas',
]
const selectedCategory = ref('Todos')

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'Todos') return products.value
  // Mapeo de categorías por nombre
  const categoryMap: { [key: string]: number } = {
    'Clásicas': 1,
    'Especiales': 2,
    'Pollos': 3,
    'Vegetariano': 4,
    'Acompañantes': 5,
    'Bebidas': 6,
  }
  const categoryId = categoryMap[selectedCategory.value]
  return products.value.filter((p) => p.idCategoria === categoryId)
})

// Formulario de contacto
const contactForm = ref({
  name: '',
  email: '',
  phone: '',
  message: '',
})

const submitContact = () => {
  alert(`¡Gracias ${contactForm.value.name}! Nos pondremos en contacto contigo pronto.`)
  contactForm.value = { name: '', email: '', phone: '', message: '' }
}

const addToCart = (product: Product) => {
  alert(`🍔 ${product.nombre} agregado al carrito (demo)`)
}

// Scroll suave
const scrollToMenu = () => {
  const element = document.getElementById('menu')
  element?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToContact = () => {
  const element = document.getElementById('contacto')
  element?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
/* Hero Section */
.hero {
  background: linear-gradient(107deg, #1e1b1a 0%, #1f2a1c 100%);
  padding: 5rem 0;
  border-bottom: 5px solid #ff7e05;
}

.hero-grid {
  display: flex;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.hero-content {
  flex: 1;
}

.badge {
  background: #ff7e05;
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 40px;
  font-weight: 800;
  margin-bottom: 1.2rem;
  color: #1a120b;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.hero-content h1 span {
  color: #ff7e05;
}

.hero-content p {
  font-size: 1.1rem;
  color: #ddd2c8;
  margin-bottom: 2rem;
}

.btn-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  background: #ff7e05;
  border: none;
  padding: 0.8rem 1.8rem;
  border-radius: 40px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  color: #1a1a1a;
}

.btn-outline {
  background: transparent;
  border: 2px solid #ff7e05;
  color: #ff7e05;
}

.btn-outline:hover {
  background: #ff7e05;
  color: #1a1a1a;
}

.hero-img {
  flex: 1;
  text-align: center;
}

.hero-img img {
  max-width: 100%;
  border-radius: 40px;
  filter: drop-shadow(0 20px 15px rgba(0, 0, 0, 0.5));
}

/* Features */
.features {
  padding: 4rem 0;
  background: #111316;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background: #1e2128;
  border-radius: 1rem;
  transition: 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  border: 1px solid #ff7e05;
}

.feature-card i {
  font-size: 3rem;
  color: #ff7e05;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
}

/* Menu Section */
.menu-section {
  padding: 5rem 0;
  background: #0a0c0f;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-btn {
  background: #1e2128;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 40px;
  color: #f5ede8;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 600;
}

.category-btn:hover,
.category-btn.active {
  background: #ff7e05;
  color: #1a1a1a;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.menu-card {
  background: #1e2128;
  border-radius: 1rem;
  overflow: hidden;
  transition: 0.3s;
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(255, 126, 5, 0.2);
}

.menu-card-img {
  height: 200px;
  overflow: hidden;
}

.menu-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-card-content {
  padding: 1.5rem;
}

.menu-card-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.menu-card-content p {
  color: #b9aca2;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.price-order {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.6rem;
  font-weight: bold;
  color: #ff7e05;
}

.add-to-cart {
  background: #ff7e05;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.add-to-cart:hover {
  background: #e56f00;
  transform: scale(1.05);
}

/* About Section */
.about {
  background: linear-gradient(135deg, #181d20, #0f1217);
  padding: 5rem 0;
}

.about-content {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  align-items: center;
}

.about-text {
  flex: 1;
}

.about-text h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.about-text p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.stats {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.stat {
  text-align: center;
}

.stat span {
  font-size: 2rem;
  font-weight: bold;
  color: #ff7e05;
  display: block;
}

.about-img {
  flex: 1;
  text-align: center;
}

.about-img img {
  max-width: 100%;
  border-radius: 50px;
  box-shadow: 0 20px 25px -12px black;
}

/* Testimonials */
.testimonials {
  padding: 5rem 0;
  background: #111316;
}

.testi-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.testi {
  background: #1e2128;
  padding: 2rem;
  border-radius: 2rem;
  max-width: 320px;
  text-align: center;
}

.testi i {
  font-size: 2rem;
  color: #ff7e05;
  margin-bottom: 1rem;
}

.testi p {
  font-style: italic;
  margin: 1rem 0;
}

.stars {
  color: #ffb347;
  letter-spacing: 3px;
  margin: 0.5rem 0;
}

/* Contact Section */
.contact {
  padding: 5rem 0;
  background: #0a0c0f;
}

.contact-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  justify-content: space-between;
}

.contact-info {
  flex: 1;
}

.contact-info i {
  margin-right: 15px;
  color: #ff7e05;
  width: 30px;
}

.contact-info p {
  margin: 1rem 0;
  font-size: 1.1rem;
}

.badge-status {
  background: #dc3545;
  color: white;
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  margin-left: 10px;
}

.services-info {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #b9aca2;
}

.social-links a {
  color: #f5ede8;
  font-size: 1.8rem;
  margin-right: 1rem;
  transition: 0.2s;
}

.social-links a:hover {
  color: #ff7e05;
}

.contact-form {
  flex: 1;
  background: #1e2128;
  padding: 2rem;
  border-radius: 2rem;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  background: #2c313a;
  border: none;
  padding: 0.9rem;
  margin-bottom: 1rem;
  border-radius: 40px;
  color: white;
  font-family: inherit;
}

.contact-form textarea {
  border-radius: 20px;
  resize: vertical;
}

/* Map */
.map iframe {
  width: 100%;
  height: 300px;
  filter: grayscale(0.3);
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .stats {
    flex-direction: column;
    gap: 1rem;
  }

  .menu-grid {
    grid-template-columns: 1fr;
  }

  .contact-grid {
    flex-direction: column;
  }
  
  .container {
    padding: 0 15px;
  }
}
</style>