# VeChain Kit Dependency Conflicts - PERMANENT SOLUTION

## ❌ **CRITICAL ERROR TO AVOID:**

```
Attempted import error: 'useForm' is not exported from 'react-hook-form' (imported as 'useForm').
```

## 🔍 **Root Cause:**

The `@vechain/vechain-kit` package has internal dependencies on `react-hook-form` that conflict with our project's version. This creates a version mismatch where VeChain Kit expects a different version of `react-hook-form` than what we have installed.

## ✅ **PERMANENT SOLUTION:**

### 1. **DO NOT USE VeChain Kit Hooks Directly**
```typescript
// ❌ NEVER DO THIS - Causes useForm import errors
import { useWallet, useSendTransaction } from '@vechain/vechain-kit';
import { VeChainKitProvider } from '@vechain/vechain-kit';
```

### 2. **Use Custom Wallet Implementation Instead**
```typescript
// ✅ ALWAYS USE THIS - No dependency conflicts
import { useWallet } from './ClientOnlyVeChainKit';
import { ClientOnlyVeChainKit } from '@/components/ClientOnlyVeChainKit';
```

### 3. **Use Simple Transaction Service**
```typescript
// ✅ ALWAYS USE THIS - Direct VeWorld wallet calls
import { simpleTransactionService } from '@/utils/simpleTransactionService';

// Send transactions
const txHash = await simpleTransactionService.askQuestion(question, bounty);
```

## 🚫 **NEVER ADD THESE DEPENDENCIES:**

```json
// ❌ NEVER ADD THESE - They cause useForm conflicts
"@vechain/vechain-kit": "^2.0.0",
"@vechain/dapp-kit-react": "^1.0.0"
```

## ✅ **SAFE DEPENDENCIES:**

```json
// ✅ THESE ARE SAFE - No conflicts
"@vechain/connex": "^2.2.1",
"@vechain/sdk-core": "^2.0.5",
"@vechain/sdk-network": "^2.0.5",
"react-hook-form": "^7.64.0"
```

## 🔧 **Current Working Architecture:**

1. **Layout**: Uses `ClientOnlyVeChainKit` (custom implementation)
2. **Wallet Connection**: Uses `useWallet` from custom context
3. **Transactions**: Uses `simpleTransactionService` with direct VeWorld calls
4. **No VeChain Kit Dependencies**: Completely avoids VeChain Kit package

## 📝 **Why This Happens:**

- VeChain Kit internally uses `react-hook-form` for form handling
- Our project has `react-hook-form: ^7.64.0`
- VeChain Kit expects a different version internally
- This creates a module resolution conflict

## 🎯 **Prevention Checklist:**

- [ ] Never import from `@vechain/vechain-kit`
- [ ] Never add `@vechain/vechain-kit` to package.json
- [ ] Always use custom `ClientOnlyVeChainKit`
- [ ] Always use `simpleTransactionService` for transactions
- [ ] If you see `useForm` import errors, immediately remove VeChain Kit imports

## 🚨 **Emergency Fix:**

If you accidentally add VeChain Kit and get the error:

1. **Remove VeChain Kit imports** from all files
2. **Revert to custom implementation**:
   ```typescript
   // Replace this:
   import { useWallet } from '@vechain/vechain-kit';
   
   // With this:
   import { useWallet } from './ClientOnlyVeChainKit';
   ```
3. **Use simple transaction service**:
   ```typescript
   // Replace VeChain Kit transactions with:
   import { simpleTransactionService } from '@/utils/simpleTransactionService';
   ```

## ✅ **Current Working Files:**

- `frontend/src/components/ClientOnlyVeChainKit.tsx` - Custom wallet context
- `frontend/src/utils/simpleTransactionService.ts` - Transaction service
- `frontend/src/app/layout.tsx` - Uses custom implementation
- `frontend/src/components/QAInterface.tsx` - Uses simple service

## 🎉 **Result:**

- ✅ No `useForm` import errors
- ✅ No dependency conflicts
- ✅ Real VeChain testnet transactions work
- ✅ VeWorld wallet integration works
- ✅ No VeChain Kit dependency issues

---

**REMEMBER: VeChain Kit causes dependency conflicts. Always use custom implementation!**
