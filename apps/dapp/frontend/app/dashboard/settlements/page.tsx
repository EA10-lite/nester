"use client";

import { useWallet } from "@/components/wallet-provider";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ChevronDown,
    ArrowDownUp,
    ShieldCheck,
    Clock,
    Info,
} from "lucide-react";

const BANKS = [
    { name: "Kuda Bank", code: "kuda" },
    { name: "Moniepoint", code: "moniepoint" },
    { name: "Access Bank", code: "access" },
    { name: "GTBank", code: "gtbank" },
    { name: "First Bank", code: "firstbank" },
    { name: "UBA", code: "uba" },
    { name: "Zenith Bank", code: "zenith" },
    { name: "Opay", code: "opay" },
];

const SEND_ASSETS = [
    { symbol: "USDC", name: "USD Coin", icon: "💲" },
    { symbol: "USDT", name: "Tether", icon: "💵" },
    { symbol: "XLM", name: "Stellar Lumens", icon: "✦" },
];

const RECEIVE_CURRENCIES = [
    { symbol: "NGN", name: "Nigerian Naira", icon: "🇳🇬", rate: 1512.45 },
    { symbol: "GHS", name: "Ghanaian Cedi", icon: "🇬🇭", rate: 15.80 },
    { symbol: "KES", name: "Kenyan Shilling", icon: "🇰🇪", rate: 129.50 },
];

