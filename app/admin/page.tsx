'use client';
import { useEffect, useState } from 'react';
import { supabase, hasSupabase } from '@/lib/supabase';


type Product = {
  id?: string;
  name: string;
  category: string;
  origin: string;
  size?: string;
  description: string;
  image_url: string;
  price: string;
  active?: boolean;
  sort_order?: number;
  stock?: number;
};

type Settings={tagline:string;whatsapp:string;maps_url:string;instagram:string;tiktok:string;shop_url:string;about:string};

const blank: Product = {
  name: '',
  category: 'Ground Coffee',
  origin: '',
  size: '1 kg',
  description: '',
  image_url: '',
  price: '',
  active: true,
  sort_order: 0,
  stock: 30
};

const defaults:Settings={tagline:'A journey through Indonesian coffee.',whatsapp:'6281234567890',maps_url:'',instagram:'',tiktok:'',shop_url:'',about:'We bring carefully selected Indonesian coffee closer to people who appreciate its origin, character, and craft.'};
export default function Admin(){const [session,setSession]=useState<any>(null);const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [message,setMessage]=useState('');const [tab,setTab]=useState('overview');const [products,setProducts]=useState<Product[]>([]);const [settings,setSettings]=useState<Settings>(defaults);const [form,setForm]=useState<Product>(blank);const [editing,setEditing]=useState<string|null>(null);const [events,setEvents]=useState<any[]>([]);
const [productSearch,setProductSearch]=useState('');
const [productCategory,setProductCategory]=useState('All');
const [uploading,setUploading]=useState(false);
const [uploadMessage,setUploadMessage]=useState('');
 useEffect(()=>{if(!supabase)return;supabase.auth.getSession().then(({data})=>setSession(data.session));const {data:listener}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>listener.subscription.unsubscribe()},[]);
 async function load(){if(!supabase)return;const [p,s,e]=await Promise.all([supabase.from('products').select('*').order('sort_order'),supabase.from('site_settings').select('*').eq('id',1).maybeSingle(),supabase.from('click_events').select('*').order('created_at',{ascending:false}).limit(30)]);setProducts((p.data||[]) as Product[]);if(s.data)setSettings({...defaults,...s.data});setEvents(e.data||[])}
 useEffect(()=>{if(session)void load()},[session]);
const categories = [
  'All',
  'Ground Coffee',
  'Roasted Beans',
  'Green Beans'
];
const filteredAdminProducts = products.filter(p=>{
  const keyword = productSearch.toLowerCase();

  const matchSearch =
    p.name.toLowerCase().includes(keyword) ||
    p.origin.toLowerCase().includes(keyword);

  const matchCategory =
    productCategory === 'All' ||
    p.category === productCategory;

  return matchSearch && matchCategory;
});
 async function login(e:React.FormEvent){e.preventDefault();if(!supabase)return;const {error}=await supabase.auth.signInWithPassword({email,password});setMessage(error?.message||'Login berhasil.');}
async function handleImageUpload(e:React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];

  if (!file || !supabase) return;

  if (!file.type.startsWith('image/')) {
    setUploadMessage('File harus berupa gambar.');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setUploadMessage('Ukuran gambar maksimal 5 MB.');
    return;
  }

  setUploading(true);
  setUploadMessage('Mengunggah gambar...');

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
  const filePath = `${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    setUploadMessage(`Upload gagal: ${error.message}`);
    setUploading(false);
    return;
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  setForm(prev => ({ ...prev, image_url: data.publicUrl }));
  setUploadMessage('Foto berhasil diunggah.');

  setUploading(false);
} 
async function saveProduct(e:React.FormEvent){e.preventDefault();if(!supabase)return;const payload={...form,stock:Number(form.stock ?? 30),active:true};const result=editing?await supabase.from('products').update(payload).eq('id',editing):await supabase.from('products').insert(payload);if(result.error){setMessage(result.error.message);return}setMessage('Produk berhasil disimpan.');setForm(blank);setEditing(null);await load()}
 async function removeProduct(id?:string){if(!supabase||!id||!confirm('Hapus produk ini?'))return;const {error}=await supabase.from('products').delete().eq('id',id);setMessage(error?.message||'Produk dihapus.');await load()}
 async function saveSettings(e:React.FormEvent){e.preventDefault();if(!supabase)return;const {error}=await supabase.from('site_settings').upsert({id:1,...settings});setMessage(error?.message||'Pengaturan berhasil disimpan.');}
 if(!hasSupabase)return <main className="admin-shell"><div className="admin-card"><a className="brand-logo" href="/">
 <img src="/lodaya-logo.png" alt="Lodaya Coffee Nusantara" />
</a><p className="section-kicker">ADMIN SETUP</p><h1>Connect your<br/><em>digital workspace.</em></h1><p>Dashboard admin sudah disiapkan. Hubungkan project Supabase terlebih dahulu agar login, katalog, pengaturan, dan statistik tersimpan secara online.</p><ol><li>Buat project di Supabase.</li><li>Salin Project URL dan anon key.</li><li>Isi file <code>.env.local</code> sesuai panduan README.</li><li>Jalankan ulang website.</li></ol><a className="button button-dark" href="https://supabase.com/dashboard" target="_blank">Open Supabase ↗</a><a className="under-link" href="/">← Back to website</a></div></main>;
 if(!session)return <main className="admin-shell"><form className="admin-card" onSubmit={login}><a className="brand-logo" href="/">
  <img src="/lodaya-logo.png" alt="Lodaya Coffee Nusantara" />
</a><p className="section-kicker">PRIVATE ACCESS</p><h1>Admin<br/><em>workspace.</em></h1><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className="button button-dark">Sign in ↗</button>{message&&<p className="notice">{message}</p>}<a className="under-link" href="/">← Back to website</a></form></main>;
 return <main className="dashboard"><aside className="sidebar"><a className="brand-logo brand-logo-white" href="/">
  <img src="/lodaya-logo-white.png" alt="Lodaya Coffee Nusantara" />
</a><p className="section-kicker">MANAGEMENT</p>{[['overview','Overview'],['products','Products'],['settings','Site settings']].map(([id,label])=><button key={id} className={tab===id?'side-active':'side-button'} onClick={()=>setTab(id)}>{label}</button>)}<button className="side-button signout" onClick={()=>supabase?.auth.signOut()}>Sign out ↗</button></aside><section className="dash-main"><div className="dash-top"><div><p className="section-kicker">LODAYA DIGITAL HUB / ADMIN</p><h1>{tab==='overview'?'Overview':tab==='products'?'Product catalog':'Site settings'}</h1></div><a href="/" target="_blank" className="under-link">View website ↗</a></div>
 {tab==='overview'&&<>
  <div className="stat-grid">
    <div className="stat-card">
      <span>TOTAL PRODUCTS</span>
      <strong>{products.length}</strong>
      <small>Catalog entries</small>
    </div>

    <div className="stat-card">
      <span>TOTAL STOCK</span>
      <strong>{products.reduce((total,p)=>total+(Number(p.stock)||0),0)}</strong>
      <small>Units in inventory</small>
    </div>

    <div className="stat-card">
      <span>LOW STOCK</span>
      <strong>{products.filter(p=>Number(p.stock)>0&&Number(p.stock)<=5).length}</strong>
      <small>Products with 5 or fewer units</small>
    </div>

    <div className="stat-card">
      <span>SOLD OUT</span>
      <strong>{products.filter(p=>Number(p.stock)===0).length}</strong>
      <small>Products out of stock</small>
    </div>
  </div>

  <div className="panel inventory-panel">
    <h2>Inventory overview</h2>
    {products.length ? products.map(p=>(
      <div className="inventory-row" key={p.id}>
        <div>
          <strong>{p.name}</strong>
          <small>{p.category} · {p.size||'1 kg'}</small>
        </div>
        <span className={
          Number(p.stock)===0?'stock-empty':
          Number(p.stock)<=5?'stock-low':'stock-good'
        }>
          {Number(p.stock)||0} Units
        </span>
      </div>
    )) : <p className="muted">Belum ada produk.</p>}
  </div>

  <div className="panel">
    <h2>Recent link activity</h2>
    {events.length?events.map((e,i)=>(
      <div className="event-row" key={i}>
        <span>{e.label}</span>
        <small>{new Date(e.created_at).toLocaleString('id-ID')}</small>
      </div>
    )):<p className="muted">Belum ada aktivitas tercatat.</p>}
  </div>
</>}
 {tab==='products'&&<div className="admin-columns"><div className="panel"><h2>{editing?'Edit product':'Add a product'}</h2><form className="stack-form" onSubmit={saveProduct}><label>
  Product name
  <input
    value={form.name}
    onChange={e=>setForm({...form,name:e.target.value})}
    required
  />
</label>

<label>
  Category
  <select
    value={form.category}
    onChange={e=>setForm({...form,category:e.target.value})}
    required
  >
    <option value="Ground Coffee">Ground Coffee</option>
    <option value="Roasted Beans">Roasted Beans</option>
    <option value="Green Beans">Green Beans</option>
  </select>
</label>

<label>
  Origin
  <input
    value={form.origin}
    onChange={e=>setForm({...form,origin:e.target.value})}
    required
  />
</label>

<label>
  Price / inquiry label
  <input
    value={form.price}
    onChange={e=>setForm({...form,price:e.target.value})}
    placeholder="Contoh: 250.000"
    required
  />
</label>

<label>
  Product Image
  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    disabled={uploading}
  />
</label>

{uploadMessage && (
  <p className="notice">{uploadMessage}</p>
)}

{form.image_url && (
  <div className="image-preview">
    <img src={form.image_url} alt="Product preview" />
    <button
      type="button"
      className="button button-outline"
      onClick={() => setForm({...form,image_url:''})}
    >
      Remove image
    </button>
  </div>
)}

<label>
  Description
  <textarea
    value={form.description}
    onChange={e=>setForm({...form,description:e.target.value})}
    required
  />
</label>
<label>
  Product Size
  <select
    value={form.size || '1 kg'}
    onChange={e => setForm({...form, size:e.target.value})}
    required
  >
    <option value="1 kg">1 KG</option>
    <option value="500 g">500 G</option>
    <option value="250 g">250 G</option>
    <option value="100 g">100 G</option>
  </select>
</label>

<label>
  Stock Quantity
  <input
    type="number"
    min="0"
    value={form.stock ?? 30}
    onChange={e =>
      setForm({...form, stock:Number(e.target.value)})
    }
    required
  />
</label>

<button
  className="button button-dark"
  disabled={uploading}
>
  {uploading ? 'Uploading image...' : 'Save product'}
</button>{editing&&<button type="button" className="button button-outline" onClick={()=>{setEditing(null);setForm(blank)}}>Cancel edit</button>}</form></div><div className="panel product-list-panel">
  <h2>Current products ({filteredAdminProducts.length})</h2>

  <div className="product-filter">
    <input
      type="text"
      placeholder="Search product or origin..."
      value={productSearch}
      onChange={e=>setProductSearch(e.target.value)}
    />

    <select
      value={productCategory}
      onChange={e=>setProductCategory(e.target.value)}
    >
      {categories.map(category=>(
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  </div>

  {filteredAdminProducts.length ? filteredAdminProducts.map(p=>(
    <div className="manage-product product-manage-card" key={p.id}>
      <img
        src={p.image_url || '/placeholder.png'}
        alt={p.name}
      />

      <div className="product-manage-info">
        <strong>{p.name}</strong>
        <small>{p.category} · {p.origin}</small>
        <small>{p.size || '1 kg'} · Stock: {p.stock ?? 0}</small>
        <small>{p.price}</small>
      </div>

      <div className="inline-actions">
        <button onClick={()=>{
          setEditing(p.id||null);
          setForm({...p,size:p.size||'1 kg'});
        }}>Edit</button>

        <button onClick={()=>removeProduct(p.id)}>
          Delete
        </button>
      </div>
    </div>
  )) : (
    <p className="muted">Produk tidak ditemukan.</p>
  )}
</div></div>}
 {tab==='settings'&&<form className="panel settings-form" onSubmit={saveSettings}><h2>Public website information</h2>{[['tagline','Tagline'],['whatsapp','WhatsApp number (62...)'],['maps_url','Google Maps URL'],['instagram','Instagram URL'],['tiktok','TikTok URL'],['shop_url','Marketplace URL'],['about','About Lodaya']].map(([k,label])=><label key={k}>{label}{k==='about'?<textarea value={(settings as any)[k]} onChange={e=>setSettings({...settings,[k]:e.target.value})}/>:<input value={(settings as any)[k]} onChange={e=>setSettings({...settings,[k]:e.target.value})}/>}</label>)}<button className="button button-dark">Save settings</button></form>}
 {message&&<p className="notice">{message}</p>}</section></main>
}
