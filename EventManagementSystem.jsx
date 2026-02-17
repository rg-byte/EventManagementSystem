import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   INITIAL DATA
═══════════════════════════════════════════════════════ */
const INIT_USERS = [
  { id: 1, username: "admin", password: "admin123", role: "admin", name: "Administrator", email: "admin@events.com" },
  { id: 2, username: "vendor1", password: "vendor123", role: "vendor", name: "Royal Caterers", email: "royal@events.com", category: "Catering", membershipId: "MEM001" },
  { id: 3, username: "vendor2", password: "vendor123", role: "vendor", name: "Bloom Florists", email: "bloom@events.com", category: "Florist", membershipId: "MEM002" },
  { id: 4, username: "user1", password: "user123", role: "user", name: "John Doe", email: "john@events.com", phone: "9876543210" },
];

const INIT_VENDORS = [
  { id: 1, username: "vendor1", name: "Royal Caterers", email: "royal@events.com", category: "Catering", contact: "9876543210", membershipId: "MEM001" },
  { id: 2, username: "vendor2", name: "Bloom Florists", email: "bloom@events.com", category: "Florist", contact: "9123456789", membershipId: "MEM002" },
  { id: 3, username: "vendor3", name: "Decor Dreams", email: "decor@events.com", category: "Decoration", contact: "8765432109", membershipId: "MEM003" },
  { id: 4, username: "vendor4", name: "Bright Lights", email: "lights@events.com", category: "Lighting", contact: "7654321098", membershipId: "MEM004" },
];

const INIT_MEMBERSHIPS = [
  { id: "MEM001", vendorId: 1, vendorName: "Royal Caterers", plan: "1 year", startDate: "2025-01-01", endDate: "2026-01-01", status: "Active" },
  { id: "MEM002", vendorId: 2, vendorName: "Bloom Florists", plan: "6 months", startDate: "2025-06-01", endDate: "2025-12-01", status: "Active" },
  { id: "MEM003", vendorId: 3, vendorName: "Decor Dreams", plan: "2 years", startDate: "2024-01-01", endDate: "2026-01-01", status: "Active" },
  { id: "MEM004", vendorId: 4, vendorName: "Bright Lights", plan: "6 months", startDate: "2025-08-01", endDate: "2026-02-01", status: "Active" },
];

const INIT_PRODUCTS = [
  { id: 1, vendorId: 1, vendorName: "Royal Caterers", category: "Catering", name: "Wedding Feast Package", price: 15000, image: "🍽️", status: "Available" },
  { id: 2, vendorId: 1, vendorName: "Royal Caterers", category: "Catering", name: "Corporate Lunch", price: 5000, image: "🥘", status: "Available" },
  { id: 3, vendorId: 2, vendorName: "Bloom Florists", category: "Florist", name: "Bridal Bouquet", price: 3500, image: "💐", status: "Available" },
  { id: 4, vendorId: 2, vendorName: "Bloom Florists", category: "Florist", name: "Stage Floral Arch", price: 12000, image: "🌸", status: "Available" },
  { id: 5, vendorId: 3, vendorName: "Decor Dreams", category: "Decoration", name: "Mandap Setup", price: 25000, image: "✨", status: "Available" },
  { id: 6, vendorId: 3, vendorName: "Decor Dreams", category: "Decoration", name: "Reception Decor", price: 18000, image: "🎊", status: "Available" },
  { id: 7, vendorId: 4, vendorName: "Bright Lights", category: "Lighting", name: "LED Stage Lighting", price: 8000, image: "💡", status: "Available" },
  { id: 8, vendorId: 4, vendorName: "Bright Lights", category: "Lighting", name: "Fairy Lights Setup", price: 4500, image: "🌟", status: "Available" },
];

const INIT_ORDERS = [
  { id: "TXN001", userId: 4, userName: "John Doe", userEmail: "john@events.com", items: [{ productId: 3, name: "Bridal Bouquet", price: 3500, qty: 2, image: "💐" }], total: 7000, status: "Pending", name: "John Doe", email: "john@events.com", phone: "9876543210", address: "123 Main St", city: "Mumbai", state: "Maharashtra", pinCode: "400001", paymentMethod: "UPI", date: "2026-02-10" },
];

const INIT_GUESTS = [
  { id: 1, userId: 4, name: "Priya Sharma", email: "priya@email.com", phone: "9876501111", event: "Wedding", rsvp: true, note: "Vegetarian" },
  { id: 2, userId: 4, name: "Rahul Verma", email: "rahul@email.com", phone: "9876502222", event: "Corporate", rsvp: false, note: "" },
];

const CATEGORIES = ["Catering", "Florist", "Decoration", "Lighting"];
const PLAN_MONTHS = { "6 months": 6, "1 year": 12, "2 years": 24 };

function addMonths(dateStr, months) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}
function today() { return new Date().toISOString().split("T")[0]; }
function genId(prefix, arr) { return `${prefix}${String(arr.length + 1).padStart(3, "0")}`; }

/* ═══════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Nunito:wght@300;400;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --navy:#0B1829;--navy2:#112240;--navy3:#1A3055;
  --teal:#00B4D8;--teal2:#0096B7;--teal3:#48CAE4;
  --amber:#FFC300;--amber2:#E6AF00;
  --white:#F0F8FF;--muted:#8BAFC7;--danger:#EF4444;
  --success:#10B981;--warn:#F59E0B;
  --card:#142840;--border:rgba(0,180,216,0.18);
  --shadow:0 4px 24px rgba(0,0,0,0.4);
  --rad:10px;
}
body{font-family:'Nunito',sans-serif;background:var(--navy);color:var(--white);min-height:100vh}
h1,h2,h3{font-family:'Crimson Pro',serif}

/* Layout */
.app-shell{min-height:100vh}
.page{padding:1.5rem;max-width:1100px;margin:0 auto}
.page-sm{padding:1.5rem;max-width:540px;margin:0 auto}

/* Topnav */
.topnav{background:var(--navy2);border-bottom:1px solid var(--border);padding:.75rem 1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;position:sticky;top:0;z-index:100}
.nav-brand{font-family:'Crimson Pro',serif;font-size:1.3rem;color:var(--teal);font-weight:700;display:flex;align-items:center;gap:.4rem}
.nav-right{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}
.nav-btn{background:transparent;border:1px solid var(--border);color:var(--muted);padding:.38rem .85rem;border-radius:7px;cursor:pointer;font-size:.82rem;font-family:'Nunito',sans-serif;transition:all .2s}
.nav-btn:hover,.nav-btn.active{border-color:var(--teal);color:var(--teal);background:rgba(0,180,216,.08)}
.nav-out{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);color:#fca5a5;padding:.38rem .85rem;border-radius:7px;cursor:pointer;font-size:.82rem;font-family:'Nunito',sans-serif;transition:all .2s}
.nav-out:hover{background:rgba(239,68,68,.18)}
.nav-user{font-size:.82rem;color:var(--muted)}
.nav-user strong{color:var(--amber)}
.nav-badge{background:var(--amber);color:var(--navy);border-radius:50%;width:18px;height:18px;font-size:.65rem;font-weight:700;display:inline-flex;align-items:center;justify-content:center;margin-left:3px}

/* Auth */
.auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem;background:radial-gradient(ellipse at 40% 30%,rgba(0,180,216,.12),transparent 60%),var(--navy)}
.auth-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:2.5rem;width:100%;max-width:460px;box-shadow:var(--shadow)}
.auth-icon{text-align:center;font-size:3rem;margin-bottom:.5rem}
.auth-title{font-family:'Crimson Pro',serif;font-size:2rem;color:var(--teal);text-align:center;margin-bottom:.25rem}
.auth-sub{text-align:center;color:var(--muted);font-size:.88rem;margin-bottom:2rem}
.auth-back{background:transparent;border:none;color:var(--muted);cursor:pointer;font-size:.85rem;padding:.3rem 0;margin-bottom:1.25rem;display:flex;align-items:center;gap:.3rem;font-family:'Nunito',sans-serif}
.auth-back:hover{color:var(--teal)}

/* Forms */
.fgroup{margin-bottom:1.1rem}
.flabel{display:block;font-size:.75rem;font-weight:700;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:.4rem}
.flabel.required::after{content:" *";color:var(--danger)}
.finput{width:100%;background:var(--navy3);border:1px solid var(--border);border-radius:var(--rad);padding:.7rem 1rem;color:var(--white);font-family:'Nunito',sans-serif;font-size:.9rem;outline:none;transition:border-color .2s}
.finput:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(0,180,216,.12)}
.finput.err{border-color:var(--danger)}
.fselect{width:100%;background:var(--navy3);border:1px solid var(--border);border-radius:var(--rad);padding:.7rem 1rem;color:var(--white);font-family:'Nunito',sans-serif;font-size:.9rem;outline:none;cursor:pointer}
.fselect:focus{border-color:var(--teal)}
.ferr{color:var(--danger);font-size:.78rem;margin-top:.25rem}
.radio-group{display:flex;gap:1rem;flex-wrap:wrap;margin-top:.35rem}
.radio-opt{display:flex;align-items:center;gap:.4rem;cursor:pointer;font-size:.88rem;padding:.45rem .9rem;border:1px solid var(--border);border-radius:7px;transition:all .2s;user-select:none}
.radio-opt.selected{border-color:var(--teal);background:rgba(0,180,216,.1);color:var(--teal)}
.radio-opt input{accent-color:var(--teal)}
.checkbox-opt{display:flex;align-items:center;gap:.5rem;cursor:pointer;font-size:.9rem;user-select:none}
.checkbox-opt input{accent-color:var(--teal);width:16px;height:16px}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
@media(max-width:560px){.form-grid{grid-template-columns:1fr}}
.err-box{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:.7rem 1rem;color:#fca5a5;font-size:.85rem;margin-bottom:1rem}
.ok-box{background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.3);border-radius:8px;padding:.7rem 1rem;color:#6ee7b7;font-size:.85rem;margin-bottom:1rem}

/* Buttons */
.brow{display:flex;gap:.75rem;margin-top:1.25rem;flex-wrap:wrap}
.btn{padding:.7rem 1.4rem;border-radius:var(--rad);border:none;cursor:pointer;font-family:'Nunito',sans-serif;font-size:.9rem;font-weight:700;transition:all .2s}
.btn-teal{background:linear-gradient(135deg,var(--teal),var(--teal2));color:var(--navy);flex:1}
.btn-teal:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,180,216,.35)}
.btn-amber{background:linear-gradient(135deg,var(--amber),var(--amber2));color:var(--navy)}
.btn-amber:hover{transform:translateY(-1px)}
.btn-ghost{background:transparent;border:1px solid var(--border);color:var(--muted);flex:1}
.btn-ghost:hover{border-color:var(--teal);color:var(--teal)}
.btn-danger{background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.3);color:#fca5a5}
.btn-danger:hover{background:rgba(239,68,68,.25)}
.btn-success{background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3);color:#6ee7b7}
.btn-sm{padding:.38rem .85rem;font-size:.8rem}
.btn-xs{padding:.25rem .6rem;font-size:.75rem}