export default function SettlementsPage() {
    const { isConnected } = useWallet();
    const router = useRouter();

    const [sendAmount, setSendAmount] = useState("");
    const [sendAsset, setSendAsset] = useState(SEND_ASSETS[0]);
    const [receiveCurrency, setReceiveCurrency] = useState(RECEIVE_CURRENCIES[0]);
    const [selectedBank, setSelectedBank] = useState<typeof BANKS[0] | null>(null);
    const [accountNumber, setAccountNumber] = useState("");
    const [showBankDropdown, setShowBankDropdown] = useState(false);
    const [showSendDropdown, setShowSendDropdown] = useState(false);
    const [showReceiveDropdown, setShowReceiveDropdown] = useState(false);

    useEffect(() => {
        if (!isConnected) {
            router.push("/");
        }
    }, [isConnected, router]);

    if (!isConnected) return null;

    const numericAmount = parseFloat(sendAmount) || 0;
    const receiveAmount = numericAmount * receiveCurrency.rate;
    const fee = numericAmount * 0.005;
    const netAmount = numericAmount - fee;
    const netReceive = netAmount * receiveCurrency.rate;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="mx-auto max-w-xl px-4 pt-28 pb-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-8"
                >
                    <h1 className="font-heading text-2xl font-semibold text-foreground">
                        Cash Out
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Convert crypto to fiat, directly to your bank account
                    </p>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden"
                >
                    {/* You'll Send */}
                    <div className="p-5">
                        <label className="text-xs text-muted-foreground font-medium mb-2 block">You&apos;ll send</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={sendAmount}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*\.?\d*$/.test(val)) setSendAmount(val);
                                }}
                                className="flex-1 text-3xl font-heading font-light text-foreground bg-transparent outline-none placeholder:text-muted-foreground/40 min-w-0"
                            />
                            <div className="relative">
                                <button
                                    onClick={() => setShowSendDropdown(!showSendDropdown)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                                >
                                    <span className="text-base">{sendAsset.icon}</span>
                                    <span className="text-sm font-medium text-foreground">{sendAsset.symbol}</span>
                                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                                {showSendDropdown && (
                                    <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-border bg-white shadow-lg py-1 z-10">
                                        {SEND_ASSETS.map((asset) => (
                                            <button
                                                key={asset.symbol}
                                                onClick={() => { setSendAsset(asset); setShowSendDropdown(false); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-secondary/50 transition-colors"
                                            >
                                                <span>{asset.icon}</span>
                                                <span className="font-medium">{asset.symbol}</span>
                                                <span className="text-muted-foreground text-xs ml-auto">{asset.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                            Balance: 0.00 {sendAsset.symbol}
                        </div>
                    </div>

                    {/* Swap Divider */}
                    <div className="relative px-5">
                        <div className="border-t border-border" />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="h-9 w-9 rounded-full border border-border bg-white flex items-center justify-center shadow-sm">
                                <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    {/* You'll Receive */}
                    <div className="p-5">
                        <label className="text-xs text-muted-foreground font-medium mb-2 block">You&apos;ll receive</label>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 text-3xl font-heading font-light text-foreground min-w-0 truncate">
                                {numericAmount > 0
                                    ? netReceive.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    : <span className="text-muted-foreground/40">0.00</span>
                                }
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setShowReceiveDropdown(!showReceiveDropdown)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                                >
                                    <span className="text-base">{receiveCurrency.icon}</span>
                                    <span className="text-sm font-medium text-foreground">{receiveCurrency.symbol}</span>
                                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                                {showReceiveDropdown && (
                                    <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-border bg-white shadow-lg py-1 z-10">
                                        {RECEIVE_CURRENCIES.map((currency) => (
                                            <button
                                                key={currency.symbol}
                                                onClick={() => { setReceiveCurrency(currency); setShowReceiveDropdown(false); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-secondary/50 transition-colors"
                                            >
                                                <span>{currency.icon}</span>
                                                <span className="font-medium">{currency.symbol}</span>
                                                <span className="text-muted-foreground text-xs ml-auto">{currency.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bank Details Section */}
                    <div className="border-t border-border p-5 space-y-4">
                        {/* Bank Selector */}
                        <div className="relative">
                            <label className="text-xs text-muted-foreground font-medium mb-2 block">Select bank</label>
                            <button
                                onClick={() => setShowBankDropdown(!showBankDropdown)}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border hover:border-foreground/20 transition-colors bg-white"
                            >
                                <span className={selectedBank ? "text-sm font-medium text-foreground" : "text-sm text-muted-foreground"}>
                                    {selectedBank ? selectedBank.name : "Choose your bank"}
                                </span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </button>
                            {showBankDropdown && (
                                <div className="absolute left-0 right-0 top-full mt-1 rounded-xl border border-border bg-white shadow-lg py-1 z-10 max-h-48 overflow-y-auto">
                                    {BANKS.map((bank) => (
                                        <button
                                            key={bank.code}
                                            onClick={() => { setSelectedBank(bank); setShowBankDropdown(false); }}
                                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors"
                                        >
                                            {bank.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Account Number */}
                        <div>
                            <label className="text-xs text-muted-foreground font-medium mb-2 block">Account number</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={10}
                                placeholder="Enter 10-digit account number"
                                value={accountNumber}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    setAccountNumber(val);
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-foreground/20 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Rate & Fees */}
                    {numericAmount > 0 && (
                        <div className="border-t border-border px-5 py-4 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground flex items-center gap-1">
                                    Exchange rate
                                    <Info className="h-3 w-3" />
                                </span>
                                <span className="text-foreground font-medium">
                                    1 {sendAsset.symbol} ≈ {receiveCurrency.rate.toLocaleString()} {receiveCurrency.symbol}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Network fee (0.5%)</span>
                                <span className="text-foreground font-medium">
                                    {fee.toFixed(4)} {sendAsset.symbol}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Estimated time</span>
                                <span className="text-foreground font-medium flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    1–5 minutes
                                </span>
                            </div>
                        </div>
                    )}

                    {/* CTA Button */}
                    <div className="p-5 pt-0">
                        <button
                            disabled={!numericAmount || !selectedBank || accountNumber.length !== 10}
                            className="w-full rounded-xl bg-foreground text-background py-4 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {!numericAmount ? "Enter an amount" :
                                !selectedBank ? "Select a bank" :
                                    accountNumber.length !== 10 ? "Enter account number" :
                                        `Withdraw ${netReceive.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${receiveCurrency.symbol}`}
                        </button>
                    </div>
                </motion.div>

                {/* Security Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mt-4 flex items-center justify-center gap-2"
                >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-[11px] text-muted-foreground">
                        Secured by Soroban smart contract escrow — auto-refund if settlement fails
                    </span>
                </motion.div>

                {/* Pending Settlements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="mt-8 rounded-2xl border border-border bg-white p-5"
                >
                    <h3 className="font-heading text-sm font-medium text-foreground mb-3">Recent Settlements</h3>
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Clock className="h-5 w-5 text-muted-foreground/30 mb-2" />
                        <p className="text-xs text-muted-foreground">No settlements yet</p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
