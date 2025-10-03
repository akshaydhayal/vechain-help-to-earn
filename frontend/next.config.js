/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['explore-testnet.vechain.org'],
  },
  env: {
    NEXT_PUBLIC_VECHAIN_TESTNET_URL: 'https://testnet.vechain.org',
    NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS: '0x90a2c4a5a53278d5d81f92e60503073b89fd1b63',
    NEXT_PUBLIC_QUESTION_MANAGER_ADDRESS: '0x9A202C7Ed53BdCB6e3832F5DD14860Ee144e41CA',
    NEXT_PUBLIC_REWARD_SYSTEM_ADDRESS: '0xce633774B928829CdA322B8c0d5690A276DC4C33',
  },
}

module.exports = nextConfig
