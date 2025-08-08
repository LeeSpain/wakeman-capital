import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';

interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'crypto' | 'forex';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (asset: Asset) => void;
  existingAssets: string[];
}

// Top 50 cryptocurrencies
const CRYPTO_ASSETS: Asset[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', type: 'crypto' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', type: 'crypto' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', type: 'crypto' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', type: 'crypto' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', type: 'crypto' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', type: 'crypto' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', type: 'crypto' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', type: 'crypto' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', type: 'crypto' },
  { id: 'polygon', symbol: 'MATIC', name: 'Polygon', type: 'crypto' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', type: 'crypto' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', type: 'crypto' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', type: 'crypto' },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar', type: 'crypto' },
  { id: 'algorand', symbol: 'ALGO', name: 'Algorand', type: 'crypto' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', type: 'crypto' },
  { id: 'vechain', symbol: 'VET', name: 'VeChain', type: 'crypto' },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', type: 'crypto' },
  { id: 'aave', symbol: 'AAVE', name: 'Aave', type: 'crypto' },
  { id: 'maker', symbol: 'MKR', name: 'Maker', type: 'crypto' },
  { id: 'compound', symbol: 'COMP', name: 'Compound', type: 'crypto' },
  { id: 'sushi', symbol: 'SUSHI', name: 'SushiSwap', type: 'crypto' },
  { id: 'curve-dao-token', symbol: 'CRV', name: 'Curve DAO', type: 'crypto' },
  { id: '1inch', symbol: '1INCH', name: '1inch', type: 'crypto' },
  { id: 'pancakeswap-token', symbol: 'CAKE', name: 'PancakeSwap', type: 'crypto' },
  { id: 'the-graph', symbol: 'GRT', name: 'The Graph', type: 'crypto' },
  { id: 'enjincoin', symbol: 'ENJ', name: 'Enjin Coin', type: 'crypto' },
  { id: 'basic-attention-token', symbol: 'BAT', name: 'Basic Attention Token', type: 'crypto' },
  { id: 'decentraland', symbol: 'MANA', name: 'Decentraland', type: 'crypto' },
  { id: 'the-sandbox', symbol: 'SAND', name: 'The Sandbox', type: 'crypto' },
  { id: 'axie-infinity', symbol: 'AXS', name: 'Axie Infinity', type: 'crypto' },
  { id: 'gala', symbol: 'GALA', name: 'Gala', type: 'crypto' },
  { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer', type: 'crypto' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', type: 'crypto' },
  { id: 'flow', symbol: 'FLOW', name: 'Flow', type: 'crypto' },
  { id: 'elrond-erd-2', symbol: 'EGLD', name: 'MultiversX', type: 'crypto' },
  { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera', type: 'crypto' },
  { id: 'fantom', symbol: 'FTM', name: 'Fantom', type: 'crypto' },
  { id: 'harmony', symbol: 'ONE', name: 'Harmony', type: 'crypto' },
  { id: 'klay-token', symbol: 'KLAY', name: 'Klaytn', type: 'crypto' },
  { id: 'terra-luna', symbol: 'LUNA', name: 'Terra Classic', type: 'crypto' },
  { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', type: 'crypto' },
  { id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic', type: 'crypto' },
  { id: 'monero', symbol: 'XMR', name: 'Monero', type: 'crypto' },
  { id: 'zcash', symbol: 'ZEC', name: 'Zcash', type: 'crypto' },
  { id: 'dash', symbol: 'DASH', name: 'Dash', type: 'crypto' },
  { id: 'tezos', symbol: 'XTZ', name: 'Tezos', type: 'crypto' },
  { id: 'iota', symbol: 'MIOTA', name: 'IOTA', type: 'crypto' },
  { id: 'neo', symbol: 'NEO', name: 'Neo', type: 'crypto' },
  { id: 'qtum', symbol: 'QTUM', name: 'Qtum', type: 'crypto' },
];

// Major forex pairs and commodities
const FOREX_ASSETS: Asset[] = [
  { id: 'EUR/USD', symbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'forex' },
  { id: 'GBP/USD', symbol: 'GBP/USD', name: 'British Pound / US Dollar', type: 'forex' },
  { id: 'USD/JPY', symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', type: 'forex' },
  { id: 'USD/CHF', symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', type: 'forex' },
  { id: 'AUD/USD', symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', type: 'forex' },
  { id: 'USD/CAD', symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', type: 'forex' },
  { id: 'NZD/USD', symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', type: 'forex' },
  { id: 'EUR/GBP', symbol: 'EUR/GBP', name: 'Euro / British Pound', type: 'forex' },
  { id: 'EUR/JPY', symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', type: 'forex' },
  { id: 'GBP/JPY', symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', type: 'forex' },
  { id: 'EUR/CHF', symbol: 'EUR/CHF', name: 'Euro / Swiss Franc', type: 'forex' },
  { id: 'GBP/CHF', symbol: 'GBP/CHF', name: 'British Pound / Swiss Franc', type: 'forex' },
  { id: 'AUD/JPY', symbol: 'AUD/JPY', name: 'Australian Dollar / Japanese Yen', type: 'forex' },
  { id: 'CAD/JPY', symbol: 'CAD/JPY', name: 'Canadian Dollar / Japanese Yen', type: 'forex' },
  { id: 'CHF/JPY', symbol: 'CHF/JPY', name: 'Swiss Franc / Japanese Yen', type: 'forex' },
  { id: 'EUR/AUD', symbol: 'EUR/AUD', name: 'Euro / Australian Dollar', type: 'forex' },
  { id: 'GBP/AUD', symbol: 'GBP/AUD', name: 'British Pound / Australian Dollar', type: 'forex' },
  { id: 'USD/CNY', symbol: 'USD/CNY', name: 'US Dollar / Chinese Yuan', type: 'forex' },
  { id: 'USD/SGD', symbol: 'USD/SGD', name: 'US Dollar / Singapore Dollar', type: 'forex' },
  { id: 'USD/ZAR', symbol: 'USD/ZAR', name: 'US Dollar / South African Rand', type: 'forex' },
];

const ALL_ASSETS = [...CRYPTO_ASSETS, ...FOREX_ASSETS];

export const AddInvestmentModal: React.FC<Props> = ({ isOpen, onClose, onAdd, existingAssets }) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'crypto' | 'forex'>('all');

  const filteredAssets = useMemo(() => {
    return ALL_ASSETS.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
                           asset.symbol.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === 'all' || asset.type === selectedType;
      const notExists = !existingAssets.includes(asset.id);
      return matchesSearch && matchesType && notExists;
    });
  }, [search, selectedType, existingAssets]);

  const handleAdd = (asset: Asset) => {
    onAdd(asset);
    onClose();
    setSearch('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-card-foreground">Add Investment</h2>
          <Button variant="outline" onClick={onClose}>×</Button>
        </div>

        <div className="flex flex-col gap-4 mb-4">
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
          />
          
          <div className="flex gap-2">
            <Button 
              variant={selectedType === 'all' ? 'default' : 'outline'} 
              onClick={() => setSelectedType('all')}
              className="text-sm"
            >
              All
            </Button>
            <Button 
              variant={selectedType === 'crypto' ? 'default' : 'outline'} 
              onClick={() => setSelectedType('crypto')}
              className="text-sm"
            >
              Crypto
            </Button>
            <Button 
              variant={selectedType === 'forex' ? 'default' : 'outline'} 
              onClick={() => setSelectedType('forex')}
              className="text-sm"
            >
              Forex
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
                onClick={() => handleAdd(asset)}
              >
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    asset.type === 'crypto' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-secondary/10 text-secondary-foreground'
                  }`}>
                    {asset.type.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-card-foreground">{asset.symbol}</div>
                    <div className="text-sm text-muted-foreground">{asset.name}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Add</Button>
              </div>
            ))}
          </div>
          
          {filteredAssets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No assets found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};