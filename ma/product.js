// PRODUCTS DATA
const productsData = [
{
  id: "P1765665447828",
  name: "Facebook account",
  description: "Afghanistan",
  price: "5000",
  currency: "NGN",
  image: "https://i.ibb.co/Gfck1BWm/Screenshot-20251213-232350.jpg",
  sellerId: 7639132061,
  sellerContact: "+2348129086235",
  url: "https://www.facebook.com/profile.php?id=61582133835196"
},
{
  id: "P1765698764796",
  name: "Facebook with switch profile",
  description: "Facebook with switch profile",
  price: "5000",
  currency: "NGN",
  image: "https://www.facebook.com/share/1By4oU18YF/?mibextid=wwXIfr",
  sellerId: 8398812994,
  sellerContact: "08123246776",
  url: "https://www.facebook.com/share/1By4oU18YF/?mibextid=wwXIfr"
},
{
  id: "P1765670040110",
  name: "2021 South Africa switch profile (can create page )",
  description: "Don’t change details in haste so that you log will last long and useful to you.",
  price: "2500",
  currency: "NGN",
  image: "https://i.ibb.co/1fXyhxZK/IMG-2950.png",
  sellerId: 7227113353,
  sellerContact: "+2347075433008",
  url: "https://www.facebook.com/share/1C7qu1MnFD/?mibextid=wwXIfr"
},
{
  id: "P1765562740044",
  name: "Plenty TikTok account",
  description: "Plenty TikTok account",
  price: "10000",
  currency: "NGN",
  image: "https://i.ibb.co/PZYVGVq0/Screenshot-20251211-125529.png",
  sellerId: 6976365864,
  sellerContact: "+2348121697423",
  url: "https://i.ibb.co/PZYVGVq0/Screenshot-20251211-125529.png"
},
{
  id: "P1765526244522",
  name: "AUSTRALIAN TIKTOK 229 FOLLOWERS",
  description: "Freshly spammed Australia TikTok with outlook mail. Followers on Amassing",
  price: "6000",
  currency: "NGN",
  image: "https://ibb.co/MkFN0Cdp",
  sellerId: 8097634090,
  sellerContact: "Whatsapp: +2349067581749",
  url: "https://tiktok.com/@laze1977"
},
{
  id: "P1765526509190",
  name: "AUSTRALIAN FEMALE TIKTOK 140 FOLLOWERS....& AMASSING",
  description: "FRESHLY SPAMMED AUSTRALIAN FEMALE TIKTOK WITH EMAIL",
  price: "6000",
  currency: "NGN",
  image: "https://ibb.co/Lz3RC8gR",
  sellerId: 8097634090,
  sellerContact: "Whatsapp: +2349067581749",
  url: "https://tiktok.com/@waselighis"
},
{
  id: "P1765260605236",
  name: "Tiktok account with 1k followers",
  description: "5 years Tiktok with 1k+ followers",
  price: "7000",
  currency: "NGN",
  image: "https://i.ibb.co/nNR9Vn62/Screenshot-20251209-070431.jpg",
  sellerId: 6789580197,
  sellerContact: "Whatsapp: 08139337058",
  url: "https://www.tiktok.com/@tinofx12?_r=1&_t=ZS-924Qgm4OcAH"
},
{
  id: "P1765166520546",
  name: "7 YEARS OLD FOREIGN TIKTOK",
  description: "Fresh Netherland old TikTok",
  price: "6500",
  currency: "NGN",
  image: "https://i.ibb.co/XrwzFnQJ/IMG-9625.png",
  sellerId: 7436021331,
  sellerContact: "Whatsapp: +2349121412096",
  url: "https://www.tiktok.com/@siemdegroot08?_r=1&_t=ZG-922ZRkNqBuL"
},
{
  id: "P1765163337840",
  name: "15YEARS OLD TWITTER ACCOUNT",
  description: "Old 15Years foreign Twitter",
  price: "10000",
  currency: "NGN",
  image: "https://i.ibb.co/5hKyBM6Y/946f7fb0-2c40-475e-8daf-e1fe496f67c1.jpg",
  sellerId: 7436021331,
  sellerContact: "Whatsapp: +2349121412096",
  url: "https://x.com/jemberoutlet?t=JU3B5yoEA4dCD0OvCfNAjQ&s=09"
},
  {
  id: "P1764508470835",
  name: "Crypto & investment Telegram bot",
  description: "I can create or build and edit any telegram bot and any telegram webapp at a very low price",
  price: "50",
  currency: "USD",
  image: "https://i.ibb.co/r2FtZY4v/Screenshot-20251130-140808.png",
  sellerId: 8140042906,
  sellerContact: "Whatsapp: +2348121697423",
  url: "https://t.me/lnytecobot"
},
  {
  id: "P1764462838460",
  name: "Broker website",
  description: "Sharp broker/investment website Available, I also build and design all kind of websites",
  price: "250000",
  currency: "NGN",
  image: "https://i.ibb.co/9krtf0GF/1743496836blue1.png",
  sellerId: 6070010078,
  sellerContact: "Whatsapp: +2348111625143",
  url: "https://ibb.co/HfHdMyXW"
},
{
  id: "P1764307198192",
  name: "UK number to receive verification code",
  description: "United kingdom (UK) number verification for any platform or social media account",
  price: "5000",
  currency: "NGN",
  image: "https://i.ibb.co/Q73C02fQ/Screenshot-20251128-040729.png",
  sellerId: 6976365864,
  sellerContact: "Whatsapp: +234 916 631 4650",
  url: "https://i.ibb.co/Q73C02fQ/Screenshot-20251128-040729.png"
},
  { id:"P001", name:"Facebook Account", description:"Very good and strong.", price:"4500", currency:"NGN", image:"https://i.ibb.co/1f9GfgZL/IMG-20251124-000420-272.jpg", sellerId: 8111362786, sellerContact: "Whatsapp: +234 916 631 4650", url:"https://www.facebook.com/profile.php?id=61582415454848" },
  { id:"P002", name:"Tiktok account", description:"Active Tiktok account with 12+ followers.", price:"5", currency:"USD", image:"https://i.ibb.co/ksGYg1Vx/Screenshot-20251124-000807.png", sellerId: 7979664801, sellerContact: "Whatsapp: +2348121697423", url:"https://vm.tiktok.com/ZSHTeW8bRNKww-8KMhW/" } ,
  { id:"P176399696094362", name:"Facebook", description:"Good & Active.", price:"7000", currency:"NGN", image:"https://www.facebook.com/profile.php?id=61582947623474", sellerId: 8111362786, sellerContact: "Whatsapp: +2349166314650", url:"https://www.facebook.com/profile.php?id=61582947623474" },
  { id: "P176399729659985", name: "Foreign TikTok", description: "34 followers, 11 likes. Active.", price: "6000", currency: "NGN", image: "https://www.tiktok.com/@smith30114?_r=1&_t=ZS-91fY6ubi0yT", sellerId: 8111362786, sellerContact: "Whatsapp: +2349166314650", url: "https://www.tiktok.com/@smith30114?_r=1&_t=ZS-91fY6ubi0yT" }
];