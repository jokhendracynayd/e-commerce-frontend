# Country Configuration System

This directory contains the configuration files for multi-country support in the e-commerce frontend.

## 📁 Structure

```
config/
├── countries/
│   ├── us.json          # United States configuration
│   ├── in.json          # India configuration
│   ├── gb.json          # United Kingdom configuration
│   ├── bd.json           # Bangladesh configuration
│   ├── index.ts         # Country configuration exports
│   └── types.ts         # TypeScript type definitions
├── currencies/
│   ├── symbols.json     # Currency symbols and formatting
│   ├── exchange-rates.json # Exchange rates
│   ├── index.ts         # Currency configuration exports
│   └── types.ts         # TypeScript type definitions
├── index.ts             # Main configuration exports
└── README.md            # This file
```

## 🚀 Usage

### Basic Usage

```typescript
import { useCountry } from '@/hooks/useCountry';
import { countryService } from '@/services/countryService';

// In your component
const MyComponent = () => {
  const {
    currentCountry,
    getFieldLabel,
    getFieldConfig,
    getFieldOrder,
    validateField,
    setCountry
  } = useCountry();

  // Get field label for current country
  const streetLabel = getFieldLabel('street'); // "Street Address" for US, "Street Address" for IN, BD

  // Get field configuration
  const streetConfig = getFieldConfig('street');
  // Returns: { label: "Street Address", placeholder: "123 Main St", required: true, helpText: "..." }

  // Get field order for form rendering
  const fieldOrder = getFieldOrder(); // ["street", "city", "state", "zip"] for US, ["street", "area", "city", "district", "postcode"] for BD

  // Get states/provinces for dropdown
  const states = getStatesProvinces(); // Array of {code, name} objects
  const stateName = getStateProvinceName('CA'); // "California" for US
  const isValidState = isValidStateProvince('CA'); // true for US

  // Validate field value
  const isValid = validateField('zip', '10001'); // true for US ZIP format

  // Change country
  setCountry('IN'); // Switch to India
};
```

### Using Country Service Directly

```typescript
import { countryService } from '@/services/countryService';

// Get country configuration
const usConfig = countryService.getCountryConfig('US');

// Get field labels
const labels = countryService.getCountryLabels('IN');

// Get states/provinces
const states = countryService.getStatesProvinces('US'); // All US states
const stateName = countryService.getStateProvinceName('CA', 'US'); // "California"
const isValidState = countryService.isValidStateProvince('CA', 'US'); // true

// Validate field
const isValid = countryService.validateField('pincode', '400001', 'IN');

// Format address
const address = countryService.formatAddress({
  street: '123 MG Road',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001'
}, 'IN');
// Returns: "123 MG Road, Mumbai, Maharashtra, 400001"
```

### Using Currency Service

```typescript
import { currencyService } from '@/services/currencyService';

// Format currency
const formatted = currencyService.formatAmount(1000, 'USD'); // "$1000.00"
const formattedBDT = currencyService.formatAmount(1000, 'BDT'); // "৳1000.00"

// Convert currency
const converted = currencyService.convertAmount(1000, 'USD', 'INR'); // 83500
const convertedBDT = currencyService.convertAmount(1000, 'USD', 'BDT'); // 110500

// Get currency for country
const currency = currencyService.getCurrencyForCountry('IN'); // "INR"
const currencyBD = currencyService.getCurrencyForCountry('BD'); // "BDT"
```

## 🏗️ Configuration Structure

### Country Configuration

Each country configuration file (`us.json`, `in.json`, `bd.json`, etc.) contains:

```json
{
  "code": "US",
  "name": "United States",
  "currency": "USD",
  "phoneCode": "+1",
  "timezone": "America/New_York",
  "locale": "en-US",
  "labels": {
    "street": {
      "label": "Street Address",
      "placeholder": "123 Main St",
      "required": true,
      "helpText": "Enter your street address"
    }
  },
  "validation": {
    "zip": "^[0-9]{5}(-[0-9]{4})?$",
    "phone": "^\\+1[0-9]{10}$"
  },
  "fieldOrder": ["street", "city", "state", "zip"],
  "requiredFields": ["name", "street", "city", "state", "zip", "phone"],
  "addressFormat": {
    "fields": ["street", "city", "state", "zip", "country"],
    "required": ["street", "city", "state", "zip"],
    "separator": ", "
  }
}
```