/* Cards */
.panel{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:1.5rem;margin-bottom:1.25rem}
.panel-title{font-family:'Crimson Pro',serif;font-size:1.25rem;color:var(--teal);margin-bottom:1rem;display:flex;align-items:center;gap:.4rem}
.pg-title{font-family:'Crimson Pro',serif;font-size:1.9rem;color:var(--white);margin-bottom:.25rem}
.pg-sub{color:var(--muted);font-size:.88rem;margin-bottom:1.5rem}
.stat-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem;margin-bottom:1.5rem}
.stat{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.2rem;text-align:center}
.stat-n{font-family:'Crimson Pro',serif;font-size:2.2rem;color:var(--amber)}
.stat-l{font-size:.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1.1rem}
.vcard{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem;transition:all .25s;cursor:pointer}
.vcard:hover{border-color:var(--teal);transform:translateY(-3px);box-shadow:0 10px 30px rgba(0,0,0,.3)}
.vcard-icon{font-size:2.4rem;text-align:center;margin-bottom:.6rem}
.vcard-name{font-family:'Crimson Pro',serif;font-size:1.05rem;text-align:center;margin-bottom:.2rem}
.vcard-cat{text-align:center;color:var(--muted);font-size:.8rem;margin-bottom:.5rem}

/* Table */
.tbl-wrap{overflow-x:auto}
table.dtbl{width:100%;border-collapse:collapse;font-size:.86rem}
.dtbl th{background:var(--navy3);color:var(--teal);padding:.7rem .9rem;text-align:left;border-bottom:1px solid var(--border);font-size:.76rem;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap}
.dtbl td{padding:.7rem .9rem;border-bottom:1px solid rgba(255,255,255,.04);vertical-align:middle}
.dtbl tr:hover td{background:rgba(0,180,216,.04)}
.badge{display:inline-block;padding:.18rem .6rem;border-radius:20px;font-size:.72rem;font-weight:700}
.b-teal{background:rgba(0,180,216,.18);color:var(--teal3)}
.b-amber{background:rgba(255,195,0,.18);color:var(--amber)}
.b-green{background:rgba(16,185,129,.18);color:#6ee7b7}
.b-red{background:rgba(239,68,68,.18);color:#fca5a5}
.b-gray{background:rgba(139,175,199,.15);color:var(--muted)}

/* Cart */
.cart-item{display:flex;align-items:center;gap:.9rem;padding:.9rem;background:var(--navy3);border-radius:10px;margin-bottom:.6rem;border:1px solid var(--border)}
.ci-img{font-size:2rem;min-width:40px;text-align:center}
.ci-info{flex:1}
.ci-name{font-weight:600;font-size:.92rem}
.ci-price{color:var(--muted);font-size:.8rem}
.qty-ctrl{display:flex;align-items:center;gap:.4rem}
.qty-btn{background:var(--navy2);border:1px solid var(--border);color:var(--white);width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:border-color .2s}
.qty-btn:hover{border-color:var(--teal);color:var(--teal)}
.cart-total{background:rgba(255,195,0,.06);border:1px solid rgba(255,195,0,.2);border-radius:10px;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;margin-top:.75rem}
.ct-label{color:var(--muted);font-size:.9rem}
.ct-amount{font-family:'Crimson Pro',serif;font-size:1.8rem;color:var(--amber)}

/* Index splash */
.splash{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;background:radial-gradient(ellipse at 50% 20%,rgba(0,180,216,.1),transparent 60%),var(--navy)}
.splash-title{font-family:'Crimson Pro',serif;font-size:clamp(2.2rem,6vw,4rem);color:var(--teal);text-align:center;margin-bottom:.4rem}
.splash-sub{color:var(--muted);text-align:center;letter-spacing:.2em;text-transform:uppercase;font-size:.88rem;margin-bottom:3rem}
.splash-cards{display:flex;gap:1.25rem;flex-wrap:wrap;justify-content:center}
.sc{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:2rem 2.5rem;cursor:pointer;transition:all .3s;text-align:center;min-width:180px}
.sc:hover{border-color:var(--teal);transform:translateY(-6px);box-shadow:0 16px 40px rgba(0,0,0,.4)}
.sc-icon{font-size:2.5rem;margin-bottom:.6rem}
.sc-title{font-family:'Crimson Pro',serif;font-size:1.3rem;color:var(--amber)}
.sc-desc{font-size:.8rem;color:var(--muted);margin-top:.25rem}

/* Misc */
.divider{height:1px;background:var(--border);margin:1.25rem 0}
.empty{text-align:center;padding:3rem 1rem;color:var(--muted)}
.empty-icon{font-size:2.5rem;margin-bottom:.75rem}
.tag-bar{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.25rem}
.tag{padding:.38rem .9rem;border:1px solid var(--border);border-radius:20px;background:transparent;color:var(--muted);cursor:pointer;font-size:.8rem;font-family:'Nunito',sans-serif;transition:all .2s}
.tag.on{border-color:var(--teal);color:var(--teal);background:rgba(0,180,216,.08)}
.search-in{background:var(--navy3);border:1px solid var(--border);border-radius:var(--rad);padding:.6rem 1rem;color:var(--white);font-family:'Nunito',sans-serif;font-size:.88rem;outline:none;min-width:200px;flex:1}
.search-in:focus{border-color:var(--teal)}
.fbar{display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:1.25rem}

/* Toast */
.toast{position:fixed;bottom:1.5rem;right:1.5rem;padding:.8rem 1.4rem;border-radius:10px;font-weight:700;font-size:.88rem;z-index:9999;animation:slidein .3s ease;box-shadow:0 8px 25px rgba(0,0,0,.35)}
@keyframes slidein{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}
.toast-ok{background:rgba(16,185,129,.9);color:#0D2818}
.toast-err{background:rgba(239,68,68,.9);color:#fff}

/* Maintenance menu */
.maint-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem}
.maint-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.5rem;cursor:pointer;transition:all .25s;text-align:center}
.maint-card:hover{border-color:var(--amber);transform:translateY(-3px)}
.mc-icon{font-size:2rem;margin-bottom:.5rem}
.mc-title{font-family:'Crimson Pro',serif;font-size:1.1rem;color:var(--amber)}
.mc-desc{font-size:.78rem;color:var(--muted);margin-top:.2rem}

/* Payment confirm */
.confirm-block{background:var(--navy3);border:1px solid var(--border);border-radius:12px;padding:1.25rem;margin-bottom:1rem}
.confirm-row{display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:.88rem}
.confirm-row:last-child{border-bottom:none}
.confirm-label{color:var(--muted)}
.confirm-val{font-weight:600}
`;

/* ═══════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("index");
  const [session, setSession] = useState(null); // { user }
  const [users, setUsers] = useState(INIT_USERS);
  const [vendors, setVendors] = useState(INIT_VENDORS);
  const [memberships, setMemberships] = useState(INIT_MEMBERSHIPS);
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [orders, setOrders] = useState(INIT_ORDERS);
  const [guests, setGuests] = useState(INIT_GUESTS);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [ctx2, setCtx2] = useState({}); // extra context passed between screens

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const nav = (s, extra = {}) => { setScreen(s); setCtx2(extra); window.scrollTo(0, 0); };

  const login = (user) => { setSession({ user }); };
  const logout = () => { setSession(null); setCart([]); nav("index"); };

  // Cart helpers
  const addToCart = (product) => {
    setCart(p => {
      const ex = p.find(i => i.id === product.id);
      if (ex) return p.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...p, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart`);
  };
  const removeFromCart = (id) => setCart(p => p.filter(i => i.id !== id));
  const updateQty = (id, d) => setCart(p => p.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const placeOrder = (details) => {
    const o = { id: genId("TXN", orders), userId: session.user.id, userName: session.user.name, userEmail: session.user.email, items: cart.map(i => ({ productId: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image })), total: cartTotal, status: "Pending", ...details, date: today() };
    setOrders(p => [...p, o]);
    setCart([]);
    return o;
  };

  const shared = { session, login, logout, nav, showToast, ctx2, users, setUsers, vendors, setVendors, memberships, setMemberships, products, setProducts, orders, setOrders, guests, setGuests, cart, addToCart, removeFromCart, updateQty, cartTotal, placeOrder };

  const SCREENS = {
    index: <IndexPage {...shared} />,
    adminLogin: <LoginPage role="admin" {...shared} />,
    vendorLogin: <LoginPage role="vendor" {...shared} />,
    userLogin: <LoginPage role="user" {...shared} />,
    vendorSignup: <VendorSignup {...shared} />,
    userSignup: <UserSignup {...shared} />,

    // Admin flow
    adminMaintenance: <AdminMaintenance {...shared} />,
    addMembership: <AddMembership {...shared} />,
    updateMembership: <UpdateMembership {...shared} />,
    adminReports: <AdminReports {...shared} />,
    adminTransactions: <AdminTransactions {...shared} />,

    // Vendor flow
    vendorHome: <VendorHome {...shared} />,
    vendorAddItem: <VendorAddItem {...shared} />,
    vendorProductStatus: <VendorProductStatus {...shared} />,
    vendorUserRequests: <VendorUserRequests {...shared} />,
    vendorViewProduct: <VendorViewProduct {...shared} />,

    // User flow
    userHome: <UserHome {...shared} />,
    userVendors: <UserVendors {...shared} />,
    userProducts: <UserProducts {...shared} />,
    userCart: <UserCart {...shared} />,
    userPayment: <UserPayment {...shared} />,
    userGuestList: <UserGuestList {...shared} />,
    userOrderStatus: <UserOrderStatus {...shared} />,
    userReports: <UserReports {...shared} />,
    userTransactions: <UserTransactions {...shared} />,
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">
        {SCREENS[screen] || SCREENS.index}
        {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   INDEX PAGE
═══════════════════════════════════════════════════════ */
function IndexPage({ nav }) {
  return (
    <div className="splash">
      <div style={{ fontSize: "3.5rem", marginBottom: ".5rem" }}>🎪</div>
      <h1 className="splash-title">Event Management System</h1>
      <p className="splash-sub">Select your role to continue</p>
      <div className="splash-cards">
        <div className="sc" onClick={() => nav("adminLogin")}><div className="sc-icon">🛡️</div><div className="sc-title">Admin</div><div className="sc-desc">Maintenance & management</div></div>
        <div className="sc" onClick={() => nav("vendorLogin")}><div className="sc-icon">🏪</div><div className="sc-title">Vendor</div><div className="sc-desc">Manage products & orders</div></div>
        <div className="sc" onClick={() => nav("userLogin")}><div className="sc-icon">🎉</div><div className="sc-title">User</div><div className="sc-desc">Book event services</div></div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LOGIN PAGE (all 3 roles)
═══════════════════════════════════════════════════════ */
function LoginPage({ role, users, login, nav }) {
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const [errors, setErrors] = useState({});

  const cfg = { admin: { icon: "🛡️", label: "Admin Login", dest: "adminMaintenance" }, vendor: { icon: "🏪", label: "Vendor Login", dest: "vendorHome" }, user: { icon: "🎉", label: "User Login", dest: "userHome" } }[role];

  const validate = () => {
    const e = {};
    if (!uname.trim()) e.uname = "Username is required";
    if (!pass.trim()) e.pass = "Password is required";
    return e;
  };

  const handleLogin = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const user = users.find(u => u.username === uname.trim() && u.password === pass && u.role === role);
    if (!user) { setErrors({ general: "Invalid username or password" }); return; }
    login(user);
    nav(cfg.dest);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <button className="auth-back" onClick={() => nav("index")}>← Back to Home</button>
        <div className="auth-icon">{cfg.icon}</div>
        <h2 className="auth-title">{cfg.label}</h2>
        <p className="auth-sub">Event Management System</p>
        {errors.general && <div className="err-box">{errors.general}</div>}
        <div className="fgroup">
          <label className="flabel required">Username</label>
          <input className={`finput ${errors.uname ? "err" : ""}`} value={uname} onChange={e => setUname(e.target.value)} placeholder="Enter username" autoComplete="username" />
          {errors.uname && <div className="ferr">{errors.uname}</div>}
        </div>
        <div className="fgroup">
          <label className="flabel required">Password</label>
          <input className={`finput ${errors.pass ? "err" : ""}`} type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter password" autoComplete="current-password" onKeyDown={e => e.key === "Enter" && handleLogin()} />
          {errors.pass && <div className="ferr">{errors.pass}</div>}
        </div>
        <div className="brow">
          <button className="btn btn-ghost" onClick={() => nav("index")}>Cancel</button>
          <button className="btn btn-teal" onClick={handleLogin}>Login</button>
        </div>
        {role === "user" && <div style={{ textAlign: "center", marginTop: "1.1rem", fontSize: ".85rem", color: "var(--muted)" }}>No account? <span style={{ color: "var(--teal)", cursor: "pointer" }} onClick={() => nav("userSignup")}>Sign Up</span></div>}
        {role === "vendor" && <div style={{ textAlign: "center", marginTop: "1.1rem", fontSize: ".85rem", color: "var(--muted)" }}>New vendor? <span style={{ color: "var(--teal)", cursor: "pointer" }} onClick={() => nav("vendorSignup")}>Register here</span></div>}
        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(0,180,216,.06)", borderRadius: "8px", fontSize: ".78rem", color: "var(--muted)" }}>
          <strong style={{ color: "var(--teal)" }}>Demo credentials:</strong><br />
          {role === "admin" && "admin / admin123"}
          {role === "vendor" && "vendor1 / vendor123"}
          {role === "user" && "user1 / user123"}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VENDOR SIGNUP
═══════════════════════════════════════════════════════ */
function VendorSignup({ users, setUsers, vendors, setVendors, login, nav }) {
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "", category: "Catering", contact: "" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Name is required";
    if (!f.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = "Invalid email";
    if (!f.password) e.password = "Password is required";
    else if (f.password.length < 6) e.password = "Minimum 6 characters";
    if (f.password !== f.confirm) e.confirm = "Passwords do not match";
    if (!f.contact.trim()) e.contact = "Contact is required";
    return e;
  };

  const handleSignup = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const uname = f.name.toLowerCase().replace(/\s+/, "").slice(0, 10) + Date.now().toString().slice(-3);
    const newUser = { id: users.length + 1, username: uname, password: f.password, role: "vendor", name: f.name, email: f.email };
    const newVendor = { id: vendors.length + 1, username: uname, name: f.name, email: f.email, category: f.category, contact: f.contact, membershipId: null };
    setUsers(p => [...p, newUser]);
    setVendors(p => [...p, newVendor]);
    login(newUser);
    nav("vendorHome");
  };

  const fi = (k, label, type = "text", ph = "") => (
    <div className="fgroup">
      <label className="flabel required">{label}</label>
      <input className={`finput ${errors[k] ? "err" : ""}`} type={type} value={f[k]} onChange={e => set(k, e.target.value)} placeholder={ph || label} autoComplete={type === "password" ? "new-password" : "off"} />
      {errors[k] && <div className="ferr">{errors[k]}</div>}
    </div>
  );

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <button className="auth-back" onClick={() => nav("vendorLogin")}>← Back to Login</button>
        <div className="auth-icon">🏪</div>
        <h2 className="auth-title">Vendor Sign Up</h2>
        <p className="auth-sub">Event Management System</p>
        {fi("name", "Vendor / Business Name")}
        {fi("email", "Email", "email")}
        {fi("contact", "Contact Number", "tel")}
        <div className="fgroup">
          <label className="flabel required">Category</label>
          <select className="fselect" value={f.category} onChange={e => set("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        {fi("password", "Password", "password")}
        {fi("confirm", "Confirm Password", "password")}
        <div className="brow">
          <button className="btn btn-teal" onClick={handleSignup}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   USER SIGNUP
═══════════════════════════════════════════════════════ */
function UserSignup({ users, setUsers, login, nav }) {
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "", phone: "" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Name is required";
    if (!f.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = "Invalid email";
    if (!f.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(f.phone)) e.phone = "Enter valid 10-digit phone";
    if (!f.password) e.password = "Password is required";
    else if (f.password.length < 6) e.password = "Minimum 6 characters";
    if (f.password !== f.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSignup = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const uname = f.name.toLowerCase().replace(/\s+/, "").slice(0, 10) + Date.now().toString().slice(-3);
    const newUser = { id: users.length + 1, username: uname, password: f.password, role: "user", name: f.name, email: f.email, phone: f.phone };
    setUsers(p => [...p, newUser]);
    login(newUser);
    nav("userHome");
  };

  const fi = (k, label, type = "text") => (
    <div className="fgroup">
      <label className="flabel required">{label}</label>
      <input className={`finput ${errors[k] ? "err" : ""}`} type={type} value={f[k]} onChange={e => set(k, e.target.value)} placeholder={label} autoComplete={type === "password" ? "new-password" : "off"} />
      {errors[k] && <div className="ferr">{errors[k]}</div>}
    </div>
  );

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <button className="auth-back" onClick={() => nav("userLogin")}>← Back to Login</button>
        <div className="auth-icon">🎉</div>
        <h2 className="auth-title">User Sign Up</h2>
        <p className="auth-sub">Event Management System</p>
        {fi("name", "Full Name")}
        {fi("email", "Email", "email")}
        {fi("phone", "Phone Number", "tel")}
        {fi("password", "Password", "password")}
        {fi("confirm", "Confirm Password", "password")}
        <div className="brow">
          <button className="btn btn-teal" onClick={handleSignup}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TOPNAV COMPONENT
═══════════════════════════════════════════════════════ */
function TopNav({ session, logout, nav, cart = [], links = [] }) {
  return (
    <nav className="topnav">
      <span className="nav-brand">🎪 EventMS</span>
      <div className="nav-right">
        <span className="nav-user">Welcome <strong>{session?.user?.name}</strong></span>
        {links.map(l => <button key={l.label} className="nav-btn" onClick={() => nav(l.to)}>{l.label}{l.badge ? <span className="nav-badge">{l.badge}</span> : null}</button>)}
        <button className="nav-out" onClick={logout}>Log Out</button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════
   ██ ADMIN MAINTENANCE MENU
═══════════════════════════════════════════════════════ */
function AdminMaintenance({ session, logout, nav }) {
  if (!session || session.user.role !== "admin") { nav("index"); return null; }
  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "Reports", to: "adminReports" }, { label: "Transactions", to: "adminTransactions" }]} />
      <div className="page">
        <h1 className="pg-title">Maintenance Menu</h1>
        <p className="pg-sub">Admin access only — Manage memberships, users & vendors</p>
        <div className="maint-grid">
          {[
            { icon: "➕", title: "Add Membership", desc: "Register new vendor membership", to: "addMembership" },
            { icon: "✏️", title: "Update Membership", desc: "Extend or cancel memberships", to: "updateMembership" },
            { icon: "👥", title: "Users Management", desc: "View & manage system users", to: "adminReports" },
            { icon: "🏪", title: "Vendor Management", desc: "View & manage vendors", to: "adminReports" },
          ].map(c => (
            <div key={c.to} className="maint-card" onClick={() => nav(c.to)}>
              <div className="mc-icon">{c.icon}</div>
              <div className="mc-title">{c.title}</div>
              <div className="mc-desc">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ADD MEMBERSHIP
═══════════════════════════════════════════════════════ */
function AddMembership({ session, logout, nav, vendors, memberships, setMemberships, showToast }) {
  if (!session || session.user.role !== "admin") { nav("index"); return null; }
  const [f, setF] = useState({ vendorId: "", plan: "6 months", startDate: today(), isActive: true });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!f.vendorId) e.vendorId = "Please select a vendor";
    if (!f.startDate) e.startDate = "Start date is required";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const vendor = vendors.find(v => v.id === Number(f.vendorId));
    const endDate = addMonths(f.startDate, PLAN_MONTHS[f.plan]);
    const newMem = { id: genId("MEM", memberships), vendorId: vendor.id, vendorName: vendor.name, plan: f.plan, startDate: f.startDate, endDate, status: f.isActive ? "Active" : "Inactive" };
    setMemberships(p => [...p, newMem]);
    showToast("Membership added successfully");
    setSuccess(`Membership ${newMem.id} created for ${vendor.name} — valid until ${endDate}`);
    setF({ vendorId: "", plan: "6 months", startDate: today(), isActive: true });
    setErrors({});
  };

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Maintenance", to: "adminMaintenance" }, { label: "Reports", to: "adminReports" }]} />
      <div className="page-sm">
        <h1 className="pg-title">Add Membership</h1>
        <p className="pg-sub">Register a new membership for a vendor</p>
        {success && <div className="ok-box">{success}</div>}
        <div className="panel">
          <div className="fgroup">
            <label className="flabel required">Select Vendor</label>
            <select className={`fselect ${errors.vendorId ? "err" : ""}`} value={f.vendorId} onChange={e => set("vendorId", e.target.value)}>
              <option value="">-- Select Vendor --</option>
              {vendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.category})</option>)}
            </select>
            {errors.vendorId && <div className="ferr">{errors.vendorId}</div>}
          </div>

          <div className="fgroup">
            <label className="flabel required">Membership Plan</label>
            <div className="radio-group">
              {["6 months", "1 year", "2 years"].map(plan => (
                <label key={plan} className={`radio-opt ${f.plan === plan ? "selected" : ""}`}>
                  <input type="radio" name="plan" value={plan} checked={f.plan === plan} onChange={() => set("plan", plan)} />
                  {plan}
                </label>
              ))}
            </div>
          </div>

          <div className="fgroup">
            <label className="flabel required">Start Date</label>
            <input className={`finput ${errors.startDate ? "err" : ""}`} type="date" value={f.startDate} onChange={e => set("startDate", e.target.value)} />
            {errors.startDate && <div className="ferr">{errors.startDate}</div>}
            {f.startDate && <div style={{ marginTop: ".4rem", fontSize: ".8rem", color: "var(--muted)" }}>End date will be: <strong style={{ color: "var(--teal)" }}>{addMonths(f.startDate, PLAN_MONTHS[f.plan])}</strong></div>}
          </div>

          <div className="fgroup">
            <label className="checkbox-opt">
              <input type="checkbox" checked={f.isActive} onChange={e => set("isActive", e.target.checked)} />
              Activate membership immediately
            </label>
          </div>

          <div className="brow">
            <button className="btn btn-ghost" onClick={() => nav("adminMaintenance")}>Cancel</button>
            <button className="btn btn-teal" onClick={handleAdd}>Add Membership</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   UPDATE MEMBERSHIP
═══════════════════════════════════════════════════════ */
function UpdateMembership({ session, logout, nav, memberships, setMemberships, showToast }) {
  if (!session || session.user.role !== "admin") { nav("index"); return null; }
  const [memId, setMemId] = useState("");
  const [found, setFound] = useState(null);
  const [action, setAction] = useState("extend");
  const [extPlan, setExtPlan] = useState("6 months");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const lookup = () => {
    if (!memId.trim()) { setErrors({ memId: "Membership Number is required" }); return; }
    const m = memberships.find(m => m.id === memId.trim().toUpperCase());
    if (!m) { setErrors({ memId: "Membership not found" }); setFound(null); return; }
    setErrors({});
    setFound(m);
    setSuccess("");
  };

  const handleUpdate = () => {
    if (!found) return;
    if (action === "extend") {
      const newEnd = addMonths(found.endDate, PLAN_MONTHS[extPlan]);
      setMemberships(p => p.map(m => m.id === found.id ? { ...m, endDate: newEnd, status: "Active" } : m));
      showToast("Membership extended");
      setSuccess(`Extended ${found.id} — new end date: ${newEnd}`);
    } else {
      setMemberships(p => p.map(m => m.id === found.id ? { ...m, status: "Cancelled" } : m));
      showToast("Membership cancelled");
      setSuccess(`Membership ${found.id} has been cancelled`);
    }
    setFound(null); setMemId("");
  };

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Maintenance", to: "adminMaintenance" }, { label: "Reports", to: "adminReports" }]} />
      <div className="page-sm">
        <h1 className="pg-title">Update Membership</h1>
        <p className="pg-sub">Extend or cancel an existing membership</p>
        {success && <div className="ok-box">{success}</div>}
        <div className="panel">
          <div className="fgroup">
            <label className="flabel required">Membership Number</label>
            <div style={{ display: "flex", gap: ".6rem" }}>
              <input className={`finput ${errors.memId ? "err" : ""}`} value={memId} onChange={e => setMemId(e.target.value)} placeholder="e.g. MEM001" onKeyDown={e => e.key === "Enter" && lookup()} />
              <button className="btn btn-amber btn-sm" style={{ flex: "none" }} onClick={lookup}>Lookup</button>
            </div>
            {errors.memId && <div className="ferr">{errors.memId}</div>}
          </div>

          {found && (
            <>
              <div className="divider" />
              <div className="confirm-block">
                {[["Membership ID", found.id], ["Vendor", found.vendorName], ["Current Plan", found.plan], ["Start Date", found.startDate], ["End Date", found.endDate], ["Status", found.status]].map(([l, v]) => (
                  <div key={l} className="confirm-row"><span className="confirm-label">{l}</span><span className="confirm-val">{v}</span></div>
                ))}
              </div>

              <div className="fgroup">
                <label className="flabel required">Action</label>
                <div className="radio-group">
                  <label className={`radio-opt ${action === "extend" ? "selected" : ""}`}><input type="radio" name="action" checked={action === "extend"} onChange={() => setAction("extend")} />Extend Membership</label>
                  <label className={`radio-opt ${action === "cancel" ? "selected" : ""}`}><input type="radio" name="action" checked={action === "cancel"} onChange={() => setAction("cancel")} />Cancel Membership</label>
                </div>
              </div>

              {action === "extend" && (
                <div className="fgroup">
                  <label className="flabel required">Extension Period</label>
                  <div className="radio-group">
                    {["6 months", "1 year", "2 years"].map(plan => (
                      <label key={plan} className={`radio-opt ${extPlan === plan ? "selected" : ""}`}>
                        <input type="radio" name="extPlan" value={plan} checked={extPlan === plan} onChange={() => setExtPlan(plan)} />
                        {plan}
                      </label>
                    ))}
                  </div>
                  <div style={{ marginTop: ".5rem", fontSize: ".8rem", color: "var(--muted)" }}>New end date: <strong style={{ color: "var(--teal)" }}>{addMonths(found.endDate, PLAN_MONTHS[extPlan])}</strong></div>
                </div>
              )}

              <div className="brow">
                <button className="btn btn-ghost" onClick={() => { setFound(null); setMemId(""); }}>Clear</button>
                <button className={`btn ${action === "cancel" ? "btn-danger" : "btn-teal"}`} onClick={handleUpdate}>{action === "extend" ? "Extend Membership" : "Cancel Membership"}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ADMIN REPORTS
═══════════════════════════════════════════════════════ */
function AdminReports({ session, logout, nav, vendors, users, memberships, orders, products }) {
  if (!session || session.user.role !== "admin") { nav("index"); return null; }
  const [tab, setTab] = useState("vendors");
  const tabs = [{ k: "vendors", l: "Vendors" }, { k: "users", l: "Users" }, { k: "memberships", l: "Memberships" }, { k: "products", l: "Products" }];

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Maintenance", to: "adminMaintenance" }, { label: "Transactions", to: "adminTransactions" }]} />
      <div className="page">
        <h1 className="pg-title">Reports</h1>
        <p className="pg-sub">System data overview</p>
        <div className="stat-row">
          <div className="stat"><div className="stat-n">{vendors.length}</div><div className="stat-l">Vendors</div></div>
          <div className="stat"><div className="stat-n">{users.filter(u => u.role === "user").length}</div><div className="stat-l">Users</div></div>
          <div className="stat"><div className="stat-n">{memberships.filter(m => m.status === "Active").length}</div><div className="stat-l">Active Memberships</div></div>
          <div className="stat"><div className="stat-n">{orders.length}</div><div className="stat-l">Total Orders</div></div>
          <div className="stat"><div className="stat-n">₹{orders.reduce((s, o) => s + o.total, 0).toLocaleString()}</div><div className="stat-l">Revenue</div></div>
        </div>
        <div className="tag-bar">{tabs.map(t => <button key={t.k} className={`tag ${tab === t.k ? "on" : ""}`} onClick={() => setTab(t.k)}>{t.l}</button>)}</div>

        <div className="panel">
          {tab === "vendors" && (
            <div className="tbl-wrap"><table className="dtbl"><thead><tr><th>#</th><th>Name</th><th>Email</th><th>Category</th><th>Contact</th><th>Membership</th></tr></thead>
              <tbody>{vendors.map((v, i) => <tr key={v.id}><td>{i + 1}</td><td><strong>{v.name}</strong></td><td style={{ color: "var(--muted)" }}>{v.email}</td><td><span className="badge b-teal">{v.category}</span></td><td>{v.contact}</td><td>{v.membershipId ? <span className="badge b-green">{v.membershipId}</span> : <span className="badge b-gray">None</span>}</td></tr>)}</tbody>
            </table></div>
          )}
          {tab === "users" && (
            <div className="tbl-wrap"><table className="dtbl"><thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Phone</th></tr></thead>
              <tbody>{users.filter(u => u.role !== "admin").map((u, i) => <tr key={u.id}><td>{i + 1}</td><td><strong>{u.name}</strong></td><td style={{ color: "var(--muted)" }}>{u.email}</td><td><span className={`badge ${u.role === "vendor" ? "b-teal" : "b-amber"}`}>{u.role}</span></td><td>{u.phone || "—"}</td></tr>)}</tbody>
            </table></div>
          )}
          {tab === "memberships" && (
            <div className="tbl-wrap"><table className="dtbl"><thead><tr><th>ID</th><th>Vendor</th><th>Plan</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
              <tbody>{memberships.map(m => <tr key={m.id}><td><strong>{m.id}</strong></td><td>{m.vendorName}</td><td>{m.plan}</td><td>{m.startDate}</td><td>{m.endDate}</td><td><span className={`badge ${m.status === "Active" ? "b-green" : m.status === "Cancelled" ? "b-red" : "b-gray"}`}>{m.status}</span></td></tr>)}</tbody>
            </table></div>
          )}
          {tab === "products" && (
            <div className="tbl-wrap"><table className="dtbl"><thead><tr><th>#</th><th>Product</th><th>Vendor</th><th>Category</th><th>Price</th><th>Status</th></tr></thead>
              <tbody>{products.map((p, i) => <tr key={p.id}><td>{i + 1}</td><td>{p.image} <strong>{p.name}</strong></td><td style={{ color: "var(--muted)" }}>{p.vendorName}</td><td><span className="badge b-teal">{p.category}</span></td><td style={{ color: "var(--amber)" }}>₹{p.price.toLocaleString()}</td><td><span className="badge b-green">{p.status}</span></td></tr>)}</tbody>
            </table></div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ADMIN TRANSACTIONS
═══════════════════════════════════════════════════════ */
function AdminTransactions({ session, logout, nav, orders, setOrders }) {
  if (!session || session.user.role !== "admin") { nav("index"); return null; }
  const total = orders.reduce((s, o) => s + o.total, 0);
  const statusColor = { Pending: "b-amber", Confirmed: "b-teal", Delivered: "b-green", Cancelled: "b-red" };

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Maintenance", to: "adminMaintenance" }, { label: "Reports", to: "adminReports" }]} />
      <div className="page">
        <h1 className="pg-title">Transactions</h1>
        <p className="pg-sub">All order transactions in the system</p>
        <div className="stat-row">
          <div className="stat"><div className="stat-n">{orders.length}</div><div className="stat-l">Total Orders</div></div>
          <div className="stat"><div className="stat-n">{orders.filter(o => o.status === "Pending").length}</div><div className="stat-l">Pending</div></div>
          <div className="stat"><div className="stat-n">₹{total.toLocaleString()}</div><div className="stat-l">Total Revenue</div></div>
        </div>
        {orders.length === 0 ? <div className="empty"><div className="empty-icon">📋</div><p>No transactions yet</p></div> : (
          <div className="panel">
            <div className="tbl-wrap">
              <table className="dtbl">
                <thead><tr><th>TXN ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td><strong style={{ color: "var(--teal)" }}>{o.id}</strong></td>
                      <td>{o.userName}<br /><span style={{ color: "var(--muted)", fontSize: ".75rem" }}>{o.userEmail}</span></td>
                      <td>{o.items?.map(i => `${i.name}×${i.qty}`).join(", ")}</td>
                      <td style={{ color: "var(--amber)", fontWeight: 700 }}>₹{o.total.toLocaleString()}</td>
                      <td>{o.paymentMethod}</td>
                      <td style={{ color: "var(--muted)", fontSize: ".8rem" }}>{o.date}</td>
                      <td><span className={`badge ${statusColor[o.status] || "b-gray"}`}>{o.status}</span></td>
                      <td>
                        <select className="fselect" style={{ padding: ".25rem .5rem", fontSize: ".75rem", width: "auto" }} value={o.status}
                          onChange={e => setOrders(p => p.map(ord => ord.id === o.id ? { ...ord, status: e.target.value } : ord))}>
                          <option>Pending</option><option>Confirmed</option><option>Delivered</option><option>Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ██ VENDOR HOME (Main Page)
═══════════════════════════════════════════════════════ */
function VendorHome({ session, logout, nav }) {
  if (!session || session.user.role !== "vendor") { nav("index"); return null; }
  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "Your Items", to: "vendorProductStatus" }, { label: "Add New Item", to: "vendorAddItem" }, { label: "Transactions", to: "vendorUserRequests" }, { label: "View Product", to: "vendorViewProduct" }]} />
      <div className="page">
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "2.5rem", textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: ".5rem" }}>🏪</div>
          <h2 style={{ fontFamily: "Crimson Pro, serif", fontSize: "2rem", color: "var(--amber)", marginBottom: ".25rem" }}>Welcome {session.user.name}</h2>
          <p style={{ color: "var(--muted)" }}>Vendor Dashboard</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1rem" }}>
          {[
            { icon: "📦", label: "Your Items", sub: "View your listed products", to: "vendorProductStatus" },
            { icon: "➕", label: "Add New Item", sub: "List a new product", to: "vendorAddItem" },
            { icon: "📋", label: "Transactions", sub: "View order requests", to: "vendorUserRequests" },
            { icon: "👁️", label: "View Products", sub: "Browse all products", to: "vendorViewProduct" },
          ].map(c => (
            <div key={c.to} className="maint-card" onClick={() => nav(c.to)}>
              <div className="mc-icon">{c.icon}</div>
              <div className="mc-title">{c.label}</div>
              <div className="mc-desc">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VENDOR ADD ITEM
═══════════════════════════════════════════════════════ */
function VendorAddItem({ session, logout, nav, products, setProducts, vendors, showToast }) {
  if (!session || session.user.role !== "vendor") { nav("index"); return null; }
  const myVendor = vendors.find(v => v.username === session.user.username);
  const [f, setF] = useState({ name: "", price: "", category: myVendor?.category || "Catering", image: "📦", status: "Available" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const EMOJIS = ["📦", "🍽️", "🥘", "💐", "🌸", "✨", "🎊", "💡", "🌟", "🎭", "🎨", "🎵", "🍰", "🧁"];

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Product name is required";
    if (!f.price) e.price = "Price is required";
    else if (isNaN(f.price) || Number(f.price) <= 0) e.price = "Enter a valid positive price";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const newP = { id: products.length + 1, vendorId: myVendor?.id || 1, vendorName: session.user.name, category: f.category, name: f.name.trim(), price: Number(f.price), image: f.image, status: f.status };
    setProducts(p => [...p, newP]);
    showToast("Product added successfully!");
    nav("vendorProductStatus");
  };

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Home", to: "vendorHome" }, { label: "Product Status", to: "vendorProductStatus" }, { label: "Transactions", to: "vendorUserRequests" }, { label: "View Product", to: "vendorViewProduct" }]} />
      <div className="page-sm">
        <h1 className="pg-title">Add New Item</h1>
        <p className="pg-sub">List a new product or service</p>
        <div className="panel">
          <div className="fgroup">
            <label className="flabel required">Product Name</label>
            <input className={`finput ${errors.name ? "err" : ""}`} value={f.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Wedding Catering Package" />
            {errors.name && <div className="ferr">{errors.name}</div>}
          </div>
          <div className="fgroup">
            <label className="flabel required">Price (₹)</label>
            <input className={`finput ${errors.price ? "err" : ""}`} type="number" min="1" value={f.price} onChange={e => set("price", e.target.value)} placeholder="e.g. 5000" />
            {errors.price && <div className="ferr">{errors.price}</div>}
          </div>
          <div className="fgroup">
            <label className="flabel required">Category</label>
            <select className="fselect" value={f.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="fgroup">
            <label className="flabel">Product Icon</label>
            <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
              {EMOJIS.map(em => (
                <button key={em} onClick={() => set("image", em)} style={{ background: f.image === em ? "rgba(0,180,216,.2)" : "var(--navy3)", border: `1px solid ${f.image === em ? "var(--teal)" : "var(--border)"}`, borderRadius: "8px", padding: ".35rem .5rem", cursor: "pointer", fontSize: "1.3rem" }}>{em}</button>
              ))}
            </div>
          </div>
          <div className="fgroup">
            <label className="flabel required">Status</label>
            <div className="radio-group">
              <label className={`radio-opt ${f.status === "Available" ? "selected" : ""}`}><input type="radio" name="vstatus" checked={f.status === "Available"} onChange={() => set("status", "Available")} />Available</label>
              <label className={`radio-opt ${f.status === "Unavailable" ? "selected" : ""}`}><input type="radio" name="vstatus" checked={f.status === "Unavailable"} onChange={() => set("status", "Unavailable")} />Unavailable</label>
            </div>
          </div>
          <div className="brow">
            <button className="btn btn-ghost" onClick={() => nav("vendorHome")}>Cancel</button>
            <button className="btn btn-teal" onClick={handleAdd}>Add The Product</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VENDOR PRODUCT STATUS
═══════════════════════════════════════════════════════ */
function VendorProductStatus({ session, logout, nav, products, setProducts, orders, showToast }) {
  if (!session || session.user.role !== "vendor") { nav("index"); return null; }
  const mine = products.filter(p => p.vendorName === session.user.name);

  const deleteP = (id) => { setProducts(p => p.filter(x => x.id !== id)); showToast("Product deleted"); };
  const toggleStatus = (id) => setProducts(p => p.map(x => x.id === id ? { ...x, status: x.status === "Available" ? "Unavailable" : "Available" } : x));

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Home", to: "vendorHome" }, { label: "Add New Item", to: "vendorAddItem" }, { label: "Transactions", to: "vendorUserRequests" }, { label: "View Product", to: "vendorViewProduct" }]} />
      <div className="page">
        <h1 className="pg-title">Product Status</h1>
        <p className="pg-sub">{mine.length} products listed</p>
        {mine.length === 0 ? <div className="empty"><div className="empty-icon">📦</div><p>No products yet. <span style={{ color: "var(--teal)", cursor: "pointer" }} onClick={() => nav("vendorAddItem")}>Add your first product →</span></p></div> : (
          <div className="panel">
            <div className="tbl-wrap">
              <table className="dtbl">
                <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Status</th><th>Orders</th><th>Action</th></tr></thead>
                <tbody>
                  {mine.map(p => {
                    const orderCount = orders.reduce((s, o) => s + (o.items?.filter(i => i.productId === p.id).reduce((a, i) => a + i.qty, 0) || 0), 0);
                    return (
                      <tr key={p.id}>
                        <td>{p.image} <strong>{p.name}</strong></td>
                        <td><span className="badge b-teal">{p.category}</span></td>
                        <td style={{ color: "var(--amber)" }}>₹{p.price.toLocaleString()}</td>
                        <td><span className={`badge ${p.status === "Available" ? "b-green" : "b-gray"}`}>{p.status}</span></td>
                        <td>{orderCount}</td>
                        <td style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                          <button className="btn btn-sm btn-amber" onClick={() => toggleStatus(p.id)}>{p.status === "Available" ? "Deactivate" : "Activate"}</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteP(p.id)}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VENDOR USER REQUESTS (Transactions)
═══════════════════════════════════════════════════════ */
function VendorUserRequests({ session, logout, nav, orders, products }) {
  if (!session || session.user.role !== "vendor") { nav("index"); return null; }
  const mine = products.filter(p => p.vendorName === session.user.name).map(p => p.id);
  const myOrders = orders.filter(o => o.items?.some(i => mine.includes(i.productId)));

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Home", to: "vendorHome" }, { label: "Product Status", to: "vendorProductStatus" }, { label: "Add New Item", to: "vendorAddItem" }]} />
      <div className="page">
        <h1 className="pg-title">Transactions</h1>
        <p className="pg-sub">User order requests for your products</p>
        {myOrders.length === 0 ? <div className="empty"><div className="empty-icon">📋</div><p>No orders yet</p></div> : (
          <div className="panel">
            <div className="tbl-wrap">
              <table className="dtbl">
                <thead><tr><th>TXN ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {myOrders.map(o => (
                    <tr key={o.id}>
                      <td><strong style={{ color: "var(--teal)" }}>{o.id}</strong></td>
                      <td>{o.name}<br /><span style={{ color: "var(--muted)", fontSize: ".75rem" }}>{o.phone}</span></td>
                      <td>{o.items?.filter(i => mine.includes(i.productId)).map(i => `${i.name}×${i.qty}`).join(", ")}</td>
                      <td style={{ color: "var(--amber)" }}>₹{o.total.toLocaleString()}</td>
                      <td>{o.paymentMethod}</td>
                      <td style={{ color: "var(--muted)", fontSize: ".8rem" }}>{o.date}</td>
                      <td><span className={`badge ${o.status === "Pending" ? "b-amber" : o.status === "Delivered" ? "b-green" : o.status === "Cancelled" ? "b-red" : "b-teal"}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VENDOR VIEW PRODUCT (browse all)
═══════════════════════════════════════════════════════ */
function VendorViewProduct({ session, logout, nav, products }) {
  if (!session || session.user.role !== "vendor") { nav("index"); return null; }
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? products : products.filter(p => p.category === cat);

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Home", to: "vendorHome" }, { label: "Product Status", to: "vendorProductStatus" }, { label: "Add New Item", to: "vendorAddItem" }]} />
      <div className="page">
        <h1 className="pg-title">All Products</h1>
        <div className="tag-bar">
          {["All", ...CATEGORIES].map(c => <button key={c} className={`tag ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <div className="panel">
          <div className="tbl-wrap">
            <table className="dtbl">
              <thead><tr><th>#</th><th>Product</th><th>Vendor</th><th>Category</th><th>Price</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map((p, i) => <tr key={p.id}><td>{i + 1}</td><td>{p.image} <strong>{p.name}</strong></td><td style={{ color: "var(--muted)" }}>{p.vendorName}</td><td><span className="badge b-teal">{p.category}</span></td><td style={{ color: "var(--amber)" }}>₹{p.price.toLocaleString()}</td><td><span className={`badge ${p.status === "Available" ? "b-green" : "b-gray"}`}>{p.status}</span></td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ██ USER HOME
═══════════════════════════════════════════════════════ */
function UserHome({ session, logout, nav, cart }) {
  if (!session || session.user.role !== "user") { nav("index"); return null; }
  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[
        { label: "Vendor", to: "userVendors" },
        { label: "Cart", to: "userCart", badge: cart.length || null },
        { label: "Guest List", to: "userGuestList" },
        { label: "Order Status", to: "userOrderStatus" },
        { label: "Reports", to: "userReports" },
        { label: "Transactions", to: "userTransactions" },
      ]} />
      <div className="page">
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "2.5rem", textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: ".5rem" }}>🎉</div>
          <h2 style={{ fontFamily: "Crimson Pro, serif", fontSize: "2rem", color: "var(--teal)", marginBottom: ".25rem" }}>Welcome {session.user.name}</h2>
          <p style={{ color: "var(--muted)" }}>Plan your perfect event</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "1rem" }}>
          {[
            { icon: "🏪", label: "Vendors", sub: "Browse vendors", to: "userVendors" },
            { icon: "🛒", label: "Cart", sub: `${cart.length} item${cart.length !== 1 ? "s" : ""}`, to: "userCart" },
            { icon: "👥", label: "Guest List", sub: "Manage guests", to: "userGuestList" },
            { icon: "📦", label: "Order Status", sub: "Track orders", to: "userOrderStatus" },
            { icon: "📊", label: "Reports", sub: "View reports", to: "userReports" },
            { icon: "💳", label: "Transactions", sub: "Payment history", to: "userTransactions" },
          ].map(c => (
            <div key={c.to} className="maint-card" onClick={() => nav(c.to)}>
              <div className="mc-icon">{c.icon}</div>
              <div className="mc-title">{c.label}</div>
              <div className="mc-desc">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   USER VENDORS (browse vendors)
═══════════════════════════════════════════════════════ */
function UserVendors({ session, logout, nav, vendors, cart }) {
  if (!session || session.user.role !== "user") { nav("index"); return null; }
  const [cat, setCat] = useState("All");
  const ICONS = { Catering: "🍽️", Florist: "🌸", Decoration: "✨", Lighting: "💡" };
  const filtered = cat === "All" ? vendors : vendors.filter(v => v.category === cat);

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[
        { label: "← Home", to: "userHome" },
        { label: "Cart", to: "userCart", badge: cart.length || null },
        { label: "Guest List", to: "userGuestList" },
        { label: "Order Status", to: "userOrderStatus" },
      ]} />
      <div className="page">
        <h1 className="pg-title">Vendors</h1>
        <p className="pg-sub">Browse vendors by category</p>
        <div className="tag-bar">
          {["All", ...CATEGORIES].map(c => <button key={c} className={`tag ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <div className="card-grid">
          {filtered.map(v => (
            <div key={v.id} className="vcard" onClick={() => nav("userProducts", { vendorId: v.id, vendorName: v.name })}>
              <div className="vcard-icon">{ICONS[v.category] || "🏢"}</div>
              <div className="vcard-name">{v.name}</div>
              <div className="vcard-cat"><span className="badge b-teal">{v.category}</span></div>
              <div style={{ textAlign: "center", color: "var(--muted)", fontSize: ".8rem", marginBottom: ".75rem" }}>{v.contact}</div>
              <button className="btn btn-teal btn-sm" style={{ width: "100%" }} onClick={e => { e.stopPropagation(); nav("userProducts", { vendorId: v.id, vendorName: v.name }); }}>Shop Items</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   USER PRODUCTS
═══════════════════════════════════════════════════════ */
function UserProducts({ session, logout, nav, products, addToCart, cart, ctx2 }) {
  if (!session || session.user.role !== "user") { nav("index"); return null; }
  const [search, setSearch] = useState("");
  const filtered = products.filter(p => {
    const matchCat = ctx2.vendorId ? p.vendorId === ctx2.vendorId : true;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && p.status === "Available";
  });

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[
        { label: "← Home", to: "userHome" },
        { label: "Vendors", to: "userVendors" },
        { label: "Cart", to: "userCart", badge: cart.length || null },
      ]} />
      <div className="page">
        <h1 className="pg-title">{ctx2.vendorName ? `${ctx2.vendorName} — Products` : "All Products"}</h1>
        <div className="fbar">
          <input className="search-in" placeholder="🔍 Search products…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {filtered.length === 0 ? <div className="empty"><div className="empty-icon">📦</div><p>No products found</p></div> : (
          <div className="card-grid">
            {filtered.map(p => (
              <div key={p.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: ".4rem" }}>
                <div style={{ fontSize: "2.5rem", textAlign: "center" }}>{p.image}</div>
                <div style={{ fontFamily: "Crimson Pro, serif", fontSize: "1.05rem", fontWeight: 600 }}>{p.name}</div>
                <div style={{ color: "var(--amber)", fontWeight: 700 }}>₹{p.price.toLocaleString()}</div>
                <div style={{ color: "var(--muted)", fontSize: ".78rem" }}>{p.vendorName}</div>
                <button className="btn btn-teal btn-sm" style={{ marginTop: ".5rem" }} onClick={() => addToCart(p)}>Add to Cart</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   USER CART
═══════════════════════════════════════════════════════ */
function UserCart({ session, logout, nav, cart, removeFromCart, updateQty, cartTotal }) {
  if (!session || session.user.role !== "user") { nav("index"); return null; }
  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[
        { label: "← Home", to: "userHome" },
        { label: "Vendors", to: "userVendors" },
        { label: "Request Item", to: "userVendors" },
        { label: "Product Status", to: "userProducts" },
      ]} />
      <div className="page">
        <h1 className="pg-title">Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="empty"><div className="empty-icon">🛒</div><p>Your cart is empty</p><button className="btn btn-teal btn-sm" style={{ marginTop: "1rem" }} onClick={() => nav("userVendors")}>Browse Vendors</button></div>
        ) : (
          <div className="panel">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="ci-img">{item.image}</div>
                <div className="ci-info">
                  <div className="ci-name">{item.name}</div>
                  <div className="ci-price">₹{item.price.toLocaleString()} each · {item.vendorName}</div>
                </div>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                  <span style={{ minWidth: "28px", textAlign: "center", fontWeight: 700 }}>{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
                <div style={{ minWidth: "80px", textAlign: "right", color: "var(--amber)", fontWeight: 700 }}>₹{(item.price * item.qty).toLocaleString()}</div>
                <button className="btn btn-danger btn-xs" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))}
            <div className="cart-total">
              <span className="ct-label">Grand Total</span>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span className="ct-amount">₹{cartTotal.toLocaleString()}</span>
                <button className="btn btn-danger btn-sm" onClick={() => { cart.forEach(i => removeFromCart(i.id)); }}>Delete All</button>
              </div>
            </div>
            <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
              <button className="btn btn-teal" style={{ padding: ".9rem 3rem", fontSize: "1rem" }} onClick={() => nav("userPayment")}>Proceed to CheckOut →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   USER PAYMENT (Checkout)
═══════════════════════════════════════════════════════ */
function UserPayment({ session, logout, nav, cart, cartTotal, placeOrder, showToast }) {
  if (!session || session.user.role !== "user") { nav("index"); return null; }
  const [f, setF] = useState({ name: session.user.name, email: session.user.email, phone: session.user.phone || "", address: "", city: "", state: "", pinCode: "", paymentMethod: "UPI" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  if (cart.length === 0) return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Cart", to: "userCart" }]} />
      <div className="page"><div className="empty"><div className="empty-icon">🛒</div><p>Your cart is empty</p><button className="btn btn-teal btn-sm" style={{ marginTop: "1rem" }} onClick={() => nav("userVendors")}>Shop Now</button></div></div>
    </div>
  );

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Name is required";
    if (!f.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = "Invalid email";
    if (!f.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(f.phone)) e.phone = "Enter valid 10-digit phone";
    if (!f.address.trim()) e.address = "Address is required";
    if (!f.city.trim()) e.city = "City is required";
    if (!f.state.trim()) e.state = "State is required";
    if (!f.pinCode.trim()) e.pinCode = "Pin code is required";
    else if (!/^\d{6}$/.test(f.pinCode)) e.pinCode = "Enter valid 6-digit pin code";
    return e;
  };

  const handleOrder = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const order = placeOrder(f);
    showToast("Order placed successfully!");
    nav("userOrderStatus");
  };

  const fi = (k, label, type = "text", full = false) => (
    <div className="fgroup" style={full ? { gridColumn: "1 / -1" } : {}}>
      <label className="flabel required">{label}</label>
      <input className={`finput ${errors[k] ? "err" : ""}`} type={type} value={f[k]} onChange={e => set(k, e.target.value)} placeholder={label} />
      {errors[k] && <div className="ferr">{errors[k]}</div>}
    </div>
  );

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Cart", to: "userCart" }]} />
      <div className="page">
        <h1 className="pg-title">Payment & Delivery Details</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.25rem" }}>
          <div className="panel">
            <div className="panel-title">📋 Delivery Information</div>
            <div className="form-grid">
              {fi("name", "Full Name")}
              {fi("phone", "Phone Number", "tel")}
              {fi("email", "Email", "email")}
              <div className="fgroup">
                <label className="flabel required">Payment Method</label>
                <div className="radio-group">
                  <label className={`radio-opt ${f.paymentMethod === "UPI" ? "selected" : ""}`}><input type="radio" name="pmethod" checked={f.paymentMethod === "UPI"} onChange={() => set("paymentMethod", "UPI")} />UPI</label>
                  <label className={`radio-opt ${f.paymentMethod === "Cash" ? "selected" : ""}`}><input type="radio" name="pmethod" checked={f.paymentMethod === "Cash"} onChange={() => set("paymentMethod", "Cash")} />Cash</label>
                  <label className={`radio-opt ${f.paymentMethod === "Card" ? "selected" : ""}`}><input type="radio" name="pmethod" checked={f.paymentMethod === "Card"} onChange={() => set("paymentMethod", "Card")} />Card</label>
                </div>
              </div>
              {fi("address", "Address", "text", true)}
              {fi("city", "City")}
              {fi("state", "State")}
              {fi("pinCode", "Pin Code")}
            </div>
            <div className="brow">
              <button className="btn btn-ghost" onClick={() => nav("userCart")}>← Cancel</button>
              <button className="btn btn-teal" onClick={handleOrder}>Place Order Now</button>
            </div>
          </div>
          <div className="panel" style={{ alignSelf: "start" }}>
            <div className="panel-title">🛒 Order Summary</div>
            {cart.map(i => (
              <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid rgba(255,255,255,.04)", fontSize: ".85rem" }}>
                <span>{i.image} {i.name} ×{i.qty}</span>
                <span style={{ color: "var(--amber)" }}>₹{(i.price * i.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".75rem", paddingTop: ".75rem", borderTop: "1px solid rgba(255,195,0,.2)" }}>
              <strong>Total Amount</strong>
              <strong style={{ color: "var(--amber)", fontSize: "1.2rem" }}>₹{cartTotal.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   USER ORDER STATUS
═══════════════════════════════════════════════════════ */
function UserOrderStatus({ session, logout, nav, orders, setOrders, showToast }) {
  if (!session || session.user.role !== "user") { nav("index"); return null; }
  const mine = orders.filter(o => o.userId === session.user.id);
  const statusColor = { Pending: "b-amber", Confirmed: "b-teal", Delivered: "b-green", Cancelled: "b-red" };

  const cancelOrder = (id) => {
    const o = orders.find(x => x.id === id);
    if (o.status !== "Pending") { showToast("Only pending orders can be cancelled", "err"); return; }
    setOrders(p => p.map(x => x.id === id ? { ...x, status: "Cancelled" } : x));
    showToast("Order cancelled");
  };

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Home", to: "userHome" }, { label: "Vendors", to: "userVendors" }]} />
      <div className="page">
        <h1 className="pg-title">Order Status</h1>
        <p className="pg-sub">Track your orders</p>
        {mine.length === 0 ? (
          <div className="empty"><div className="empty-icon">📦</div><p>No orders yet</p><button className="btn btn-teal btn-sm" style={{ marginTop: "1rem" }} onClick={() => nav("userVendors")}>Start Shopping</button></div>
        ) : mine.map(o => (
          <div key={o.id} className="panel">
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: ".5rem", marginBottom: ".75rem" }}>
              <strong style={{ color: "var(--teal)", fontSize: "1.05rem" }}>{o.id}</strong>
              <span className={`badge ${statusColor[o.status] || "b-gray"}`}>{o.status}</span>
            </div>
            <div className="confirm-block">
              {[["Date", o.date], ["Name", o.name], ["Phone", o.phone], ["Address", `${o.address}, ${o.city}, ${o.state} - ${o.pinCode}`], ["Payment", o.paymentMethod]].map(([l, v]) => (
                <div key={l} className="confirm-row"><span className="confirm-label">{l}</span><span className="confirm-val">{v}</span></div>
              ))}
            </div>
            <div style={{ marginBottom: ".75rem" }}>{o.items?.map((i, idx) => <span key={idx} style={{ background: "var(--navy3)", borderRadius: "6px", padding: ".2rem .55rem", marginRight: ".4rem", fontSize: ".8rem" }}>{i.image} {i.name} ×{i.qty}</span>)}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".5rem" }}>
              <strong style={{ color: "var(--amber)", fontFamily: "Crimson Pro, serif", fontSize: "1.3rem" }}>₹{o.total.toLocaleString()}</strong>
              {o.status === "Pending" && <button className="btn btn-danger btn-sm" onClick={() => cancelOrder(o.id)}>Cancel Order</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   USER GUEST LIST
═══════════════════════════════════════════════════════ */
function UserGuestList({ session, logout, nav, guests, setGuests, showToast }) {
  if (!session || session.user.role !== "user") { nav("index"); return null; }
  const mine = guests.filter(g => g.userId === session.user.id);
  const [showAdd, setShowAdd] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", event: "Wedding", rsvp: false, note: "" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Guest name is required";
    if (!f.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = "Invalid email";
    if (!f.phone.trim()) e.phone = "Phone is required";
    return e;
  };

  const addGuest = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setGuests(p => [...p, { ...f, id: Date.now(), userId: session.user.id }]);
    setF({ name: "", email: "", phone: "", event: "Wedding", rsvp: false, note: "" });
    setErrors({});
    setShowAdd(false);
    showToast("Guest added");
  };

  const deleteGuest = (id) => { setGuests(p => p.filter(g => g.id !== id)); showToast("Guest removed"); };
  const toggleRsvp = (id) => setGuests(p => p.map(g => g.id === id ? { ...g, rsvp: !g.rsvp } : g));

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Home", to: "userHome" }, { label: "Update", to: "userGuestList" }]} />
      <div className="page">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: ".5rem" }}>
          <div><h1 className="pg-title">Guest List</h1><p className="pg-sub">{mine.length} guests · {mine.filter(g => g.rsvp).length} confirmed</p></div>
          <button className="btn btn-teal btn-sm" onClick={() => setShowAdd(!showAdd)}>+ Add Guest</button>
        </div>

        {showAdd && (
          <div className="panel" style={{ borderColor: "rgba(0,180,216,.4)" }}>
            <div className="panel-title">➕ New Guest</div>
            <div className="form-grid">
              <div className="fgroup"><label className="flabel required">Name</label><input className={`finput ${errors.name ? "err" : ""}`} value={f.name} onChange={e => set("name", e.target.value)} />{errors.name && <div className="ferr">{errors.name}</div>}</div>
              <div className="fgroup"><label className="flabel required">Email</label><input className={`finput ${errors.email ? "err" : ""}`} type="email" value={f.email} onChange={e => set("email", e.target.value)} />{errors.email && <div className="ferr">{errors.email}</div>}</div>
              <div className="fgroup"><label className="flabel required">Phone</label><input className={`finput ${errors.phone ? "err" : ""}`} value={f.phone} onChange={e => set("phone", e.target.value)} />{errors.phone && <div className="ferr">{errors.phone}</div>}</div>
              <div className="fgroup"><label className="flabel">Event</label><select className="fselect" value={f.event} onChange={e => set("event", e.target.value)}><option>Wedding</option><option>Corporate</option><option>Birthday</option><option>Other</option></select></div>
              <div className="fgroup" style={{ gridColumn: "1 / -1" }}><label className="flabel">Note</label><input className="finput" value={f.note} onChange={e => set("note", e.target.value)} placeholder="Dietary requirements, special notes…" /></div>
            </div>
            <div className="fgroup">
              <label className="checkbox-opt">
                <input type="checkbox" checked={f.rsvp} onChange={e => set("rsvp", e.target.checked)} />
                RSVP Confirmed
              </label>
            </div>
            <div className="brow">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-teal" onClick={addGuest}>Add Guest</button>
            </div>
          </div>
        )}

        {mine.length === 0 ? (
          <div className="empty"><div className="empty-icon">👥</div><p>No guests added yet</p></div>
        ) : (
          <div className="panel">
            <div className="tbl-wrap">
              <table className="dtbl">
                <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Event</th><th>Note</th><th>RSVP</th><th>Action</th></tr></thead>
                <tbody>
                  {mine.map((g, i) => (
                    <tr key={g.id}>
                      <td>{i + 1}</td>
                      <td><strong>{g.name}</strong></td>
                      <td style={{ color: "var(--muted)" }}>{g.email}</td>
                      <td style={{ color: "var(--muted)" }}>{g.phone}</td>
                      <td><span className="badge b-teal">{g.event}</span></td>
                      <td style={{ color: "var(--muted)", fontSize: ".8rem" }}>{g.note || "—"}</td>
                      <td>
                        <label className="checkbox-opt">
                          <input type="checkbox" checked={g.rsvp} onChange={() => toggleRsvp(g.id)} />
                          {g.rsvp ? <span style={{ color: "var(--success)", fontSize: ".8rem" }}>Yes</span> : <span style={{ color: "var(--muted)", fontSize: ".8rem" }}>No</span>}
                        </label>
                      </td>
                      <td>
                        <button className="btn btn-danger btn-xs" onClick={() => deleteGuest(g.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   USER REPORTS
═══════════════════════════════════════════════════════ */
function UserReports({ session, logout, nav, orders, guests, products }) {
  if (!session || session.user.role !== "user") { nav("index"); return null; }
  const myOrders = orders.filter(o => o.userId === session.user.id);
  const myGuests = guests.filter(g => g.userId === session.user.id);
  const totalSpent = myOrders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Home", to: "userHome" }, { label: "Transactions", to: "userTransactions" }]} />
      <div className="page">
        <h1 className="pg-title">My Reports</h1>
        <div className="stat-row">
          <div className="stat"><div className="stat-n">{myOrders.length}</div><div className="stat-l">Total Orders</div></div>
          <div className="stat"><div className="stat-n">{myOrders.filter(o => o.status === "Pending").length}</div><div className="stat-l">Pending</div></div>
          <div className="stat"><div className="stat-n">₹{totalSpent.toLocaleString()}</div><div className="stat-l">Total Spent</div></div>
          <div className="stat"><div className="stat-n">{myGuests.length}</div><div className="stat-l">Guests</div></div>
          <div className="stat"><div className="stat-n">{myGuests.filter(g => g.rsvp).length}</div><div className="stat-l">RSVP Confirmed</div></div>
        </div>
        <div className="panel">
          <div className="panel-title">📋 Order Summary</div>
          {myOrders.length === 0 ? <div className="empty"><div className="empty-icon">📦</div><p>No orders yet</p></div> : (
            <div className="tbl-wrap">
              <table className="dtbl">
                <thead><tr><th>Order ID</th><th>Items</th><th>Total</th><th>Payment</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {myOrders.map(o => (
                    <tr key={o.id}>
                      <td><strong style={{ color: "var(--teal)" }}>{o.id}</strong></td>
                      <td>{o.items?.map(i => `${i.name}×${i.qty}`).join(", ")}</td>
                      <td style={{ color: "var(--amber)" }}>₹{o.total.toLocaleString()}</td>
                      <td>{o.paymentMethod}</td>
                      <td style={{ color: "var(--muted)", fontSize: ".8rem" }}>{o.date}</td>
                      <td><span className={`badge ${o.status === "Pending" ? "b-amber" : o.status === "Delivered" ? "b-green" : o.status === "Cancelled" ? "b-red" : "b-teal"}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="panel">
          <div className="panel-title">👥 Guest Summary</div>
          {myGuests.length === 0 ? <div className="empty"><p>No guests added</p></div> : (
            <div className="tbl-wrap">
              <table className="dtbl">
                <thead><tr><th>#</th><th>Name</th><th>Event</th><th>RSVP</th></tr></thead>
                <tbody>{myGuests.map((g, i) => <tr key={g.id}><td>{i + 1}</td><td>{g.name}</td><td><span className="badge b-teal">{g.event}</span></td><td><span className={`badge ${g.rsvp ? "b-green" : "b-gray"}`}>{g.rsvp ? "Confirmed" : "Pending"}</span></td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   USER TRANSACTIONS
═══════════════════════════════════════════════════════ */
function UserTransactions({ session, logout, nav, orders }) {
  if (!session || session.user.role !== "user") { nav("index"); return null; }
  const mine = orders.filter(o => o.userId === session.user.id);
  const statusColor = { Pending: "b-amber", Confirmed: "b-teal", Delivered: "b-green", Cancelled: "b-red" };

  return (
    <div>
      <TopNav session={session} logout={logout} nav={nav} links={[{ label: "← Home", to: "userHome" }, { label: "Reports", to: "userReports" }, { label: "Check Status", to: "userOrderStatus" }]} />
      <div className="page">
        <h1 className="pg-title">Transactions</h1>
        <p className="pg-sub">Your payment history</p>
        {mine.length === 0 ? <div className="empty"><div className="empty-icon">💳</div><p>No transactions yet</p></div> : (
          <div className="panel">
            <div className="tbl-wrap">
              <table className="dtbl">
                <thead><tr><th>TXN ID</th><th>Items</th><th>Amount</th><th>Payment</th><th>Address</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {mine.map(o => (
                    <tr key={o.id}>
                      <td><strong style={{ color: "var(--teal)" }}>{o.id}</strong></td>
                      <td style={{ maxWidth: "160px" }}>{o.items?.map(i => `${i.image} ${i.name}×${i.qty}`).join(", ")}</td>
                      <td style={{ color: "var(--amber)", fontWeight: 700 }}>₹{o.total.toLocaleString()}</td>
                      <td>{o.paymentMethod}</td>
                      <td style={{ color: "var(--muted)", fontSize: ".78rem" }}>{o.city}, {o.state}</td>
                      <td style={{ color: "var(--muted)", fontSize: ".78rem" }}>{o.date}</td>
                      <td><span className={`badge ${statusColor[o.status] || "b-gray"}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
