'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Product = { id?: string; name: string; category: string; origin: string; size?: string; stock?: number; description: string; image_url: string; price: string; sort_order?: number };
type Settings = { brand_name: string; tagline: string; whatsapp: string; maps_url: string; instagram: string; tiktok: string; shop_url: string; about: string };
const defaults: Settings = { brand_name:'LODAYA COFFEE', tagline:'A journey through Indonesian coffee.', whatsapp:process.env.NEXT_PUBLIC_WHATSAPP || '6281234567890', maps_url:process.env.NEXT_PUBLIC_MAPS_URL || '#', instagram:process.env.NEXT_PUBLIC_INSTAGRAM || '#', tiktok:process.env.NEXT_PUBLIC_TIKTOK || '#', shop_url:process.env.NEXT_PUBLIC_SHOP_URL || '#', about:'We bring carefully selected Indonesian coffee closer to people who appreciate its origin, character, and craft.' };

export default function Home(){
 const [settings,setSettings]=useState<Settings>(defaults);
const [products,setProducts]=useState<Product[]>([]);
const [selectedProduct,setSelectedProduct]=useState<Product|null>(null);
const [searchTerm,setSearchTerm]=useState('');
const [selectedCategory,setSelectedCategory]=useState('All');

const categories = [
  'All',
  'Ground Coffee',
  'Roasted Beans',
  'Green Beans'
];

const filteredProducts = products.filter(p => {
  const matchCategory =
    selectedCategory === 'All' ||
    p.category === selectedCategory;

  const keyword = searchTerm.toLowerCase().trim();

  const matchSearch =
    p.name.toLowerCase().includes(keyword) ||
    p.origin.toLowerCase().includes(keyword);

  return matchCategory && matchSearch;
});
 useEffect(()=>{ (async()=>{ if(!supabase)return; const {data:s}=await supabase.from('site_settings').select('*').eq('id',1).maybeSingle(); if(s)setSettings({...defaults,...s}); const {data:p}=await supabase.from('products').select('*').eq('active',true).order('sort_order'); if(p?.length)setProducts(p as Product[]); })(); },[]);
 const wa=`https://wa.me/${settings.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent('Halo Lodaya Coffee, saya ingin mengetahui informasi produk kopi.')}`;
const track=(label:string)=>{ 
  if(supabase) void supabase.from('click_events').insert({label}); 
};

const formatPrice = (value: string) => {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (!digits) return value || 'Contact us';
  return `Rp${Number(digits).toLocaleString('id-ID')}`;
};

const productWhatsApp = (p: Product, action: string) => {
  const message = `Halo Lodaya Coffee, saya ingin ${action} produk ${p.name} dengan harga ${formatPrice(p.price)}. Apakah masih tersedia?`;
  return `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
};
 return <main>
  <nav className="nav wrap"><div className="navlinks"><a href="#story">Our Story</a><a href="#products">Products</a><a href="#contact">Contact</a></div></nav>
  <section className="hero" id="top"><div className="hero-brand-logo">
  <img src="/lodaya-logo-white.png" alt="Lodaya Coffee Nusantara" />
</div><div className="hero-image"/><div className="hero-shade"/><div className="hero-content wrap"><p className="eyebrow">COFFEE • ORIGIN • NUSANTARA</p><h1>Good coffee.<br/><em>Grounded in</em><br/>Indonesia.</h1><p className="hero-copy">{settings.tagline} Discover the stories and character behind every origin.</p><div className="hero-actions"><a className="button button-light" href="#products">Explore our coffee <span>↗</span></a><a className="text-link" href={wa} onClick={()=>track('hero_whatsapp')}>Talk to our team ↗</a></div></div><div className="hero-index">01 / 04</div></section>
  
<section className="story-profile" id="story">
  <div className="wrap story-layout">

    <div className="story-content">
      <div className="section-kicker">01 — ABOUT LODAYA</div>

      <p className="story-label">LODAYA COFFEE NUSANTARA</p>

      <h2>
        Connecting origins.<br/>
        <em>Sharing excellence.</em>
      </h2>

      <p className="story-description">
        Lodaya Coffee Nusantara is an Indonesian coffee company
        dedicated to showcasing the richness and diversity of
        coffee from across the archipelago.
      </p>

      <p className="story-description">
        We focus on the provision and distribution of Indonesian
        coffee products, covering green beans, roasted beans,
        and ground coffee. Through a carefully developed
        product portfolio, we bring distinctive coffee origins
        closer to individuals, businesses, and coffee enthusiasts.
      </p>

      <p className="story-description">
        From the highlands of Gayo to the coffee landscapes
        of Java Preanger and Meranti, we believe every origin
        carries its own character, identity, and potential.
      </p>

      <p className="story-description">
        Our commitment is to connect the value of Indonesian
        coffee with a wider market through quality, collaboration,
        and a shared appreciation for the nation's coffee heritage.
      </p>

      <div className="story-actions">
  <a href={wa} target="_blank" rel="noreferrer"
    onClick={()=>track('story_whatsapp')}>
    <span>☏</span> START A CONVERSATION ↗
  </a>
  <a href={settings.maps_url} target="_blank" rel="noreferrer"
    onClick={()=>track('story_location')}>
    <span>⌖</span> OUR LOCATION ↗
  </a>
</div>
    </div>

    <div className="story-visual">
      <div className="story-slideshow">

        <img
          className="story-slide slide-one"
          src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=90"
          alt="Coffee beans and coffee preparation"
        />

        <img
          className="story-slide slide-two"
          src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=90"
          alt="Coffee beans close up"
        />

        <img
          className="story-slide slide-three"
          src="https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=90"
          alt="Coffee production and brewing"
        />

      </div>

      <div className="story-image-caption">
        <span>THE INDONESIAN COFFEE HERITAGE</span>
        <span>LODAYA — 01 / 03</span>
      </div>
    </div>

  </div>

  <div className="wrap story-highlights">
    <div>
      <span>01</span>
      <h3>Green Beans</h3>
      <p>Selected Indonesian coffee origins.</p>
    </div>

    <div>
      <span>02</span>
      <h3>Roasted Beans</h3>
      <p>Distinctive character in every roast.</p>
    </div>

    <div>
      <span>03</span>
      <h3>Ground Coffee</h3>
      <p>Indonesian coffee for everyday enjoyment.</p>
    </div>
  </div>
</section>

  <section className="products-section" id="products"><div className="wrap"><div className="section-head"><div><div className="section-kicker">02 — OUR SELECTION</div><h2>Coffee with<br/><em>a sense of place.</em></h2></div><p>Explore our selection of Indonesian coffee, from green beans to carefully roasted coffee and ground coffee.</p></div><div style={{
  display:'flex',
  flexWrap:'wrap',
  justifyContent:'space-between',
  alignItems:'center',
  gap:16,
  marginBottom:30
}}>
  <input
    type="text"
    placeholder="Search coffee or origin..."
    value={searchTerm}
    onChange={e=>setSearchTerm(e.target.value)}
    style={{
      flex:'1 1 240px',
      padding:'14px 16px',
      border:'1px solid #cbb9a9',
      background:'transparent',
      fontSize:13,
      outline:'none'
    }}
  />

  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
    {categories.map(category=>(
      <button
        key={category}
        onClick={()=>setSelectedCategory(category)}
        style={{
          padding:'12px 16px',
          border:'1px solid #cbb9a9',
          background:selectedCategory===category?'#38251e':'transparent',
          color:selectedCategory===category?'#fff':'#38251e',
          cursor:'pointer',
          fontSize:11,
          letterSpacing:1
        }}
      >
        {category.toUpperCase()}
      </button>
    ))}
  </div>
</div>


<div className="product-grid">
 
{filteredProducts.map((p,i)=>(
  <article className="product" key={p.id||p.name}>
    <div className="product-image">
      <img src={p.image_url} alt={p.name}/>
      <span>0{i+1}</span>
    </div>

    {/* KATEGORI */}
    <div style={{
      display:'inline-block',
      marginTop:16,
      marginBottom:10,
      padding:'6px 12px',
      borderRadius:20,
      background:'#ead8ce',
      color:'#641F32',
      fontSize:11,
      fontWeight:700,
      letterSpacing:1
    }}>
      {p.category.toUpperCase()}
    </div>

    {/* NAMA PRODUK */}
    <h3 style={{
      fontSize:25,
      lineHeight:1.2,
      margin:'4px 0 8px',
      fontWeight:500
    }}>
      {p.name}
    </h3>

    {/* ASAL PRODUK */}
    <p style={{
      fontSize:15,
      margin:'0 0 16px',
      color:'#827166'
    }}>
      {p.origin}
    </p>

    {/* UKURAN */}
    <div style={{
      borderTop:'1px solid #dccdb8',
      paddingTop:12,
      marginBottom:10,
      fontSize:17,
      color:'#291B1D'
    }}>
      <strong>Size:</strong> {p.size || 'Not specified'}
    </div>

    {/* HARGA */}
    <div style={{
      fontSize:25,
      fontWeight:700,
      color:'#641F32',
      marginBottom:12
    }}>
      {formatPrice(p.price)}
    </div>

    {/* STOK */}
    <div style={{
      fontSize:13,
      letterSpacing:1.2,
      fontWeight:700,
      color:(p.stock ?? 0)>0?'#55734e':'#a0443e',
      marginBottom:24
    }}>
      {(p.stock ?? 0)>0?'● IN STOCK':'● SOLD OUT'}
    </div>

    {/* TOMBOL */}
    <div style={{
      display:'flex',
      gap:8,
      flexWrap:'wrap'
    }}>
      <button
        onClick={()=>setSelectedProduct(p)}
        style={{
          flex:'1 1 110px',
          padding:'14px 8px',
          border:'1px solid #641F32',
          background:'transparent',
          color:'#641F32',
          fontSize:12,
          fontWeight:700,
          letterSpacing:0.5,
          cursor:'pointer'
        }}
      >
        VIEW DETAILS
      </button>

      <a
        href={productWhatsApp(p,'memesan')}
        target="_blank"
        rel="noreferrer"
        onClick={()=>track('buy_'+p.name)}
        style={{
          flex:'1 1 90px',
          padding:'14px 8px',
          background:(p.stock ?? 0)>0?'#641F32':'#999',
          color:'#fff',
          textAlign:'center',
          fontSize:12,
          fontWeight:700,
          textDecoration:'none',
          pointerEvents:(p.stock ?? 0)>0?'auto':'none',
          opacity:(p.stock ?? 0)>0?1:0.5
        }}
      >
        BUY NOW ↗
      </a>
    </div>
  </article>
))}


  {filteredProducts.length===0&&(
    <p style={{textAlign:'center',padding:40,gridColumn:'1/-1'}}>
      No coffee found. Try another search.
    </p>
  )}
</div>
<div className="center-action"><a className="button button-dark" href={settings.shop_url} onClick={()=>track('shop_all')}>Shop our selection ↗</a></div></div></section>
  <section className="origin-band"><div className="origin-photo"/><div className="origin-copy"><div className="section-kicker">03 — ROOTED IN THE ARCHIPELAGO</div><h2>Many origins.<br/><em>One shared passion.</em></h2><p>Indonesia’s coffee landscape is rich with places, people, and traditions. We’re here to help you explore it, one cup at a time.</p><div className="origin-actions">
  <a href={wa} target="_blank" rel="noreferrer"
    onClick={()=>track('origin_whatsapp')}>
    ☏ START CHAT ↗
  </a>
  <a href={settings.maps_url} target="_blank" rel="noreferrer"
    onClick={()=>track('origin_location')}>
    ⌖ FIND OUR LOCATION ↗
  </a>
</div></div></section>
  <section className="contact wrap" id="contact"><div className="section-kicker">04 — CONNECT WITH LODAYA</div><h2>Let’s make<br/><em>good things happen.</em></h2><p>For product inquiries, wholesale, partnerships, or simply a conversation about coffee — we’d love to hear from you.</p>
<div className="contact-links">

  <a href={wa} target="_blank" rel="noreferrer"
    onClick={()=>track('contact_whatsapp')}>
    <span className="contact-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M20 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20l1.2-4.4A8.4 8.4 0 1 1 20 11.5Z"/>
        <path d="M8.5 8.5c.5 2.5 2 4 4.5 5l1.5-1.5 2 1c-.3 1.5-1.2 2.2-2.5 2.2-3.8-.4-6.3-2.9-6.7-6.7 0-1.3.7-2.2 2.2-2.5l1 2-1.5 1.5"/>
      </svg>
    </span>
    <span>WhatsApp</span><span>↗</span>
  </a>

  <a href={settings.instagram} target="_blank" rel="noreferrer"
    onClick={()=>track('contact_instagram')}>
    <span className="contact-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="3" width="18" height="18" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/>
      </svg>
    </span>
    <span>Instagram</span><span>↗</span>
  </a>

  <a href={settings.tiktok} target="_blank" rel="noreferrer"
    onClick={()=>track('contact_tiktok')}>
    <span className="contact-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M14 3v11.5a4.5 4.5 0 1 1-4-4.47"/>
        <path d="M14 3c.5 3 2.5 5 5 5.5"/>
      </svg>
    </span>
    <span>TikTok</span><span>↗</span>
  </a>

  <a href={settings.maps_url} target="_blank" rel="noreferrer"
    onClick={()=>track('contact_maps')}>
    <span className="contact-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/>
        <circle cx="12" cy="10" r="2.5"/>
      </svg>
    </span>
    <span>Our Location</span><span>↗</span>
  </a>

  <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || ''}`}
    onClick={()=>track('contact_email')}>
    <span className="contact-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <path d="m3 7 9 6 9-6"/>
      </svg>
    </span>
    <span>Email</span><span>↗</span>
  </a>

</div>
</section>
  <footer className="footer"><div className="wrap footer-inner"><a className="brand-logo footer-brand-logo" href="#top">
  <img src="/lodaya-logo-white.png" alt="Lodaya Coffee Nusantara" />
</a><p>Indonesian coffee, thoughtfully shared.</p><span>© {new Date().getFullYear()} Lodaya Coffee Nusantara</span></div></footer> {selectedProduct && (
<div
  onClick={()=>setSelectedProduct(null)}
  style={{
    position:'fixed',
    inset:0,
    background:'rgba(25,15,12,0.8)',
    zIndex:9999,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    padding:20
  }}
>
  <div
    onClick={e=>e.stopPropagation()}
    style={{
      background:'#f3eee5',
      maxWidth:750,
      width:'100%',
      padding:30,
      position:'relative',
      maxHeight:'90vh',
      overflowY:'auto'
    }}
  >
    <button
      onClick={()=>setSelectedProduct(null)}
      style={{float:'right',cursor:'pointer'}}
    >
      ✕ Close
    </button>

    <img
      src={selectedProduct.image_url}
      alt={selectedProduct.name}
      style={{width:'100%',maxHeight:350,objectFit:'cover'}}
    />

    <p>
  {selectedProduct.category} · {selectedProduct.origin}
  {selectedProduct.size && ` · ${selectedProduct.size.toUpperCase()}`}
</p>

    <h2>{selectedProduct.name}</h2>

    <p>{selectedProduct.description}</p>

   <p>
  {(selectedProduct.stock ?? 0)>0
    ? '● IN STOCK'
    : '● SOLD OUT'}
</p>

<p>{selectedProduct.price}</p>

    <div style={{
  display:'flex',
  gap:12,
  flexWrap:'wrap',
  marginTop:20
}}>
  <a
    href={productWhatsApp(selectedProduct,'menanyakan informasi')}
    target="_blank"
    rel="noreferrer"
    onClick={()=>track('inquiry_'+selectedProduct.name)}
    style={{
      padding:'14px 20px',
      border:'1px solid #641F32',
      color:'#641F32',
      textDecoration:'none',
      fontSize:13
    }}
  >
    ASK ABOUT THIS COFFEE
  </a>

  <a
    href={productWhatsApp(selectedProduct,'memesan')}
    target="_blank"
    rel="noreferrer"
    onClick={()=>track('buy_detail_'+selectedProduct.name)}
    style={{
      padding:'14px 24px',
      background:(selectedProduct.stock ?? 0)>0?'#641F32':'#999',
      color:'#fff',
      textDecoration:'none',
      fontSize:13,
      pointerEvents:(selectedProduct.stock ?? 0)>0?'auto':'none',
      opacity:(selectedProduct.stock ?? 0)>0?1:0.5
    }}
  >
    BUY NOW ↗
  </a>
</div>     </div>
  </div>
)}
 </main>
}
