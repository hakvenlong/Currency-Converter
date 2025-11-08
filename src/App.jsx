import { useState, useEffect, useRef } from 'react';
import './App.css';

const Country_List = {
  AED: 'AE', AFN: 'AF', XCD: 'AG', ALL: 'AL', AMD: 'AM', ANG: 'AN', AOA: 'AO',
  AQD: 'AQ', ARS: 'AR', AUD: 'AU', AZN: 'AZ', BAM: 'BA', BBD: 'BB', BDT: 'BD',
  XOF: 'BE', BGN: 'BG', BHD: 'BH', BIF: 'BI', BMD: 'BM', BND: 'BN', BOB: 'BO',
  BRL: 'BR', BSD: 'BS', NOK: 'BV', BWP: 'BW', BYR: 'BY', BZD: 'BZ', CAD: 'CA',
  CDF: 'CD', XAF: 'CF', CHF: 'CH', CLP: 'CL', CNY: 'CN', COP: 'CO', CRC: 'CR',
  CUP: 'CU', CVE: 'CV', CYP: 'CY', CZK: 'CZ', DJF: 'DJ', DKK: 'DK', DOP: 'DO',
  DZD: 'DZ', ECS: 'EC', EEK: 'EE', EGP: 'EG', ETB: 'ET', EUR: 'FR', FJD: 'FJ',
  FKP: 'FK', GBP: 'GB', GEL: 'GE', GGP: 'GG', GHS: 'GH', GIP: 'GI', GMD: 'GM',
  GNF: 'GN', GTQ: 'GT', GYD: 'GY', HKD: 'HK', HNL: 'HN', HRK: 'HR', HTG: 'HT',
  HUF: 'HU', IDR: 'ID', ILS: 'IL', INR: 'IN', IQD: 'IQ', IRR: 'IR', ISK: 'IS',
  JMD: 'JM', JOD: 'JO', JPY: 'JP', KES: 'KE', KGS: 'KG', KHR: 'KH', KMF: 'KM',
  KPW: 'KP', KRW: 'KR', KWD: 'KW', KYD: 'KY', KZT: 'KZ', LAK: 'LA', LBP: 'LB',
  LKR: 'LK', LRD: 'LR', LSL: 'LS', LTL: 'LT', LVL: 'LV', LYD: 'LY', MAD: 'MA',
  MDL: 'MD', MGA: 'MG', MKD: 'MK', MMK: 'MM', MNT: 'MN', MOP: 'MO', MRO: 'MR',
  MTL: 'MT', MUR: 'MU', MVR: 'MV', MWK: 'MW', MXN: 'MX', MYR: 'MY', MZN: 'MZ',
  NAD: 'NA', XPF: 'NC', NGN: 'NG', NIO: 'NI', NPR: 'NP', NZD: 'NZ', OMR: 'OM',
  PAB: 'PA', PEN: 'PE', PGK: 'PG', PHP: 'PH', PKR: 'PK', PLN: 'PL', PYG: 'PY',
  QAR: 'QA', RON: 'RO', RSD: 'RS', RUB: 'RU', RWF: 'RW', SAR: 'SA', SBD: 'SB',
  SCR: 'SC', SDG: 'SD', SEK: 'SE', SGD: 'SG', SKK: 'SK', SLL: 'SL', SOS: 'SO',
  SRD: 'SR', STD: 'ST', SVC: 'SV', SYP: 'SY', SZL: 'SZ', THB: 'TH', TJS: 'TJ',
  TMT: 'TM', TND: 'TN', TOP: 'TO', TRY: 'TR', TTD: 'TT', TWD: 'TW', TZS: 'TZ',
  UAH: 'UA', UGX: 'UG', USD: 'US', UYU: 'UY', UZS: 'UZ', VEF: 'VE', VND: 'VN',
  VUV: 'VU', YER: 'YE', ZAR: 'ZA', ZMK: 'ZM', ZWD: 'ZW'
};

function App() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('GBP');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [resultText, setResultText] = useState('');
  const [loading, setLoading] = useState(false);

  const fromFlag = `https://flagcdn.com/48x36/${Country_List[fromCurrency]?.toLowerCase()}.png`;
  const toFlag = `https://flagcdn.com/48x36/${Country_List[toCurrency]?.toLowerCase()}.png`;

  const API_KEY = '3ed5629c6b1fb1fc6c90c23b'; 

  const getExchangeRate = async (initialLoad = false) => {
    const amountVal = amount || 1;
    setLoading(true);
    setResultText('Getting exchange rate...');

    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`
      );
      const data = await response.json();

      if (data.result === 'error') throw new Error(data['error-type']);

      const rate = data.conversion_rates[toCurrency];
      const total = (amountVal * rate).toFixed(2);
      setExchangeRate(rate);
      if (!initialLoad) {
        setResultText(`${amountVal} ${fromCurrency} = ${total} ${toCurrency}`);
      }
    } catch (error) {
      setResultText('Something went wrong. Check your connection or API key.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount and when currencies change
  useEffect(() => {
    getExchangeRate(true).then(() => {
      setResultText(''); // Clear "Getting exchange rate..." after initial load
    });
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getExchangeRate();
  };

  return (
    <div className="container">
      <h2>Currency Converter</h2>
      <form onSubmit={handleSubmit}>
        <div className="amount">
          <p>Amount</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
            placeholder="1"
          />
        </div>

        <div className="convert-box">
          <div className="from">
            <p>From</p>
            <div className="select-input">
              <img src={fromFlag} alt={fromCurrency} />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {Object.keys(Country_List).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="reverse" onClick={handleSwap}>
            <i className="fas fa-exchange-alt"></i>
          </div>

          <div className="to">
            <p>To</p>
            <div className="select-input">
              <img src={toFlag} alt={toCurrency} />
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {Object.keys(Country_List).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="result">
            {loading ? 'Getting exchange rate...' : resultText}
          </div>

          <button type="submit" disabled={loading}>
            Get Exchange Rate
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;