### Currency Configuration

Currency symbols configuration:

```json
{
  "USD": {
    "symbol": "$",
    "position": "before",
    "decimalPlaces": 2,
    "thousandSeparator": ",",
    "decimalSeparator": "."
  }
}
```

## 🔧 Adding New Countries

1. **Create country configuration file**:
   ```bash
   touch config/countries/au.json
   ```

2. **Add country configuration**:
   ```json
   {
     "code": "AU",
     "name": "Australia",
     "currency": "AUD",
     "phoneCode": "+61",
     "timezone": "Australia/Sydney",
     "locale": "en-AU",
     "labels": { ... },
     "validation": { ... },
     "fieldOrder": [ ... ],
     "requiredFields": [ ... ],
     "addressFormat": { ... }
   }
   ```

3. **Update exports**:
   ```typescript
   // config/countries/index.ts
   import auConfig from './au.json';
   
   export const countryConfigs: Record<string, CountryConfig> = {
     US: usConfig,
     IN: inConfig,
     GB: gbConfig,
     BD: bdConfig,
     AU: auConfig, // Add new country
   };
   ```

## 🇧🇩 Bangladesh Configuration

Bangladesh (`BD`) has been added with the following features:

- **Currency**: BDT (৳) - Bangladeshi Taka
- **Phone Code**: +880
- **Fields**: Street, Area, City, District, Postal Code
- **Validation**: 4-digit postal code, +880 phone format
- **Exchange Rate**: 1 USD = 110.50 BDT (example rate)

### Bangladesh Field Structure:
```json
{
  "fieldOrder": ["street", "area", "city", "district", "postcode"],
  "requiredFields": ["name", "street", "city", "district", "postcode", "phone"],
  "validation": {
    "postcode": "^[1-9][0-9]{3}$",
    "phone": "^\\+880[0-9]{10}$",
    "district": "^[A-Za-z\\s]+$"
  }
}
```

## 🗺️ State/Province Data

Each country now includes comprehensive state/province data:

### **US States** (50 states + DC)
- **Field**: `states` array
- **Format**: `{"code": "CA", "name": "California"}`
- **Usage**: Dropdown for state selection

### **India States** (28 states + 8 union territories)
- **Field**: `states` array  
- **Format**: `{"code": "MH", "name": "Maharashtra"}`
- **Usage**: Dropdown for state selection

### **UK Counties** (England, Scotland, Wales, Northern Ireland + counties)
- **Field**: `counties` array
- **Format**: `{"code": "ENG", "name": "England"}`
- **Usage**: Dropdown for county selection

### **Bangladesh Districts** (64 districts)
- **Field**: `districts` array
- **Format**: `{"code": "DHA", "name": "Dhaka"}`
- **Usage**: Dropdown for district selection

### **Usage in Forms**:
```typescript
// Get states for dropdown
const states = getStatesProvinces();

// Render dropdown
<select>
  <option value="">Select State</option>
  {states.map(state => (
    <option key={state.code} value={state.code}>
      {state.name}
    </option>
  ))}
</select>

// Validate selection
const isValid = isValidStateProvince(selectedState);
```

## 🎯 Best Practices

1. **Use the hook**: Prefer `useCountry()` hook over direct service calls in components
2. **Validate inputs**: Always validate user inputs using `validateField()`
3. **Dynamic rendering**: Use `getFieldOrder()` to render fields dynamically
4. **Error handling**: Check if country is supported before setting it
5. **Type safety**: Use TypeScript types for better development experience

## 🧪 Testing

```typescript
// Test country configuration
const config = countryService.getCountryConfig('US');
expect(config.code).toBe('US');
expect(config.currency).toBe('USD');

// Test field validation
const isValid = countryService.validateField('zip', '10001', 'US');
expect(isValid).toBe(true);

// Test currency formatting
const formatted = currencyService.formatAmount(1000, 'USD');
expect(formatted).toBe('$1000.00');
```

## 📝 Examples

See `src/components/examples/CountryAwareForm.tsx` for a complete example of how to use the country configuration system in a form component.
