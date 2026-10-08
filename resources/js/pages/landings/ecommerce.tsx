// Landing page NUSAMART, marketplace umum khas Indonesia.
// Halaman ini TIDAK memakai AuthenticatedLayout, header/nav + footer inline, self-contained.
// Tidak menerima props.
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CountdownTimer } from '@/components/countdown-timer';
import { StickyMobileCta } from '@/components/sticky-mobile-cta';
import {
    BadgePercent,
    CreditCard,
    Heart,
    LifeBuoy,
    MapPin,
    Menu,
    Phone,
    ShieldCheck,
    ShoppingCart,
    Star,
    Store,
    Truck,
    X,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Format rupiah gaya Indonesia: 145000 -> "Rp145.000"
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

// ---------- Data ----------

interface Produk {
    nama: string;
    harga: number;
    hargaCoret: number;
    rating: number;
    terjual: string;
    icon: LucideIcon;
    art: string; // kelas gradient untuk tile CSS-art
    kategori: string;
}

const FLASH_SALE: Produk[] = [
    { nama: 'Kopi Arabika Gayo 500g', harga: 99000, hargaCoret: 145000, rating: 4.9, terjual: '12,4 rb', icon: Store, art: 'from-amber-700 via-amber-900 to-stone-950', kategori: 'Kopi & Teh' },
    { nama: 'Batik Cap Pekalongan', harga: 269000, hargaCoret: 385000, rating: 4.8, terjual: '3,1 rb', icon: Store, art: 'from-indigo-700 via-purple-800 to-indigo-950', kategori: 'Fashion' },
    { nama: 'Rendang Sapi Kemasan 250g', harga: 71000, hargaCoret: 89000, rating: 4.9, terjual: '8,7 rb', icon: Store, art: 'from-red-700 via-red-900 to-stone-950', kategori: 'Makanan' },
    { nama: 'Keripik Singkong Balado 300g', harga: 28000, hargaCoret: 35000, rating: 4.7, terjual: '21,2 rb', icon: Store, art: 'from-orange-500 via-amber-600 to-orange-800', kategori: 'Makanan' },
    { nama: 'Tas Anyaman Pandan Lombok', harga: 122000, hargaCoret: 175000, rating: 4.8, terjual: '1,9 rb', icon: Store, art: 'from-lime-600 via-green-700 to-emerald-900', kategori: 'Kerajinan' },
    { nama: 'Madu Hutan Sumbawa 500ml', harga: 132000, hargaCoret: 165000, rating: 4.9, terjual: '5,6 rb', icon: Store, art: 'from-yellow-500 via-amber-600 to-yellow-800', kategori: 'Kesehatan' },
    { nama: 'Teh Melati Slawi 100g', harga: 33500, hargaCoret: 42000, rating: 4.6, terjual: '9,3 rb', icon: Store, art: 'from-emerald-500 via-teal-600 to-emerald-800', kategori: 'Kopi & Teh' },
    { nama: 'Sambal Bawang Bu Lastri 150g', harga: 22400, hargaCoret: 28000, rating: 4.8, terjual: '15,8 rb', icon: Store, art: 'from-rose-600 via-red-700 to-rose-900', kategori: 'Makanan' },
];

const REKOMENDASI: Produk[] = [
    { nama: 'Kaos Sablon Komunitas Merdeka', harga: 120000, hargaCoret: 150000, rating: 4.7, terjual: '2,2 rb', icon: Store, art: 'from-slate-600 via-slate-700 to-slate-900', kategori: 'Fashion' },
    { nama: 'Sabun Kopi Lulur Alami', harga: 45000, hargaCoret: 60000, rating: 4.6, terjual: '4,4 rb', icon: Store, art: 'from-stone-600 via-amber-800 to-stone-900', kategori: 'Kecantikan' },
    { nama: 'Gula Aren Asli 1kg', harga: 38000, hargaCoret: 48000, rating: 4.8, terjual: '7,1 rb', icon: Store, art: 'from-amber-600 via-yellow-700 to-amber-900', kategori: 'Makanan' },
    { nama: 'Dompet Kulit Sapi Asli', harga: 210000, hargaCoret: 280000, rating: 4.7, terjual: '980', icon: Store, art: 'from-orange-800 via-amber-900 to-stone-950', kategori: 'Fashion' },
    { nama: 'Kopi Robusta Lampung 250g', harga: 68000, hargaCoret: 85000, rating: 4.8, terjual: '6,5 rb', icon: Store, art: 'from-stone-700 via-stone-800 to-black', kategori: 'Kopi & Teh' },
    { nama: 'Kain Tenun Ikat NTT', harga: 450000, hargaCoret: 550000, rating: 4.9, terjual: '640', icon: Store, art: 'from-fuchsia-700 via-purple-800 to-indigo-950', kategori: 'Kerajinan' },
];

const KATEGORI = ['Kopi & Teh', 'Batik & Fashion', 'Makanan', 'Kerajinan', 'Kecantikan', 'Kesehatan'];

// Foto produk per kategori, dipakai kartu produk flash sale & rekomendasi.
const FOTO_KATEGORI: Record<string, string> = {
    'Kopi & Teh': '/images/landing-ecommerce/produk-kopi-teh.jpg',
    Fashion: '/images/landing-ecommerce/produk-fashion.jpg',
    Makanan: '/images/landing-ecommerce/produk-makanan.jpg',
    Kerajinan: '/images/landing-ecommerce/produk-kerajinan.jpg',
    Kesehatan: '/images/landing-ecommerce/produk-kesehatan.jpg',
    Kecantikan: '/images/landing-ecommerce/produk-kecantikan.jpg',
};

// ---------- Komponen kecil ----------

// Bintang rating: bintang penuh sesuai rating, sisanya outline.
function Bintang({ rating, className }: { rating: number; className?: string }) {
    return (
        <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`Rating ${rating} dari 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={cn('h-3.5 w-3.5', i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/40')}
                />
            ))}
        </span>
    );
}

// Persen diskon dari harga coret, dibulatkan ke bilangan bulat.
function persenDiskon(p: Produk) {
    return Math.round((1 - p.harga / p.hargaCoret) * 100);
}

function KartuProduk({ produk }: { produk: Produk }) {
    const [suka, setSuka] = useState(false);
    return (
        <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative h-40 overflow-hidden">
                <img
                    src={FOTO_KATEGORI[produk.kategori]}
                    alt={produk.nama}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-2 left-2 bg-red-600 text-white hover:bg-red-600">-{persenDiskon(produk)}%</Badge>
                <button
                    type="button"
                    onClick={() => setSuka((v) => !v)}
                    aria-label="Simpan ke wishlist"
                    aria-pressed={suka}
                    className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 shadow-sm transition hover:scale-110"
                >
                    <Heart className={cn('h-4 w-4', suka ? 'fill-red-500 text-red-500' : 'text-slate-500')} />
                </button>
            </div>
            <CardContent className="space-y-1.5 p-3">
                <p className="line-clamp-2 min-h-10 text-sm font-medium">{produk.nama}</p>
                <div className="flex items-baseline gap-2">
                    <span className="tnum text-base font-bold text-red-600">{rupiah(produk.harga)}</span>
                </div>
                <p className="tnum text-xs text-muted-foreground line-through">{rupiah(produk.hargaCoret)}</p>
                <div className="flex items-center gap-1.5 pt-0.5">
                    <Bintang rating={produk.rating} />
                    <span className="text-xs text-muted-foreground">({produk.terjual})</span>
                </div>
            </CardContent>
        </Card>
    );
}

// ---------- Halaman ----------

export default function EcommerceLanding() {
    const [menuBuka, setMenuBuka] = useState(false);
    const [kategoriAktif, setKategoriAktif] = useState<string | null>(null);
    // Flash sale berakhir ~14 jam dari sekarang, dihitung sekali saat mount.
    const targetFlashSale = useMemo(() => new Date(Date.now() + 14 * 3600 * 1000), []);

    const navLinks = [
        { href: '#beranda', label: 'Beranda' },
        { href: '#flash-sale', label: 'Flash Sale' },
        { href: '#kategori', label: 'Kategori' },
        { href: '#rekomendasi', label: 'Rekomendasi' },
        { href: '#penjual', label: 'Penjual' },
    ];

    const scrollKe = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    // Kategori memfilter rekomendasi secara nyata.
    const cocokKategori = (p: Produk) =>
        kategoriAktif === null ||
        p.kategori === kategoriAktif ||
        (kategoriAktif === 'Batik & Fashion' && p.kategori === 'Fashion');
    const rekomendasiTampil = REKOMENDASI.filter(cocokKategori);

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-0">
            {/* Topbar pengumuman */}
            <div className="bg-orange-600 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
                <BadgePercent className="mr-1.5 inline h-4 w-4" />
                Gratis ongkir min. belanja Rp50.000, pakai kode <span className="font-bold tracking-wide">NUSAONGKIR</span>
            </div>

            {/* Navbar */}
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
                    <a href="#beranda" className="flex shrink-0 items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600">
                            <Store className="h-5 w-5 text-white" />
                        </span>
                        <span className="text-xl font-extrabold tracking-tight">
                            NUSA<span className="text-orange-600">MART</span>
                        </span>
                    </a>
                    <div className="ml-auto flex items-center gap-1.5">
                        <Button variant="ghost" size="icon" aria-label="Keranjang" className="relative" onClick={() => scrollKe('rekomendasi')}>
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                                3
                            </span>
                        </Button>
                        <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => scrollKe('penjual')}>Jadi Penjual</Button>
                        <Button className="hidden bg-orange-600 hover:bg-orange-700 sm:inline-flex" onClick={() => scrollKe('flash-sale')}>Belanja Sekarang</Button>
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuBuka((v) => !v)} aria-label="Menu">
                            {menuBuka ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
                {/* Nav links */}
                <nav className={cn('border-t md:block', menuBuka ? 'block' : 'hidden')}>
                    <div className="mx-auto flex max-w-7xl flex-col px-4 py-1 md:flex-row md:items-center md:gap-1">
                        {navLinks.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                onClick={() => setMenuBuka(false)}
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>
                </nav>
            </header>

            {/* Hero, 1 proposisi konkret */}
            <section id="beranda" className="mx-auto max-w-7xl px-4 pt-6">
                <div className="relative overflow-hidden rounded-2xl text-white">
                    <img src="/images/landing-ecommerce/hero-1.jpg" alt="Produk UMKM lokal Indonesia" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" aria-hidden />
                    <div className="relative max-w-2xl p-8 sm:p-12">
                        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
                            Belanja langsung dari 48.000 UMKM, tanpa potongan tersembunyi.
                        </h1>
                        <p className="mt-4 max-w-md text-white/85">
                            Kopi Gayo, batik Pekalongan, rendang kemasan: 92% penjual kami adalah UMKM dan
                            setiap rupiah transaksi diteruskan penuh ke mereka.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <Button size="lg" className="bg-orange-600 text-white hover:bg-orange-700" onClick={() => scrollKe('flash-sale')}>
                                Belanja Flash Sale
                            </Button>
                            <button onClick={() => scrollKe('penjual')} className="text-sm font-semibold text-white/85 underline decoration-white/50 underline-offset-4 hover:text-white">
                                Kenali para penjual kami
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Flash sale + countdown */}
            <section id="flash-sale" className="mx-auto max-w-7xl scroll-mt-32 px-4 pt-10">
                <Card className="overflow-hidden border-red-200 bg-gradient-to-b from-red-50 to-background">
                    <CardContent className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600">
                                <Zap className="h-5 w-5 fill-white text-white" />
                            </span>
                            <div>
                                <h2 className="font-display text-xl font-extrabold text-red-700 sm:text-2xl">FLASH SALE</h2>
                                <p className="text-xs text-muted-foreground">Berakhir dalam</p>
                            </div>
                            <CountdownTimer target={targetFlashSale} className="ml-auto" />
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                            {FLASH_SALE.map((p) => (
                                <KartuProduk key={p.nama} produk={p} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Kategori, berfungsi sebagai filter rekomendasi */}
            <section id="kategori" className="mx-auto max-w-7xl scroll-mt-32 px-4 pt-10">
                <h2 className="font-display text-xl font-bold sm:text-2xl">Jelajahi Kategori</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                    {KATEGORI.map((k) => (
                        <Button
                            key={k}
                            variant={kategoriAktif === k ? 'default' : 'outline'}
                            className={cn('rounded-full', kategoriAktif === k && 'bg-orange-600 hover:bg-orange-700')}
                            onClick={() => { setKategoriAktif((a) => (a === k ? null : k)); scrollKe('rekomendasi'); }}
                            aria-pressed={kategoriAktif === k}
                        >
                            {k}
                        </Button>
                    ))}
                </div>
            </section>

            {/* Rekomendasi */}
            <section id="rekomendasi" className="mx-auto max-w-7xl scroll-mt-32 px-4 pt-10">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold sm:text-2xl">
                        {kategoriAktif ? `Rekomendasi: ${kategoriAktif}` : 'Rekomendasi Untukmu'}
                    </h2>
                    {kategoriAktif && (
                        <button onClick={() => setKategoriAktif(null)} className="text-sm font-semibold text-orange-600 hover:underline">
                            Hapus filter
                        </button>
                    )}
                </div>
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
                    {rekomendasiTampil.map((p) => (
                        <div key={p.nama} className="w-40 shrink-0 sm:w-auto">
                            <KartuProduk produk={p} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Dibuat untuk siapa, pola persona, bukan kartu generik */}
            <section id="penjual" className="mx-auto max-w-7xl scroll-mt-32 px-4 pt-14">
                <div className="overflow-hidden rounded-3xl bg-stone-950 text-white">
                    <div className="grid lg:grid-cols-2">
                        <div className="p-8 sm:p-12">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">Dibuat untuk siapa</p>
                            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">NUSAMART ada untuk dua sisi meja</h2>
                            <div className="mt-8 space-y-6">
                                <div className="flex gap-4">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-600/20 text-orange-400">
                                        <ShoppingCart className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="font-bold">Kamu yang belanja</p>
                                        <p className="mt-1 text-sm text-stone-400">
                                            Cari oleh-oleh khas daerah yang asli, bukan KW pasar. Setiap produk terverifikasi
                                            asal-usulnya dan dinilai 4.6+ oleh pembeli sebelumnya.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-600/20 text-orange-400">
                                        <Store className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="font-bold">Kamu yang jualan</p>
                                        <p className="mt-1 text-sm text-stone-400">
                                            UMKM tanpa biaya pendaftaran dan tanpa potongan tersembunyi. Dana cair H+1
                                            setelah barang diterima pembeli.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Button size="lg" className="mt-8 bg-orange-600 hover:bg-orange-700" onClick={() => scrollKe('flash-sale')}>
                                Mulai Belanja
                            </Button>
                        </div>
                        <div className="relative min-h-72">
                            <img
                                src="/images/landing-ecommerce/produk-kopi-teh.jpg"
                                alt="Produk kopi dari penjual UMKM NUSAMART"
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                            />
                            {/* Bukti teratribusi di dekat konversi */}
                            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/65 p-4 backdrop-blur">
                                <div className="flex items-center gap-2">
                                    <Bintang rating={5} />
                                </div>
                                <p className="mt-2 text-sm italic text-white/90">
                                    "Dulu jualan kopi cuma ke tetangga. Sekarang kirim ke 27 provinsi,
                                    omzet naik 3x dalam 6 bulan."
                                </p>
                                <p className="mt-2 text-xs font-semibold text-orange-300">
                                    Sari Dewi, penjual Kopi Arabika Gayo, Takengon
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust badges */}
            <section id="bantuan" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-12">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                        { icon: Truck, judul: 'Gratis Ongkir', teks: 'Ke seluruh Indonesia min. belanja Rp50.000' },
                        { icon: ShieldCheck, judul: '100% Produk Asli', teks: 'Garansi uang kembali jika terbukti palsu' },
                        { icon: CreditCard, judul: 'Pembayaran Aman', teks: 'QRIS, transfer bank, e-wallet, dan COD' },
                        { icon: LifeBuoy, judul: 'Bantuan 24/7', teks: 'Tim CS siap membantu kapan pun' },
                    ].map((t) => (
                        <Card key={t.judul}>
                            <CardContent className="flex items-start gap-3 p-4">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                                    <t.icon className="h-5 w-5 text-orange-700" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold">{t.judul}</p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">{t.teks}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-slate-950 text-slate-300">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600">
                                <Store className="h-5 w-5 text-white" />
                            </span>
                            <span className="text-lg font-extrabold text-white">
                                NUSA<span className="text-orange-500">MART</span>
                            </span>
                        </div>
                        <p className="mt-3 text-sm text-slate-400">
                            Marketplace karya anak bangsa. Menghubungkan 48.000+ UMKM dari Sabang sampai Merauke dengan jutaan pembeli.
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                            <MapPin className="h-4 w-4" /> Jl. Merdeka No. 88, Jakarta Pusat
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                            <Phone className="h-4 w-4" /> 1500-882 (24 jam)
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Bantuan</p>
                        <ul className="mt-3 space-y-2 text-sm text-slate-400">
                            <li><a href="#bantuan" className="hover:text-white">Lacak Pesanan</a></li>
                            <li><a href="#bantuan" className="hover:text-white">Pengembalian Barang</a></li>
                            <li><a href="#bantuan" className="hover:text-white">Pusat Bantuan</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Tentang NUSAMART</p>
                        <ul className="mt-3 space-y-2 text-sm text-slate-400">
                            <li><a href="#beranda" className="hover:text-white">Beranda</a></li>
                            <li><a href="#penjual" className="hover:text-white">Jadi Penjual</a></li>
                            <li><a href="#kategori" className="hover:text-white">Kategori</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Metode Pembayaran</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {['QRIS', 'BCA', 'BRI', 'Mandiri', 'OVO', 'GoPay', 'COD'].map((x) => (
                                <Badge key={x} variant="outline" className="border-slate-700 text-slate-300">{x}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
                    © 2026 NUSAMART. Seluruh hak cipta dilindungi.
                </div>
            </footer>

            {/* CTA sticky khusus mobile: keranjang siap checkout.
                Isi konsisten: Kopi Gayo 99.000 + Keripik 28.000 + Madu 132.000 = Rp259.000,
                hemat (145-99)+(35-28)+(165-132) = Rp86.000. */}
            <StickyMobileCta
                variant="cart"
                title="Keranjang belanja"
                subtitle="3 produk • hemat Rp86.000"
                actionLabel="Checkout"
                price={rupiah(259000)}
                onAction={() => scrollKe('flash-sale')}
            />
        </div>
    );
}
