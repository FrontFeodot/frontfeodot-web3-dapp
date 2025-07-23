import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';

const env = process.env.NODE_ENV;

export const NAV_ROUTES = [
  { name: 'Home', href: '/' },
  { name: 'Swap', href: '/swap' },
  { name: 'Transfer', href: '/transfer' },
  { name: 'History', href: '/history' },
  ...(env === 'development'
    ? [{ name: 'Get tokens', href: '/getTokens' }]
    : []),
];

export const TOKEN_ADDRESS_LIST: Record<string, string> = {
  ETH: '',
  WETH: '0x4200000000000000000000000000000000000006',
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
};

export const ERC20_ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function approve(address _spender, uint256 _value) returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
]
export const QUOTER_ABI = Quoter.abi;

export const QUOTER_CONTRACT_ADDRESS =
  '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a';

  export const SWAP_ROUTER_ADDRESS = "0x2626664c2603336E57B271c5C0b26F421741e481"

export const V_2_ROUTER_ABI = [
  'function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts)',
  'function swapExactETHForTokens(uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external payable returns (uint256[] memory amounts)',
  'function swapExactTokensForETH(uint256,uint256,address[],address,uint256) external returns (uint256[] memory)'
];
export const V_3_ROUTER_ABI = [
  'function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 deadline,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96) params) external payable returns (uint256)'
];

export const SWAP_ABI = [{
  "inputs": [
    {
      "components": [
        { "internalType": "address",   "name": "tokenIn",           "type": "address" },
        { "internalType": "address",   "name": "tokenOut",          "type": "address" },
        { "internalType": "uint24",    "name": "fee",               "type": "uint24" },
        { "internalType": "address",   "name": "recipient",         "type": "address" },
        { "internalType": "uint256",   "name": "amountIn",          "type": "uint256" },
        { "internalType": "uint256",   "name": "amountOutMinimum",  "type": "uint256" },
        { "internalType": "uint160",   "name": "sqrtPriceLimitX96","type": "uint160" }
      ],
      "internalType": "struct IV3SwapRouter.ExactInputSingleParams",
      "name": "params",
      "type": "tuple"
    }
  ],
  "name": "exactInputSingle",
  "outputs": [
    { "internalType": "uint256", "name": "amountOut", "type": "uint256" }
  ],
  "stateMutability": "payable",
  "type": "function"
}]